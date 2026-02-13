        // --- 1. SHA-256 Hashing Function ---
        async function sha256(message) {
            // Encode as UTF-8
            const msgBuffer = new TextEncoder().encode(message);
            // Hash the message
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            // Convert to hex string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }

        // --- 3. Cookie Helper Functions ---
        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite:Lax";
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

        // --- 4. Quiz Data Definitions ---
        let isPremium = false; // Global premium status
        let quizData; // This will be set by our premium check

        const freeQuizData = {
            "S1": {
                // "Subject": { "Test Name": [ { name: "Link Name", href: "..." } ] }
                "Chinese": {
                    "Text Book UT 1": [
                        { name: "The Challenge", href: "s1/chi/tb-ut1" },
                        { name: "Flashcards", href: "s1/chi/tb-ut1/flash.html" },
                        { name: "Notes", href: "s1/chi/tb-ut1/notes.html" }
                    ],
                    "Reading Practice": [
                        { name: "一碗水", href: "s1/chi/rd-ut1/bowlwater.html" },
                        { name: "女媧補天", href: "s1/chi/rd-ut1/holesky.html" },  
                        { name: "搬家", href: "s1/chi/rd-ut1/movehome.html" },         
                        { name: "一隻貝", href: "s1/chi/rd-ut1/oneshell.html" },   
                        { name: "蜀賈賣藥", href: "s1/chi/rd-ut1/buymedicine.html" },                    
                    ]
                },
                "Math": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/ma/ut1" },
                        { name: "Flashcards", href: "s1/ma/ut1/flash.html" },
                        { name: "Notes", href: "s1/ma/ut1/notes.html" }
                    ],
                    "UT 2": [
                        { name: "The Challenge", href: "s1/ma/ut2" },
                        { name: "Flashcards", href: "s1/ma/ut2/flash.html" },
                        { name: "Notes", href: "s1/ma/ut2/notes.html" }
                    ],
                    "Algebra Quest": [
                        { name: "Easy", href: "s1/ma/Algebra Adventure.html" }
                    ]
                },
                "Science": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/sc/ut1" },
                        { name: "Flashcards", href: "s1/sc/ut1/flash.html" },
                        { name: "Notes", href: "s1/sc/ut1/notes.html" }                    
                        ],
                    "UT 2": [
                        { name: "Reproduction", href: "s1/sc/ut2/reproductive.html" },
                        { name: "Cells", href: "s1/sc/ut2/cell.html" },
                        { name: "Microscope", href: "s1/sc/ut2/microscope.html" }   ,
                        { name: "Life Cycles", href: "s1/sc/ut2/cycle.html" }    ,
                        { name: "Living Things", href: "s1/sc/ut2/living.html" },
                        { name: "Vitals of living things", href: "s1/sc/ut2/life.html" },
                        { name: "📷 Menstruation", href:"https://drive.google.com/file/d/12sIfYV95JUWxldBPxtRjoSgxbaVyVVYc/view?usp=drivesdk"}                     
                        ]
                },
                "Chinese History": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/ch/ut1" },
                        { name: "Flashcards", href: "s1/ch/ut1/flash.html" },
                        { name: "Notes", href: "s1/ch/ut1/notes.html" }                    ]
                },
                "Geography": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/geo/ut1" },
                        { name: "Flashcards", href: "s1/geo/ut1/flash.html" },
                        { name: "Notes", href: "s1/geo/ut1/notes.html" }
                    ]
                },
                "History": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/hi/ut1" },
                        { name: "Flashcards", href: "s1/hi/ut1/flash.html" },
                        { name: "Notes", href: "s1/hi/ut1/notes.html" }
                    ]
                }
            },
            "S2": {
                // Empty object means "No UTs Yet" will be shown
            },
            "S3": {},
            "S4": {},
            "S5": {},
            "S6": {},
        };

        const premiumQuizData = {
            "S1": {
                "Chinese": {
                    "Text Book UT 1": [
                        { name: "The Challenge", href: "s1/chi/tb-ut1" },
                        { name: "Flashcards", href: "s1/chi/tb-ut1/flash.html" },
                        { name: "Notes", href: "s1/chi/tb-ut1/notes.html" },
                        { name: "✨ Files ✨", href: "s1/chi/tb-ut1/files.html" }
                    ],
                    "Reading Practice": [
                        { name: "一碗水", href: "s1/chi/rd-ut1/bowlwater.html" },
                        { name: "女媧補天", href: "s1/chi/rd-ut1/holesky.html" },  
                        { name: "搬家", href: "s1/chi/rd-ut1/movehome.html" },         
                        { name: "一隻貝", href: "s1/chi/rd-ut1/oneshell.html" },   
                        { name: "蜀賈賣藥", href: "s1/chi/rd-ut1/buymedicine.html" },                    
                    ]
                },
                "Math": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/ma/ut1" },
                        { name: "Flashcards", href: "s1/ma/ut1/flash.html" },
                        { name: "Notes", href: "s1/ma/ut1/notes.html" }
                    ],
                    "UT 2": [
                        { name: "The Challenge", href: "s1/ma/ut2" },
                        { name: "Flashcards", href: "s1/ma/ut2/flash.html" },
                        { name: "Notes", href: "s1/ma/ut2/notes.html" }
                    ],
                    "Algebra Quest": [
                        { name: "Easy", href: "s1/ma/Algebra Adventure.html" }
                    ]
                },
                "Science": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/sc/ut1" },
                        { name: "Flashcards", href: "s1/sc/ut1/flash.html" },
                        { name: "Notes", href: "s1/sc/ut1/notes.html" }                    
                    ],
                    "UT 2": [
                        { name: "Reproduction", href: "s1/sc/ut2/reproductive.html" },
                        { name: "Cells", href: "s1/sc/ut2/cell.html" },
                        { name: "Microscope", href: "s1/sc/ut2/microscope.html" }   ,
                        { name: "Life Cycles", href: "s1/sc/ut2/cycle.html" }    ,
                        { name: "Living Things", href: "s1/sc/ut2/living.html" },
                        { name: "Vitals of living things", href: "s1/sc/ut2/life.html" },
                        { name: "📷 Menstruation", href:"https://drive.google.com/file/d/12sIfYV95JUWxldBPxtRjoSgxbaVyVVYc/view?usp=drivesdk"}                             
                        ]
                },
                "Chinese History": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/ch/ut1" },
                        { name: "Flashcards", href: "s1/ch/ut1/flash.html" },
                        { name: "Notes", href: "s1/ch/ut1/notes.html" }   ,
                        { name: "✨ Files ✨", href: "s1/ch/ut1/files.html" }                    ]
                },
                "Geography": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/geo/ut1" },
                        { name: "Flashcards", href: "s1/geo/ut1/flash.html" },
                        { name: "Notes", href: "s1/geo/ut1/notes.html" },
                        { name: "✨ GAME!!! ✨", href: "s1/geo/ut1/game.html" }
                    ]
                },
                "History": {
                    "UT 1": [
                        { name: "The Challenge", href: "s1/hi/ut1" },
                        { name: "Flashcards", href: "s1/hi/ut1/flash.html" },
                        { name: "Notes", href: "s1/hi/ut1/notes.html" }
                    ]
                }
            },
            "S2": {},
            "S3": {},
            "S4": {},
            "S5": {},
            "S6": {},
        };
        
        // --- RANK DATA ---
        // Score: The minimum score needed to *reach* this rank
        const ranks = [
            { name: "Stone", score: 0, className: "rank-stone" },
            { name: "Iron", score: 50, className: "rank-iron" },
            { name: "Bronze", score: 150, className: "rank-bronze" },
            { name: "Silver", score: 300, className: "rank-silver" },
            { name: "Gold", score: 500, className: "rank-gold" },
            { name: "Platinum", score: 750, className: "rank-platinum" },
            { name: "ULTIMATE", score: 1000, className: "rank-ultimate" }
        ];

        // --- 5. Premium Status Check & Modal Logic ---
        
        // Get Modal DOM elements
        const premiumModal = document.getElementById('premium-modal');
        const modalContent = document.getElementById('modal-content');
        const closeModalButton = document.getElementById('modal-close');
        const redeemInput = document.getElementById('redeem-input');
        const redeemSubmit = document.getElementById('redeem-submit');
        const upgradeButton = document.getElementById('upgrade-button');

        /**
         * Checks cookies to see if premium is active, expired, or non-existent
         */
        function checkPremiumStatus() {
            const isPremiumCookie = getCookie("isPremium");
            const redeemDateStr = getCookie("premiumRedeemedDate");
            const durationMonths = getCookie("premiumDurationMonths");

            if (isPremiumCookie === "true" && redeemDateStr && durationMonths) {
                const redeemDate = new Date(redeemDateStr);
                const expiryDate = new Date(redeemDate);
                // Calculate expiry
                expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationMonths, 10));

                const now = new Date();

                if (now > expiryDate) {
                    // Premium has expired
                    deleteCookie("isPremium");
                    deleteCookie("premiumRedeemedDate");
                    deleteCookie("premiumDurationMonths");
                    isPremium = false;
                    alert("Your UGA Rev Premium has expired. Please redeem a new code.");
                } else {
                    // Premium is active
                    isPremium = true;
                }
            } else {
                // Not premium
                isPremium = false;
            }
        }
        
        // --- RANK DISPLAY FUNCTION ---
        function updateRankDisplay() {
            // 1. Get DOM elements
            const badge = document.getElementById('rank-badge');
            const progressFill = document.getElementById('rank-progress-fill');
            const progressText = document.getElementById('rank-progress-text');
            
            // 2. Get current score from cookie
            const currentScore = parseInt(getCookie("score") || "0", 10);
            
            // 3. Find current and next rank
            let currentRank = ranks[0];
            let nextRank = ranks[1];
            
            // Loop backwards to find the highest rank achieved
            for (let i = ranks.length - 1; i >= 0; i--) {
                if (currentScore >= ranks[i].score) {
                    currentRank = ranks[i];
                    nextRank = (i < ranks.length - 1) ? ranks[i+1] : null; // null if max rank
                    break;
                }
            }
            
            // 4. Update Badge
            badge.textContent = currentRank.name;
            badge.className = 'rank-badge ' + currentRank.className; // Set class for color
            
            // 5. Update Progress Bar
            if (nextRank) {
                // Not max rank
                const scoreForNextRank = nextRank.score - currentRank.score;
                const scoreInCurrentRank = currentScore - currentRank.score;
                const progressPercent = Math.max(0, Math.min(100, (scoreInCurrentRank / scoreForNextRank) * 100));
                
                progressFill.style.width = progressPercent + '%';
                progressText.textContent = `${currentScore} / ${nextRank.score} Score (Need ${nextRank.score - currentScore} more for ${nextRank.name})`;
            } else {
                // Max rank (ULTIMATE)
                progressFill.style.width = '100%';
                progressText.textContent = `Max Rank! Total Score: ${currentScore}`;
            }
        }

        async function handleRedeem() {
            if (!crypto.subtle) {
                alert("Security Error: crypto.subtle is not available. This feature requires a secure (HTTPS) server or localhost. It will not work if you open it from a 'file:///' path.");
                return;
            }
            const code = redeemInput.value.replace(/\s/g, '').toUpperCase();
            if (code === "") {
                alert("Please enter a code.");
                return;
            }

            redeemSubmit.textContent = "Checking...";
            redeemSubmit.disabled = true;

            try {
                const hashedCode = await sha256(code);
                const duration = redeemCodes[hashedCode];

                if (duration) {
                    alert("Success! Premium activated for " + duration + " month(s).");
                    const now = new Date();
                    setCookie("isPremium", "true", 3650);
                    setCookie("premiumRedeemedDate", now.toISOString(), 3650);
                    setCookie("premiumDurationMonths", duration, 3650);
                    location.reload();
                } else {
                    alert("Code invalid! Debug message: " + hashedCode);
                    console.log("Checking against keys:", Object.keys(redeemCodes));
                    redeemSubmit.textContent = "Submit";
                    redeemSubmit.disabled = false;
                }
            } catch (error) {
                console.error("Hashing error:", error);
                alert("An unexpected error occurred during hashing: " + error.message);
                redeemSubmit.textContent = "Submit";
                redeemSubmit.disabled = false;
            }
        }

        // --- 6. Modal Event Listeners ---
        closeModalButton.onclick = () => {
            premiumModal.style.display = 'none';
        }
        upgradeButton.onclick = () => {
            premiumModal.style.display = 'flex';
        }
        redeemSubmit.onclick = handleRedeem;

        premiumModal.onclick = (event) => {
            if (event.target === premiumModal) {
                premiumModal.style.display = 'none';
            }
        }

        // --- 7. Page Initialization (MODIFIED) ---
        function initializePage() {
            checkPremiumStatus(); // Check cookies
            updateRankDisplay();  // <-- ADDED THIS CALL

            if (isPremium) {
                quizData = premiumQuizData; 
                document.body.classList.add('premium-active'); 
            } else {
                quizData = freeQuizData; 
                premiumModal.style.display = 'flex'; 
            }

            // Now, run the main app logic
            renderContent();
        }

        // ---------------------------------
        // --- ORIGINAL APP LOGIC ---
        // ---------------------------------
        const navPathContainer = document.getElementById('nav-path');
        const contentArea = document.getElementById('content-area');
        let navStack = [];

        function createButton(text, type = 'button', href = '#') {
            if (type === 'link') {
                const a = document.createElement('a');
                a.textContent = text;
                a.href = href;
                a.className = 'nav-button quiz-link';
                return a;
            } else {
                const button = document.createElement('button');
                button.textContent = text;
                button.className = 'nav-button';
                return button;
            }
        }

        function updateNavPath() {
            navPathContainer.innerHTML = ''; // Clear current path
            const homeLink = document.createElement('a');
            homeLink.textContent = 'Home';
            homeLink.onclick = () => {
                navStack = []; 
                renderContent();
            };
            navPathContainer.appendChild(homeLink);

            navStack.forEach((item, index) => {
                const separator = document.createElement('span');
                separator.textContent = '>';
                navPathContainer.appendChild(separator);

                const levelLink = document.createElement('a');
                levelLink.textContent = item;
                levelLink.onclick = () => {
                    navStack = navStack.slice(0, index + 1);
                    renderContent();
                };
                navPathContainer.appendChild(levelLink);
            });
        }

        function renderContent() {
            contentArea.innerHTML = ''; 
            updateNavPath(); 

            let level = navStack.length;

            switch (level) {
                case 0:
                    const grades = Object.keys(quizData);
                    grades.forEach(grade => {
                        const button = createButton(grade);
                        button.onclick = () => {
                            navStack.push(grade);
                            renderContent();
                        };
                        contentArea.appendChild(button);
                    });
                    break;

                case 1:
                    const selectedGrade = navStack[0];
                    const subjects = quizData[selectedGrade];
                    const subjectNames = Object.keys(subjects);

                    if (subjectNames.length === 0) {
                        contentArea.innerHTML = '<a href="https://wa.me/85292130599?text=Hi I would like to suggest a UT to be added to UGA Rev"><p>Nothing here, yet... Suggest UT to be added</p></a>';
                    } else {
                        subjectNames.forEach(subject => {
                            const button = createButton(subject);
                            button.onclick = () => {
                                navStack.push(subject);
                                renderContent();
                            };
                            contentArea.appendChild(button);
                        });
                    }
                    break;

                case 2:
                    const [grade, subject] = navStack;
                    const tests = quizData[grade][subject]; 
                    const testNames = Object.keys(tests); 

                    if (testNames.length === 0) {
                        contentArea.innerHTML = '<p>No tests available for this subject.</p>';
                    } else {
                        testNames.forEach(testName => {
                            const button = createButton(testName);
                            button.onclick = () => {
                                navStack.push(testName); 
                                renderContent();
                            };
                            contentArea.appendChild(button);
                        });
                    }
                    break;

                case 3:
                    const [gradeL3, subjectL3, testNameL3] = navStack;
                    const quizzes = quizData[gradeL3][subjectL3][testNameL3];

                    if (!quizzes || quizzes.length === 0) {
                        contentArea.innerHTML = '<p>No quiz links available for this test.</p>';
                    } else {
                        quizzes.forEach(quiz => {
                            const link = createButton(quiz.name, 'link', quiz.href);
                            contentArea.appendChild(link);
                        });
                    }
                    break;
            }
        }

        initializePage();
