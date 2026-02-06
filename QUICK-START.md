# 🚀 Quick Start Guide - Get Your Portfolio Working in 5 Minutes!

## ⚠️ Current Status: NOT CONFIGURED YET

Your DSA tracker shows "Loading..." because the default username is `'UVII555'` which doesn't exist.

---

## 🔧 FIX #1: Configure DSA Tracking (2 minutes)

### Step 1: Open `dsa-config.js`

Find lines 9-12 and replace with YOUR actual usernames:

**BEFORE (Current):**
```javascript
platforms: {
    leetcode: 'UVII555',      // ❌ This doesn't work!
    codeforces: 'UVII555',
    codechef: 'UVII555',
    hackerrank: 'UVII555'
}
```

**AFTER (Example with real usernames):**
```javascript
platforms: {
    leetcode: 'tourist',           // ✅ Replace with YOUR username
    codeforces: 'tourist',         // ✅ Replace with YOUR username
    codechef: 'tourist',           // ✅ Replace with YOUR username
    hackerrank: 'tourist'          // ✅ Replace with YOUR username
}
```

### Step 2: Make Your Profiles Public

- **LeetCode**: Go to Settings → Profile → Make profile public
- **Codeforces**: Your submissions are public by default
- **CodeChef**: Go to Profile settings → Set to public

### Step 3: Test It!

1. Save `dsa-config.js`
2. Open `index.html` in your browser
3. Scroll to "DSA Progress Tracker" section
4. Wait 2-3 seconds
5. Your stats should appear!

**Still not working?** Open browser console (F12) to see errors.

---

## 📧 FIX #2: Contact Form - Where Does Data Go?

### Current Behavior: Frontend Only (No Backend)

Right now, the contact form does:
- ✅ Validates input (email format, required fields)
- ✅ Shows success message
- ❌ **DOES NOT actually send emails**
- ❌ **DOES NOT save data anywhere**

### Why?
Because there's no backend server to process the form!

---

## 💾 Where to Save Contact Form Data? (3 Options)

### Option 1: Formspree (FREE & EASIEST - 5 minutes) ⭐ RECOMMENDED

**Setup:**

1. Go to [formspree.io](https://formspree.io)
2. Sign up (free - 50 submissions/month)
3. Create a new form → Get your form ID: `xyzabc123`

4. **Open `index.html`** and find line 529:
```html
<form class="contact-form" id="contactForm">
```

5. **Replace with:**
```html
<form class="contact-form" id="contactForm" 
      action="https://formspree.io/f/YOUR_FORM_ID" 
      method="POST">
```

6. **Open `script.js`** and COMMENT OUT lines 123-165:
```javascript
// contactForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     ... (comment out the entire function)
// });
```

**Done!** Now when someone submits:
- ✅ You get email notifications
- ✅ Can download submissions as CSV
- ✅ See all messages in Formspree dashboard

---

### Option 2: EmailJS (FREE - 10 minutes)

**Setup:**

1. Go to [emailjs.com](https://emailjs.com)
2. Sign up (free - 200 emails/month)
3. Create email service (connect Gmail)
4. Create email template
5. Get your Service ID, Template ID, Public Key

6. **Add to `index.html`** before `</head>` (line 11):
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init("YOUR_PUBLIC_KEY");
</script>
```

7. **Replace form handler in `script.js`** (lines 123-165):
```javascript
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(() => {
            showFormStatus('Message sent successfully!', 'success');
            contactForm.reset();
        })
        .catch((error) => {
            showFormStatus('Failed to send message. Try again.', 'error');
        });
});
```

**Done!** Messages go straight to your email.

---

### Option 3: Netlify Forms (FREE - if hosting on Netlify)

**Setup:**

1. Deploy to Netlify first (see deployment section below)

2. **Open `index.html`** and update form (line 529):
```html
<form class="contact-form" 
      name="contact" 
      method="POST" 
      data-netlify="true">
