# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **static portfolio website** for Utsav Singh, a Computer Science undergraduate seeking internships. The portfolio features:
- Single-page responsive design with light/dark theme toggle
- Live DSA (Data Structures & Algorithms) problem tracking via public APIs
- Contact form with validation (frontend-only, requires backend integration for actual submissions)
- Zero external dependencies except Font Awesome CDN for icons

**Tech Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+) - No frameworks or build tools

## File Structure & Purpose

```
Portfolio/
├── index.html           # Main single-page application
├── styles.css           # All styling with CSS custom properties for theming
├── script.js            # Core functionality (theme, navigation, form, animations)
├── dsa-tracker.js       # DSA stats fetching and caching logic
├── dsa-config.js        # Configuration for coding platform usernames
└── *.md                 # Documentation files
```

### Key Architecture Patterns

**1. DSA Tracking System**
- `dsa-config.js` exports `DSA_CONFIG` object with platform usernames and API endpoints
- `dsa-tracker.js` defines `DSATracker` class that fetches stats from LeetCode, Codeforces, GitHub APIs
- Uses browser `localStorage` for 1-hour caching to respect API rate limits
- `script.js` initializes tracker on page load and auto-refreshes every 30 minutes

**2. Theme System**
- CSS custom properties (`:root` and `[data-theme="dark"]`) in styles.css
- Theme state persisted in localStorage
- Toggle handled in script.js with icon updates

**3. Script Load Order** (Critical - in index.html)
```html
<script src="dsa-config.js"></script>    <!-- 1. Load config first -->
<script src="dsa-tracker.js"></script>   <!-- 2. Load tracker class -->
<script src="script.js"></script>        <!-- 3. Initialize everything -->
```

## Development Workflow

### Testing Locally
```bash
# Open in default browser
open index.html

# For live reload during development (optional - requires npm/python)
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

### Debugging DSA Tracker
```javascript
// Open browser console (F12) to see logs:
// ✅ LeetCode stats fetched
// ✅ DSA stats updated successfully
// ⚠️ Could not fetch [Platform] stats: [reason]

// Clear cache to force refresh
localStorage.removeItem('dsa_stats_cache')
```

### Configuration

**Personal Information** - Update in `index.html`:
- Lines 339-340: University name and graduation year
- Lines 504, 511, 518: Contact info (email, GitHub, LinkedIn)
- Lines 561, 564, 567: Footer links (same as above)

**DSA Platform Usernames** - Update in `dsa-config.js`:
- Lines 9-12: Replace `'yourusername'` with actual platform usernames
- Only configure platforms you actively use (others gracefully fail)

**Resume Download** - Update in `script.js`:
- Line 193: Uncomment and set path to your resume PDF file

## Deployment

### Git Workflow
```bash
# This project uses Git - commit messages should include co-author attribution
git add .
git commit -m "Your commit message

Co-Authored-By: Warp <agent@warp.dev>"
git push
```

### Hosting Options
- **GitHub Pages**: Fully supported, enable in repo Settings → Pages
- **Netlify**: Drag-and-drop deployment works out of the box
- **Vercel**: Import from GitHub works perfectly

**Important**: DSA tracker APIs require actual hosting (not `file://`) due to CORS. Testing locally via `file://` may show API errors.

## Known Limitations & Gotchas

1. **Contact Form**: Currently frontend-only validation. To actually send emails, integrate with:
   - Formspree (recommended - easiest)
   - EmailJS (requires API keys)
   - Netlify Forms (if deploying to Netlify)

2. **CodeChef API**: No public API available. The tracker logs a warning but doesn't break.

3. **LeetCode API**: Uses third-party proxy (`leetcode-stats-api.herokuapp.com`). May have rate limits or occasional downtime.

4. **LocalStorage Cache**: Users must clear browser data to see fresh stats before cache expires (1 hour default).

5. **Profile Visibility**: DSA stats only work if user profiles on LeetCode/Codeforces are set to **public**.

## API Integrations

### LeetCode Stats API
- Endpoint: `https://leetcode-stats-api.herokuapp.com/{username}`
- Returns: `totalSolved`, `easySolved`, `mediumSolved`, `hardSolved`, `ranking`, `acceptanceRate`
- No authentication required

### Codeforces API
- Endpoint: `https://codeforces.com/api/user.status?handle={username}&from=1&count=100`
- Returns: Recent submissions (deduplicated to count unique problems)
- Official API with rate limiting

### GitHub Events API
- Endpoint: `https://api.github.com/users/{username}/events`
- Filters for DSA-related repositories (keywords: 'dsa', 'leetcode', 'algorithm')
- Rate limit: 60 requests/hour for unauthenticated requests

## Common Development Tasks

### Update DSA Config
```javascript
// Edit dsa-config.js
const DSA_CONFIG = {
    platforms: {
        leetcode: 'Uvii555',      // Already configured
        codeforces: 'yourusername', // Update this
        codechef: 'yourusername',   // Update this
        hackerrank: 'yourusername'  // Update this
    }
    // ... rest of config
};
```

### Customize Colors
```css
/* Edit styles.css - Lines 4-42 for light theme, 44-82 for dark theme */
:root {
    --accent-primary: #4f46e5;  /* Change primary color */
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add New Project Card
```html
<!-- In index.html, duplicate a project-card div (e.g., lines 206-233) -->
<!-- Update icon, title, description, tech badges, learnings, and GitHub link -->
```

## Browser Console Debug Commands

```javascript
// Check if DSA tracker is initialized
console.log(dsaTracker);

// Manually refresh stats
dsaTracker.refresh();

// View current stats
console.log(dsaTracker.stats);

// Clear cache
dsaTracker.clearCache();

// Check cache age
const cached = localStorage.getItem('dsa_stats_cache');
if (cached) {
    const { timestamp } = JSON.parse(cached);
    console.log('Cache age:', Math.floor((Date.now() - timestamp) / 60000), 'minutes');
}
```

## Accessibility Features

- All interactive elements have ARIA labels
- Keyboard navigation: Press 'T' to toggle theme (when not typing in input)
- Smooth scroll navigation with offset for fixed navbar
- Focus states on all form inputs and buttons
- Semantic HTML structure

## Performance Notes

- Page is ~50KB total (excluding Font Awesome CDN)
- No JavaScript frameworks = fast load times
- Intersection Observer API for scroll animations (efficient)
- CSS transitions instead of JavaScript animations where possible
- LocalStorage caching reduces API calls significantly
