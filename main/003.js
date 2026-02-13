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
                    ],
                    "UT 2": [
                        { name: "Dead Zone Formation", href: "s1/geo/ut2/deadzone.html" },
                        { name: "Dead Zone Game", href: "s1/geo/ut2/deadzone2.html" }
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
                    ],
                    "UT 2": [
                        { name: "Dead Zone Formation", href: "s1/geo/ut2/deadzone.html" },
                        { name: "Dead Zone Game", href: "s1/geo/ut2/deadzone2.html" }
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
