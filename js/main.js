const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const live={cf:null,gh:null,repos:[]};

/* typing roles + marquee */
const roles=['Competitive Programmer','Full-Stack Developer','Problem Solver','Codeforces Specialist'];
let ri=0,ci=0,del=false;
(function tick(){const w=roles[ri];$('#type').textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(tick,1400)}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
  ci+=del?-1:1;setTimeout(tick,del?40:80)})();
const tech=['C++','C#','.NET Core','Java','Python','JavaScript','TypeScript','React','Next.js','MongoDB','Spring Boot','Django','Tailwind CSS','MySQL','Git','Data Structures','Algorithms','OOP','Node.js','System Design'];
const tc={'C++':'#5aa9e6','C#':'#b07cff','.NET Core':'#8b7bff','Java':'#f89820','Python':'#ffd43b','JavaScript':'#f7df1e','TypeScript':'#3b8eea','React':'#61dafb','Next.js':'#ffffff','MongoDB':'#4fd36b','Spring Boot':'#6db33f','Django':'#44b78b','Tailwind CSS':'#38bdf8','MySQL':'#5aa7d6','Git':'#f05032','Data Structures':'#22d3ee','Algorithms':'#f472b6','OOP':'#fbbf24','Node.js':'#7ed36b','System Design':'#a78bfa'};
$('#mq').innerHTML=[...tech,...tech].map(x=>`<span style="--c:${tc[x]||'#8b8cff'}"><i></i>${x}</span>`).join('');

/* skills */
const skills={'Frontend':[['HTML'],['CSS'],['JavaScript'],['TypeScript'],['React'],['Next.js'],['Tailwind CSS'],['Vite']],'Backend':[['C#'],['.NET Core'],['Java'],['Spring Boot'],['Python'],['Django'],['Node.js',1]],'Database':[['MySQL'],['SQL'],['MongoDB'],['Data Modeling'],['CRUD']],'Tools':[['Git'],['GitHub'],['VS Code'],['npm'],['ESLint']],'Languages & CS':[['C++'],['C#'],['Data Structures'],['Algorithms'],['OOP'],['System Design',1]]};
$('#skillGrid').innerHTML=Object.entries(skills).map(([k,v])=>`<div class="card rv"><h3>${k}</h3><div class="chips">${v.map(s=>`<span class="chip${s[1]?' l':''}">${s[0]}</span>`).join('')}</div></div>`).join('');

/* scroll: progress bar, reveal, counters, active nav, spotlight */
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
  const c=e.target.querySelector('[data-count]');if(c){const n=+c.dataset.count;let i=0;const s=setInterval(()=>{i+=Math.ceil(n/40);if(i>=n){i=n;clearInterval(s)}c.textContent=i+(c.dataset.suf||'')},30)}}),{threshold:.15});
