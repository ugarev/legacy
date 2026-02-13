// --- HELPERS ---
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// GCD is not directly used by the new generators, but kept for completeness if other generators need it.
function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}


// --- GENERATORS ---
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pickRandom(arr){return arr[Math.floor(Math.random()*arr.length)];}
function makeUniqueOptions(c,d,f,b){let s=new Set([c]);for(let v of d)s.add(f(v));while(s.size<4)s.add(f(b()));return shuffle(Array.from(s).slice(0,4));}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function genDirectedNums() { const a=randomInt(-10,10),b=randomInt(-10,10),op=Math.random()>0.5?'+':'-',ans=op==='+'?a+b:a-b; return {mode:'text',question:`${a} ${op} (${b}) = ?`,options:makeUniqueOptions(ans.toString(),[a-b,b-a,-ans],n=>n.toString(),()=>randomInt(-20,20)),correctAnswer:ans.toString(),explanation:"Watch signs."}; }
function genSimpleCoord() { const tx=randomInt(-4,4),ty=randomInt(-3,3); gameState.visual={mode:'',type:'Draggable',shapes:[{pts:[{x:0,y:0}],x:0,y:0,color:'#4A90E2'}],targetOutlines:[{pts:[{x:0,y:0}],x:tx,y:ty}],gridW:10,gridH:8,originMarker:true}; return {mode:'visual',question:`Drag Blue Dot to (${tx},${ty})`,explanation:`x=${tx}, y=${ty}`}; }
function genBasicAlgebra() { const x=randomInt(2,9),k=randomInt(2,5),c=randomInt(1,10),ans=k*x+c; return {mode:'text',question:`Solve ${k}x + ${c} = ${ans}`,options:makeUniqueOptions(x.toString(),[x+1,x-1],n=>n.toString(),()=>randomInt(1,20)),correctAnswer:x.toString(),explanation:"Inverse ops"}; }
function genAreaArchitect() { const a=randomInt(6,12); gameState.visual={type:'GridPainter',gridCells:Array(8).fill().map(()=>Array(10).fill(0)),reqArea:a,subType:'Area',gridW:10,gridH:8}; return {mode:'visual',question:`Paint shape with Area ${a}`,explanation:`Count squares.`}; }

// U2: Varied
function genPolyArea() { 
    // Random area & type
    const area=pickRandom([6,8,10,12]); 
    const type=Math.random()>0.5?'Triangle':'Trapezium'; 
    gameState.visual={type:'GridPainter',gridCells:Array(8).fill().map(()=>Array(10).fill(0)),reqArea:area,subType:'Area',gridW:10,gridH:8}; 
    return {mode:'visual',question:`Paint a <strong>${type}</strong> with <strong>Area = ${area}</strong>.`,explanation:`(1 square = 1 unit area)`}; 
}

function genShapeSlicer() { 
    const type = pickRandom(['Trapezoid', 'Parallelogram', 'L-Shape']);
    let p, cuts, q;
    if(type==='Trapezoid'){
        p=[{x:1,y:1},{x:4,y:1},{x:5,y:3},{x:0,y:3}];
        cuts=[{s:{x:1,y:1},e:{x:2,y:3}},{s:{x:4,y:1},e:{x:3,y:3}}]; // Standard parallel cuts
        q="Cut into Parallelogram & Triangle";
    } else if(type==='Parallelogram'){
        p=[{x:2,y:2},{x:5,y:2},{x:4,y:5},{x:1,y:5}];
        cuts=[{s:{x:2,y:2},e:{x:4,y:5}},{s:{x:5,y:2},e:{x:1,y:5}}];
        q="Cut into 2 Triangles";
    } else { 
        p=[{x:2,y:2},{x:4,y:2},{x:4,y:4},{x:6,y:4},{x:6,y:6},{x:2,y:6}];
        cuts=[{s:{x:4,y:4},e:{x:4,y:6}}, {s:{x:4,y:4},e:{x:2,y:4}}];
        q="Cut into 2 Rectangles";
    }
    gameState.visual={type:'Slicer',polygon:p,cutLine:null,validCuts:cuts,gridW:10,gridH:8}; 
    return {mode:'visual',question:q,explanation:`Find the dividing line.`}; 
}

