// ==========================================
        //  AUDIO ENGINE
        // ==========================================
        const AudioEngine = {
            ctx: null,
            init: function() {
                if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                if(this.ctx.state === 'suspended') this.ctx.resume();
            },
            playTone: function(freq, type, duration, delay=0) {
                if(!this.ctx) this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + delay);
                osc.stop(this.ctx.currentTime + delay + duration);
            },
            correct: function() { this.playTone(600, 'sine', 0.1); this.playTone(1000, 'sine', 0.3, 0.1); },
            wrong: function() { this.playTone(200, 'sawtooth', 0.3); this.playTone(150, 'sawtooth', 0.3, 0.1); },
            complete: function() { [440, 554, 659, 880].forEach((f, i) => this.playTone(f, 'square', 0.2, i*0.1)); }
        };

        // ==========================================
        //  CURRICULUM DATA (EXPANDED)
        // ==========================================
        const CURRICULUM = [
            {
                id: 'u1', title: "Unit 1: Foundations", desc: "Numbers, Algebra & Area", color: 'u1',
                lessons: [
                    { id: 'U1-L1', title: "Integers", icon: "➕", gen: "genDirectedNums", count: 5, desc: "Signs" },
                    { id: 'U1-L2', title: "Coords", icon: "📍", gen: "genSimpleCoord", count: 5, desc: "(x,y)" },
                    { id: 'U1-L3', title: "Algebra", icon: "𝑥", gen: "genBasicAlgebra", count: 5, desc: "Solving" },
                    { id: 'U1-L4', title: "Area", icon: "🟥", gen: "genAreaArchitect", count: 5, desc: "Squares" },
                ]
            },
            {
                id: 'u2', title: "Unit 2: Shape & Space", desc: "Triangles, Vectors & Cuts", color: 'u2',
                lessons: [
                    { id: 'U2-L1', title: "Triangle Area", icon: "📐", gen: "genPolyArea", count: 6, desc: "Calc Area" },
                    { id: 'U2-L2', title: "Slicing", icon: "✂️", gen: "genShapeSlicer", count: 5, desc: "Dissect" },
                    { id: 'U2-L3', title: "Vectors", icon: "➡", gen: "genShapeTrans", count: 6, desc: "Move" },
                    { id: 'U2-L4', title: "Reflect", icon: "🪞", gen: "genSymmetryPainter", count: 6, desc: "Mirror" }
                ]
            },
            {
                id: 'u3', title: "Unit 3: Logic & Systems", desc: "Binary, Gears & Sets", color: 'u3',
                lessons: [
                    { id: 'U3-L1', title: "Binary", icon: "💡", gen: "genBinaryBulbs", count: 5, desc: "0s & 1s" },
                    { id: 'U3-L2', title: "Gears", icon: "⚙️", gen: "genGears", count: 5, desc: "Ratios" },
                    { id: 'U3-L3', title: "Venn", icon: "⭕", gen: "genVennSort", count: 5, desc: "Sorting" },
                    { id: 'U3-L4', title: "Vector Math", icon: "↗", gen: "genVectorCalc", count: 6, desc: "Calculate" }
                ]
            },
            {
                id: 'u4', title: "Unit 4: Advanced Geometry", desc: "Rotation, Balance & Construction", color: 'u4',
                lessons: [
                    { id: 'U4-L1', title: "Balance", icon: "⚖️", gen: "genBalanceScale", count: 5, desc: "Equations" },
                    { id: 'U4-L2', title: "Rotation", icon: "🔄", gen: "genRotation", count: 6, desc: "Turn 90°" },
                    { id: 'U4-L3', title: "Perimeter", icon: "📏", gen: "genPerimeterPuzzle", count: 6, desc: "Construct" },
                    { id: 'U4-L4', title: "Coords II", icon: "📍", gen: "genReflectPoint", count: 6, desc: "Reflect Pt" }
                ]
            },
            {
                id: 'u5', title: "Unit 5: Advanced Logic & Systems", desc: "Logic, Optimization & Finance", color: 'u5',
                lessons: [
                    { id: 'U5-L1', title: "Logic", icon: "🧠", gen: "genLogicExpert", count: 5, desc: "Knights" },
                    { id: 'U5-L2', title: "Finance", icon: "💰", gen: "genProfitLoss", count: 5, desc: "Profit %" },
                    { id: 'U5-L3', title: "Series", icon: "🔢", gen: "genSequenceHard", count: 5, desc: "Patterns" },
                    { id: 'U5-L4', title: "Maximize", icon: "🚀", gen: "genMaxArea", count: 5, desc: "Optimization" }
                ]
            },
            {
                id: 'u6', title: "Unit 6: Statistics", desc: "Probability & Data", color: 'u6',
                lessons: [
                    { id: 'U6-L1', title: "Probability", icon: "🎲", gen: "genProbability", count: 5, desc: "Chance" },
                    { id: 'U6-L2', title: "Mean/Median", icon: "📊", gen: "genMeanMedian", count: 5, desc: "Averages" },
                    { id: 'U6-L3', title: "Mode/Range", icon: "📈", gen: "genModeRange", count: 5, desc: "Data Spread" }
                ]
            },
            {
                id: 'u7', title: "Unit 7: Adv Algebra", desc: "Substitution & Angles", color: 'u7',
                lessons: [
                    { id: 'U7-L1', title: "Substitution", icon: "𝑥𝑦𝓏", gen: "genSubstitution", count: 5, desc: "Evaluate" },
                    { id: 'U7-L2', title: "Angles", icon: "∠", gen: "genAngleFinder", count: 5, desc: "Geometry" },
                    { id: 'U7-L3', title: "Simplify Exp.", icon: "𝒶+𝒷", gen: "genSimplifyAlgebra", count: 5, desc: "Like Terms" }
                ]
            }
        ];

        const FLAT_LESSONS = CURRICULUM.flatMap(u => u.lessons);

        // --- STATE ---
        let gameState = {
            activeLessonIdx: 0, currentQIndex: 0, correctCount: 0, startTime: 0,
            currentPuzzle: null, selectedOption: null, isAnswered: false, pendingSkipIdx: -1,
            visual: resetVisualState()
        };
        const canvas = document.getElementById('visual-canvas');
        const ctx = canvas.getContext('2d');

        // --- COOKIES ---
        function getCookie(n){let m=document.cookie.match(new RegExp('(^| )'+n+'=([^;]+)'));return m?parseInt(m[2]):0;}
        function setCookie(n,v){document.cookie=n+"="+v+"; path=/; max-age=31536000";}

        // --- INIT ---
        function init() {
            const savedLv = getCookie('gym-lv');
            document.getElementById('total-xp').textContent = getCookie('gym-xp') || 0;
            renderCurriculum(savedLv);
        }

        function renderCurriculum(maxLv) {
            const container = document.getElementById('path-container');
            container.innerHTML = "";
            let globalIdx = 0;
            
            CURRICULUM.forEach((unit) => {
                const uDiv = document.createElement('div');
                uDiv.className = 'unit-section';
                uDiv.innerHTML = `<div class="unit-header ${unit.color}"><h2>${unit.title}</h2><p>${unit.desc}</p></div>`;
                container.appendChild(uDiv);
                
                const unitGrid = document.createElement('div');
                unitGrid.className = unit.color; // Use unit color for children styling
                
                unit.lessons.forEach((l) => {
                    const row = document.createElement('div');
                    row.className = 'path-row';
                    
                    const node = document.createElement('div');
                    let status = 'locked';
                    if (globalIdx < maxLv) status = 'completed';
                    else if (globalIdx === maxLv) status = 'current';
                    
                    node.className = `lesson-node ${status}`;
                    node.innerHTML = l.icon;
                    
                    const currentGlobal = globalIdx; 
                    node.onclick = () => handleNodeClick(currentGlobal, status);
                    
                    const label = document.createElement('div');
                    label.className = 'node-label';
                    label.innerHTML = `${l.title}<br><small>${l.desc}</small>`;
                    
                    node.appendChild(label); row.appendChild(node); unitGrid.appendChild(row);
                    globalIdx++;
                });
                container.appendChild(unitGrid);
            });
        }

        function handleNodeClick(idx, status) {
            AudioEngine.init(); 
            if (status === 'locked') {
                gameState.pendingSkipIdx = idx;
                document.getElementById('skip-overlay').style.display = 'flex';
            } else {
                startLesson(idx);
            }
        }
        
        function closeSkip() { document.getElementById('skip-overlay').style.display = 'none'; }
        function confirmSkip() { closeSkip(); startLesson(gameState.pendingSkipIdx); }

        function startLesson(idx) {
            gameState.activeLessonIdx = idx;
            gameState.currentQIndex = 0;
            gameState.correctCount = 0;
            gameState.startTime = Date.now();
            const lesson = FLAT_LESSONS[idx];
            gameState.totalQ = lesson.count;
            
            document.getElementById('path-view').classList.remove('active');
            document.getElementById('game-view').classList.add('active');
            updateProgress();
            loadNextQuestion();
        }

        function quitLesson() {
            document.getElementById('game-view').classList.remove('active');
            document.getElementById('path-view').classList.add('active');
        }

        function updateProgress() {
            const pct = (gameState.currentQIndex / gameState.totalQ) * 100;
            document.getElementById('progress-fill').style.width = pct + "%";
        }

        function loadNextQuestion() {
            if (gameState.currentQIndex >= gameState.totalQ) { showResults(); return; }

            gameState.isAnswered = false; gameState.selectedOption = null; gameState.visual = resetVisualState();
            document.getElementById('feedback-sheet').classList.remove('show', 'correct', 'wrong');
            document.getElementById('check-btn').style.display = 'block'; 
            document.getElementById('game-footer').style.display = 'flex';
            document.getElementById('options-area').innerHTML = '';
            document.getElementById('visual-canvas').style.display = 'none';
            document.getElementById('visual-hint').style.display = 'none';

            const lesson = FLAT_LESSONS[gameState.activeLessonIdx];
            const generator = window[lesson.gen];
            const p = generator();
            gameState.currentPuzzle = p;

            document.getElementById('q-text').innerHTML = p.question;

            if (p.mode === 'text') {
                const container = document.getElementById('options-area');
                if(gameState.visual.staticVisuals && gameState.visual.staticVisuals.length > 0) {
                    document.getElementById('visual-canvas').style.display = 'block'; resizeCanvas();
                }
                p.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn'; btn.innerHTML = opt;
                    btn.onclick = () => selectOption(idx, btn);
                    container.appendChild(btn);
                });
            } else {
                document.getElementById('visual-canvas').style.display = 'block';
                document.getElementById('visual-hint').style.display = 'block';
                if(gameState.visual.type === 'GridPainter') document.getElementById('visual-hint').textContent = gameState.visual.style==='Bulbs' ? "Tap bulbs to toggle" : "Tap squares to paint";
                else if(gameState.visual.type === 'Draggable') document.getElementById('visual-hint').textContent = "Drag the shape";
                else if(gameState.visual.type === 'Slicer') document.getElementById('visual-hint').textContent = "Swipe to cut";
                setupVisualInteraction();
            }
        }

        function showResults() {
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            const accuracy = Math.round((gameState.correctCount / gameState.totalQ) * 100);
            const earnedXP = gameState.correctCount * 5; 

            document.getElementById('res-acc').textContent = accuracy + "%";
            document.getElementById('res-time').textContent = `${mins}:${secs<10?'0':''}${secs}`;
            document.getElementById('res-xp').textContent = "+" + earnedXP;
            
            AudioEngine.complete();
            document.getElementById('result-overlay').style.display = 'flex';
            
            const currentMax = getCookie('gym-lv');
            if (gameState.activeLessonIdx >= currentMax) setCookie('gym-lv', gameState.activeLessonIdx + 1);
            
            // Cookies: gym-xp for display, score for master tracking
            setCookie('gym-xp', (getCookie('gym-xp')||0) + earnedXP);
            setCookie('score', (getCookie('score')||0) + earnedXP);
        }

        function finishLesson() {
            document.getElementById('result-overlay').style.display = 'none';
            init(); quitLesson();
        }

        // --- INTERACTION ---
        function selectOption(idx, btn) {
            if(gameState.isAnswered) return;
            AudioEngine.playTone(400, 'sine', 0.05);
            gameState.selectedOption = idx;
            document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        }

        document.getElementById('check-btn').onclick = () => {
            if(gameState.isAnswered) return;
            let isCorrect = checkAnswerLogic();
            gameState.isAnswered = true;

            const sheet = document.getElementById('feedback-sheet');
            const header = document.getElementById('fb-header');
            const text = document.getElementById('fb-text');
            sheet.classList.add('show');
            if(isCorrect) {
                sheet.classList.add('correct'); header.innerHTML = "Correct! 🎉";
                gameState.correctCount++; AudioEngine.correct();
            } else {
                sheet.classList.add('wrong'); header.innerHTML = "Correct Answer:";
                if(gameState.currentPuzzle.mode === 'visual') { gameState.visual.showSolution = true; drawVisual(); }
                AudioEngine.wrong();
            }
            text.innerHTML = gameState.currentPuzzle.explanation;
            document.getElementById('game-footer').style.display = 'none';
        };

        document.getElementById('continue-btn').onclick = () => {
            gameState.currentQIndex++; updateProgress(); loadNextQuestion();
        };

        // --- CHECK LOGIC ---
        function checkAnswerLogic() {
            const p = gameState.currentPuzzle; const v = gameState.visual;
            if (p.mode === 'text') {
                if (gameState.selectedOption === null) return false;
                const correct = p.options[gameState.selectedOption] === p.correctAnswer;
                const btns = document.querySelectorAll('.game-btn');
                if(correct) btns[gameState.selectedOption].classList.add('correct');
                else { btns[gameState.selectedOption].classList.add('wrong'); btns.forEach((b,i) => { if(p.options[i]===p.correctAnswer) b.classList.add('correct'); }); }
                return correct;
            } else {
                if (v.type === 'GridPainter') {
                    if(v.style==='Bulbs') {
                        let match=true; for(let c=0;c<5;c++) if(v.gridCells[0][c] !== v.targetCells[0][c]) match=false;
                        return match;
                    } else {
                         let userArea=0, match=true;
                         for(let r=0;r<v.gridH;r++) for(let c=0;c<v.gridW;c++) {
                            if(v.gridCells[r][c]) userArea++;
                            if(v.targetCells && v.gridCells[r][c]!==v.targetCells[r][c]) match=false;
                         }
                         if(v.subType==='Area') return userArea === v.reqArea;
                         else if(v.subType==='Perimeter') return userArea === v.reqArea && checkPerimeter(v) === v.reqPerim;
                         else return match;
                    }
                }
                else if (v.type === 'Draggable') {
                     if(v.shapes.length === 0) return false;
                     if(v.staticVisuals && v.staticVisuals[0].type==='Venn') return v.shapes[0].x === v.targetOutlines[0].x && v.shapes[0].y === v.targetOutlines[0].y;
                     return v.shapes.every((s, i) => s.x===v.targetOutlines[i].x && s.y===v.targetOutlines[i].y);
                }
                else if (v.type === 'Slicer') {
                     if(!v.cutLine) return false;
                     const c = v.cutLine;
                     return v.validCuts.some(k => (k.s.x===c.p1.x && k.s.y===c.p1.y && k.e.x===c.p2.x && k.e.y===c.p2.y) || (k.s.x===c.p2.x && k.s.y===c.p2.y && k.e.x===c.p1.x && k.e.y===c.p1.y));
                }
            }
            return false;
        }
        function checkPerimeter(v) {
            let p = 0;
            for(let r=0; r<v.gridH; r++) for(let c=0; c<v.gridW; c++) {
                if(v.gridCells[r][c]) {
                    if(r===0 || !v.gridCells[r-1][c]) p++;
                    if(r===v.gridH-1 || !v.gridCells[r+1][c]) p++;
                    if(c===0 || !v.gridCells[r][c-1]) p++;
                    if(c===v.gridW-1 || !v.gridCells[r][c+1]) p++;
                }
            }
            return p;
        }

        // --- VISUAL ENGINE ---
        function resetVisualState() {
            return { 
                mode: '', isDragging: false, isPainting: false, draggingShapeIndex: -1, isDrawing: false, drawStart: null, drawEnd: null,
                gridCells: [], targetCells: [], staticCells: null, gridW: 10, gridH: 8, cellSize: 30, offsetX:0, offsetY:0,
                shapes: [], targetOutlines: [], staticOutlines: [], polygon: [], cutLine: null, validCuts: [],
                originMarker: false, hideOutlines: false, showSolution: false, style: 'Normal', staticVisuals: null
            };
        }
        function setupVisualInteraction() { resizeCanvas(); }
        function resizeCanvas() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = 300; if(gameState.currentPuzzle && (gameState.currentPuzzle.mode!=='text' || gameState.visual.staticVisuals)) drawVisual(); }
        window.addEventListener('resize', resizeCanvas);

        function drawVisual() {
            const w=canvas.width, h=canvas.height, v=gameState.visual; ctx.clearRect(0,0,w,h);
            const cell = v.style==='Bulbs' ? 40 : Math.min(w/v.gridW, h/v.gridH); v.cellSize = cell; v.offsetX = (w - v.gridW*cell)/2; v.offsetY = (h - v.gridH*cell)/2;

            if(v.staticVisuals) {
                const cx=w/2, cy=h/2;
                v.staticVisuals.forEach(obj => {
                    if(obj.type==='Gear') drawGear(cx+obj.x, cy+obj.y, obj.teeth, obj.r, obj.color, obj.label);
                    else if(obj.type==='Venn') {
                        ctx.globalAlpha=0.2; ctx.fillStyle='#e74c3c'; ctx.beginPath(); ctx.arc(cx-50,cy,90,0,6.28); ctx.fill(); ctx.fillStyle='#3498db'; ctx.beginPath(); ctx.arc(cx+50,cy,90,0,6.28); ctx.fill(); ctx.globalAlpha=1;
                        ctx.fillStyle='#666'; ctx.font='bold 14px Nunito'; ctx.fillText('Left', cx-90, cy-100); ctx.fillText('Right', cx+90, cy-100);
                    }
                    else if(obj.type==='Balance') {
                        ctx.strokeStyle='#333'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx-80,cy-30); ctx.lineTo(cx+80,cy-30); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx,cy+60); ctx.moveTo(cx-30,cy+60); ctx.lineTo(cx+30,cy+60); ctx.stroke();
                        for(let i=0;i<obj.lCount;i++) ctx.strokeRect(cx-90+i*20,cy-45,15,15);
                        ctx.beginPath(); ctx.moveTo(cx+70,cy-45); ctx.lineTo(cx+85,cy-45); ctx.lineTo(cx+77,cy-60); ctx.fill(); ctx.strokeRect(cx+90,cy-45,15,15);
                    }
                });
            }

            if(v.type === 'GridPainter') {
                if(v.style==='Bulbs') {
                    for(let i=0;i<v.gridW;i++){
                        const bx = v.offsetX + i*cell + cell/2, by = v.offsetY + cell/2;
                        const on = v.gridCells[0][i];
                        ctx.beginPath(); ctx.arc(bx,by,15,0,6.28); ctx.fillStyle=on?'#f1c40f':'#eee'; ctx.fill(); ctx.stroke();
                        ctx.fillStyle='#666'; ctx.fillText(Math.pow(2,4-i), bx-4, by+35);
                    }
                } else {
                    ctx.strokeStyle='#eee'; ctx.lineWidth=1;
                    for(let r=0;r<=v.gridH;r++){ctx.beginPath();ctx.moveTo(v.offsetX,v.offsetY+r*cell);ctx.lineTo(v.offsetX+v.gridW*cell,v.offsetY+r*cell);ctx.stroke();}
                    for(let c=0;c<=v.gridW;c++){ctx.beginPath();ctx.moveTo(v.offsetX+c*cell,v.offsetY);ctx.lineTo(v.offsetX+c*cell,v.offsetY+v.gridH*cell);ctx.stroke();}
                    if(v.axis){ ctx.strokeStyle='#f39c12'; ctx.lineWidth=3; ctx.setLineDash([5,5]); ctx.beginPath(); if(v.axis==='Vertical'){ctx.moveTo(w/2,v.offsetY);ctx.lineTo(w/2,v.offsetY+v.gridH*cell);}else{ctx.moveTo(v.offsetX,h/2);ctx.lineTo(v.offsetX+v.gridW*cell,h/2);} ctx.stroke(); ctx.setLineDash([]); }
                    for(let r=0;r<v.gridH;r++) for(let c=0;c<v.gridW;c++) {
                        const cx=v.offsetX+c*cell, cy=v.offsetY+r*cell;
                        if(v.showSolution && v.targetCells && v.targetCells[r][c]) {ctx.strokeStyle='#2ecc71';ctx.lineWidth=3;ctx.strokeRect(cx+2,cy+2,cell-4,cell-4);}
                        if(v.staticCells && v.staticCells[r] && v.staticCells[r][c]) { ctx.fillStyle='#b0bec5'; ctx.fillRect(cx+1,cy+1,cell-2,cell-2); }
                        else if(v.gridCells[r][c]) { ctx.fillStyle='#58cc02'; ctx.fillRect(cx+1,cy+1,cell-2,cell-2); }
                    }
                }
            }
            else if(v.type === 'Draggable') {
                if(!v.staticVisuals) {
                    ctx.strokeStyle='#f0f0f0'; ctx.lineWidth=1;
                    for(let i=0; i<=v.gridH; i++) { ctx.beginPath(); ctx.moveTo(v.offsetX, v.offsetY+i*cell); ctx.lineTo(v.offsetX+v.gridW*cell, v.offsetY+i*cell); ctx.stroke(); }
                    for(let i=0; i<=v.gridW; i++) { ctx.beginPath(); ctx.moveTo(v.offsetX+i*cell, v.offsetY); ctx.lineTo(v.offsetX+i*cell, v.offsetY+v.gridH*cell); ctx.stroke(); }
                }
                if(v.targetOutlines && (!v.hideOutlines || v.showSolution)) {
                    const col = v.showSolution?'#2ecc71':'#ccc';
                    v.targetOutlines.forEach(t=>drawPoly(t.pts,t.x,t.y,null,col,true));
                }
                if(v.showGhostLine && v.shapes.length>0) {
                    const s = v.shapes[0];
                    const cx=v.offsetX+v.gridW/2*cell, cy=v.offsetY+v.gridH/2*cell;
                    const px = v.offsetX + (v.gridW/2 + s.x)*cell, py = v.offsetY + (v.gridH/2 - s.y)*cell; // Center relative
                    ctx.strokeStyle = 'rgba(74, 144, 226, 0.4)'; ctx.lineWidth=2; ctx.setLineDash([5,5]);
                    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
                }
                if(v.staticOutlines) v.staticOutlines.forEach(s => drawPoly(s.pts, s.x, s.y, null, '#ccc', true));
                if(v.shapes) v.shapes.forEach(s=>drawPoly(s.pts, s.x, s.y, s.color, '#fff', false, s.label));
            }
            else if(v.type === 'Slicer') {
                drawPoly(v.polygon, 0, 0, 'rgba(200,200,200,0.2)', '#666', false, null, true);
                if(v.cutLine) drawLine(v.cutLine.p1, v.cutLine.p2, '#e74c3c');
                else if(v.isDrawing) drawPixelLine(v.drawStart, v.drawEnd, '#e74c3c');
                if(v.showSolution && v.validCuts.length>0) drawLine(v.validCuts[0].s,v.validCuts[0].e, '#2ecc71', 3);
            }
        }

        // Draw Helpers (Same as before)
        function drawGear(x,y,t,r,c,l) { ctx.fillStyle=c; ctx.beginPath(); for(let i=0;i<t*2;i++){ const a=(Math.PI*2*i)/(t*2); const rad=(i%2===0)?r+5:r-5; ctx.lineTo(x+Math.cos(a)*rad, y+Math.sin(a)*rad); } ctx.fill(); ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(x,y,10,0,6.28); ctx.fill(); if(l){ctx.fillStyle='#333';ctx.font='bold 12px Arial';ctx.fillText(l,x-4,y+4);} }
        function drawPoly(pts, dx, dy, fill, stroke, outline, label, isMath) {
            const v=gameState.visual, c=v.cellSize, cx=v.offsetX+v.gridW/2*c, cy=v.offsetY+v.gridH/2*c;
            if(pts.length===1) { 
                // Dot fix: Venn uses center-relative for target, Grid Rel for shape start
                // BUT genVennSort sets x=5 (center) which is center-relative 0?
                // Let's stick to: Draggable uses center-relative.
                let x,y;
                if(v.type==='Draggable') { x = cx+dx*c; y = cy-dy*c; } // Center relative
                else { const p=gridToPixel(dx, dy); x=p.x; y=p.y; } // Grid Index
                
                ctx.beginPath(); ctx.arc(x,y,10,0,6.28); ctx.fillStyle=fill||stroke; ctx.fill(); if(label){ctx.fillStyle='white';ctx.font='bold 12px Arial';ctx.fillText(label,x-4,y+4);} return; 
            }
            ctx.beginPath();
            const tx = isMath ? cx : (v.type==='Draggable' ? cx+dx*c : v.offsetX);
            const ty = isMath ? cy : (v.type==='Draggable' ? cy-dy*c : v.offsetY);
            if(isMath) { ctx.moveTo(cx+pts[0].x*c, cy-pts[0].y*c); for(let i=1;i<pts.length;i++) ctx.lineTo(cx+pts[i].x*c, cy-pts[i].y*c); } 
            else { ctx.moveTo(tx+pts[0].x*c, ty-pts[0].y*c); for(let i=1;i<pts.length;i++) ctx.lineTo(tx+pts[i].x*c, ty-pts[i].y*c); }
            ctx.closePath(); if(fill){ctx.fillStyle=fill;ctx.fill();} if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=outline?2:1;if(outline)ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);}
        }
        function drawLine(p1,p2,col,w=3) { const v=gameState.visual; const s = {x:v.offsetX+p1.x*v.cellSize, y:v.offsetY+(v.gridH-p1.y)*v.cellSize}, e={x:v.offsetX+p2.x*v.cellSize, y:v.offsetY+(v.gridH-p2.y)*v.cellSize}; ctx.strokeStyle=col; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(e.x,e.y); ctx.stroke(); }
        function drawPixelLine(p1,p2,col) { ctx.strokeStyle=col;ctx.lineWidth=3;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.setLineDash([]); }
        
        // --- INPUTS ---
        function getPos(e) { const r=canvas.getBoundingClientRect(), t=e.touches?e.touches[0]:e; return {x:(t.clientX-r.left)*(canvas.width/r.width), y:(t.clientY-r.top)*(canvas.height/r.height)}; }
        function startInput(e) { 
            if(gameState.isAnswered)return; 
            if(e.target === canvas) e.preventDefault();
            const p=getPos(e), v=gameState.visual; 
            AudioEngine.playTone(300, 'triangle', 0.05); 
            if(v.type==='GridPainter'){ if(v.style==='Bulbs'){const c=Math.floor((p.x-v.offsetX)/v.cellSize); if(c>=0&&c<5&&Math.abs(p.y-(v.offsetY+v.cellSize/2))<20){v.gridCells[0][c]=v.gridCells[0][c]?0:1;drawVisual();}} else {const c=Math.floor((p.x-v.offsetX)/v.cellSize), r=Math.floor((p.y-v.offsetY)/v.cellSize); if(r>=0&&r<v.gridH&&c>=0&&c<v.gridW) { if(!v.staticCells || !v.staticCells[r] || !v.staticCells[r][c]) { v.gridCells[r][c] = v.gridCells[r][c]?0:1; drawVisual(); } } } } 
            else if(v.type==='Draggable') { const cx=v.offsetX+v.gridW/2*v.cellSize, cy=v.offsetY+v.gridH/2*v.cellSize; for(let i=0;i<v.shapes.length;i++){const s=v.shapes[i], sx=cx+s.x*v.cellSize, sy=cy-s.y*v.cellSize; if(Math.hypot(p.x-sx,p.y-sy)<30){v.isDragging=true;v.draggingShapeIndex=i;break;}} } 
            else if(v.type==='Slicer') { v.isDrawing=true; v.drawStart=p; v.drawEnd=p; } 
        }
        function moveInput(e) { 
            const v=gameState.visual; if(!v.isDragging && !v.isDrawing) return; 
            if(e.target === canvas) e.preventDefault();
            const p=getPos(e); 
            if(v.isDragging){const cx=v.offsetX+v.gridW/2*v.cellSize, cy=v.offsetY+v.gridH/2*v.cellSize, gx=Math.round((p.x-cx)/v.cellSize), gy=Math.round((cy-p.y)/v.cellSize); v.shapes[v.draggingShapeIndex].x=gx; v.shapes[v.draggingShapeIndex].y=gy; drawVisual();} else {v.drawEnd=p; drawVisual();} 
        }
        function endInput() { const v=gameState.visual; if(v.isDrawing){const snap=(pt)=>({x:Math.round((pt.x-v.offsetX)/v.cellSize),y:v.gridH-Math.round((pt.y-v.offsetY)/v.cellSize)}); v.cutLine={p1:snap(v.drawStart),p2:snap(v.drawEnd)}; drawVisual();} v.isDragging=false; v.isDrawing=false; }
        canvas.addEventListener('mousedown', startInput); canvas.addEventListener('touchstart', startInput, {passive:false}); canvas.addEventListener('mousemove', moveInput); canvas.addEventListener('touchmove', moveInput, {passive:false}); canvas.addEventListener('mouseup', endInput); canvas.addEventListener('touchend', endInput);