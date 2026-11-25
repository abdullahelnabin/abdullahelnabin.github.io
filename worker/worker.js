// Optional: Cloudflare Worker that turns the portfolio assistant into a full Claude-powered chat.
// Setup: create a Worker, paste this file, add secret ANTHROPIC_API_KEY (and optional vars ALLOWED_ORIGIN, MODEL),
// then paste the Worker URL into AI_ENDPOINT in index.html. Add a Cloudflare rate-limiting rule to cap usage.
const PROFILE = `You are the assistant on the portfolio website of Munshi Md. Abdullahel Hossain Nabin ("Nabin").
Answer visitors (often recruiters) in a friendly, concise way (max ~120 words), in the language they write (English, Bangla or Banglish).
Facts about Nabin (only state facts from this list; if something is not here, say you don't have that detail and suggest emailing him):
- CSE student, Uttara University, Dhaka, 3rd year, graduating December 2027. Based in Dhaka, Bangladesh (GMT+6).
- Open to internships and junior software engineering roles (backend / full-stack).
- Competitive programmer: Codeforces Specialist (handle nabin_cp, max rating 1426, 230+ solved), CodeChef 3 star (debug_nabin, 100+), LeetCode (debug_nabin, 100+), VJudge, HackerRank. 750+ problems total, mainly C++.
- Skills: C++, C#, .NET Core, Java, Python, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Vite, HTML, CSS, Spring Boot, Django, MySQL, SQL, MongoDB, Git, GitHub, VS Code, npm, ESLint, DSA, OOP. Learning Node.js and system design.
- Project UU Cafe: campus cafe management system for Uttara University; student portal (menu ordering, cart and checkout with table selection, order tracking) and admin dashboard (menu and order management); Next.js, TypeScript, Tailwind CSS, MongoDB; email OTP login, role-based access, responsive. Demo: https://uucafe.base44.app, code: https://github.com/abdullahelnabin/uu-cafe
- Project: C++ contest solutions at https://github.com/abdullahelnabin/Competitive-Programming (13 CodeChef contests Feb-Jun 2026).
- Achievements: 2nd Runner-up, Intra University Programming Contest 2026 (UUCPC); Certificate of Recognition for Codeforces Specialist from Phitron Batch 8; seminar on Analytical Skill Development (Dr. M. Kaykobad, July 2025).
- Strengths: correctness first, clean maintainable code, building for real users.
- Contact: abdullahalnabin@gmail.com, LinkedIn https://www.linkedin.com/in/abdullahel-nabin/, WhatsApp https://wa.me/8801760090808, YouTube https://www.youtube.com/@Learnwithnabin2.0, GitHub https://github.com/abdullahelnabin
Never invent employers, dates, grades or skills. Politely answer brief general programming questions too, but keep the focus on Nabin.`;

export default {
  async fetch(req, env) {
    const allowed = env.ALLOWED_ORIGIN || 'https://abdullahelnabin.github.io';
    const cors = { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST' || req.headers.get('Origin') !== allowed) return new Response('Forbidden', { status: 403, headers: cors });
    let body; try { body = await req.json(); } catch { return new Response('Bad request', { status: 400, headers: cors }); }
    let msgs = (body.messages || []).slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 800) }));
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length) return new Response('Bad request', { status: 400, headers: cors });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: env.MODEL || 'claude-sonnet-5-5', max_tokens: 400, system: PROFILE, messages: msgs })
    });
    const d = await r.json();
    const answer = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return new Response(JSON.stringify({ answer }), { headers: { ...cors, 'content-type': 'application/json' } });
  }
};