function genShapeTrans() { 
    const s = pickRandom([{pts:[{x:0,y:0},{x:1,y:0},{x:0,y:1}]},{pts:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}]}]);
    const sx=randomInt(-2,0), sy=randomInt(-2,0), tx=randomInt(-2,2)||2, ty=randomInt(-2,2)||2; 
    gameState.visual={type:'Draggable',shapes:[{pts:s.pts,x:sx,y:sy,color:'#4A90E2'}],targetOutlines:[{pts:s.pts,x:sx+tx,y:sy+ty}],staticOutlines:[{pts:s.pts,x:sx,y:sy}],gridW:10,gridH:8,hideOutlines:true}; 
    return {mode:'visual',question:`Translate by (${tx},${ty})`,explanation:`Right ${tx}, Up ${ty}`}; 
}
function genSymmetryPainter() { const w=10,h=8,ax=Math.random()>0.5?'Vertical':'Horizontal',g=Array(h).fill().map(()=>Array(w).fill(0)),t=Array(h).fill().map(()=>Array(w).fill(0)); let n=randomInt(3,5); for(let k=0;k<n;k++){ if(ax==='Vertical'){let r=randomInt(1,h-2),c=randomInt(1,4);g[r][c]=1;t[r][c]=1;t[r][w-1-c]=1;}else{let r=randomInt(1,3),c=randomInt(1,w-2);g[r][c]=1;t[r][c]=1;t[h-1-r][c]=1;} } gameState.visual={type:'GridPainter',gridCells:g,targetCells:t,gridW:w,gridH:h,axis:ax,subType:'Symmetry'}; return {mode:'visual',question:`Reflect ${ax}`,explanation:`Mirror.`}; }

// U3 Varied
function genBinaryBulbs() { const target=randomInt(5,31), bin=target.toString(2).padStart(5,'0'); let t=Array(1).fill().map(()=>Array(5).fill(0)); for(let i=0;i<5;i++)if(bin[i]==='1')t[0][i]=1; gameState.visual={type:'GridPainter',style:'Bulbs',gridCells:Array(1).fill().map(()=>Array(5).fill(0)),targetCells:t,gridW:5,gridH:1}; return {mode:'visual',question:`Make <strong>${target}</strong> in Binary`,explanation:`${target} = ${bin}`}; }
function genGears() { const t1=pickRandom([8,12,16]), t2=pickRandom([24,32]), turns=randomInt(2,4); gameState.visual={mode:'Static',staticVisuals:[{type:'Gear',x:-80,y:0,r:30,teeth:t1,color:'#e74c3c',label:'A'},{type:'Gear',x:50,y:0,r:50,teeth:t2,color:'#3498db',label:'B'}]}; const ans=(t1*turns)/t2; return {mode:'text',question:`Gear A (${t1}t) turns ${turns}x. Gear B (${t2}t)?`,options:makeUniqueOptions(ans.toString(),[ans*2,ans+1],n=>n,()=>randomInt(1,5)),correctAnswer:ans.toString(),explanation:'Ratio'}; }
function genVennSort() { const r1=randomInt(2,3), r2=randomInt(4,5), n=randomInt(4,30); 
    // Start at bottom center area (5,7) relative to grid center-relative logic for draggable
    // Wait, Draggable uses center-relative grid coords.
    // Center (0,0) is 5,4. Bottom is y=-3.
    // Venn centers at -50, +50 pixels from center.
    // Target zones (approx): Left (-1.5, 0), Right (1.5, 0), Mid (0,0), Out (-3, -3)
    // Fix: Use simpler logic. Just check logical regions.
    gameState.visual={type:'Draggable',staticVisuals:[{type:'Venn'}],shapes:[{pts:[{x:0,y:0}],x:0,y:-3,color:'#4A90E2',label:n.toString()}],targetOutlines:[{pts:[{x:0,y:0}],x:(n%r1==0&&n%r2==0?0:(n%r1==0?-2:(n%r2==0?2:-3))),y:0}],gridW:10,gridH:8,hideOutlines:true}; 
    return {mode:'visual',question:`Drag ${n}. Left:x${r1}, Right:x${r2}`,explanation:`Divisibility.`}; 
}
function genVectorCalc() { const ax=randomInt(-3,3), ay=randomInt(-3,3), bx=randomInt(-3,3), by=randomInt(-3,3); return {mode:'text',question:`A(${ax},${ay}) to B(${bx},${by}). Vector?`,options:makeUniqueOptions(`(${bx-ax},${by-ay})`,[`(${ax-bx},${ay-by})`],n=>n,()=>`(${randomInt(-5,5)},${randomInt(-5,5)})`),correctAnswer:`(${bx-ax},${by-ay})`,explanation:'End - Start'}; }

