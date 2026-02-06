// ============================================
// DSA Problem Tracker with Live API Integration
// ============================================

class DSATracker {
    constructor(config) {
        this.config = config;
        this.stats = {
            total: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            platforms: {},
            recentProblems: [],
            lastUpdated: null
        };
    }

    // Main method to fetch all stats
    async fetchAllStats() {
        console.log('🔄 Fetching DSA stats from all platforms...');
        
        // Check cache first
        const cachedData = this.getCachedData();
        if (cachedData) {
            console.log('✅ Using cached data');
            this.stats = cachedData;
            this.updateUI();
            return this.stats;
        }

        try {
            // Fetch from all platforms
            await Promise.allSettled([
                this.fetchLeetCodeStats(),
                this.fetchCodeforcesStats(),
                this.fetchCodeChefStats(),
                this.fetchGitHubStats()
            ]);

            this.stats.lastUpdated = new Date().toISOString();
            this.cacheData(this.stats);
            this.updateUI();
            
            console.log('✅ DSA stats updated successfully');
            return this.stats;
        } catch (error) {
            console.error('❌ Error fetching DSA stats:', error);
            this.showError();
            return null;
        }
    }

    // Fetch LeetCode stats using public API
    async fetchLeetCodeStats() {
        const username = this.config.platforms.leetcode;
        if (!username || username === 'Uvii555') return;

        try {
            // Using LeetCode public API
            const response = await fetch(`${this.config.apis.leetcode}${username}`);
            
            if (!response.ok) {
                throw new Error('LeetCode API error');
            }

            const data = await response.json();
            
            this.stats.platforms.leetcode = {
                total: data.totalSolved || 0,
                easy: data.easySolved || 0,
                medium: data.mediumSolved || 0,
                hard: data.hardSolved || 0,
                ranking: data.ranking || 'N/A',
                acceptanceRate: data.acceptanceRate || 0
            };

            this.stats.total += data.totalSolved || 0;
            this.stats.easy += data.easySolved || 0;
            this.stats.medium += data.mediumSolved || 0;
            this.stats.hard += data.hardSolved || 0;

            console.log('✅ LeetCode stats fetched');
        } catch (error) {
            console.warn('⚠️ Could not fetch LeetCode stats:', error.message);
        }
    }

    // Fetch Codeforces stats
    async fetchCodeforcesStats() {
        const username = this.config.platforms.codeforces;
        if (!username || username === 'Username') return;

        try {
            const response = await fetch(
                `${this.config.apis.codeforces}user.status?handle=${username}&from=1&count=100`
            );
            
            if (!response.ok) throw new Error('Codeforces API error');

            const data = await response.json();
            
            if (data.status === 'OK') {
                const acceptedProblems = data.result.filter(
                    submission => submission.verdict === 'OK'
                );
                
                const uniqueProblems = new Set(
                    acceptedProblems.map(p => `${p.problem.contestId}-${p.problem.index}`)
                );

                this.stats.platforms.codeforces = {
                    total: uniqueProblems.size,
                    problems: Array.from(uniqueProblems)
                };

                this.stats.total += uniqueProblems.size;
                console.log('✅ Codeforces stats fetched');
            }
        } catch (error) {
            console.warn('⚠️ Could not fetch Codeforces stats:', error.message);
        }
    }

    // Fetch CodeChef stats
    async fetchCodeChefStats() {
        const username = this.config.platforms.codechef;
        if (!username || username === 'uvii555') return;

        try {
            // CodeChef doesn't have a public API, so we'll track manually
            // or use web scraping (requires backend)
            console.log('ℹ️ CodeChef requires manual tracking or backend setup');
        } catch (error) {
            console.warn('⚠️ Could not fetch CodeChef stats:', error.message);
        }
    }

    // Fetch GitHub contributions (for tracking DSA repos)
    async fetchGitHubStats() {
        const username = this.config.platforms.leetcode; // Assuming same username
        if (!username || username === 'UVII555') return;

        try {
            const response = await fetch(`${this.config.apis.github}${username}/events`);
            
            if (!response.ok) throw new Error('GitHub API error');

            const events = await response.json();
            
            // Filter for DSA-related commits
            const dsaEvents = events.filter(event => 
                event.type === 'PushEvent' && 
                (event.repo.name.toLowerCase().includes('dsa') ||
                 event.repo.name.toLowerCase().includes('leetcode') ||
                 event.repo.name.toLowerCase().includes('algorithm'))
            );

            this.stats.platforms.github = {
                dsaCommits: dsaEvents.length,
                recentActivity: dsaEvents.slice(0, 5)
            };

            console.log('✅ GitHub stats fetched');
        } catch (error) {
            console.warn('⚠️ Could not fetch GitHub stats:', error.message);
        }
    }

