// --- GLOBAL VARIABLES ---
let isPremium = false;
        
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const sourceRadios = document.getElementsByName('searchSource');

// Sidebar elements
const sidebarContent = document.getElementById('sidebar-content');
const tabWord = document.getElementById('tab-word');
const tabArticle = document.getElementById('tab-article');

let currentSidebarTab = 'word'; // 'word' or 'article'

// --- CHRISTMAS LOGIC START ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Music Control Logic ---
    const music = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    // Try to autoplay (might be blocked by browser)
    music.volume = 0.5; // Set volume to 50%
    
    toggleBtn.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggleBtn.textContent = '🔇';
            toggleBtn.classList.remove('playing');
            toggleBtn.title = "Play Music";
        } else {
            music.play().then(() => {
                toggleBtn.textContent = '🎵';
                toggleBtn.classList.add('playing');
                toggleBtn.title = "Pause Music";
            }).catch(e => {
                console.log("Audio play failed:", e);
                alert("Please interact with the page first to play audio!");
            });
        }
        isPlaying = !isPlaying;
    });

    // --- Snow Logic ---
    const snowContainer = document.getElementById('snow-container');
    const maxSnowflakes = 50; // Limit for performance

    function createSnowflake() {
        if (snowContainer.children.length >= maxSnowflakes) return;

        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄'; 
        
        // Random positioning
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        // Randomize animation properties
        const duration = Math.random() * 3 + 4; 
        const opacity = Math.random() * 0.5 + 0.3;
        const size = Math.random() * 10 + 10 + 'px';
        
        snowflake.style.animationDuration = `${duration}s, 3s`;
        snowflake.style.opacity = opacity;
        snowflake.style.fontSize = size;

        snowContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    setInterval(createSnowflake, 300);
});
// --- CHRISTMAS LOGIC END ---

// --- CHECK PREMIUM ---
function checkPremiumStatus() {
    // Check localStorage set by index.html or redemption
    if (localStorage.getItem('ugaRevPremium') === 'true') {
        isPremium = true;
    }
}

function getSelectedSource() {
    for (const radio of sourceRadios) {
        if (radio.checked) return radio.value;
    }
    return 'auto';
}

// --- MAIN SEARCH HANDLER ---
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = '<div class="loader"></div>';
    
    const source = getSelectedSource();
    
    try {
        if (source === 'dictionary') {
            await fetchDictionary(query);
        } else if (source === 'wikipedia') {
            await fetchWikipedia(query);
        } else {
            // AUTO MODE: Try dictionary, if simple fail, fallback to Wiki
            try {
                await fetchDictionary(query, true); // true = throw on 404
            } catch (e) {
                console.log("Dictionary failed, switching to Wiki...");
                await fetchWikipedia(query);
                // Update radio to reflect switch
                document.querySelector('input[value="wikipedia"]').checked = true;
                updateLayout(true);
            }
        }
    } catch (err) {
        resultsContainer.innerHTML = `<div class="error-message">Could not find results for "${query}".</div>`;
    }
}

// --- DICTIONARY API ---
async function fetchDictionary(word, autoMode = false) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    if (!response.ok) {
        if (autoMode) throw new Error("Not found");
        resultsContainer.innerHTML = `<div class="error-message">Word not found in dictionary. Try Wiki mode!</div>`;
        return;
    }

    const data = await response.json();
    const entry = data[0];
    
    let html = `
        <div>
            <div class="result-word">${entry.word}</div>
            ${entry.phonetic ? `<div class="result-phonetic">${entry.phonetic}</div>` : ''}
        </div>
    `;

    // Limit meanings to 3 for brevity
    entry.meanings.slice(0, 3).forEach(meaning => {
        html += `<div class="part-of-speech">${meaning.partOfSpeech}</div>`;
        html += `<ol class="definition-list">`;
        
        meaning.definitions.slice(0, 3).forEach(def => {
            html += `
                <li class="definition-item">
                    ${def.definition}
                    ${def.example ? `<div class="definition-example">"${def.example}"</div>` : ''}
                </li>
            `;
        });
        
        html += `</ol>`;
    });

    resultsContainer.innerHTML = html;
}