// U4
function genBalanceScale() { const t=randomInt(4,10)*2, s=t/2; gameState.visual={mode:'Static',staticVisuals:[{type:'Balance',lCount:3,rTri:1,rSq:1}]}; return {mode:'text',question:`Tri=${t}. Sq?`,options:makeUniqueOptions(s.toString(),[t.toString(),s+2],n=>n,()=>randomInt(2,10)),correctAnswer:s.toString(),explanation:'3s = t+s -> 2s=t'}; }
function genRotation() { const px=pickRandom([2,3]), py=pickRandom([1,2]); gameState.visual={type:'Draggable',shapes:[{pts:[{x:0,y:0}],x:px,y:py,color:'#4A90E2'}],targetOutlines:[{pts:[{x:0,y:0}],x:py,y:-px}],gridW:10,gridH:8,originMarker:true,hideOutlines:true,showGhostLine:true}; return {mode:'visual',question:`Rotate 90 CW`,explanation:`(x,y)->(y,-x)`}; }
function genPerimeterPuzzle() { const a=6, p=10; gameState.visual={type:'GridPainter',gridCells:Array(8).fill().map(()=>Array(10).fill(0)),reqArea:a,reqPerim:p,subType:'Perimeter',gridW:10,gridH:8}; return {mode:'visual',question:`Area 6, Perim 10`,explanation:`3x2 rect`}; }
function genReflectPoint() { const ax=randomInt(-3,3)||1, ay=randomInt(-2,2)||1, axis=Math.random()>0.5?'X-axis':'Y-axis'; const tx=(axis==='X-axis'?ax:-ax), ty=(axis==='X-axis'?-ay:ay); gameState.visual={type:'Draggable',shapes:[{pts:[{x:0,y:0}],x:0,y:0,color:'#4A90E2'}],targetOutlines:[{pts:[{x:0,y:0}],x:tx,y:ty}],gridW:10,gridH:8,originMarker:true,staticShapes:[{pts:[{x:0,y:0}],x:ax,y:ay,color:'#888'}],hideOutlines:true}; return {mode:'visual',question:`Reflect Grey Dot across <strong>${axis}</strong>`,explanation:`Invert coordinate.`}; }

// U5
function genLogicExpert() { const t=randomInt(0,3); let q,a; if(t==0){q="Both Knaves";a="Knave/Knight";}else if(t==1){q="At least one Knave";a="Knight/Knave";}else{q="I am Knave or B Knight";a="Both Knights";} return {mode:'text',question:`Knights/Knaves. A: "${q}"`,options:shuffle(["Both Knights","Both Knaves","Knight/Knave","Knave/Knight"]),correctAnswer:a,explanation:'Logic.'}; }
function genProfitLoss() { const c=randomInt(2,8)*50, p=pickRandom([10,20,25]), isL=Math.random()>0.5, s=isL?c*(1-p/100):c*(1+p/100); return { mode:'text', question:`Sold $${s}, ${p}% ${isL?'Loss':'Profit'}. Cost?`, options:makeUniqueOptions("$"+c,["$"+(s+50)],n=>n,()=>"$"+randomInt(100,500)), correctAnswer:"$"+c, explanation:'Reverse %.' }; }
function genSequenceHard() { const t=Math.random(); let s,n,r; if(t<0.5){s=[1,1,2,3,5];n=8;r="Fibonacci";}else{s=[1,4,9,16];n=25;r="Squares";} return {mode:'text',question:`Next: ${s.join(', ')}...`,options:makeUniqueOptions(n.toString(),[n+2,n-1],x=>x,()=>randomInt(10,50)),correctAnswer:n.toString(),explanation:r}; }
function genMaxArea() { const s=randomInt(3,5), p=s*4, a=s*s; gameState.visual={type:'GridPainter',gridCells:Array(8).fill().map(()=>Array(10).fill(0)),reqArea:a,reqPerim:p,subType:'Perimeter',gridW:10,gridH:8}; return {mode:'visual',question:`Paint Rect: <strong>Perim ${p}, Max Area</strong>`,explanation:`Square.`}; }

