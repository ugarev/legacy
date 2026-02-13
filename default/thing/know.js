// --- GLOBAL VARS ---
let isPremium = false;
let currentSidebarTab = 'word'; // 'word' or 'article'

// API URLs
const API_DICT = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const API_WIKI_PARSE = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&redirects=1&origin=*&page=";
const WORDLIST_URL = "https://raw.githubusercontent.com/kkrypt0nn/wordlists/refs/heads/main/wordlists/languages/english.txt";

// --- DOM ELEMENTS ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const sidebarContainer = document.getElementById('sidebar-container');
const sidebarContent = document.getElementById('sidebar-content');
const contentGrid = document.querySelector('.content-grid');
const sourceRadios = document.getElementsByName('searchSource');
const tabWord = document.getElementById('tab-word');
const tabArticle = document.getElementById('tab-article');

// --- COOKIE HELPERS ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite:Lax';
}

function checkPremiumStatus() {
    const isPremiumCookie = getCookie("isPremium");
    const redeemDateStr = getCookie("premiumRedeemedDate");
    const durationMonths = getCookie("premiumDurationMonths");

    if (isPremiumCookie === "true" && redeemDateStr && durationMonths) {
        const redeemDate = new Date(redeemDateStr);
        const expiryDate = new Date(redeemDate);
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationMonths, 10));
        const now = new Date();

        if (now > expiryDate) {
            deleteCookie("isPremium");
            deleteCookie("premiumRedeemedDate");
            deleteCookie("premiumDurationMonths");
            isPremium = false;
        } else {
            isPremium = true;
        }
    } else {
        isPremium = false;
    }
}

// --- UI STATE MANAGEMENT ---

function getSelectedSource() {
    for (const radio of sourceRadios) {
        if (radio.checked) return radio.value;
    }
    return 'auto';
}

function updateLayout(isWikiContent) {
    const source = getSelectedSource();
    
    if (isWikiContent || source === 'wikipedia') {
        sidebarContainer.classList.add('hidden');
        contentGrid.classList.add('single-column');
    } else {
        sidebarContainer.classList.remove('hidden');
        contentGrid.classList.remove('single-column');
    }
}

function switchSidebarTab(tab) {
    currentSidebarTab = tab;
    
    // Update Tab Styling
    if (tab === 'word') {
        tabWord.classList.add('active');
        tabArticle.classList.remove('active');
        fetchWordOfTheDay(); // Reload Word
    } else {
        tabArticle.classList.add('active');
        tabWord.classList.remove('active');
        fetchArticleOfTheDay(); // Load Article
    }
}

// --- SEARCH LOGIC ---

async function fetchWikiData(term) {
    try {
        const response = await fetch(API_WIKI_PARSE + encodeURIComponent(term));
        const data = await response.json();
        
        if (data.error) return null;
        if (!data.parse || !data.parse.text) return null;
        
        return {
            title: data.parse.title,
            html: data.parse.text['*']
        };
    } catch (e) {
        console.error("Wiki fetch error", e);
        return null;
    }
}

function openWikiArticle(term) {
    // Update Input
    searchInput.value = term;
    
    // Switch Radio to Wiki so logic knows we are in Wiki mode
    const wikiRadio = document.querySelector('input[name="searchSource"][value="wikipedia"]');
    if (wikiRadio) wikiRadio.checked = true;
    
    // Execute Search
    handleSearch(term);
}

async function handleSearch(overrideTerm = null) {
    const term = overrideTerm || searchInput.value.trim();
    if (!term) return;
    
    // If called via "Read More", update input for consistency
    if (overrideTerm) searchInput.value = term;

    resultsContainer.innerHTML = '<div class="loader"></div>';
    const source = getSelectedSource();
    
    try {
        if (source === 'dictionary') {
            await searchDictionaryOnly(term);
        } else if (source === 'wikipedia') {
            await searchWikipediaOnly(term);
        } else {
            await searchAuto(term);
        }
    } catch (error) {
        console.error("Search handler error:", error);
        displayError("An unexpected error occurred.", resultsContainer);
    }
}

