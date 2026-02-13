
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
