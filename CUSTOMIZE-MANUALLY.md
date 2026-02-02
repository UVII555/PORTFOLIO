# 📝 Manual Customization Guide

If you've already deployed and your site shows default template values, follow this guide to update everything.

---

## 🎯 What You Need to Change

Your deployed site shows:
- ❌ `[Your University Name]`
- ❌ `yourusername` 
- ❌ `utsav.singh@example.com`
- ❌ `20XX`

You need YOUR actual information!

---

## ⚡ QUICK METHOD: Use the Script (Recommended)

Run this command in Terminal:

```bash
cd /Users/utsavsingh/Desktop/Wrap
./customize.sh
```

It will ask you for:
1. University name
2. Graduation year
3. Email
4. GitHub username
5. LinkedIn username
6. LeetCode username (optional)
7. Codeforces username (optional)

Then automatically update everything!

---

## 📝 MANUAL METHOD: Edit Files Yourself

If you prefer to edit manually, here's what to change:

### File 1: `index.html`

#### Change 1: University Name (Line 339)
```html
<!-- FIND THIS: -->
<p class="institution">[Your University Name]</p>

<!-- REPLACE WITH: -->
<p class="institution">IIT Delhi</p>  <!-- Your actual university -->
```

#### Change 2: Graduation Year (Line 340)
```html
<!-- FIND THIS: -->
<p class="duration">Expected Graduation: 20XX</p>

<!-- REPLACE WITH: -->
<p class="duration">Expected Graduation: 2027</p>  <!-- Your year -->
```

#### Change 3: Email (Line 504)
```html
<!-- FIND THIS: -->
<a href="mailto:utsav.singh@example.com">utsav.singh@example.com</a>

<!-- REPLACE WITH: -->
<a href="mailto:your.real.email@gmail.com">your.real.email@gmail.com</a>
```

#### Change 4: GitHub (Line 511)
```html
<!-- FIND THIS: -->
<a href="https://github.com/yourusername" target="_blank">github.com/yourusername</a>

<!-- REPLACE WITH: -->
<a href="https://github.com/your_actual_github" target="_blank">github.com/your_actual_github</a>
```

#### Change 5: LinkedIn (Line 518)
```html
<!-- FIND THIS: -->
<a href="https://linkedin.com/in/yourusername" target="_blank">linkedin.com/in/yourusername</a>

<!-- REPLACE WITH: -->
<a href="https://linkedin.com/in/your_linkedin_id" target="_blank">linkedin.com/in/your_linkedin_id</a>
```

#### Change 6: Footer GitHub (Line 561)
```html
<!-- FIND THIS: -->
<a href="https://github.com/yourusername" target="_blank" aria-label="GitHub">

<!-- REPLACE WITH: -->
<a href="https://github.com/your_actual_github" target="_blank" aria-label="GitHub">
```

#### Change 7: Footer LinkedIn (Line 564)
```html
<!-- FIND THIS: -->
<a href="https://linkedin.com/in/yourusername" target="_blank" aria-label="LinkedIn">

<!-- REPLACE WITH: -->
<a href="https://linkedin.com/in/your_linkedin_id" target="_blank" aria-label="LinkedIn">
```

#### Change 8: Footer Email (Line 567)
```html
<!-- FIND THIS: -->
<a href="mailto:utsav.singh@example.com" aria-label="Email">

<!-- REPLACE WITH: -->
<a href="mailto:your.real.email@gmail.com" aria-label="Email">
```

---

### File 2: `dsa-config.js`

#### Change Lines 9-12:
```javascript
// FIND THIS:
platforms: {
    leetcode: 'yourusername',
    codeforces: 'yourusername',
    codechef: 'yourusername',
    hackerrank: 'yourusername'
}

// REPLACE WITH YOUR ACTUAL USERNAMES:
platforms: {
    leetcode: 'your_leetcode_id',      // Your LeetCode username
    codeforces: 'your_codeforces_id',  // Your Codeforces handle
    codechef: 'your_codechef_id',      // Your CodeChef username
    hackerrank: 'your_hackerrank_id'   // Your HackerRank username
}
```

