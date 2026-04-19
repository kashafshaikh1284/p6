document.addEventListener('DOMContentLoaded', () => {
    
    // DOM Elements
    const cpuValue = document.getElementById('cpu-value');
    const cpuBar = document.getElementById('cpu-bar');
    const memValue = document.getElementById('mem-value');
    const memBar = document.getElementById('mem-bar');
    const instValue = document.getElementById('inst-value');
    const statusBadge = document.getElementById('sys-status');
    const timestampTxt = document.getElementById('timestamp');
    const refreshBtn = document.getElementById('refresh-btn');

    // Function to fetch data from the Flask Backend API
    async function fetchMetrics() {
        // Add loading spin to button
        refreshBtn.style.opacity = '0.5';
        refreshBtn.querySelector('svg').style.animation = 'spin 1s linear infinite';
        
        try {
            const response = await fetch('/api/metrics');
            const data = await response.json();
            
            updateUI(data);
        } catch (error) {
            console.error("Failed to fetch metrics:", error);
            statusBadge.textContent = "Offline";
            statusBadge.style.color = "#ef4444";
            statusBadge.style.background = "rgba(239, 68, 68, 0.2)";
        } finally {
            // Remove loading spin
            refreshBtn.style.opacity = '1';
            refreshBtn.querySelector('svg').style.animation = 'none';
        }
    }

    // Function to animate numbers smoothly
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final value is exact for instances
                obj.innerHTML = (end % 1 === 0) ? end : end.toFixed(1);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Determine the color of the progress bar based on value
    function getBarColor(value) {
        if (value < 50) return 'linear-gradient(90deg, #10b981, #34d399)'; // Green
        if (value < 80) return 'linear-gradient(90deg, #f59e0b, #fbbf24)'; // Yellow
        return 'linear-gradient(90deg, #ef4444, #f87171)'; // Red
    }

    // Dynamically update the frontend components
    function updateUI(data) {
        // Update CPU
        const currentCpu = parseFloat(cpuValue.innerText) || 0;
        animateValue(cpuValue, currentCpu, data.cpu, 800);
        cpuBar.style.width = `${data.cpu}%`;
        cpuBar.style.background = getBarColor(data.cpu);

        // Update Memory
        const currentMem = parseFloat(memValue.innerText) || 0;
        animateValue(memValue, currentMem, data.memory, 800);
        memBar.style.width = `${data.memory}%`;
        memBar.style.background = getBarColor(data.memory);

        // Update Instances and Status
        const currentInst = parseInt(instValue.innerText) || 0;
        animateValue(instValue, currentInst, data.instances, 500);
        
        statusBadge.textContent = data.status;
        statusBadge.style.color = "#34d399";
        statusBadge.style.background = "rgba(16, 185, 129, 0.2)";

        // Formatting timestamp
        const date = new Date(data.timestamp);
        timestampTxt.textContent = date.toLocaleTimeString();
    }

    // Add spin animation to stylesheet dynamically for the button
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // Event Listeners
    refreshBtn.addEventListener('click', fetchMetrics);

    // Initial Fetch
    fetchMetrics();
    
    // Auto refresh every 5 seconds
    setInterval(fetchMetrics, 5000);
});