// U6
// function genProbability() { const r=randomInt(2,5), b=randomInt(2,5), total=r+b; return {mode:'text',question:`Box: ${r} Red, ${b} Blue. Prob(Red)?`,options:[`${r}/${total}`,`${b}/${total}`],correctAnswer:`${r}/${total}`,explanation:`Part/Total`}; }
// function genMeanMedian() { const d=[2,3,5,5,10]; return {mode:'text',question:`Median of 2, 3, 5, 5, 10?`,options:['5','3','6'],correctAnswer:'5',explanation:'Middle value'}; }

// U7
// function genSubstitution() { const a=2, b=3; return {mode:'text',question:`If a=2, b=3, find 2a+b`,options:['7','8'],correctAnswer:'7',explanation:'2(2)+3'}; }
// function genAngleFinder() { return {mode:'text',question:`Angles on line sum to?`,options:['180','360'],correctAnswer:'180',explanation:'Straight line'}; }



// U6
function genProbability() {
    const r = randomInt(2, 5); // Random number of red balls
    const b = randomInt(2, 5); // Random number of blue balls
    const total = r + b;
    return {
        mode: 'text',
        question: `A box contains ${r} red balls and ${b} blue balls. What is the probability of picking a red ball?`,
        options: [`${r}/${total}`, `${b}/${total}`, `${r}/${b}`, `${b}/${r}`], // Added more plausible distractors
        correctAnswer: `${r}/${total}`,
        explanation: `The probability of an event is calculated as (Number of favorable outcomes) / (Total number of possible outcomes).
        Here, the number of favorable outcomes (picking a red ball) is ${r}.
        The total number of possible outcomes (total balls) is ${r} + ${b} = ${total}.
        So, the probability of picking a red ball is ${r}/${total}.`
    };
}

function genMeanMedian() {
    // 1. Generate a random set of numbers
    const numElements = randomInt(5, 9); // Number of elements between 5 and 9
    const data = [];
    for (let i = 0; i < numElements; i++) {
        data.push(randomInt(1, 25)); // Random values between 1 and 25
    }
    data.sort((a, b) => a - b); // Sort the data to easily find the median

    // 2. Calculate the median
    let median;
    const mid = Math.floor(data.length / 2);
    if (data.length % 2 === 1) {
        // Odd number of elements: median is the middle value
        median = data[mid];
    } else {
        // Even number of elements: median is the average of the two middle values
        median = (data[mid - 1] + data[mid]) / 2;
    }

    // 3. Calculate the mean for a potential distractor
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / data.length;

    // 4. Generate options including the correct answer and plausible distractors
    const options = new Set();
    options.add(median.toString()); // Correct answer

    // Add distractors:
    // - Mean (if different from median)
    if (mean.toFixed(1) !== median.toString()) { // Compare string representations to avoid float comparison issues
        options.add(mean.toFixed(1).toString()); // Keep one decimal for mean
    }
    // - A value slightly off the median
    if (median > 1) options.add((median - 1).toString());
    options.add((median + 1).toString());
    // - One of the extreme values (min/max)
    options.add(data[0].toString());
    options.add(data[data.length - 1].toString());
    // - If even number of elements, one of the two middle numbers without averaging
    if (data.length % 2 === 0) {
        options.add(data[mid - 1].toString());
        options.add(data[mid].toString());
    }


    // Ensure we have at least 3-4 unique options
    while (options.size < 4) {
        let randomDistractor = randomInt(1, 25);
        if (randomDistractor !== median) {
            options.add(randomDistractor.toString());
        }
    }

    const finalOptions = Array.from(options).slice(0, 4); // Limit to 4 options
    // Shuffle options to ensure the correct answer isn't always in the same position
    for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }

    return {
        mode: 'text',
        question: `Find the median of the following set of numbers: ${data.join(', ')}`,
        options: finalOptions,
        correctAnswer: median.toString(),
        explanation: `To find the median, first arrange the numbers in ascending order: ${data.join(', ')}.
        There are ${data.length} numbers in the set.
        ${data.length % 2 === 1
            ? `Since there is an odd number of elements, the median is the middle number.`
            : `Since there is an even number of elements, the median is the average of the two middle numbers.`
        }
        In this case, the median is ${median}.`
    };
}