async function searchDictionaryOnly(term) {
    try {
        const response = await fetch(API_DICT + term);
        if (!response.ok) {
            displayError(`Dictionary: No definition found for "${term}".`, resultsContainer);
            return;
        }
        const data = await response.json();
        updateLayout(false);
        displayDictionaryResults(data, resultsContainer);
    } catch (e) {
        displayError("Error connecting to Dictionary service.", resultsContainer);
    }
}

async function searchWikipediaOnly(term) {
    const pageData = await fetchWikiData(term);
    if (pageData) {
        updateLayout(true);
        displayWikipediaResults(pageData, resultsContainer);
    } else {
        displayError(`Wikipedia: No entry found for "${term}".`, resultsContainer);
    }
}

async function searchAuto(term) {
    try {
        const dictResponse = await fetch(API_DICT + term);
        if (dictResponse.ok) {
            const data = await dictResponse.json();
            updateLayout(false);
            displayDictionaryResults(data, resultsContainer);
            return; 
        }
    } catch (e) {}

    const pageData = await fetchWikiData(term);
    if (pageData) {
        updateLayout(true);
        displayWikipediaResults(pageData, resultsContainer);
    } else {
        updateLayout(false);
        displayError(`No results found in Dictionary or Wikipedia for "${term}".`, resultsContainer);
    }
}

// --- DISPLAY FUNCTIONS ---

function displayDictionaryResults(data, container) {
    container.innerHTML = ""; 
    const entry = data[0]; 
    const phonetic = entry.phonetics.find(p => p.text)?.text || "";
    
    let html = `<div class="result-word">${entry.word}</div>
                <div class="result-phonetic">${phonetic}</div>`;

    entry.meanings.forEach(meaning => {
        html += `<div class="part-of-speech">${meaning.partOfSpeech}</div>`;
        html += `<ol class="definition-list">`;
        meaning.definitions.forEach(def => {
            html += `<li class="definition-item">
                        ${def.definition}
                        ${def.example ? `<div class="definition-example">"${def.example}"</div>` : ''}
                     </li>`;
        });
        html += `</ol>`;
    });
    container.innerHTML = html;
}

function displayWikipediaResults(pageData, container) {
    container.innerHTML = "";
    
    let html = `<div class="result-word">
                    ${pageData.title} 
                    <span class="wiki-badge">Wikipedia</span>
                </div>`;
    
    html += `<div class="wiki-content-root" id="wiki-content-root"></div>`;
    container.innerHTML = html;

    const wikiRoot = document.getElementById('wiki-content-root');
    wikiRoot.innerHTML = pageData.html;

    const images = wikiRoot.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('//')) {
            img.setAttribute('src', 'https:' + src);
        }
        const srcset = img.getAttribute('srcset');
        if (srcset) {
            const newSrcset = srcset.replace(/\/\//g, 'https://');
            img.setAttribute('srcset', newSrcset);
        }
    });
    
    makeWikiSectionsCollapsible(wikiRoot);
}

function makeWikiSectionsCollapsible(root) {
    const children = Array.from(root.childNodes);
    root.innerHTML = '';

    let currentWrapper = document.createElement('div');
    currentWrapper.className = 'wiki-intro'; 
    root.appendChild(currentWrapper);

    children.forEach(node => {
        if (node.nodeType === 1 && node.tagName === 'H2') {
            node.classList.add('wiki-section-header');
            const edits = node.querySelectorAll('.mw-editsection');
            edits.forEach(e => e.remove());
            
            root.appendChild(node);

            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = 'wiki-section-content';
            sectionWrapper.style.display = 'none';
            root.appendChild(sectionWrapper);

            currentWrapper = sectionWrapper;

            node.addEventListener('click', function() {
                const isHidden = sectionWrapper.style.display === 'none';
                sectionWrapper.style.display = isHidden ? 'block' : 'none';
                this.classList.toggle('active', isHidden);
            });

        } else {
            currentWrapper.appendChild(node);
        }
    });
}

function displayError(message, container) {
    container.innerHTML = `<p class="error-message">${message}</p>`;
}

// --- WORD OF THE DAY LOGIC ---

