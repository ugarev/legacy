
        
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
