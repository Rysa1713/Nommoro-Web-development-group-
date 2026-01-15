
            function calculateExpiry() {
                const expiryDate = document.getElementById('expiryDate').value;
                const foodType = document.getElementById('foodType').value;
                const resultCard = document.getElementById('resultCard');
                const resultTitle = document.getElementById('resultTitle');
                const resultDescription = document.getElementById('resultDescription');
                
                if (!expiryDate || !foodType) return;
                
                const today = new Date();
                const expiry = new Date(expiryDate);
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let status, message, description;
                
                // Define food safety guidelines based on realistic sources
                const foodSafetyGuidelines = {
                    'Milk': { safe: -2, warning: 'Consume immediately if stored properly' },
                    'Yogurt': { safe: 7, warning: 'Usually safe 1-2 weeks past expiry if refrigerated' },
                    'Bread': { safe: 7, warning: 'Check for mold; usually safe few days past expiry' },
                    'Cheese': { safe: 14, warning: 'Hard cheeses last longer; check for unusual smell' },
                    'Eggs': { safe: 21, warning: 'Usually safe 3-5 weeks past expiry if refrigerated' },
                    'Meat': { safe: -1, warning: 'Do not consume past expiry date' },
                    'Chicken': { safe: -1, warning: 'Do not consume past expiry date' },
                    'Fish': { safe: -1, warning: 'Do not consume past expiry date' },
                    'Pork': { safe: -1, warning: 'Do not consume past expiry date' },
                    'Beef': { safe: -1, warning: 'Do not consume past expiry date' },
                    'Vegetables': { safe: 3, warning: 'Check for spoilage; consume soon if wilted' },
                    'Fruits': { safe: 5, warning: 'Check for spoilage; some fruits ripen after expiry' },
                    'Canned Goods': { safe: 365, warning: 'Usually safe years past expiry if can is intact' },
                    'Pasta': { safe: 730, warning: 'Dry pasta safe 2-3 years past expiry' },
                    'Rice': { safe: 1095, warning: 'White rice safe 4-5 years past expiry if stored properly' },
                    'Cereal': { safe: 180, warning: 'Usually safe 6-8 months past expiry; may lose crunch' },
                    'Butter': { safe: 30, warning: 'Usually safe 1-2 months past expiry if refrigerated' },
                    'Cream': { safe: -1, warning: 'Do not use past expiry date' },
                    'Ice Cream': { safe: 60, warning: 'Quality degrades but usually safe 2-3 months past expiry' },
                    'Frozen Food': { safe: 90, warning: 'Safe indefinitely but quality degrades over time' },
                    'Leftovers': { safe: -1, warning: 'Consume within 3-4 days of cooking' },
                    'Condiments': { safe: 180, warning: 'Most condiments safe months past expiry' },
                    'Snacks': { safe: 90, warning: 'Usually safe 2-3 months past expiry; may lose freshness' },
                    'Beverages': { safe: 90, warning: 'Check for changes in taste, color, or smell' }
                };
                
                const guidelines = foodSafetyGuidelines[foodType] || { safe: 0, warning: 'Use caution' };
                
                if (diffDays < -Math.abs(guidelines.safe)) {
                    status = 'expired';
                    message = 'Not safe to eat';
                    description = `This ${foodType.toLowerCase()} expired ${Math.abs(diffDays)} days ago and should be disposed of safely.`;
                    resultCard.className = 'result-card result-expired';
                } else if (diffDays < 0 && diffDays >= -Math.abs(guidelines.safe)) {
                    status = 'caution';
                    message = 'Consume immediately';
                    description = `This ${foodType.toLowerCase()} expired ${Math.abs(diffDays)} day(s) ago. ${guidelines.warning}. Check for signs of spoilage before consuming.`;
                    resultCard.className = 'result-card result-today';
                } else if (diffDays === 0) {
                    status = 'today';
                    message = 'Use immediately';
                    description = `This ${foodType.toLowerCase()} expires today! Use it immediately for best quality.`;
                    resultCard.className = 'result-card result-today';
                } else if (diffDays <= 3) {
                    status = 'soon';
                    message = 'Use soon';
                    description = `This ${foodType.toLowerCase()} expires in ${diffDays} day(s). Use it soon for best quality.`;
                    resultCard.className = 'result-card result-soon';
                } else {
                    status = 'safe';
                    message = 'Safe to eat';
                    description = `This ${foodType.toLowerCase()} expires in ${diffDays} day(s) and is safe to consume. Store properly to maintain quality.`;
                    resultCard.className = 'result-card result-safe';
                }
                
                resultTitle.textContent = message;
                resultDescription.textContent = description;
                resultCard.style.display = 'block';
            }

            function updateCheckButton() {
                const expiryDate = document.getElementById('expiryDate').value;
                const foodType = document.getElementById('foodType').value;
                const checkButton = document.getElementById('checkButton');
                
                checkButton.disabled = !expiryDate || !foodType;
            }

            document.getElementById('expiryDate').addEventListener('change', updateCheckButton);
            document.getElementById('foodType').addEventListener('change', updateCheckButton);
            
            updateCheckButton();
