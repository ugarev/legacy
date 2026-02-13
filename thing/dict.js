// --- Variables ---
        let syllabus = [];
        let practiceQueue = [];
        let currentWordObj = null; // { text: "word", chars: ["w","o","r","d"] }
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let selectedLang = 'zh-HK'; // Default Cantonese
        let stats = { total: 0, correct: 0 };
        
        // Canvas Setup
        const canvas = document.getElementById('drawing-board');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('canvas-container');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // --- Init & Storage ---
        window.onload = function() {
            lucide.createIcons();
            const savedText = localStorage.getItem('dictation_syllabus');
            if (savedText) {
                document.getElementById('syllabus-input').value = savedText;
            }
            
            // Setup Canvas resolution for high DPI
            setupCanvas();
            window.addEventListener('resize', setupCanvas);

            // Audio pre-load (fix for some browsers needing user interaction)
            if ('speechSynthesis' in window) {
                window.speechSynthesis.getVoices();
            }
        };

        document.getElementById('syllabus-input').addEventListener('input', (e) => {
            localStorage.setItem('dictation_syllabus', e.target.value);
        });

        // --- Canvas Logic ---
        function setupCanvas() {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 6;
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;
            
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startDrawing(e) {
            isDrawing = true;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
            // Draw a dot if it's just a tap
            draw(e);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath(); // Reset path
        }

        function draw(e) {
            if (!isDrawing) return;
            
            // Prevent scrolling on touch
            if(e.type === 'touchmove') e.preventDefault();

            const pos = getPos(e);
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            
            lastX = pos.x;
            lastY = pos.y;
        }

        // Event Listeners for Drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1));
        }

        // --- Game Logic ---

        function setLang(lang) {
            selectedLang = lang;
            if(lang === 'zh-HK') {
                document.getElementById('lang-canto').className = "flex-1 py-2 px-4 rounded-lg border-2 border-indigo-600 bg-indigo-600 text-white font-medium transition";
                document.getElementById('lang-mando').className = "flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 text-gray-600 font-medium transition";
            } else {
                document.getElementById('lang-mando').className = "flex-1 py-2 px-4 rounded-lg border-2 border-indigo-600 bg-indigo-600 text-white font-medium transition";
                document.getElementById('lang-canto').className = "flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 text-gray-600 font-medium transition";
            }
        }

        function startDictation() {
            const rawText = document.getElementById('syllabus-input').value.trim();
            if (!rawText) {
                alert("Please enter some words first!");
                return;
            }

            // Split by new line, remove empty lines
            const lines = rawText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
            
            if (lines.length === 0) return;

            // Shuffle and pick 5
            practiceQueue = lines.sort(() => 0.5 - Math.random()).slice(0, 5);
            
            currentWordIndex = 0;
            stats.total = 0;
            stats.correct = 0;

            switchScreen('dictation-screen');
            loadWord();
        }

        function loadWord() {
            const word = practiceQueue[currentWordIndex];
            currentWordObj = {
                text: word,
                chars: Array.from(word) // Split into characters properly handling surrogates
            };
            currentCharIndex = 0;
            
            updateUIForWord();
            
            // Small delay to let transition finish before speaking
            setTimeout(() => {
                playCurrentWord();
            }, 500);
        }

        function updateUIForWord() {
            document.getElementById('word-counter').innerText = currentWordIndex + 1;
            updateCharUI();
        }

        function updateCharUI() {
            // Update dots
            const dotsContainer = document.getElementById('progress-dots');
            dotsContainer.innerHTML = '';
            
            currentWordObj.chars.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `w-2 h-2 rounded-full ${idx === currentCharIndex ? 'bg-indigo-600' : (idx < currentCharIndex ? 'bg-gray-300' : 'border border-gray-300')}`;
                dotsContainer.appendChild(dot);
            });

            document.getElementById('char-counter').innerText = `${currentCharIndex + 1} / ${currentWordObj.chars.length}`;
            
            // Reset canvas state
            clearCanvas();
            document.getElementById('overlay-char').innerText = '';
            document.getElementById('drawing-controls').classList.remove('hidden');
            document.getElementById('drawing-controls').classList.add('flex');
            document.getElementById('judgment-controls').classList.remove('flex');
            document.getElementById('judgment-controls').classList.add('hidden');
            
            // Ensure overlay is hidden
            document.getElementById('overlay-char').style.zIndex = -1;
        }

        function playCurrentWord() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // Stop any current speech
                const utterance = new SpeechSynthesisUtterance(currentWordObj.text);
                utterance.lang = selectedLang;
                utterance.rate = 0.8; // Slightly slower for dictation
                window.speechSynthesis.speak(utterance);
            } else {
                alert("Sorry, your browser doesn't support Text-to-Speech.");
            }
        }

        function submitCharacter() {
            // Show Overlay
            const char = currentWordObj.chars[currentCharIndex];
            const overlay = document.getElementById('overlay-char');
            
            overlay.innerText = char;
            overlay.style.zIndex = 20; // Move on top of canvas (visually mixed because of transparency)
            
            // Switch controls
            document.getElementById('drawing-controls').classList.add('hidden');
            document.getElementById('drawing-controls').classList.remove('flex');
            
            document.getElementById('judgment-controls').classList.remove('hidden');
            document.getElementById('judgment-controls').classList.add('flex');
        }

        function judge(isCorrect) {
            stats.total++;
            if (isCorrect) stats.correct++;

            currentCharIndex++;

            if (currentCharIndex < currentWordObj.chars.length) {
                // Next character in same word
                updateCharUI();
            } else {
                // Word finished
                currentWordIndex++;
                if (currentWordIndex < practiceQueue.length) {
                    loadWord();
                } else {
                    finishGame();
                }
            }
        }

        function finishGame() {
            switchScreen('result-screen');
            const percentage = Math.round((stats.correct / stats.total) * 100);
            document.getElementById('final-score').innerText = `${percentage}%`;
            document.getElementById('final-stats').innerText = `${stats.correct}/${stats.total} Characters Correct`;
        }

        function exitGame() {
            if(confirm("Exit practice session?")) {
                location.reload();
            }
        }

        function switchScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            
            // Recalculate canvas size if switching to dictation screen
            if(screenId === 'dictation-screen') {
                setTimeout(setupCanvas, 100);
            }
        }