```

3. **Add hidden input** inside form:
```html
<input type="hidden" name="form-name" value="contact">
```

**Done!** Submissions appear in Netlify dashboard.

---

## 🌐 Deployment Guide (Host Your Portfolio)

### Option A: GitHub Pages (FREE) - 5 minutes

**In Terminal:**

```bash
cd /Users/utsavsingh/Desktop/Wrap

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio website"

# Create repo on GitHub.com first, then:
git branch -M main
git remote add origin https://github.com/UVII555/portfolio.git
git push -u origin main
```

**On GitHub:**
1. Go to Settings → Pages
2. Source: `main` branch
3. Save

**Live at:** `https://UVII555.github.io/portfolio/`

---

### Option B: Netlify (EASIEST) - 2 minutes

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Drag and drop the `Wrap` folder
4. Done!

**Live at:** `https://random-name-123.netlify.app`

You can change the name in settings.

---

## ✅ Complete Setup Checklist

```
[ ] Step 1: Update dsa-config.js with YOUR usernames
[ ] Step 2: Test DSA tracker locally (open index.html)
[ ] Step 3: Choose contact form solution (Formspree recommended)
[ ] Step 4: Update index.html with your info:
    [ ] Line 420: University name
    [ ] Line 421: Graduation year
    [ ] Line 503: Email address
    [ ] Line 510: GitHub username
    [ ] Line 517: LinkedIn username
[ ] Step 5: Add resume.pdf to folder
[ ] Step 6: Update script.js line 193 (uncomment resume link)
[ ] Step 7: Deploy to GitHub Pages or Netlify
[ ] Step 8: Test live site
[ ] Step 9: Share with recruiters!
```

---

## 🐛 Troubleshooting

### "Loading platform stats..." won't go away

**Causes:**
- Username is still `'UVII555'`
- Profile is private
- Wrong username (typo)

**Fix:**
1. Open browser console (F12)
2. Look for errors
3. Check red text - it will tell you exactly what's wrong

**Common errors:**
- `404 Not Found` = Wrong username
- `Network error` = Testing locally (need to deploy)

---

### Contact form not working

**Causes:**
- No backend configured
- Form just shows success message but doesn't send

**Fix:**
- Follow Option 1 (Formspree) above - easiest solution!

---

### Resume download doesn't work

**Cause:** No resume.pdf file in folder

**Fix:**
1. Add `resume.pdf` to `/Users/utsavsingh/Desktop/Wrap/`
2. Open `script.js` line 193
3. Change from:
   ```javascript
   // window.open('path/to/your/resume.pdf', '_blank');
   ```
   To:
   ```javascript
   window.open('resume.pdf', '_blank');
   ```

---

## 🎯 Test Your Setup

### Local Testing:
```bash
cd /Users/utsavsingh/Desktop/Wrap
open index.html
```

### Check these:
1. ✅ DSA stats show numbers (not "Loading...")
2. ✅ Theme toggle works (moon/sun icon)
3. ✅ All your info is correct
4. ✅ Contact form validates
5. ✅ Links work

### Console Check (F12):
- Should see: `✅ LeetCode stats fetched`
- Should see: `✅ DSA stats updated successfully`
- Should NOT see: `❌` or red errors

---

## 📞 Still Having Issues?

1. **Check browser console (F12)** - it will tell you exactly what's wrong
2. **Read the error message** - it's usually very specific
3. **Common fixes:**
   - Clear browser cache (Cmd+Shift+R)
   - Make sure all files are saved
   - Check for typos in usernames
   - Deploy to real hosting (not file://)

---

## 🎉 Success Looks Like:

```
DSA Progress Tracker                    ↻
Live tracking of coding problems

[💻] Total: 156    [✓] Easy: 72
[🔥] Medium: 65    [⭐] Hard: 19

Platform Breakdown
┌─────────────┬──────────────┐
│  LeetCode   │ Codeforces   │
│  156 solved │  45 solved   │
│  Rank: ...  │              │
└─────────────┴──────────────┘

Last updated: Feb 1, 2026, 4:30 PM
✅ Synced
```

**When you see this = Everything works! 🚀**

---

Need more help? Check:
- `DSA-TRACKING-GUIDE.md` - Full documentation
- `README.md` - Complete features list
- Browser console (F12) - Error messages