function displayWordOfTheDay(entry) {
    sidebarContent.innerHTML = ""; 
    const phonetic = entry.phonetics.find(p => p.text)?.text || "";
    
    let html = `<div class="result-word" style="font-size: 1.8rem;">${entry.word}</div>
                <div class="result-phonetic" style="margin-bottom: 10px;">${phonetic}</div>`;

    entry.meanings.forEach(meaning => {
        html += `<div class="part-of-speech" style="font-size: 0.8rem; margin-top: 15px;">${meaning.partOfSpeech}</div>`;
        html += `<ol class="definition-list" style="padding-left: 15px;">`;
        const defsToShow = meaning.definitions.slice(0, 2);
        defsToShow.forEach(def => {
            html += `<li class="definition-item" style="font-size: 0.95rem; margin-bottom: 10px;">
                        ${def.definition}
                     </li>`;
        });
        html += `</ol>`;
    });
    sidebarContent.innerHTML = html;
}

async function fetchWordOfTheDay() {
    sidebarContent.innerHTML = '<div class="loader"></div>';
    const todayStr = new Date().toDateString();
    const storedWord = getCookie("word");
    const storedDate = getCookie("worddate");

    // Check cache
    if (storedWord && storedDate === todayStr) {
        try {
            const defResponse = await fetch(API_DICT + storedWord);
            if (defResponse.ok) {
                const data = await defResponse.json();
                displayWordOfTheDay(data[0]);
                return;
            }
        } catch (err) {}
    }

    try {
        const listResponse = await fetch(WORDLIST_URL);
        if (!listResponse.ok) throw new Error("Failed to load word list");
        const listText = await listResponse.text();
        const allWords = listText.split(/\r?\n/).filter(line => line.trim() !== "");
        if (allWords.length === 0) throw new Error("Word list is empty");

        let foundWordData = null;
        let attempts = 0;
        while (!foundWordData && attempts < 5) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)].trim();
            try {
                const defResponse = await fetch(API_DICT + randomWord);
                if (defResponse.ok) {
                    const data = await defResponse.json();
                    foundWordData = data[0];
                    setCookie("word", foundWordData.word, 1);
                    setCookie("worddate", todayStr, 1);
                }
            } catch (err) {}
            attempts++;
        }

        if (foundWordData) {
            displayWordOfTheDay(foundWordData);
        } else {
            displayError("Could not find a definition for the random word.", sidebarContent);
        }
    } catch (error) {
        displayError("Could not load Word of the Day.", sidebarContent);
    }
}

// --- ARTICLE OF THE DAY LOGIC ---

async function fetchArticleOfTheDay() {
    sidebarContent.innerHTML = '<div class="loader"></div>';
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    // Using the public REST endpoint to avoid CORS issues with api.wikimedia.org without keys
    const API_FEED_URL = `https://en.wikipedia.org/api/rest_v1/feed/featured/${yyyy}/${mm}/${dd}`;

    try {
        const response = await fetch(API_FEED_URL);
        if (!response.ok) throw new Error("Wiki Feed Failed");
        const data = await response.json();
        
        // 'tfa' stands for Today's Featured Article
        const article = data.tfa; 
        if (!article) throw new Error("No Featured Article found");
        
        displayArticleOfTheDay(article);
    } catch (error) {
        console.error(error);
        displayError("Could not load today's article.", sidebarContent);
    }
}

function displayArticleOfTheDay(article) {
    sidebarContent.innerHTML = "";
    
    const imageUrl = article.thumbnail ? article.thumbnail.source : '';
    const extract = article.extract ? article.extract : "No summary available.";
    const title = article.title.replace(/_/g, ' ');
    
    let html = ``;
    if (imageUrl) {
        html += `<img src="${imageUrl}" class="aotd-image" alt="${title}">`;
    }
    
    html += `<div class="aotd-title">${title}</div>`;
    html += `<div class="aotd-extract">${extract}</div>`;
    
    // Button triggers the MAIN app search logic with this title, forcing Wiki mode
    html += `<button class="aotd-button" onclick="openWikiArticle('${title.replace(/'/g, "\\'")}')">Read Full Article</button>`;
    
    sidebarContent.innerHTML = html;
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