// U7
function genSubstitution() {
    // Randomly choose 1 or 2 variables (e.g., 'x', 'y', 'a', 'b')
    const varNamesPool = ['x', 'y', 'a', 'b', 'm', 'n'];
    const numVars = randomInt(1, 2);
    const selectedVars = [];
    const varValues = {};
    const usedIndices = new Set();

    // Assign random unique variable names and values
    while (selectedVars.length < numVars) {
        const index = randomInt(0, varNamesPool.length - 1);
        if (!usedIndices.has(index)) {
            const varName = varNamesPool[index];
            selectedVars.push(varName);
            varValues[varName] = randomInt(-5, 10); // Values between -5 and 10
            usedIndices.add(index);
        }
    }

    // Prepare the "If a=X, b=Y" part of the question
    let questionPart = selectedVars.map(v => `${v}=${varValues[v]}`).join(', ');

    // Define a set of expression templates and their calculation logic
    // Random constants are generated once per question to ensure consistency
    const const1 = randomInt(1, 5); // For addition/subtraction
    const const2 = randomInt(2, 4); // For multiplication
    const const3 = randomInt(2, 3); // For multiplication in 2-var expressions

    const dynamicExpressions = [
        // One variable expressions
        {
            vars: 1,
            template: (v1) => `${v1} + ${const1}`,
            calc: (vals) => vals[0] + const1
        },
        {
            vars: 1,
            template: (v1) => `${v1} - ${const1}`,
            calc: (vals) => vals[0] - const1
        },
        {
            vars: 1,
            template: (v1) => `${const2}${v1}`,
            calc: (vals) => const2 * vals[0]
        },
        {
            vars: 1,
            template: (v1) => `${v1}*${v1}`, // x^2
            calc: (vals) => vals[0] * vals[0]
        },
        // Two variable expressions
        {
            vars: 2,
            template: (v1, v2) => `${v1} + ${v2}`,
            calc: (vals) => vals[0] + vals[1]
        },
        {
            vars: 2,
            template: (v1, v2) => `${v1} - ${v2}`,
            calc: (vals) => vals[0] - vals[1]
        },
        {
            vars: 2,
            template: (v1, v2) => `${v1} * ${v2}`,
            calc: (vals) => vals[0] * vals[1]
        },
        {
            vars: 2,
            template: (v1, v2) => `${const3}${v1} + ${v2}`,
            calc: (vals) => const3 * vals[0] + vals[1]
        },
        {
            vars: 2,
            template: (v1, v2) => `${v1} - ${const3}${v2}`,
            calc: (vals) => vals[0] - const3 * vals[1]
        },
    ];
    
    // Filter expressions based on the number of selected variables
    const availableExpressions = dynamicExpressions.filter(exp => exp.vars === numVars);
    const chosenExpression = availableExpressions[randomInt(0, availableExpressions.length - 1)];
    
    // Get the actual variable values in an array for calculation
    const actualVarValues = selectedVars.map(v => varValues[v]);
    
    // Generate the expression string and calculate the correct answer
    let expressionString;
    let correctAnswerValue;
    
    if (numVars === 1) {
        expressionString = chosenExpression.template(selectedVars[0]);
        correctAnswerValue = chosenExpression.calc([varValues[selectedVars[0]]]);
    } else { // numVars === 2
        expressionString = chosenExpression.template(selectedVars[0], selectedVars[1]);
        correctAnswerValue = chosenExpression.calc([varValues[selectedVars[0]], varValues[selectedVars[1]]]);
    }

    // Generate options
    const options = new Set();
    options.add(correctAnswerValue.toString()); // Correct answer

    // Add distractors:
    // - Slightly off value
    let offValue = correctAnswerValue + randomInt(-2, 2);
    if (offValue !== correctAnswerValue) options.add(offValue.toString());

    // - Common arithmetic errors (e.g., wrong order of operations, simple sum/product)
    if (numVars === 2) {
        const v1Val = varValues[selectedVars[0]];
        const v2Val = varValues[selectedVars[1]];
        options.add((v1Val + v2Val).toString()); // Sum of variables
        options.add((v1Val * v2Val).toString()); // Product of variables
    } else { // 1 variable
        options.add((varValues[selectedVars[0]] + 1).toString());
        options.add((varValues[selectedVars[0]] - 1).toString());
    }
    // - One of the variable values themselves
    options.add(varValues[selectedVars[0]].toString());
    if (numVars === 2) options.add(varValues[selectedVars[1]].toString());

    // Ensure enough unique options
    while (options.size < 4) {
        let randomDistractor = randomInt(correctAnswerValue - 10, correctAnswerValue + 10);
        if (randomDistractor !== correctAnswerValue) {
            options.add(randomDistractor.toString());
        }
    }

    const finalOptions = Array.from(options).slice(0, 4); // Limit to 4 options
    // Shuffle options
    for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }

    // Construct detailed explanation
    let explanationText = `Given ${questionPart}, we need to substitute these values into the expression "${expressionString}".`;
    let substitutedExpression = expressionString;

    // Use regex with word boundaries to safely replace variable names
    // Sort variables by length descending to avoid issues if one variable name is a substring of another (e.g., 'a' and 'ab')
    const sortedVars = [...selectedVars].sort((a, b) => b.length - a.length);
    sortedVars.forEach(v => {
        substitutedExpression = substitutedExpression.replace(new RegExp(`\\b${v}\\b`, 'g'), `(${varValues[v]})`);
    });

    explanationText += `\nSubstituting the values: ${substitutedExpression}`;
    explanationText += `\nCalculating the result: ${correctAnswerValue}`;


    return {
        mode: 'text',
        question: `If ${questionPart}, find ${expressionString}`,
        options: finalOptions,
        correctAnswer: correctAnswerValue.toString(),
        explanation: explanationText
    };
}