// --- WIKIPEDIA API ---
async function fetchWikipedia(query) {
    updateLayout(true); // Switch to single column
    
    // 1. Search for the page to get exact title
    const searchResp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`);
    const searchData = await searchResp.json();
    
    if (!searchData.query.search.length) {
        resultsContainer.innerHTML = `<div class="error-message">No Wikipedia articles found.</div>`;
        return;
    }
    
    const bestMatch = searchData.query.search[0].title;
    
    // 2. Parse the content
    const parseResp = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${bestMatch}&format=json&origin=*&redirects=1&prop=text|sections`);
    const parseData = await parseResp.json();
    
    if (parseData.error) {
         resultsContainer.innerHTML = `<div class="error-message">Error loading article.</div>`;
         return;
    }
    
    const rawHtml = parseData.parse.text['*'];
    const sections = parseData.parse.sections;
    
    // --- CLEANUP AND DISPLAY ---
    // We need to process the raw HTML to make it look good
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;
    
    // Fix links to open in new tab or handle internally (simplified: remove links)
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
        link.removeAttribute('href');
        link.style.color = 'var(--primary-color)';
        link.style.textDecoration = 'none';
        link.style.pointerEvents = 'none';
    });
    
    // Create a custom collapsible view
    let finalHtml = `<h2 style="font-size: 2rem; margin-bottom: 20px;">${parseData.parse.title} <span class="wiki-badge">Wikipedia</span></h2>`;
    
    // Extract the intro (before first h2)
    // Strategy: Get everything until the first h2 or mw-toc
    // Simplified for this demo: Just dump the content but hide "References" and "See also" sections visually
    
    // Better strategy: Use the sections data to build an accordion
    
    // 1. Get Intro (everything before first section index 1)
    // Note: MediaWiki API is complex. A simple dump is easiest for this prototype.
    // We will inject the cleaned HTML into a wrapper.
    
    finalHtml += `<div class="wiki-content-root">${tempDiv.innerHTML}</div>`;
    
    resultsContainer.innerHTML = finalHtml;
}

// --- LAYOUT MANAGER ---
function updateLayout(isWikiMode) {
    const grid = document.querySelector('.content-grid');
    const sidebar = document.getElementById('sidebar-container');
    
    if (isWikiMode) {
        grid.classList.add('single-column');
        sidebar.classList.add('hidden');
    } else {
        grid.classList.remove('single-column');
        sidebar.classList.remove('hidden');
    }
}

// --- SIDEBAR TABS ---
function switchSidebar(tab) {
    currentSidebarTab = tab;
    tabWord.classList.toggle('active', tab === 'word');
    tabArticle.classList.toggle('active', tab === 'article');
    
    if (tab === 'word') fetchWordOfTheDay();
    else fetchArticleOfTheDay();
}

// --- SIDEBAR CONTENT: WORD OF THE DAY ---
async function fetchWordOfTheDay() {
    sidebarContent.innerHTML = '<div class="loader"></div>';
    
    // Hardcoded "random" words list for demo reliability
    const words = ["Epiphany", "Serendipity", "Petrichor", "Limerence", "Ineffable", "Ethereal", "Sonder", "Vellichor"];
    // Use date to pick one consistently per day
    const today = new Date().getDate();
    const word = words[today % words.length];
    
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        const entry = data[0];
        const def = entry.meanings[0].definitions[0].definition;
        
        let html = `
            <div style="font-size: 0.8rem; color: #777; margin-bottom: 5px;">WORD OF THE DAY</div>
            <div class="result-word" style="font-size: 1.8rem;">${entry.word}</div>
            <div class="part-of-speech" style="margin-top: 5px;">${entry.meanings[0].partOfSpeech}</div>
            <div style="line-height: 1.5; color: #444; margin-top: 10px;">${def}</div>
        `;
        
        sidebarContent.innerHTML = html;
    } catch (e) {
        sidebarContent.innerHTML = "Could not load Word of the Day.";
    }
}

// --- SIDEBAR CONTENT: ARTICLE OF THE DAY ---
async function fetchArticleOfTheDay() {
    sidebarContent.innerHTML = '<div class="loader"></div>';
    
    // Use Wikipedia Featured Article API
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    // Actually, featured feed is complex. Let's use "Random" for "Article of the Day" feel
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    const data = await response.json();
    
    const title = data.title;
    const extract = data.extract;
    const thumbnail = data.thumbnail ? data.thumbnail.source : null;
    
    let html = `<div style="font-size: 0.8rem; color: #777; margin-bottom: 10px;">ARTICLE OF THE DAY</div>`;
    if (thumbnail) {
        html += `<img src="${thumbnail}" class="aotd-image" alt="${title}">`;
    }
    html += `<div class="aotd-title">${title}</div>`;
    html += `<div class="aotd-extract">${extract}</div>`;
    
    // Button triggers the MAIN app search logic with this title, forcing Wiki mode
    html += `<button class="aotd-button" onclick="openWikiArticle('${title.replace(/'/g, "\\'")}')">Read Full Article</button>`;
    
    sidebarContent.innerHTML = html;
}

// Helper for the button
function openWikiArticle(title) {
    searchInput.value = title;
    // Force radio to wiki
    document.querySelector('input[value="wikipedia"]').checked = true;
    handleSearch();
}

// --- INITIALIZATION ---
function initializePage() {
    checkPremiumStatus();
    if (isPremium) {
        document.body.classList.add('premium-active');
    }
    
    sourceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const source = getSelectedSource();
            if(source === 'wikipedia') updateLayout(true);
            else updateLayout(false); 
        });
    });
    
    // Initial Load: Start with Word of the Day (default tab)
    if (getSelectedSource() !== 'wikipedia') {
        fetchWordOfTheDay();
    }
    
    searchButton.addEventListener('click', () => handleSearch());
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
}

initializePage();