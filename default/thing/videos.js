// --- DOM Elements ---
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const sortSelect = document.getElementById('sort-select');
const categoryBtns = document.querySelectorAll('.category-btn');
const resultsGrid = document.getElementById('results-grid');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');

const modal = document.getElementById('video-modal');
const modalCloseBtn = document.getElementById('close-modal');
const modalPlayerContainer = document.getElementById('modal-player-container');
const modalTitle = document.getElementById('modal-video-title');
const modalDesc = document.getElementById('modal-video-desc');
const modalLink = document.getElementById('modal-link');

// --- Global State ---
let appState = {
    currentQuery: "",
    currentCategory: "",
    currentSort: "relevance",
    page: 1,
    wikiOffset: 0,
    peerStart: 0,
    isLoading: false
};

// --- API Configurations ---

// 1. Internet Archive Search
async function fetchArchive(keyword, page, sortBy) {
    const BASE_URL = "https://archive.org/advancedsearch.php";
    let query = 'mediatype:movies'; 
    query += ' AND NOT collection:(sci-fi_horror OR silent_films OR horror_movies OR adult)';
    query += ' AND NOT (sex OR "exploitation film" OR murder OR crime OR madness)';

    if (keyword) {
        query += ` AND (${keyword})`;
    } else {
        query += ` AND collection:(education OR khanacademy OR ted)`;
    }

    // Sorting logic for Archive
    let sortParam = ['downloads desc'];
    if (sortBy === 'newest') {
        sortParam = ['date desc'];
    }

    const params = new URLSearchParams({
        q: query,
        fl: ['identifier', 'title', 'description', 'downloads', 'date'],
        sort: sortParam,
        rows: 8, 
        page: page,
        output: 'json'
    });

    try {
        const res = await fetch(`${BASE_URL}?${params.toString()}`);
        const data = await res.json();
        const docs = data.response.docs || [];
        
        return docs.map(doc => ({
            id: doc.identifier,
            title: doc.title,
            desc: doc.description,
            thumb: `https://archive.org/services/img/${doc.identifier}`,
            source: 'archive',
            views: doc.downloads,
            raw: doc
        }));
    } catch (e) {
        console.error("Archive API Error", e);
        return [];
    }
}

// 2. NASA Image & Video Library
async function fetchNASA(keyword, page, sortBy) {
    if (!keyword) return []; 
    
    // NASA doesn't support explicit sorting via API params easily in this endpoint, 
    // but we can pass the year if we really wanted to. For now, standard search.
    const URL = `https://images-api.nasa.gov/search?q=${encodeURIComponent(keyword)}&media_type=video&page=${page}`;

    try {
        const res = await fetch(URL);
        const data = await res.json();
        const items = data.collection.items || [];

        return items.slice(0, 8).map(item => {
            const data = item.data[0];
            const links = item.links || [];
            const thumbObj = links.find(l => l.rel === 'preview');
            
            return {
                id: data.nasa_id,
                title: data.title,
                desc: data.description,
                thumb: thumbObj ? thumbObj.href : 'https://via.placeholder.com/320x180?text=NASA',
                source: 'nasa',
                collectionUrl: item.href,
                views: null,
                raw: item
            };
        });
    } catch (e) {
        return [];
    }
}

// 3. Wikimedia Commons
async function fetchWiki(keyword, offset, sortBy) {
    if (!keyword) return { items: [], nextOffset: 0 }; 

    const URL = "https://commons.wikimedia.org/w/api.php";
    const searchQuery = `File:${keyword} filetype:video`;
    
    // Wiki sorting
    let sortType = 'relevance';
    if (sortBy === 'newest') {
        sortType = 'last_edit_desc'; // Best proxy for 'newest' in search API
    }

    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: searchQuery,
        srnamespace: 6, 
        srlimit: 8,
        sroffset: offset,
        srsort: sortType,
        format: 'json',
        origin: '*'
    });

    try {
        const res = await fetch(`${URL}?${params.toString()}`);
        const data = await res.json();
        const results = data.query.search || [];
        const nextOffset = data.continue ? data.continue.sroffset : 0;

        if (results.length === 0) return { items: [], nextOffset: 0 };

        const fileTitles = results.map(r => r.title).join('|');
        
        const infoParams = new URLSearchParams({
            action: 'query',
            prop: 'imageinfo',
            iiprop: 'url|thumbnail|extmetadata',
            iiurlwidth: 320,
            titles: fileTitles,
            format: 'json',
            origin: '*'
        });

        const infoRes = await fetch(`${URL}?${infoParams.toString()}`);
        const infoData = await infoRes.json();
        const pages = infoData.query.pages;

        const finalItems = [];
        Object.values(pages).forEach(page => {
            if (page.imageinfo && page.imageinfo[0]) {
                const info = page.imageinfo[0];
                const metadata = info.extmetadata || {};
                
                finalItems.push({
                    id: page.pageid,
                    title: page.title.replace('File:', '').replace(/\.(webm|ogv|mp4)$/i, ''),
                    desc: metadata.ImageDescription ? metadata.ImageDescription.value : "Wikimedia Commons Video",
                    thumb: info.thumburl,
                    source: 'wiki',
                    videoUrl: info.url,
                    views: null,
                    raw: page
                });
            }
        });

        return { items: finalItems, nextOffset: nextOffset };

    } catch (e) {
        return { items: [], nextOffset: 0 };
    }
}

