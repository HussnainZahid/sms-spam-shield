document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const resultContainer = document.getElementById('result-container');
    const resultCard = document.getElementById('result-card');
    const statusIndicator = document.getElementById('status-indicator');
    
    // Character counter
    messageInput.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            charCount.style.color = '#f72585';
        } else {
            charCount.style.color = '#6c757d';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        form.querySelector('.btn-text').textContent = 'Analyzing...';
        form.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin btn-icon';
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // Display results
            showResult(data.result, data.error);
        } catch (error) {
            showResult(null, "Network error. Please try again.");
        } finally {
            // Reset button
            form.querySelector('.btn-text').textContent = 'Analyze Message';
            form.querySelector('.btn-icon').className = 'fas fa-search btn-icon';
        }
    });
    
    function showResult(result, error) {
        // Clear previous results
        resultCard.className = 'result-card hidden';
        resultCard.innerHTML = '';
        
        if (error) {
            resultCard.className = 'result-card error';
            resultCard.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="result-title">Error</h3>
                <p class="result-message">${error}</p>
            `;
        } else {
            const isSpam = result === 'SPAM';
            resultCard.className = `result-card ${isSpam ? 'spam' : 'ham'}`;
            resultCard.innerHTML = `
                <div class="result-icon">
                    <i class="fas ${isSpam ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                </div>
                <h3 class="result-title">${result}</h3>
                <p class="result-message">${isSpam ? 'This message appears to be spam.' : 'This message looks legitimate.'}</p>
            `;
            
            // Update status indicator
            statusIndicator.querySelector('span').textContent = isSpam ? 'Spam Detected' : 'Message Clean';
            statusIndicator.querySelector('.indicator-dot').style.backgroundColor = isSpam ? '#f72585' : '#4ade80';
        }
        
        // Trigger animation
        setTimeout(() => {
            resultCard.classList.remove('hidden');
            resultCard.classList.add('visible');
        }, 10);
    }
    
    // Initialize status indicator
    statusIndicator.querySelector('.indicator-dot').style.backgroundColor = '#4ade80';
});