function genAngleFinder() {
    // Array of different angle facts/questions
    const angleFacts = [{
            question: 'What is the sum of angles on a straight line?',
            correct: 180,
            explanation: 'Angles on a straight line (also known as supplementary angles) always add up to 180 degrees.'
        },
        {
            question: 'What is the sum of angles around a point?',
            correct: 360,
            explanation: 'Angles that form a full circle around a point always add up to 360 degrees.'
        },
        {
            question: 'What is the sum of the interior angles in any triangle?',
            correct: 180,
            explanation: 'The sum of the interior angles of any triangle is always 180 degrees.'
        },
        {
            question: 'Two angles whose sum is 90 degrees are called...',
            correct: 'Complementary angles',
            optionsOverride: ['Complementary angles', 'Supplementary angles', 'Vertical angles', 'Adjacent angles'],
            explanation: 'Two angles that add up to 90 degrees are defined as complementary angles.'
        },
        {
            question: 'Two angles whose sum is 180 degrees are called...',
            correct: 'Supplementary angles',
            optionsOverride: ['Supplementary angles', 'Complementary angles', 'Acute angles', 'Obtuse angles'],
            explanation: 'Two angles that add up to 180 degrees are defined as supplementary angles.'
        },
        {
            question: 'When two straight lines intersect, the angles opposite each other are called... and are they equal or different?',
            correct: 'Vertical angles, and they are equal',
            optionsOverride: ['Vertical angles, and they are equal', 'Adjacent angles, and they are equal', 'Vertical angles, and they are different', 'Adjacent angles, and they are different'],
            explanation: 'Angles opposite each other when two lines intersect are called vertical angles, and vertical angles are always equal.'
        }
    ];
    
    // Randomly select one angle fact
    const chosenFact = angleFacts[randomInt(0, angleFacts.length - 1)];
    
    let options = new Set();
    if (chosenFact.optionsOverride) {
        // Use predefined options for specific questions (like definitions)
        options = new Set(chosenFact.optionsOverride);
    } else {
        // For numerical answers, generate distractors
        options.add(chosenFact.correct.toString()); // Correct answer
    
        // Add common angle sums as distractors
        const commonSums = [90, 180, 360];
        commonSums.forEach(sum => {
            if (sum !== chosenFact.correct) {
                options.add(sum.toString());
            }
        });
    
        // Add a slightly off value, ensuring it's not the correct answer or another option
        if (typeof chosenFact.correct === 'number') {
            let offValue;
            let attempts = 0;
            do {
                offValue = chosenFact.correct + randomInt(-20, 20); // Larger range for variety
                attempts++;
            } while ((offValue === chosenFact.correct || options.has(offValue.toString())) && attempts < 10); // Avoid infinite loop
        
            if (offValue !== chosenFact.correct && !options.has(offValue.toString())) {
                options.add(offValue.toString());
            }
        }
    }

    const finalOptions = Array.from(options).slice(0, 4); // Limit to 4 options
    // Shuffle options
    for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }

    return {
        mode: 'text',
        question: chosenFact.question,
        options: finalOptions,
        correctAnswer: chosenFact.correct.toString(),
        explanation: chosenFact.explanation
    };
}

