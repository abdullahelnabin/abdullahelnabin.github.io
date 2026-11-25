# Munshi Md. Abdullahel Hossain Nabin — Portfolio

A fast, dark-themed, fully responsive developer portfolio built with plain **HTML, CSS and JavaScript** (no build step, no dependencies).

## Structure

```
portfolio-site/
├── index.html          # page markup
├── css/style.css       # all styles (dark theme, responsive layout)
├── js/main.js          # typing effect, live APIs, AI Job Match, AI assistant, lightbox
├── assets/
│   ├── photo.jpg                # profile picture
│   ├── uu-cafe-cover.jpg        # UU Cafe project screen
│   ├── cert-runnerup.jpg        # 2nd Runner-up certificate
│   ├── cert-codeforces.jpg      # Codeforces Specialist recognition
│   ├── card-specialist.jpg      # Codeforces Specialist card
│   └── resume.pdf               # <-- add your resume here (linked from the hero)
├── favicon.svg
└── worker/worker.js    # OPTIONAL Cloudflare Worker for a full Claude-powered assistant
```

## Deploy on GitHub Pages
1. Put all files in the root of the `abdullahelnabin.github.io` repository (replace the old ones).
2. **Add your `assets/resume.pdf`**; the Résumé button links to it.
3. Commit and push. The site updates in a minute.

## Features
- Responsive layout: phone view mirrors a compact profile card (round photo, name, role, link pills)
- Live **Codeforces** rating chart and **GitHub** repositories (public APIs; they fail silently if unreachable)
- **AI Job Match**: paste a job description, get a match score, matched/learning/missing skills and a pitch (runs in the browser)
- **AI Assistant** (bottom-right, `Ctrl/⌘ + K`): answers from the profile data in `js/main.js` (`KB` array), English and Banglish
- Certificates open in a lightbox; colored scrolling tech strip

## Customize
- Text and sections: `index.html`
- Colors: CSS variables at the top of `css/style.css` (`--a`, `--b`, `--c`)
- Skills: `skills` object in `js/main.js`; job-match skills: `HAVE`, `LEARN`, `MISS`
- Assistant answers: the `KB` array in `js/main.js`
- Tech strip colors: `tc` map in `js/main.js`

## Optional: Claude-powered assistant
By default the assistant is rule-based. For open-ended answers:
1. Create a Cloudflare Worker and paste `worker/worker.js`.
2. Add the secret `ANTHROPIC_API_KEY` (optional vars: `ALLOWED_ORIGIN`, `MODEL`) and a rate-limit rule.
3. Put the Worker URL into `const AI_ENDPOINT=''` at the top of the assistant section in `js/main.js`.
Never put an API key in front-end code.
