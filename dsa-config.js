// ============================================
// DSA Tracking Configuration
// ============================================

// Configuration for different coding platforms
const DSA_CONFIG = {
    // Your coding platform usernames
    platforms: {
        leetcode: 'Uvii555',      // Replace with your LeetCode username
        codeforces: 'yourusername',    // Replace with your Codeforces username
        codechef: 'uvii555',      // Replace with your CodeChef username
        hackerrank: '@0202singhutsav',     // Replace with your HackerRank username
        github: 'UVII555'         // Replace with your GitHub username
    },

    // API endpoints (using public APIs and proxies)
    apis: {
        leetcode: 'https://leetcode-stats-api.herokuapp.com/',
        leetcodeGraphQL: 'https://leetcode.com/graphql',
        codeforces: 'https://codeforces.com/api/',
        codechef: 'https://codechef-api.vercel.app/',
        github: 'https://api.github.com/users/'
    },

    // GitHub filtering configuration
    github: {
        repoKeywords: ['dsa', 'leetcode', 'algorithm', 'cp', 'competitive'],
        countAllPushEvents: false
    },

    // LeetCode recent accepted problems (GraphQL)
    leetcodeRecent: {
        limit: 20,
        // Optional proxy URL if LeetCode GraphQL is blocked by CORS.
        // Example: 'https://your-netlify-site.netlify.app/.netlify/functions/leetcode'
        proxy: '/.netlify/functions/leetcode'
    },

    // Cache configuration
    cache: {
        duration: 3600000, // 1 hour in milliseconds
        key: 'dsa_stats_cache'
    },

    // Display configuration
    display: {
        showGraphs: true,
        showRecentProblems: true,
        maxRecentProblems: 5,
        animateNumbers: true
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSA_CONFIG;
}