// --- New Generator Functions ---

/**
 * Helper function to generate a Mode question.
 * Ensures a mode exists for typical S1 questions.
 */
function _genModeQuestion() {
    const count = randomInt(5, 9); // Number of elements in the data set
    let numbers = [];
    let modeMap = {};
    let maxCount = 0;

    // Phase 1: Generate initial numbers
    for (let i = 0; i < count; i++) {
        numbers.push(randomInt(1, 10)); // Numbers between 1 and 10
    }

    // Phase 2: Calculate frequencies and find initial maxCount
    for (let num of numbers) {
        modeMap[num] = (modeMap[num] || 0) + 1;
        if (modeMap[num] > maxCount) {
            maxCount = modeMap[num];
        }
    }

    // Phase 3: If no number appears more than once (maxCount is 1), force a mode
    // This makes sure the question has a clear mode for S1 level.
    if (maxCount === 1 && count > 1) {
        // Pick a random number already in the array and duplicate it by replacing another
        const numToDuplicate = numbers[randomInt(0, numbers.length - 1)];
        // Replace a different random element with the chosen number to create a duplicate
        let randomIndexToReplace;
        do {
            randomIndexToReplace = randomInt(0, numbers.length - 1);
        } while (numbers[randomIndexToReplace] === numToDuplicate); // Avoid replacing with itself if it's the only one
        
        numbers[randomIndexToReplace] = numToDuplicate;

        // Recalculate modeMap and maxCount after duplication
        modeMap = {};
        maxCount = 0;
        for (let num of numbers) {
            modeMap[num] = (modeMap[num] || 0) + 1;
            if (modeMap[num] > maxCount) {
                maxCount = modeMap[num];
            }
        }
    }

    // Phase 4: Find the mode(s) based on the final maxCount
    let modes = [];
    for (let num in modeMap) {
        if (modeMap[num] === maxCount) {
            modes.push(parseInt(num));
        }
    }

    // For Secondary 1, questions usually expect a single mode. If multiple, pick the smallest.
    const finalAnswer = modes.sort((a, b) => a - b)[0].toString();

    // Sort numbers for consistent display in the question and explanation
    numbers.sort((a, b) => a - b);

    // Generate options: include correct answer and other plausible distractors
    let options = new Set();
    options.add(finalAnswer);
    while (options.size < 4) {
        let distractor = randomInt(1, 10).toString(); // Random numbers as distractors
        if (!options.has(distractor) && distractor !== finalAnswer) {
            options.add(distractor);
        }
    }
    options = shuffleArray(Array.from(options));

    return {
        mode: 'text',
        question: `What is the mode of the following numbers: ${numbers.join(', ')}?`,
        options: options,
        correctAnswer: finalAnswer,
        explanation: `The mode is the number that appears most frequently in a data set. In the set ${numbers.join(', ')}, the number ${finalAnswer} appears most often.`
    };
}

/**
 * Helper function to generate a Range question.
 */
function _genRangeQuestion() {
    const count = randomInt(5, 9); // Number of elements in the data set
    const numbers = Array.from({ length: count }, () => randomInt(10, 100)); // Numbers between 10 and 100
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const answer = max - min;

    // Generate options: include correct answer and plausible distractors
    const options = shuffleArray([
        answer,
        answer + randomInt(1, 5), // Slightly higher
        answer - randomInt(1, 5), // Slightly lower
        answer + randomInt(6, 10) // Significantly higher
    ].filter(opt => opt > 0)).map(String); // Ensure options are positive and converted to strings

    return {
        mode: 'text',
        question: `What is the range of the following numbers: ${numbers.join(', ')}?`,
        options: options,
        correctAnswer: answer.toString(),
        explanation: `The range is the difference between the highest and lowest values in a data set. The highest value is ${max} and the lowest is ${min}. So, the range is ${max} - ${min} = ${answer}.`
    };
}