const observe=()=>$$('.rv:not(.in)').forEach(e=>io.observe(e));observe();
document.addEventListener('mousemove',e=>{const c=e.target.closest&&e.target.closest('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}});

/* lightbox */
document.addEventListener('click',e=>{const c=e.target.closest('.cert');if(c){$('#lb img').src=c.querySelector('img').src;$('#lb').classList.add('o')}else if(e.target.closest('#lb'))$('#lb').classList.remove('o')});

/* live data */
fetch('https://codeforces.com/api/user.info?handles=nabin_cp').then(r=>r.json()).then(d=>{const u=d.result[0];live.cf=u;
  const rk=u.rank.replace(/^./,c=>c.toUpperCase());$('#cfr').textContent=u.rating+' · '+rk;$('#cfl').textContent='● live'}).catch(()=>{});
fetch('https://codeforces.com/api/user.rating?handle=nabin_cp').then(r=>r.json()).then(d=>{
  const h=d.result.slice(-15);if(h.length<2)throw 0;live.hist=h;
  const v=h.map(x=>x.newRating),mn=Math.min(...v)-40,mx=Math.max(...v)+40,W=400,H=110;
  const pts=v.map((y,i)=>[i/(v.length-1)*W,H-(y-mn)/(mx-mn)*H]);
  const line=pts.map(p=>p.join(',')).join(' ');
  $('#spark').innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8b8cff" stop-opacity=".45"/><stop offset="1" stop-color="#8b8cff" stop-opacity="0"/></linearGradient></defs><polygon points="0,${H} ${line} ${W},${H}" fill="url(#g)"/><polyline points="${line}" fill="none" stroke="#22d3ee" stroke-width="2.5" vector-effect="non-scaling-stroke"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff"/>`).join('')}</svg>`;
  const last=h[h.length-1],ch=last.newRating-last.oldRating;
  $('#spT').innerHTML=`Last ${h.length} rated contests · peak <b>${Math.max(...v)}</b> · latest ${ch>=0?'+':''}${ch} in <i>${last.contestName}</i>`;$('#spL').textContent='● live'}).catch(()=>{$('#spT').textContent='Peak rating 1426 · Codeforces Specialist. (Live chart loads when the API is reachable.)'});
fetch('https://api.github.com/users/abdullahelnabin').then(r=>r.json()).then(u=>{if(u.public_repos==null)return;live.gh=u;$('#ghr').textContent=u.public_repos;$('#ghl').textContent='● live'}).catch(()=>{});
fetch('https://api.github.com/users/abdullahelnabin/repos?sort=updated&per_page=6').then(r=>r.json()).then(rs=>{if(!Array.isArray(rs))return;live.repos=rs;$('#repoL').textContent='● live';
  $('#repos').innerHTML=rs.map(r=>`<a class="card rv" href="${r.html_url}" target="_blank" rel="noopener"><h3>${r.name}</h3><p>${(r.description||'Public repository').replace(/</g,'&lt;')}</p><div class="chips"><span class="chip">${r.language||'Code'}</span><span class="chip">★ ${r.stargazers_count}</span></div></a>`).join('');observe()})
 .catch(()=>{$('#repos').innerHTML='<p class="sub">See all repositories at <a class="grad" href="https://github.com/abdullahelnabin">github.com/abdullahelnabin</a>.</p>'});

/* AI Job Match (client-side analysis of a pasted job description) */
const HAVE=[['C++',['c++','cpp']],['Java',['java ','java,','java.','java\n']],['Python',['python']],['JavaScript',['javascript','ecmascript',' js ',' js,']],['React',[' react']],['HTML',['html']],['CSS',['css']],['Tailwind CSS',['tailwind']],['Spring Boot',['spring']],['Django',['django']],['SQL / MySQL',['sql','database']],['Git & GitHub',[' git','version control']],['REST APIs',['restful',' rest ',' api']],['Data Structures',['data structure','dsa']],['Algorithms',['algorithm','problem solving','problem-solving']],['OOP',[' oop','object-oriented','object oriented']],['C# / .NET Core',['c#','.net','dotnet','asp.net']],['TypeScript',['typescript']],['Next.js',['next.js','nextjs']],['MongoDB',['mongodb']]];
const LEARN=[['Node.js',['node']],['System Design',['system design','scalab','architecture']]];
const MISS=[['Docker',['docker']],['AWS',['aws','cloud']],['Kubernetes',['kubernetes']],['Angular',['angular']],['Vue',['vue']],['PostgreSQL',['postgres']],['Go',[' golang',' go ']],['PHP',['php','laravel']],['Redis',['redis']]];
const sample='Junior Backend Engineer. We need Java, Spring Boot, SQL, REST APIs, Git and strong problem solving. Nice to have: Docker, Node.js and system design basics.';
$('#demo').onclick=()=>{$('#jd').value=sample;$('#an').click()};
$('#an').onclick=()=>{const t=' '+$('#jd').value.toLowerCase()+' ';if(t.trim().length<8){$('#res').innerHTML='<p>Paste a job description first.</p>';return}
  const f=L=>L.filter(x=>x[1].some(k=>t.includes(k))).map(x=>x[0]);
  const h=f(HAVE),l=f(LEARN),m=f(MISS),tot=h.length+l.length+m.length;
  if(!tot){$('#res').innerHTML='<p>I couldn’t detect specific technologies. Try pasting the requirements section.</p>';return}
  const sc=Math.round(100*(h.length+.5*l.length)/tot),ch=a=>a.map(x=>`<span class="chip ${a===h?'ok':a===l?'l':'no'}">${x}</span>`).join('');
  const pitch=`Nabin covers ${h.length} of the ${tot} technologies in this role${h.length?' ('+h.slice(0,5).join(', ')+')':''}. ${l.length?'He is actively learning '+l.join(' and ')+'. ':''}${m.length?'Not yet in his toolkit: '+m.join(', ')+', but competitive programming has trained him to pick up new tools quickly. ':''}Backed by a Codeforces Specialist rank, 750+ solved problems and the full-stack UU Cafe project.`;
  $('#res').innerHTML=`<div class="score grad">${sc}%</div><div class="meter"><i></i></div>${h.length?'<small>Matched</small><div class="chips">'+ch(h)+'</div>':''}${l.length?'<small>Learning</small><div class="chips">'+ch(l)+'</div>':''}${m.length?'<small>Not listed</small><div class="chips">'+ch(m)+'</div>':''}<div class="pitch">🤖 ${pitch} <a class="grad" href="mailto:abdullahalnabin@gmail.com?subject=Opportunity">Email Nabin →</a></div>`;
  requestAnimationFrame(()=>$('.meter i').style.width=sc+'%')};

/* contact */
$('#cform').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);location.href='mailto:abdullahalnabin@gmail.com?subject='+encodeURIComponent('Portfolio message from '+f.get('n'))+'&body='+encodeURIComponent(f.get('m')+'\n\n— '+f.get('n')+' ('+f.get('e')+')')};

/* AI assistant: grounded in Nabin's real profile. Set AI_ENDPOINT to a Worker URL for full Claude-powered answers. */
const AI_ENDPOINT='';
const A=(h,t)=>`<a href="${h}"${/^https?:|\.pdf$/.test(h)?' target="_blank" rel="noopener"':''}>${t}</a>`;
const MAIL=A('mailto:abdullahalnabin@gmail.com','abdullahalnabin@gmail.com');
const KB=[
 {id:'hi',lbl:null,k:['hi','hello','hey','salam','assalam','kemon acho','help','start'],a:()=>'Hi! I’m Nabin’s AI assistant. Ask me anything about his skills, projects, contests, education, availability or contact details.'},
 {id:'thx',lbl:null,k:['thank','thanks','dhonnobad','awesome','great','nice','cool'],a:()=>'You’re welcome! Anything else you’d like to know about Nabin?'},
 {id:'bye',lbl:null,k:['bye','goodbye','see you'],a:()=>'Thanks for visiting! If you’d like to talk, email '+MAIL+'.'},
 {id:'bot',lbl:'Are you an AI?',k:['are you ai','are you a bot','who made you','who are you','tumi ki','real ai','how do you work','chatgpt','claude'],a:()=>AI_ENDPOINT?'I’m the assistant built into Nabin’s portfolio, powered by Claude and grounded in his real profile.':'I’m the assistant built into Nabin’s portfolio. I answer from his real profile data plus live Codeforces and GitHub stats, so what I say about him is factual.'},
 {id:'name',lbl:'Full name',k:['name','naam','nam ki'],a:()=>'His full name is <b>Munshi Md. Abdullahel Hossain Nabin</b>; online he goes by <b>Nabin</b>.'},
 {id:'about',lbl:'Who is Nabin?',k:['who is','introduce','yourself','porichoy','shomporke','tell me about nabin','about nabin','about him'],a:()=>'Nabin is a CSE student at Uttara University (Dhaka) and a competitive programmer who builds full-stack products with React, Next.js, C# / .NET Core, Java and Python. He’s looking for internship and junior software engineering roles.',m:'He blends contest-level problem solving (750+ problems, Codeforces Specialist) with real product work like UU Cafe, and is now going deeper into backend and system design.'},
 {id:'loc',lbl:'Where is he based?',k:['where','location','based','live','city','dhaka','timezone','kothay','address'],a:()=>'Based in <b>Dhaka, Bangladesh</b> (GMT+6), and open to remote or on-site internship and junior roles.'},
 {id:'edu',lbl:'Education',k:['education','university','study','graduat','student','cse','degree','porashona','uttara','semester','year'],a:()=>'B.Sc. in Computer Science & Engineering at <b>Uttara University</b>, Dhaka. He started in 2024, is in his 3rd year and expects to graduate in December 2027.',m:'Uttara University is in Dhaka. Alongside classes he trains daily on competitive programming and builds projects like UU Cafe.'},
 {id:'sem',lbl:'Seminars',k:['seminar','kaykobad','analytical','workshop'],a:()=>'In July 2025 he attended “Analytical Skill Development for CSE Students” at Uttara University, conducted by Dr. M. Kaykobad, which focused on analytical thinking, logic and problem solving.'},
 {id:'skills',lbl:'Skills',k:['skill','stack','tech','tools','language','what can','dokkho','capable'],a:()=>'<b>Frontend:</b> HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind. <b>Backend:</b> C#, .NET Core, Java, Spring Boot, Python, Django. <b>Database:</b> MySQL, SQL, MongoDB. <b>Core:</b> C++, C#, DSA, OOP. <b>Tools:</b> Git, GitHub, VS Code, npm, ESLint. Learning Node.js and System Design.',m:'His strongest base is C++ with data structures and algorithms; for products he pairs React/Next.js + Tailwind on the front end with C#/.NET Core, Java/Spring Boot, Python/Django or MongoDB-backed services.'},
 {id:'front',lbl:'Frontend skills',k:['frontend','front-end','react','next.js','nextjs','tailwind','ui','html','css','javascript','typescript','vite'],a:()=>'On the front end he works with HTML, CSS, JavaScript, TypeScript, React, Next.js, Vite and Tailwind CSS, building responsive, component-driven interfaces like the UU Cafe student portal.'},
 {id:'back',lbl:'Backend skills',k:['backend','back-end','java','spring','django','python','server','node','express','c#','.net','dotnet','asp.net','csharp'],a:()=>'Backend: C# with .NET Core, Java with Spring Boot, Python with Django, and he’s currently learning Node.js. He cares about authentication, role-based access and clean application structure.'},
 {id:'db',lbl:'Databases',k:['database','sql','mysql','mongodb','data model','crud'],a:()=>'He works with MySQL/SQL and MongoDB, including data modeling and CRUD operations; UU Cafe stores its menu and orders in MongoDB.'},
 {id:'dsa',lbl:'C++ & DSA',k:['c++','cpp','dsa','data structure','algorithm','dp','graph'],a:()=>'C++ is his main language. He practises data structures and algorithms daily on Codeforces, CodeChef and LeetCode, and publishes his contest solutions on '+A('https://github.com/abdullahelnabin/Competitive-Programming','GitHub')+'.'},
 {id:'projects',lbl:'Projects',k:['project','built','work','projekt','banaise','portfolio','made'],a:()=>'Featured: '+A('https://uucafe.base44.app','UU Cafe')+' (campus ordering platform), his C++ '+A('https://github.com/abdullahelnabin/Competitive-Programming','competitive programming solutions')+', and this AI-powered portfolio. Ask me about any of them.',m:'UU Cafe is the full-stack showcase, the Competitive-Programming repo shows his algorithmic work (13 CodeChef contests Feb–Jun 2026), and this portfolio shows front-end polish plus live API integration.'},
 {id:'cafe',lbl:'UU Cafe',k:['uu cafe','uucafe','cafe','ordering','food','admin dashboard','otp','cart','order tracking','canteen'],a:()=>'<b>UU Cafe</b> is a campus café management system for Uttara University: a student portal for menu ordering, cart & checkout (with table selection) and live order tracking, plus an admin dashboard for menu and order management. Built with Next.js, TypeScript, Tailwind CSS and MongoDB, with email OTP login and role-based access. '+A('https://uucafe.base44.app','Live demo')+' · '+A('https://github.com/abdullahelnabin/uu-cafe','GitHub')+'.',m:'Orders move from Pending to Ready to Completed, admins see total food items, today’s orders and revenue, and the UI is fully responsive.'},
 {id:'cpsol',lbl:'Contest solutions',k:['solutions','codechef contests','competitive-programming','repo of solutions'],a:()=>'His '+A('https://github.com/abdullahelnabin/Competitive-Programming','Competitive-Programming repo')+' holds C++ solutions to CodeChef rated contests, organized by date: 13 contests from February to June 2026 and growing.'},
 {id:'site',lbl:'How is this site built?',k:['this website','this site','this portfolio','how built','who built','source code of this'],a:()=>'This site is plain HTML, CSS and vanilla JavaScript. It pulls live data from the Codeforces and GitHub APIs, and includes this assistant and the AI Job Match tool. Source: '+A('https://github.com/abdullahelnabin/abdullahelnabin.github.io','GitHub')+'.'},
 {id:'cf',lbl:'Codeforces rating',k:['codeforces','rating','specialist','cf','rank','nabin_cp'],a:()=>live.cf?`On Codeforces (${A('https://codeforces.com/profile/nabin_cp','nabin_cp')}) he is rated <b>${live.cf.rating}</b> (${live.cf.rank}), peak <b>${live.cf.maxRating}</b>, with 230+ problems solved. <i>Live data.</i>`:'He is a Codeforces Specialist ('+A('https://codeforces.com/profile/nabin_cp','nabin_cp')+'), peak rating 1426, with 230+ problems solved.',m:'Phitron (Batch 8) gave him a Certificate of Recognition for reaching Specialist. The rating chart is in the AI Lab section.'},
 {id:'cc',lbl:'CodeChef',k:['codechef','debug_nabin','3 star','3★','stars'],a:()=>'On CodeChef ('+A('https://www.codechef.com/users/debug_nabin','debug_nabin')+') he is a <b>3★</b> coder with 100+ problems solved, and he competes in rated contests.'},
 {id:'lc',lbl:'LeetCode',k:['leetcode'],a:()=>'On LeetCode ('+A('https://leetcode.com/u/debug_nabin/','debug_nabin')+') he has solved 100+ problems and follows the daily challenge.'},
 {id:'vj',lbl:'VJudge & HackerRank',k:['vjudge','hackerrank','virtual contest'],a:()=>'He also practises on '+A('https://vjudge.net/user/nabin_cp','VJudge')+' (virtual contests) and '+A('https://www.hackerrank.com/profile/abdullahal_nabin','HackerRank')+'.'},
 {id:'cp',lbl:'Problems solved',k:['solved','problems','competitive','cp','contest','practice','programmer'],a:()=>'He has solved <b>750+ problems</b> across Codeforces (230+), CodeChef (100+), LeetCode (100+), VJudge and HackerRank, mainly in C++.',m:'Breakdown: Codeforces 230+ (Specialist), CodeChef 100+ (3★), LeetCode 100+, plus VJudge and HackerRank. His contest solutions are on GitHub.'},
 {id:'awards',lbl:'Achievements',k:['achievement','award','certificate','won','prize','sofol','honor','recognition'],a:()=>'🥉 2nd Runner-up, Intra University Programming Contest 2026 (UUCPC) · 🔵 Certificate of Recognition for Codeforces Specialist (Phitron Batch 8) · 📘 Seminar certificate on analytical skill development. '+A('#awards','See the certificates')+'.',m:'The runner-up certificate comes from the Uttara University Computer Programming Club (UUCPC); the Codeforces recognition is from Phitron Batch 8 with a highest rating of 1426; the seminar was led by Dr. M. Kaykobad in July 2025.'},
 {id:'ru',lbl:'2nd Runner-up',k:['runner','intra','uucpc','programming club','battle of logic'],a:()=>'He placed 2nd Runner-up at the <b>Intra University Programming Contest 2026</b> organized by the Uttara University Computer Programming Club (UUCPC), themed “Battle of Logic and Innovation”.'},
 {id:'ph',lbl:'Phitron certificate',k:['phitron','batch 8','batch-08','batch 08'],a:()=>'Phitron (Batch 8) awarded him a Certificate of Recognition for an outstanding Codeforces result and the Specialist coder rank, with a highest rating of 1426.'},
 {id:'str',lbl:'His strengths',k:['strength','strong','best at','work style','how does he work','good at','qualities','approach'],a:()=>'<b>Correctness first</b> (edge cases and complexity up front), <b>clean maintainable code</b>, and <b>building for real users</b>, starting from the actual requirement and designing the simplest flow.'},
 {id:'why',lbl:'Why hire him?',k:['why hire','why should','should we hire','fit','recommend','worth'],a:()=>'He pairs algorithmic rigor (Codeforces Specialist, 750+ problems, contest podium) with shipped product work (UU Cafe) and learns fast. Paste a job description into the '+A('#ailab','AI Job Match')+' tool to see how he fits your role.'},
 {id:'hire',lbl:'Open to work?',k:['hire','job','jobs','intern','open','available','availability','opportunity','chakri','recruit','vacancy','freelance'],a:()=>'Yes, he’s open to internships and junior software engineering roles, especially backend and full-stack. Email '+MAIL+' or grab the '+A('assets/resume.pdf','resume')+'.',m:'He is strongest for backend or full-stack internship and junior roles (React/Next.js, Java/Spring Boot, Python/Django, MongoDB/MySQL) and can start with a short notice. Use the AI Job Match tool for a quick fit check.'},
 {id:'cv',lbl:'Resume',k:['resume','cv','curriculum'],a:()=>'You can download his '+A('assets/resume.pdf','resume (PDF)')+' from the top of this page.'},
 {id:'contact',lbl:'Contact',k:['contact','email','mail','reach','whatsapp','linkedin','phone','jogajog','call','discord','number'],a:()=>'Email: '+MAIL+' · '+A('https://www.linkedin.com/in/abdullahel-nabin/','LinkedIn')+' · '+A('https://wa.me/8801760090808','WhatsApp')+' · Discord: abdullahelnabin. Based in Dhaka (GMT+6).'},
 {id:'gh',lbl:'GitHub',k:['github','repo','repos','repository'],a:()=>live.gh?`His GitHub (${A('https://github.com/abdullahelnabin','abdullahelnabin')}) has <b>${live.gh.public_repos}</b> public repositories${live.repos[0]?`; most recently updated: <b>${live.repos[0].name}</b>`:''}. <i>Live data.</i>`:'See '+A('https://github.com/abdullahelnabin','github.com/abdullahelnabin')+' for all repositories.'},
 {id:'yt',lbl:'YouTube',k:['youtube','channel','video','learn with nabin'],a:()=>'He shares what he learns on YouTube: '+A('https://www.youtube.com/@Learnwithnabin2.0','Learn with Nabin')+'.'},
 {id:'learn',lbl:'What is he learning?',k:['learn','learning','next','shikhche','studying'],a:()=>'He’s going deeper into Node.js, backend development and system design.'},
 {id:'goal',lbl:'Career goal',k:['goal','future','dream','plan','aim','ambition'],a:()=>'His goal is to become a strong software engineer: ship meaningful work, learn from experienced engineers, and grow into someone a team can rely on.'}];
let last=null;const hist=[];
const hit=(w,q)=>(w.length<=3?new RegExp('(^|[^a-z0-9])'+w.replace(/[+.]/g,'\\$&')+'([^a-z0-9]|$)').test(q):q.includes(w))?(w.length>3?2:1):0;
const norm=s=>' '+s.toLowerCase().replace(/[?!,;:()]/g,' ')+' ';
function local(q){q=norm(q);
  if(last&&/\b(more|details?|explain|elaborate|aro|arekto)\b/.test(q)){if(last.m){const m=last.m;last=Object.assign({},last,{m:null});return m}const o=KB.filter(e=>e.lbl&&e!==last).sort(()=>Math.random()-.5).slice(0,3).map(e=>'<b>'+e.lbl+'</b>').join(', ');return 'That’s everything I have on this topic. You could also ask about '+o+'.'}
  const r=KB.map(e=>({e,s:e.k.reduce((n,w)=>n+hit(w,q),0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  if(!r.length)return 'I don’t have that exact detail yet. I can tell you about Nabin’s <b>skills</b>, <b>projects</b>, <b>UU Cafe</b>, <b>Codeforces</b>, <b>achievements</b>, <b>education</b> or <b>contact</b> details, or you can email '+MAIL+'.';
  last=r[0].e;let out=r[0].e.a();
  if(r[1]&&r[1].e.lbl&&r[1].s>=2&&r[1].s>=r[0].s-1)out+='<br><br>'+r[1].e.a();
  return out}
const fmt=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(https?:\/\/[^\s<)]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>');
async function reply(q){
  if(AI_ENDPOINT){try{const r=await fetch(AI_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:hist.slice(-8)})});const d=await r.json();if(d.answer)return fmt(d.answer)}catch(e){}}
  return local(q)}
function add(t,c,html){const d=document.createElement('div');d.className='m '+c;html?d.innerHTML=t:d.textContent=t;$('#msgs').appendChild(d);$('#msgs').scrollTop=1e9;return d}
function sug(){const p=KB.filter(e=>e.lbl&&e!==last).sort(()=>Math.random()-.5).slice(0,4).map(e=>e.lbl);if(last&&last.m)p.unshift('Tell me more');
  $('#sug').innerHTML=p.map(c=>`<button type="button">${c}</button>`).join('')}
function ask(q){if(!q.trim())return;add(q,'u');hist.push({role:'user',content:q});const d=add('<span class="dots"><i></i><i></i><i></i></span>','b',1);
  Promise.all([reply(q),new Promise(r=>setTimeout(r,550))]).then(([h])=>{d.innerHTML=h;hist.push({role:'assistant',content:d.textContent});sug();$('#msgs').scrollTop=1e9}).catch(()=>{d.innerHTML='Sorry, something went wrong. Please try again or email '+MAIL+'.'})}
$('#msgs').onclick=e=>{const a=e.target.closest('a');if(a&&a.getAttribute('href').startsWith('#'))$('#chat').classList.remove('open')};
$('#sug').onclick=e=>{if(e.target.tagName==='BUTTON')ask(e.target.textContent)};
$('#cf').onsubmit=e=>{e.preventDefault();ask($('#q').value);$('#q').value=''};
let greeted=false;
function openChat(){const c=$('#chat');c.classList.toggle('open');
  if(c.classList.contains('open')){if(!matchMedia('(pointer:coarse)').matches)$('#q').focus();if(!greeted){greeted=true;add(local('hello'),'b',1);last=null;sug()}}}

addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openChat()}if(e.key==='Escape'){$('#lb').classList.remove('o');$('#chat').classList.remove('open')}});