// 4. PeerTube (Sepia Search)
async function fetchSepia(keyword, start, sortBy) {
    const URL = `https://sepiasearch.org/api/v1/search/videos`;
    let q = keyword.trim();
    if (!q) q = "educational"; 

    // Sepia Sort
    let sortVal = '-match'; // Relevance
    if (sortBy === 'newest') {
        sortVal = '-publishedAt';
    }

    const params = new URLSearchParams({
        search: q,
        start: start,
        count: 12, // Request more PeerTube items to ensure freshness
        sort: sortVal, 
        nsfw: 'false'
    });

    try {
        const res = await fetch(`${URL}?${params.toString()}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const items = data.data || [];

        const videos = items.map(item => {
            return {
                id: item.uuid,
                title: item.name,
                desc: item.description || "Watch on PeerTube",
                thumb: item.thumbnailUrl, 
                source: 'peer',
                views: item.views,
                embedUrl: item.embedUrl, 
                linkUrl: item.url 
            };
        });

        return { items: videos, nextStart: start + videos.length };
    } catch (e) {
        console.error("Sepia fetch failed", e);
        return { items: [], nextStart: start };
    }
}

// --- Main Controller ---

async function runSearch(isLoadMore = false) {
    if (appState.isLoading) return;
    appState.isLoading = true;

    if (!isLoadMore) {
        // New Search
        resultsGrid.innerHTML = '';
        loadMoreContainer.style.display = 'none';
        showLoading();
        appState.page = 1;
        appState.wikiOffset = 0;
        appState.peerStart = 0;
    } else {
        loadMoreBtn.textContent = "Loading...";
        loadMoreBtn.disabled = true;
    }

    let finalQuery = appState.currentQuery;
    if (appState.currentCategory) {
        finalQuery = finalQuery ? `${finalQuery} ${appState.currentCategory}` : appState.currentCategory;
    }

    // Execute fetches: PeerTube, Archive, NASA, Wiki
    const [peerRes, archiveRes, nasaRes, wikiRes] = await Promise.allSettled([
        fetchSepia(finalQuery, appState.peerStart, appState.currentSort),
        fetchArchive(finalQuery, appState.page, appState.currentSort),
        fetchNASA(finalQuery, appState.page, appState.currentSort),
        fetchWiki(finalQuery, appState.wikiOffset, appState.currentSort)
    ]);

    // Extract Data
    const peerData = peerRes.status === 'fulfilled' ? peerRes.value : { items: [], nextStart: 0 };
    const archiveItems = archiveRes.status === 'fulfilled' ? archiveRes.value : [];
    const nasaItems = nasaRes.status === 'fulfilled' ? nasaRes.value : [];
    const wikiData = wikiRes.status === 'fulfilled' ? wikiRes.value : { items: [], nextOffset: 0 };

    // Update State
    appState.peerStart = peerData.nextStart;
    appState.wikiOffset = wikiData.nextOffset;
    appState.page++;

    // Mixing Logic
    const mixedResults = [];
    const peerItems = peerData.items;
    const wikiItems = wikiData.items;
    
    const maxLength = Math.max(peerItems.length, archiveItems.length, nasaItems.length, wikiItems.length);
    
    for (let i = 0; i < maxLength; i++) {
        // Prioritize PeerTube (often newer/better quality for this mix)
        if (peerItems[i]) mixedResults.push(peerItems[i]);
        // Add another PeerTube if available to weight it higher
        if (peerItems[maxLength - 1 - i] && i < maxLength/2) mixedResults.push(peerItems[maxLength - 1 - i]);
        
        if (archiveItems[i]) mixedResults.push(archiveItems[i]);
        if (nasaItems[i]) mixedResults.push(nasaItems[i]);
        if (wikiItems[i]) mixedResults.push(wikiItems[i]);
    }
    
    // Remove duplicates
    const uniqueResults = mixedResults.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

    if (!isLoadMore) {
         resultsGrid.innerHTML = '';
    }

    renderResults(uniqueResults);

    appState.isLoading = false;
    if (uniqueResults.length > 0) {
        loadMoreContainer.style.display = 'block';
        loadMoreBtn.textContent = "Load More Videos";
        loadMoreBtn.disabled = false;
    } else if (isLoadMore) {
        loadMoreBtn.textContent = "No more results";
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// --- Rendering ---

function renderResults(items) {
    if (items.length === 0 && resultsGrid.querySelectorAll('.video-card').length === 0) {
        resultsGrid.innerHTML = '<div class="state-message"><p>No results found. Try a different search.</p></div>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'video-card';

        let desc = item.desc;
        if (Array.isArray(desc)) desc = desc[0];
        if (!desc) desc = "No description.";
        let cleanDesc = desc.replace(/<[^>]*>?/gm, '');
        cleanDesc = cleanDesc.substring(0, 120) + (cleanDesc.length > 120 ? '...' : '');
        
        let badgeClass = 'source-archive';
        let badgeText = 'Archive';
        if (item.source === 'nasa') { badgeClass = 'source-nasa'; badgeText = 'NASA'; }
        if (item.source === 'wiki') { badgeClass = 'source-wiki'; badgeText = 'WIKI'; }
        if (item.source === 'peer') { badgeClass = 'source-peer'; badgeText = 'PeerTube'; }

        let viewText = "";
        if (typeof item.views === 'number') {
            viewText = item.views.toLocaleString() + ' views';
        } else {
            viewText = 'Educational Resource';
        }

        card.innerHTML = `
            <div class="thumbnail-wrapper">
                <span class="source-tag ${badgeClass}">${badgeText}</span>
                <img src="${item.thumb}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/320x180?text=No+Image'">
            </div>
            <div class="card-content">
                <div class="card-title">${item.title}</div>
                <div class="card-meta" style="font-size:0.8rem; color:#888;">
                    ${viewText}
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(item));
        resultsGrid.appendChild(card);
    });
}