/**
 * Generator for Mode or Range questions (randomly chosen).
 */
function genModeRange() {
    if (Math.random() < 0.5) { // 50% chance for Mode
        return _genModeQuestion();
    } else { // 50% chance for Range
        return _genRangeQuestion();
    }
}

/**
 * Generator for simplifying algebraic expressions (e.g., 3x + 5 - x + 2).
 */
function genSimplifyAlgebra() {
    let xCoeffSum = 0;
    let constantSum = 0;
    let questionParts = [];

    const numTerms = randomInt(3, 5); // Generate 3 to 5 terms in the expression

    for (let i = 0; i < numTerms; i++) {
        if (Math.random() < 0.5) { // 50% chance to generate an 'x' term
            let coeff = randomInt(-5, 5);
            while (coeff === 0) coeff = randomInt(-5, 5); // Ensure coefficient is not 0

            xCoeffSum += coeff;

            let termString;
            if (coeff === 1) termString = 'x';
            else if (coeff === -1) termString = '-x';
            else termString = `${coeff}x`;
            questionParts.push(termString);
        } else { // 50% chance to generate a constant term
            let val = randomInt(-10, 10);
            while (val === 0) val = randomInt(-10, 10); // Ensure constant is not 0

            constantSum += val;
            questionParts.push(val.toString());
        }
    }

    // Format the question string nicely, handling leading signs and spaces
    let question = questionParts[0];
    for (let i = 1; i < questionParts.length; i++) {
        let part = questionParts[i];
        if (part.startsWith('-')) {
            question += ` ${part}`; // e.g., "3x - 5"
        } else {
            question += ` + ${part}`; // e.g., "3x + 5"
        }
    }

    // Calculate the correct answer string
    let correctAnswer;
    if (xCoeffSum === 0 && constantSum === 0) {
        correctAnswer = "0";
    } else if (xCoeffSum === 0) {
        correctAnswer = constantSum.toString();
    } else if (constantSum === 0) {
        if (xCoeffSum === 1) correctAnswer = "x";
        else if (xCoeffSum === -1) correctAnswer = "-x";
        else correctAnswer = `${xCoeffSum}x`;
    } else {
        let xPart;
        if (xCoeffSum === 1) xPart = "x";
        else if (xCoeffSum === -1) xPart = "-x";
        else xPart = `${xCoeffSum}x`;

        if (constantSum > 0) correctAnswer = `${xPart} + ${constantSum}`;
        else correctAnswer = `${xPart} ${constantSum}`; // Negative constant already includes '-'
    }

    // Generate options: include correct answer and plausible distractors
    let options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        let distractorXCoeff = xCoeffSum + randomInt(-2, 2); // Vary x coefficient
        let distractorConstant = constantSum + randomInt(-5, 5); // Vary constant

        // Ensure distractors are different from the correct answer
        if (distractorXCoeff === xCoeffSum && distractorConstant === constantSum) {
            continue;
        }

        let distractorAnswer;
        if (distractorXCoeff === 0 && distractorConstant === 0) {
            distractorAnswer = "0";
        } else if (distractorXCoeff === 0) {
            distractorAnswer = distractorConstant.toString();
        } else if (distractorConstant === 0) {
            if (distractorXCoeff === 1) distractorAnswer = "x";
            else if (distractorXCoeff === -1) distractorAnswer = "-x";
            else distractorAnswer = `${distractorXCoeff}x`;
        } else {
            let xPart;
            if (distractorXCoeff === 1) xPart = "x";
            else if (distractorXCoeff === -1) xPart = "-x";
            else xPart = `${distractorXCoeff}x`;

            if (distractorConstant > 0) distractorAnswer = `${xPart} + ${distractorConstant}`;
            else distractorAnswer = `${xPart} ${distractorConstant}`;
        }
        options.add(distractorAnswer);
    }

    return {
        mode: 'text',
        question: `Simplify the following expression: ${question}`,
        options: shuffleArray(Array.from(options)),
        correctAnswer: correctAnswer,
        explanation: `To simplify, combine like terms. Combine the 'x' terms and combine the constant terms. The simplified expression is ${correctAnswer}.`
    };
}