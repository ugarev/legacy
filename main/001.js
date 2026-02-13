

        // Forget about the following 2 lines. They don't work. 
        if (document.cookie.includes('premiumDurationMonths=99')) document.cookie = 'isPremium=false; path=/';
        if (document.cookie.match(/premiumDurationMonths=(\d+)/)?.[1] > 12) document.cookie = 'isPremium=false; path=/';
        // --- PREMIUM FEATURE SCRIPTING ---



        // --- 2. Redeem Code Database ---
        const redeemCodes = {
             "bc59194c59d47219cb619a8d445222fb3fb3054b324b30528d7a585338592a14": 1,
             "d85c8873d19e605eab24f5cd585495ca8d21ccd657531143fa8fee13c9471b34": 2,
             "7c91846c2b8f4054b00c6a3f257dd47194de6884d3843f316e98966cb9bb24f7": 6,
             "19e0c382407b0d7c3efdaa405b68e8e83d803cd72e22b02c3f7698a69730e18f": 12
        };