    // Update UI with fetched stats
    updateUI() {
        // Update total problems solved
        this.animateNumber('dsa-total', this.stats.total);
        
        // Update difficulty breakdown
        this.animateNumber('dsa-easy', this.stats.easy);
        this.animateNumber('dsa-medium', this.stats.medium);
        this.animateNumber('dsa-hard', this.stats.hard);

        // Update platform-specific stats
        this.updatePlatformStats();

        // Update last updated time
        this.updateTimestamp();

        // Show success indicator
        this.showSuccessIndicator();
    }

    // Animate number counting
    animateNumber(elementId, targetValue, duration = 1000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            if (
                (increment > 0 && currentValue >= targetValue) ||
                (increment < 0 && currentValue <= targetValue)
            ) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 16);
    }

    // Update platform-specific stats
    updatePlatformStats() {
        const platformsContainer = document.getElementById('platform-stats');
        if (!platformsContainer) return;

        let html = '';

        // LeetCode
        if (this.stats.platforms.leetcode) {
            const lc = this.stats.platforms.leetcode;
            html += `
                <div class="platform-stat-card">
                    <i class="fas fa-code platform-icon" style="color: #FFA116;"></i>
                    <h4>LeetCode</h4>
                    <p class="stat-number">${lc.total}</p>
                    <p class="stat-label">Problems Solved</p>
                    <div class="difficulty-breakdown">
                        <span class="easy">Easy: ${lc.easy}</span>
                        <span class="medium">Medium: ${lc.medium}</span>
                        <span class="hard">Hard: ${lc.hard}</span>
                    </div>
                    ${lc.ranking !== 'N/A' ? `<p class="ranking">Rank: ${lc.ranking}</p>` : ''}
                </div>
            `;
        }

        // Codeforces
        if (this.stats.platforms.codeforces) {
            const cf = this.stats.platforms.codeforces;
            html += `
                <div class="platform-stat-card">
                    <i class="fas fa-trophy platform-icon" style="color: #1F8ACB;"></i>
                    <h4>Codeforces</h4>
                    <p class="stat-number">${cf.total}</p>
                    <p class="stat-label">Problems Solved</p>
                </div>
            `;
        }

        // GitHub
        if (this.stats.platforms.github) {
            const gh = this.stats.platforms.github;
            html += `
                <div class="platform-stat-card">
                    <i class="fab fa-github platform-icon" style="color: #333;"></i>
                    <h4>GitHub</h4>
                    <p class="stat-number">${gh.dsaCommits}</p>
                    <p class="stat-label">DSA Commits</p>
                </div>
            `;
        }

        platformsContainer.innerHTML = html || '<p>Configure your usernames in dsa-config.js</p>';
    }

    // Update timestamp
    updateTimestamp() {
        const timestampElement = document.getElementById('stats-timestamp');
        if (!timestampElement || !this.stats.lastUpdated) return;

        const date = new Date(this.stats.lastUpdated);
        timestampElement.textContent = `Last updated: ${date.toLocaleString()}`;
    }

    // Cache management
    cacheData(data) {
        try {
            localStorage.setItem(
                this.config.cache.key,
                JSON.stringify({
                    data: data,
                    timestamp: Date.now()
                })
            );
        } catch (error) {
            console.warn('Could not cache data:', error);
        }
    }

    getCachedData() {
        try {
            const cached = localStorage.getItem(this.config.cache.key);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            if (age < this.config.cache.duration) {
                return data;
            }

            // Cache expired
            localStorage.removeItem(this.config.cache.key);
            return null;
        } catch (error) {
            return null;
        }
    }

    clearCache() {
        localStorage.removeItem(this.config.cache.key);
    }

    // UI feedback methods
    showSuccessIndicator() {
        const indicator = document.getElementById('sync-indicator');
        if (indicator) {
            indicator.innerHTML = '<i class="fas fa-check-circle"></i> Synced';
            indicator.style.color = '#16a34a';
        }
    }

    showError() {
        const indicator = document.getElementById('sync-indicator');
        if (indicator) {
            indicator.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
            indicator.style.color = '#dc2626';
        }
    }

    // Manual refresh
    async refresh() {
        this.clearCache();
        await this.fetchAllStats();
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSATracker;
}
