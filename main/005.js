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