**Important:** Use your EXACT usernames from these platforms!

---

## 🔄 After Making Changes

### If Using VS Code or Text Editor:
1. Save all files
2. Test locally: `open index.html`
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Updated with my personal information"
   git push
   ```

### If Deployed on Netlify:
1. Save all changes
2. Go to Netlify dashboard
3. Drag and drop the updated `Wrap` folder
4. Done! Updates appear instantly

### If Deployed on GitHub Pages:
1. Save all changes
2. Commit and push:
   ```bash
   git add index.html dsa-config.js
   git commit -m "Updated personal information"
   git push
   ```
3. Wait 2-3 minutes for GitHub Pages to rebuild

---

## ✅ Verification Checklist

After updating, check your deployed site for:

- [ ] University name shows YOUR university (not `[Your University Name]`)
- [ ] Graduation year shows YOUR year (not `20XX`)
- [ ] Email shows YOUR email (not `utsav.singh@example.com`)
- [ ] GitHub links go to YOUR profile (not `yourusername`)
- [ ] LinkedIn links go to YOUR profile (not `yourusername`)
- [ ] DSA tracker shows numbers (not "Loading...") if you added usernames
- [ ] Footer links are correct

---

## 🐛 Common Issues

### Issue: Changes not showing on deployed site

**Solution:**
```bash
# Force push to trigger rebuild
git add .
git commit -m "Force update"
git push -f
```

Or clear browser cache: `Cmd + Shift + R`

### Issue: DSA stats still showing "Loading..."

**Causes:**
1. Usernames still say `'yourusername'` in dsa-config.js
2. Profiles are private
3. Typo in username

**Solution:**
1. Double-check usernames in dsa-config.js
2. Make profiles public on LeetCode/Codeforces
3. Test username by visiting: `https://leetcode.com/YOUR_USERNAME`

### Issue: Git says "nothing to commit"

**Solution:**
You might not have saved the files! 
- In VS Code: `Cmd + S` to save
- In TextEdit: `Cmd + S` to save
- Then try git commands again

---

## 📱 Test on Different Devices

After updating, test on:
- ✅ Desktop browser (Chrome/Firefox)
- ✅ Mobile phone (actual device)
- ✅ Tablet (if available)

Check that:
- All text is correct
- Links work
- Theme toggle works
- DSA stats appear

---

## 🆘 Need Help?

### Quick Debug:
```bash
# Check current values in files
grep "Your University" index.html
grep "yourusername" index.html
grep "yourusername" dsa-config.js
```

If these commands return results, you haven't updated yet!

### Completely start over:
```bash
# Restore from backups if you made them
mv index.html.backup index.html
mv dsa-config.js.backup dsa-config.js

# Or re-run the customization script
./customize.sh
```

---

## 💡 Pro Tips

1. **Use Find & Replace** in your editor:
   - Open index.html
   - Press `Cmd + F` (Mac) or `Ctrl + F` (Windows)
   - Find: `yourusername`
   - Replace with: `your_actual_github`
   - Click "Replace All"

2. **Test locally before pushing:**
   ```bash
   open index.html
   ```
   Check everything looks good, then push.

3. **Keep backups:**
   ```bash
   cp index.html index.html.backup
   cp dsa-config.js dsa-config.js.backup
   ```

---

## 🎉 Success Looks Like:

When you visit your deployed site, you should see:

```
✅ Your actual name
✅ Your university name
✅ Your graduation year
✅ Your email address
✅ Links to YOUR GitHub/LinkedIn
✅ DSA stats with actual numbers
```

NOT:
```
❌ [Your University Name]
❌ yourusername
❌ utsav.singh@example.com
❌ 20XX
❌ Loading platform stats...
```

---

That's it! Your portfolio should now show YOUR information instead of the template defaults.