function showLoading() {
    resultsGrid.innerHTML = `
        <div class="state-message">
            <div class="loader"></div>
            <p>Scanning libraries...</p>
        </div>
    `;
}

// --- Modal Logic ---

async function openModal(item) {
    modalTitle.textContent = item.title;
    
    let desc = Array.isArray(item.desc) ? item.desc[0] : item.desc;
    if (item.source === 'wiki') {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = desc;
        desc = tempDiv.textContent || tempDiv.innerText || "";
    }
    if (desc && desc.length > 800) desc = desc.substring(0, 800) + "...";
    
    modalDesc.innerHTML = desc || "No description available.";
    
    modalPlayerContainer.innerHTML = '<div class="loader" id="modal-loader"></div>';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (item.source === 'peer') {
        // PeerTube Embed
        modalPlayerContainer.innerHTML = `<iframe id="modal-iframe" src="${item.embedUrl}" allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups"></iframe>`;
        modalLink.href = item.linkUrl;
        modalLink.textContent = "View on PeerTube \u2197";
    }
    else if (item.source === 'archive') {
        modalPlayerContainer.innerHTML = `<iframe id="modal-iframe" src="https://archive.org/embed/${item.id}?autoplay=1" allowfullscreen></iframe>`;
        modalLink.href = `https://archive.org/details/${item.id}`;
        modalLink.textContent = "View on Internet Archive \u2197";
    } 
    else if (item.source === 'nasa') {
        try {
            const response = await fetch(item.collectionUrl);
            const files = await response.json();
            const mp4File = files.find(f => f.endsWith('~medium.mp4')) || files.find(f => f.endsWith('.mp4'));

            if (mp4File) {
                modalPlayerContainer.innerHTML = `
                    <video id="modal-video-tag" controls autoplay name="media">
                        <source src="${mp4File.replace('http:', 'https:')}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                modalLink.href = "https://images.nasa.gov/";
                modalLink.textContent = "View on NASA Image Library \u2197";
            } else {
                modalPlayerContainer.innerHTML = '<p style="color:white; padding:20px;">Video file not found.</p>';
            }
        } catch (e) {
            modalPlayerContainer.innerHTML = '<p style="color:white; padding:20px;">Error loading NASA video.</p>';
        }
    }
    else if (item.source === 'wiki') {
         modalPlayerContainer.innerHTML = `
            <video id="modal-video-tag" controls autoplay name="media">
                <source src="${item.videoUrl}" type="video/webm">
                <source src="${item.videoUrl}" type="video/ogg">
                Your browser does not support the video tag.
            </video>
        `;
        modalLink.href = item.raw.imageinfo[0].descriptionurl;
        modalLink.textContent = "View on Wikimedia Commons \u2197";
    }
}

function closeModal() {
    modal.style.display = 'none';
    modalPlayerContainer.innerHTML = ''; 
    document.body.style.overflow = '';
}

// --- Event Listeners ---

function triggerSearch() {
    appState.currentQuery = searchInput.value;
    appState.currentSort = sortSelect.value; // Capture Sort
    runSearch(false);
}

searchBtn.addEventListener('click', triggerSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerSearch();
});

// Trigger search on sort change
sortSelect.addEventListener('change', triggerSearch);

loadMoreBtn.addEventListener('click', () => {
    runSearch(true);
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        appState.currentCategory = btn.dataset.query;
        appState.currentQuery = searchInput.value;
        appState.currentSort = sortSelect.value;
        runSearch(false);
    });
});

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Initial Load
runSearch(false);