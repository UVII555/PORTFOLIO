#!/bin/bash

# Portfolio Customization Script
# This script will help you customize your portfolio with your actual information

echo "🚀 Portfolio Customization Script"
echo "=================================="
echo ""
echo "This will update your portfolio with YOUR information."
echo "Press CTRL+C at any time to cancel."
echo ""

# Function to read user input with default value
read_input() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " result
        result="${result:-$default}"
    else
        read -p "$prompt: " result
    fi
    
    echo "$result"
}

# Collect information
echo "📝 Let's collect your information..."
echo ""

UNIVERSITY=$(read_input "University Name" "")
GRAD_YEAR=$(read_input "Expected Graduation Year" "2027")
EMAIL=$(read_input "Your Email" "")
GITHUB=$(read_input "GitHub Username" "")
LINKEDIN=$(read_input "LinkedIn Username" "")
LEETCODE=$(read_input "LeetCode Username (optional)" "")
CODEFORCES=$(read_input "Codeforces Username (optional)" "")

echo ""
echo "✅ Information collected! Here's what I'll update:"
echo "=================================================="
echo "University: $UNIVERSITY"
echo "Graduation: $GRAD_YEAR"
echo "Email: $EMAIL"
echo "GitHub: $GITHUB"
echo "LinkedIn: $LINKEDIN"
echo "LeetCode: $LEETCODE"
echo "Codeforces: $CODEFORCES"
echo ""

read -p "Is this correct? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "❌ Cancelled. Run the script again to retry."
    exit 1
fi

echo ""
echo "🔧 Updating files..."

# Backup original files
cp index.html index.html.backup
cp dsa-config.js dsa-config.js.backup

echo "✅ Backups created (index.html.backup, dsa-config.js.backup)"

# Update index.html
echo "📝 Updating index.html..."

# Update University Name
sed -i '' "s/\[Your University Name\]/$UNIVERSITY/g" index.html

# Update Graduation Year
sed -i '' "s/20XX/$GRAD_YEAR/g" index.html

# Update Email (3 occurrences)
sed -i '' "s/utsav.singh@example.com/$EMAIL/g" index.html

# Update GitHub username (5 occurrences)
sed -i '' "s/yourusername/$GITHUB/g" index.html

# Update LinkedIn username
sed -i '' "s|linkedin.com/in/yourusername|linkedin.com/in/$LINKEDIN|g" index.html

# Update dsa-config.js if usernames provided
if [ -n "$LEETCODE" ]; then
    echo "📝 Updating dsa-config.js with LeetCode username..."
    sed -i '' "s/leetcode: 'yourusername'/leetcode: '$LEETCODE'/g" dsa-config.js
fi

if [ -n "$CODEFORCES" ]; then
    echo "📝 Updating dsa-config.js with Codeforces username..."
    sed -i '' "s/codeforces: 'yourusername'/codeforces: '$CODEFORCES'/g" dsa-config.js
fi

echo ""
echo "✨ Customization Complete!"
echo "========================="
echo ""
echo "📋 What was updated:"
echo "  ✅ University name"
echo "  ✅ Graduation year"
echo "  ✅ Email address (3 places)"
echo "  ✅ GitHub username (5 places)"
echo "  ✅ LinkedIn username (2 places)"
if [ -n "$LEETCODE" ]; then
    echo "  ✅ LeetCode username"
fi
if [ -n "$CODEFORCES" ]; then
    echo "  ✅ Codeforces username"
fi
echo ""
echo "🔍 Next Steps:"
echo "  1. Open index.html in your browser to test"
echo "  2. Check DSA tracker (should show stats if usernames correct)"
echo "  3. If everything looks good, commit and push to GitHub:"
echo ""
echo "     git add ."
echo "     git commit -m 'Updated portfolio with personal info'"
echo "     git push"
echo ""
echo "💡 Tip: If you made a mistake, restore backups:"
echo "     mv index.html.backup index.html"
echo "     mv dsa-config.js.backup dsa-config.js"
echo ""
