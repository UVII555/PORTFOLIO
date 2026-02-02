# Utsav Singh - Portfolio Website

A modern, responsive portfolio website designed for internship applications with light/dark mode toggle.

## 🚀 Features

- ✅ Fully responsive design (mobile-first approach)
- ✅ Light & Dark theme toggle with localStorage persistence
- ✅ Smooth scroll navigation
- ✅ Animated elements on scroll
- ✅ Contact form with validation
- ✅ Professional sections for recruiters
- ✅ Clean, modern UI with gradient accents
- ✅ SEO optimized with meta tags
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Zero dependencies - pure HTML, CSS, JavaScript

## 📁 Project Structure

```
Wrap/
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet with themes
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🛠️ Quick Setup

### 1. Customize Your Information

Open `index.html` and update:

- **Line 338**: Replace `[Your University Name]` with your actual university
- **Line 339**: Update graduation year `20XX`
- **Line 421**: Update email `utsav.singh@example.com`
- **Line 428**: Update GitHub URL `yourusername`
- **Line 435**: Update LinkedIn URL `yourusername`

### 2. Add Your Resume

1. Add your resume PDF to the project folder (e.g., `resume.pdf`)
2. Open `script.js` (line 193)
3. Uncomment and update: `window.open('resume.pdf', '_blank');`

### 3. Add GitHub Project Links

Open `index.html` and replace the `#` in project GitHub links with your actual repository URLs:

- Line 228: Product Bill Generator
- Line 258: Student Profile Management System
- Line 288: Portfolio Website
- Line 318: DSA Practice Tracker

### 4. Optional: Add Your Photo

Replace the profile placeholder:
1. Add your image (e.g., `profile.jpg`) to the folder
2. In `index.html` (lines 57-59), replace:
   ```html
   <div class="profile-placeholder">
       <i class="fas fa-user-graduate"></i>
   </div>
   ```
   with:
   ```html
   <img src="profile.jpg" alt="Utsav Singh" style="width: 300px; height: 300px; border-radius: 50%; box-shadow: var(--shadow-lg);">
   ```

## 🌐 Deployment Options

### GitHub Pages (Recommended)

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Set source to `main` branch
5. Your site will be live at: `https://yourusername.github.io/portfolio/`

### Netlify

1. Go to [netlify.com](https://www.netlify.com/)
2. Drag and drop your project folder
3. Site deploys instantly with a custom URL

### Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Import your GitHub repository
3. Deploy with one click

## 🎨 Customization Guide

### Changing Colors

Edit `styles.css` (lines 4-42) to customize the color scheme:

```css
:root {
    --accent-primary: #4f46e5;  /* Main accent color */
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New Sections

1. Add HTML in `index.html` following the existing pattern
2. Style it in `styles.css`
3. Add navigation link in the navbar (line 27-34)

### Modifying Projects

Update the projects section (lines 203-324) with your actual projects. Each project card includes:
- Icon
- Title & Description
- Tech stack badges
- Key learnings
- GitHub link

## ⚡ Performance

- No external dependencies (except Font Awesome CDN for icons)
- Lightweight: ~50KB total
- Fast loading: < 1 second
- Optimized animations with CSS transitions
- Efficient JavaScript with event delegation

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Testing

### Local Testing

Simply open `index.html` in your browser. No server required!

### Test Responsiveness

1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1200px+

## 🎯 Features Explained

### Theme Toggle
- Click the moon/sun icon in the navbar
- Theme preference saved in localStorage
- Press 'T' key to toggle (when not typing)

### Smooth Scrolling
- Click any navigation link for smooth scroll
- Automatic active section highlighting
- Offset for fixed navbar

### Form Validation
- Email format validation
- Required field checks
- Character length validation
- Success/error messages

### Scroll Animations
- Elements fade in on scroll
- Intersection Observer API
- Smooth transitions

## 📄 License

Free to use for personal portfolio purposes.

## 💡 Tips for Recruiters

- Update DSA stats regularly
- Add real project screenshots
- Keep achievement numbers current
- Update resume monthly
- Link actual GitHub repositories
- Add live project demos if available

## 🐛 Troubleshooting

**Theme not persisting?**
- Check browser localStorage permissions

**Icons not showing?**
- Check internet connection (Font Awesome loads from CDN)
- Alternative: Download Font Awesome locally

**Form not working?**
- Form is frontend-only (no backend)
- To enable actual submissions, integrate with:
  - Formspree
  - EmailJS
  - Netlify Forms
  - Backend API

**Mobile menu not working?**
- Clear browser cache
- Check JavaScript console for errors

## 📞 Support

For questions or issues:
1. Check browser console for errors
2. Validate HTML: [validator.w3.org](https://validator.w3.org/)
3. Test CSS: Use DevTools

## ✅ Pre-Deployment Checklist

- [ ] Update all personal information
- [ ] Add real email address
- [ ] Link GitHub and LinkedIn profiles
- [ ] Add resume PDF
- [ ] Update project GitHub links
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Verify form validation
- [ ] Test theme toggle
- [ ] Check console for errors
- [ ] Optimize images (if added)
- [ ] Update graduation year
- [ ] Review all text content

---

**Built with ❤️ for internship success!**

Good luck with your applications! 🚀
