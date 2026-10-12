/* Prezent Vivo Admin Best Practices Guide.
   Host page needs: <div id="admin-guide-root"></div>, guide.css and this script. */
(function () {
const BASE = new URL(".", document.currentScript.src).href;
document.getElementById("admin-guide-root").innerHTML = `
<aside class="side" id="side" aria-label="Guide navigation">
  <a class="brand" href="#/" aria-label="Guide home"><b>prezent</b><span>VIVO</span></a>
  <nav class="nav" id="nav"></nav>
  <div class="side-foot">Admin Best Practices Guide</div>
</aside>
<div class="scrim" id="scrim"></div>

<div class="main">
  <header class="top">
    <button class="menu" id="menu" aria-label="Open navigation">Menu</button>
    <div class="search" id="topsearch"></div>
    <div class="spacer"></div>
    <a class="btn line sm" id="fullGuide" href="https://docs.google.com/presentation/d/1jHRwnUjXMev-SStRs8MMCpxLjZftvUHdYvNlbPzXPdE/edit" target="_blank" rel="noopener">Open the full guide</a>
  </header>
  <div id="view" tabindex="-1"></div>
  <footer class="foot">
    <span>Prezent Vivo Admin Best Practices Guide</span>
    <span>Questions? <a href="#/help">Get help</a></span>
  </footer>
</div>

<div class="lb" id="lb" hidden><img alt=""></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const IMG = {
  "users": BASE + "img/users.webp",
  "licenses": BASE + "img/licenses.webp",
  "templates": BASE + "img/templates.webp",
  "metrics": BASE + "img/metrics.webp",
  "int-enable": BASE + "img/int-enable.webp",
  "int-connect": BASE + "img/int-connect.webp",
  "int-custom": BASE + "img/int-custom.webp",
  "api-overview": BASE + "img/api-overview.webp",
  "api-keys": BASE + "img/api-keys.webp",
  "cred-view": BASE + "img/cred-view.webp",
  "cred-usage": BASE + "img/cred-usage.webp"
};

/* =====================================================================
   CONTENT  (edit here; the page template renders from this data)
   - tip.draft = true shows a "Draft" pill until confirmed with the CSM team
   - platform = placeholder for the deep link TM will wire up
   - guide    = page numbers in the full guide
   ===================================================================== */
const PARTS = [
  {n:1, title:"Know your plan", blurb:"What's included, and what your first 90 days look like.", pages:["plan","launchpad"]},
  {n:2, title:"Set up your workspace", blurb:"Add people, licenses and brand templates, then track adoption.", pages:["users","licenses","templates","metrics"]},
  {n:3, title:"Run it day to day", blurb:"Integrations, APIs and credits, each on one page.", pages:["integrations","apis","credits"]},
  {n:4, title:"Get support", blurb:"People and resources when you need them.", pages:["help"]}
];

const PAGES = {
  "plan":{
    nav:"Your plan", title:"Your plan, fully powered", type:"plan",
    summary:"The four ways your teams can create with Prezent Vivo.",
    purpose:"One platform, three levels of support. Pick the right one for each deliverable.",
    keywords:"capabilities overnight presentations projects self-serve api agents plan included",
    guide:"pages 3 to 7"
  },
  "launchpad":{
    nav:"Your 90-day launchpad", title:"Your 90-day launchpad", type:"launchpad",
    summary:"Go-live checklist, who to involve, and the first 90 days.",
    purpose:"Everything to line up before go-live, and what happens after.",
    keywords:"checklist go-live paperwork msa sow nda po security sso it stakeholders roadmap 30 60 90 onboarding",
    guide:"pages 8 to 11"
  },
  "users":{
    nav:"Add users", title:"Add users and set permissions",
    summary:"Invite people and choose what they can access.",
    purpose:"Invite people to your workspace and choose what each person can access.",
    find:"Profile (your initials, top right) → Admin Settings → User Access",
    keywords:"add users invite permissions access roles people admin settings expert services",
    steps:[
      {t:"Open User Access", d:"Select your initials, then Admin Settings, then the User Access tab.", s:"Admin Settings, User Access tab"},
      {t:"Add new users", d:"Click Add new users to open the invitation window.", s:"Invitation window"},
      {t:"Set permissions", d:"Enter their details and choose the right access role, including expert services access.", s:"Access roles"}
    ],
    tip:"Decide who needs expert services access before you invite, since it is set with permissions.",
    platform:"Admin Settings, User Access", guide:"page 14"
  },
  "licenses":{
    nav:"Activate licenses", title:"Activate and manage licenses",
    summary:"Track assigned licenses and add more as your team grows.",
    purpose:"See what is available, what is assigned, and add more when you need them.",
    find:"Profile → Admin Settings → Licenses",
    keywords:"license licence seats buy purchase assign reallocate enable disable utilization",
    steps:[
      {t:"Open the Licenses tab", d:"Find it in Admin Settings.", s:"Licenses tab"},
      {t:"Check utilization", d:"See assigned and available licenses at a glance.", s:"Assigned and available"},
      {t:"Add licenses", d:"Click Buy, or get in touch, when your team grows.", s:"Buy and Get in touch"}
    ],
    tip:"Reallocate unused licenses before buying more.",
    platform:"Admin Settings, Licenses", guide:"page 15"
  },
  "templates":{
    nav:"Brand templates", title:"Brand templates",
    summary:"Browse your organization's templates or request a custom one.",
    purpose:"Find every template available to your organization, and ask for more.",
    find:"Profile → Templates",
    keywords:"brand templates custom style guide request organization",
    steps:[
      {t:"Open Templates", d:"Go to your Profile and select the Templates tab.", s:"Profile, Templates tab"},
      {t:"Choose a template", d:"Browse and select from all templates available to your organization.", s:"Template gallery"},
      {t:"Request a custom template", d:"Contact your Customer Success Manager to add more to your workspace.", s:"Contact option"}
    ],
    tip:"Request custom templates early so they are ready for your first onboarding sessions.",
    platform:"Profile, Templates", guide:"page 16"
  },
  "metrics":{
    nav:"Usage and metrics", title:"Usage and metrics",
    summary:"See adoption and impact across your organization.",
    purpose:"See how your teams use Prezent Vivo, from time and cost saved to usage by person.",
    find:"Profile → Metrics",
    keywords:"usage metrics reports download adoption analytics team user slide library ai builder",
    steps:[
      {t:"Open the Metrics tab", d:"Go to your Profile and select Metrics.", s:"Metrics tab"},
      {t:"View usage", d:"See usage across AI Builder, Slide Library and Expert Services, by team and by user.", s:"Usage by team and user"},
      {t:"Download reports", d:"Export detailed usage reports at team or user level.", s:"Download reports"}
    ],
    tip:"Download a team-level report before each check-in so you can talk through adoption.",
    platform:"Profile, Metrics", guide:"page 28"
  },
  "integrations":{
    nav:"Third-party integrations", title:"Manage third-party integrations",
    summary:"Enable apps, connect them, and add your own.",
    purpose:"Integrations let people pull files and data from apps like SharePoint, CoPilot, PubMed and Veeva straight into their prompts. Users can only connect an app after you enable it.",
    find:"Profile → Admin Settings → Manage Integrations",
    keywords:"integrations enable apps approve connect my apps status green grayed sharepoint copilot pubmed veeva biorender custom app mcp endpoint authentication it policy",
    steps:[
      {t:"Enable the app", d:"Open Manage Integrations, search for the app, then use the More options menu to switch access on.", s:"Manage Integrations"},
      {t:"Users connect it", d:"In AI Builder, users select My Apps on the prompt bar. Public apps like PubMed connect in one click. Others, like SharePoint, need Connect, then credentials, then Accept.", s:"My Apps panel"},
      {t:"Check the status", d:"A green dot means connected and ready. Grayed out means IT admin approval is needed first.", s:"Status indicators"},
      {t:"Add your own app", d:"Go to Custom Integrations, select Set Up Custom Integration, add the MCP endpoint URL and choose an authentication method. The app then appears under Others in My Apps.", s:"Custom Integrations"}
    ],
    tip:"Enable only the apps your IT team has approved. If an app is grayed out for your users, enable it here first.",
    platform:"Admin Settings, Manage Integrations", guide:"pages 17 to 21"
  },
  "apis":{
    nav:"APIs and Agents", title:"Manage APIs and Agents", badge:"If included in your plan",
    summary:"Documentation, API keys and usage for your developers.",
    purpose:"Everything your developers need to integrate Prezent Vivo into your own applications and agents.",
    find:"</> API tab in the left navigation bar",
    keywords:"api apis agents documentation developer presentations posters template converter scim change log guide keys key generate expired copy download remove csm",
    steps:[
      {t:"Open Developer APIs", d:"Select the API tab (</>) in the left navigation bar. The Overview tab has quick actions for keys, documentation and usage.", s:"Developer APIs overview"},
      {t:"Explore the documentation", d:"Choose Presentations, Posters, Template Converter or SCIM User Management. The Change Log covers new releases, and the Developer Guide covers rate limits and errors.", s:"API reference links"},
      {t:"Manage API keys", d:"Open the Manage API Keys tab to view, copy, download or remove keys. If a key has expired, ask your Customer Success Manager for a new one.", s:"Manage API Keys tab"}
    ],
    tip:"Share the Developer Guide with your developers first. It covers rate limits, errors and async operations for every endpoint.",
    platform:"Developer APIs, Overview", guide:"pages 25 to 27"
  },
  "credits":{
    nav:"Credits", title:"Manage credits", badge:"If included in your plan",
    summary:"Check your balance, set usage limits and add credits.",
    purpose:"One credit pool for Overnight Presentations and Fixed-Price Projects, with no separate budgets or approvals.",
    find:"Gold credit icon in the top navigation bar",
    keywords:"credits balance limits refill usage buy export statement overnight projects spend",
    steps:[
      {t:"Check your balance", d:"Select the gold credit icon in the top bar, from any page.", s:"Gold credit icon"},
      {t:"Track usage and set limits", d:"Use the Usage tab to see credits used by team and person, and to set default or custom limits.", s:"Usage tab and limits"},
      {t:"Refill or export", d:"Buy more credits, or use Get in touch. Export CSV or PDF reports for auditing.", s:"Buy and export"}
    ],
    tip:"Set a default limit for each group first, then give exceptions to individuals.",
    platform:"Credits dashboard", guide:"pages 22 to 24"
  },
  "help":{
    nav:"Get help", title:"Get help", type:"help",
    summary:"Help articles, support requests and your Customer Success Manager.",
    purpose:"Answers, how-to guides and a direct line to the Prezent team.",
    keywords:"help support contact csm customer success request faq articles",
    guide:"page 29"
  }
};

const ORDER = PARTS.flatMap(p => p.pages);
const FIGS = {
  "users":[{k:"users",c:"Add users to your team"}],
  "licenses":[{k:"licenses",c:"Licenses tab in Admin Settings"}],
  "templates":[{k:"templates",c:"Templates tab on your Profile"}],
  "metrics":[{k:"metrics",c:"Metrics tab on your Profile"}],
  "integrations":[{k:"int-enable",c:"Enable apps in Manage Integrations"},{k:"int-connect",c:"My Apps in AI Builder"},{k:"int-custom",c:"Set up a custom integration"}],
  "apis":[{k:"api-overview",c:"Developer APIs overview"},{k:"api-keys",c:"Manage API Keys tab"}],
  "credits":[{k:"cred-view",c:"Credits overview"},{k:"cred-usage",c:"Usage tab with limits"}]
};
const GROUPS = {
  "integrations":[
    {title:"Enable an app", fig:"int-enable", alt:"Enable apps in Manage Integrations", steps:[
      {t:"Open Manage Integrations", d:"Select it on the Admin Settings page."},
      {t:"Search for the app", d:"Use the search bar to find the app you want."},
      {t:"Enable or disable", d:"Open the More options menu next to the app and switch access on or off."}]},
    {title:"Connect it in AI Builder", fig:"int-connect", alt:"My Apps in AI Builder", steps:[
      {t:"Open My Apps", d:"Select the My Apps icon on the prompt bar."},
      {t:"Browse by category", d:"Apps are grouped as Life Sciences, Productivity and Others."},
      {t:"Check the status", d:"A green dot means connected and ready. Grayed out means IT admin approval is needed first."},
      {t:"Request more apps", d:"Use Request App if the one you need is not listed."}],
     note:"Public apps like PubMed connect in one click. Others, like SharePoint or BioRender, need Connect, then your credentials, then Accept."},
    {title:"Add your own app", fig:"int-custom", alt:"Set up a custom integration", steps:[
      {t:"Start setup", d:"On Manage Integrations, select Set Up Custom Integration."},
      {t:"Add the endpoint URL", d:"Enter the endpoint URL of your custom MCP."},
      {t:"Choose authentication", d:"Pick the authentication method. Several are supported."}],
     note:"Once set up, the app appears under Others in My Apps, and users can reference it in prompts like any other app."}
  ],
  "apis":[
    {title:"Find the developer tools", fig:"api-overview", alt:"Developer APIs overview", steps:[
      {t:"Open Developer APIs", d:"Select the API tab (</>) in the left navigation bar."},
      {t:"Use the quick-action toolbar", d:"On the Overview tab, generate API keys, explore the documentation and track API usage."}],
     note:"The documentation covers the Presentations, Posters, Template Converter and SCIM User Management APIs, plus a Change Log and a Developer Guide for rate limits and errors."},
    {title:"Manage API keys", fig:"api-keys", alt:"Manage API Keys tab", steps:[
      {t:"Open Manage API Keys", d:"Select the tab on the Developer APIs page."},
      {t:"View and manage keys", d:"View, copy or download a key, or remove keys you no longer need."},
      {t:"Replace an expired key", d:"Ask your Customer Success Manager for a new one, so integrations keep working."}]}
  ],
  "credits":[
    {title:"Check and add credits", fig:"cred-view", alt:"Credits overview", steps:[
      {t:"Open your balance", d:"Select the gold credit icon in the top bar, from any page."},
      {t:"Track credits", d:"See Credits Remaining, Credits Added and Credits Used."},
      {t:"Refill", d:"Buy more credits instantly, or use Get in touch."}]},
    {title:"Track usage and set limits", fig:"cred-usage", alt:"Usage tab with limits", steps:[
      {t:"Track usage", d:"See credit use by team, subgroup and individual."},
      {t:"Export reports", d:"Download CSV or PDF reports and credit statements for auditing."},
      {t:"Set limits", d:"Set default limits for groups, or custom limits for individuals."}]}
  ]
};
const CTA = {plan:"View your plan", launchpad:"Plan your 90 days", users:"Add users", licenses:"Manage licenses", templates:"Browse templates", metrics:"View usage", integrations:"Set up integrations", apis:"Manage APIs", credits:"Manage credits", help:"Get help"};
const partOf = id => PARTS.find(p => p.pages.includes(id));

/* ---------- Launchpad content ---------- */
const CHECKLIST = [
  {g:"Brand assets", next:"Connect us with your brand lead and share portal access.", items:["Brand templates (PPT)","Style guides","Images","Icons","Custom fonts"]},
  {g:"Paperwork", next:"Connect us with the right people to complete it.", items:["MSA","SOW","CDA or NDA","PO"]},
  {g:"IT and security", next:"Connect us with your IT and security lead.", items:["Vendor onboarding and procurement","IT review","Security questionnaire","SSO"]}
];
const ROLES = [
  ["Executive sponsor","VP or higher","C-level, GM or VP (one person)","Executive Business Reviews, Customer Advisory Board, signatory"],
  ["Main business owner","Director level","GM and Customer Success leader","Onboarding, refresher training, EBRs and QBRs, masterclass, Customer Advisory Board"],
  ["Day-to-day contact","COS, EA or other","Customer Success Manager","Every step of the relationship"],
  ["Champions","Three members","Not applicable","Use cases, feedback, wishlist items, quarterly refresh sessions"]
];
const MONTHS = [
  {m:"Month 1", w:"Weeks 1 to 4", i:["Share brand templates and brand portal access","Complete SOW, PO and IT and security reviews","Identify license holders and confirm day-to-day use cases","Set onboarding dates and run onboarding sessions","30-day check-in and utilization review"]},
  {m:"Month 2", w:"Weeks 5 to 8", i:["Optional monthly office hours (30 minutes) for enablement and Q&A","60-day check-in"]},
  {m:"Month 3", w:"Weeks 9 to 13", i:["Survey license holders for first feedback","Quarterly business review","Use-case specific trainings","Quarterly release demo of enhancements"]}
];
const PLAN = [
  {tag:"Self-serve", h:"AI Platform", p:"Life sciences presentations, posters and documents in minutes, always on brand.",
   li:["Builds from text, PDFs, Excel, PPTX, Docs and web links","Connects to SharePoint, CoPilot, Veeva, PubMed and more","Exports to PPTX, Google Slides, PDF, JPEG and PNG"]},
  {tag:"Expert-led", h:"Overnight Presentations", p:"Designer-quality decks delivered the next morning, with your content untouched.",
   li:["Submit by 5:30 PM PT, receive by 9:30 AM PT","Up to 20 slides, with 2 to 3 design options","Optional Editorial Review add-on"]},
  {tag:"Fully managed", h:"Fixed-Price Projects", p:"Agency-quality medical communications across the product life cycle.",
   li:["Posters, field team materials, publication to presentation","Congress Intelligence and AdBoard Insights","Initial delivery in 24 to 72 hours"]},
  {tag:"API-first", h:"API and Agents", p:"Automate life sciences communication workflows at scale.",
   li:["Presentation API and Poster API","Template Converter API","Secure, with data residency and control"]}
];

/* =====================================================================
   RENDERING
   ===================================================================== */
const view = document.getElementById("view");
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const checked = new Set();   // in-memory only

const SEARCH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
function searchHTML(id, autofocus){
  return `<label>${SEARCH_SVG}<span class="sr" style="position:absolute;left:-9999px">Search the guide</span>
    <input type="search" id="${id}" placeholder="Try “add users”, “API keys” or “credits”" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="${id}-res"></label>
    <ul class="results" id="${id}-res" role="listbox"></ul>`;
}

function buildNav(active){
  document.getElementById("nav").innerHTML = PARTS.map(p => `
    <div class="part">
      <div class="part-title"><span>${esc(p.title)}</span><small>${p.n} of 4</small></div>
      <ul>${p.pages.map(id => `<li><a class="link ${id===active?"on":""}" href="#/${id}" ${id===active?'aria-current="page"':""}>${esc(PAGES[id].nav)}</a></li>`).join("")}</ul>
    </div>`).join("");
}

function pager(id){
  const i = ORDER.indexOf(id);
  const prev = ORDER[i-1], next = ORDER[i+1];
  return `<div class="pager">
    ${prev?`<a href="#/${prev}"><small>Previous</small><b>← ${esc(PAGES[prev].nav)}</b></a>`:"<span></span>"}
    ${next?`<a class="next" href="#/${next}"><small>Next</small><b>${esc(PAGES[next].nav)} →</b></a>`:""}
  </div>`;
}

function crumb(id){
  const p = partOf(id);
  return `<div class="crumb"><a href="#/">Guide</a> / Part ${p.n}: ${esc(p.title)}</div>`;
}

function head(id){
  const pg = PAGES[id];
  return `${crumb(id)}
    <h1 class="title">${esc(pg.title)}${pg.badge?`<span class="badge">${esc(pg.badge)}</span>`:""}</h1>
    <p class="purpose">${esc(pg.purpose)}</p>
    ${pg.find?`<p class="find"><b>Find it:</b> ${esc(pg.find)}</p>`:`<p class="find"></p>`}`;
}

function guideBtn(pg){
  return `<a class="btn line" href="#" data-toast="Links to ${esc(pg.guide)} of the full guide">Full guide section</a>`;
}

function renderHome(){
  view.innerHTML = `
  <section class="hero"><div class="hero-in">
    <h1>Admin Best Practices Guide</h1>
    <p>Best practices, proven workflows and expert tips to help you set up, manage and get the most from Prezent Vivo.</p>
    <div class="ask">What do you need to do?</div>
    <div class="search" id="herosearch">${searchHTML("hs")}</div>
  </div></section>
  <section class="home-body">
    ${PARTS.map(p=>`
      <div class="home-part">
        <div><div class="step">Part ${p.n} of 4</div><h2>${esc(p.title)}</h2><p>${esc(p.blurb)}</p></div>
        <div class="tiles">${p.pages.map(id=>`<a class="tile" href="#/${id}"><b>${esc(PAGES[id].nav)}</b><span>${esc(PAGES[id].summary)}</span><em class="go">${esc(CTA[id])}<i aria-hidden="true">→</i></em></a>`).join("")}</div>
      </div>`).join("")}
  </section>`;
  initSearch("hs");
}

function renderStandard(id){
  const pg = PAGES[id];
  const groups = GROUPS[id] || [{steps:pg.steps, fig:FIGS[id][0].k, alt:FIGS[id][0].c}];
  const multi = groups.length > 1;
  view.innerHTML = `<article class="page">
    ${head(id)}
    ${groups.map(g=>`
      ${multi?`<h2 class="gt">${esc(g.title)}</h2>`:""}
      <div class="gcard">
        <div class="gsteps">${g.steps.map((st,i)=>`<div class="gs"><div class="num">${i+1}</div><div><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></div></div>`).join("")}</div>
        ${g.note?`<p class="gnote">${esc(g.note)}</p>`:""}
        <button type="button" class="zoom" data-img="${g.fig}" aria-label="Enlarge screenshot: ${esc(g.alt)}"><img src="${IMG[g.fig]}" alt="${esc(g.alt)}"></button>
      </div>`).join("")}
    <p class="figsub" style="margin-top:10px">Numbered callouts in each screenshot match the steps above it. Select an image to enlarge it.</p>
    <div class="tip"><b>Tip<span class="draft">Draft</span></b><p>${esc(pg.tip)}</p></div>
    <div class="actions">
      <a class="btn fill ext" href="#" data-toast="Deep link to add: ${esc(pg.platform)}">Go to Platform</a>
      ${guideBtn(pg)}
    </div>
    ${pager(id)}
  </article>`;
}

function renderPlan(id){
  const pg = PAGES[id];
  view.innerHTML = `<article class="page">
    ${head(id)}
    <div class="plan-grid">${PLAN.map(b=>`
      <div class="plan"><small>${esc(b.tag)}</small><h3>${esc(b.h)}</h3><p>${esc(b.p)}</p>
        <ul>${b.li.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <a class="btn line sm" href="#" data-toast="Links to the ${esc(b.h)} page on prezent.ai">Learn more</a></div>`).join("")}
    </div>
    <div class="actions">${guideBtn(pg)}</div>
    ${pager(id)}
  </article>`;
}

function updateProgress(){
  const total = CHECKLIST.reduce((a,g)=>a+g.items.length,0);
  const done = checked.size;
  const bar = document.getElementById("bar"), txt = document.getElementById("ptxt");
  if(bar){ bar.style.width = (done/total*100)+"%"; txt.textContent = `${done} of ${total} ready`; }
}

function renderLaunchpad(id){
  const pg = PAGES[id];
  view.innerHTML = `<article class="page">
    ${head(id)}
    <section class="block">
      <h2>Before go-live</h2>
      <p class="sub">Tick items off as they are ready.</p>
      <div class="prog"><div class="bar"><i id="bar"></i></div><span id="ptxt"></span></div>
      <div class="groups">${CHECKLIST.map((g,gi)=>`
        <div class="grp"><h3>${esc(g.g)}</h3><p class="nx">${esc(g.next)}</p>
          ${g.items.map((it,ii)=>{const k=gi+"-"+ii;return `<label class="chk"><input type="checkbox" data-k="${k}" ${checked.has(k)?"checked":""}><span>${esc(it)}</span></label>`}).join("")}
        </div>`).join("")}
      </div>
    </section>
    <section class="block">
      <h2>Who to involve</h2>
      <p class="sub">The right people at each level, from your team and ours.</p>
      <table class="roles"><thead><tr><th>Role</th><th>From your team</th><th>From Prezent</th><th>When they are involved</th></tr></thead>
      <tbody>${ROLES.map(r=>`<tr><td>${esc(r[0])}</td><td data-l="From your team">${esc(r[1])}</td><td data-l="From Prezent">${esc(r[2])}</td><td data-l="Involved">${esc(r[3])}</td></tr>`).join("")}</tbody></table>
    </section>
    <section class="block">
      <h2>Your first 90 days</h2>
      <p class="sub">What happens, and roughly when.</p>
      <div class="months">${MONTHS.map(m=>`<div class="month"><h3>${esc(m.m)}</h3><p class="when">${esc(m.w)}</p><ul>${m.i.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
    </section>
    <div class="actions">${guideBtn(pg)}</div>
    ${pager(id)}
  </article>`;
  view.querySelectorAll(".chk input").forEach(cb=>cb.addEventListener("change",()=>{
    cb.checked ? checked.add(cb.dataset.k) : checked.delete(cb.dataset.k); updateProgress();
  }));
  updateProgress();
}

function renderHelp(id){
  const pg = PAGES[id];
  view.innerHTML = `<article class="page">
    ${head(id)}
    <div class="help-list">
      <div class="help-row"><div><h3>Browse help articles and FAQs</h3><p>Find quick answers and how-to guides.</p></div>
        <a class="btn fill" href="#" data-toast="Link to the Prezent Support Centre">Support Centre</a></div>
      <div class="help-row"><div><h3>Raise a support request</h3><p>Tell the support team what you need.</p></div>
        <a class="btn line" href="#" data-toast="Link to the support request form">Raise a request</a></div>
      <div class="help-row"><div><h3>Contact your Customer Success Manager</h3><p>For check-ins, templates, new keys and anything about your plan.</p></div>
        <a class="btn line" href="#" data-toast="Contact route for the CSM (email or in-platform), to be confirmed">Contact your CSM</a></div>
    </div>
    ${pager(id)}
  </article>`;
}

/* ---------- Router ---------- */
function route(){
  const id = (location.hash.replace(/^#\/?/,"") || "");
  document.body.classList.remove("open");
  document.body.classList.toggle("is-home", !id || !PAGES[id]);
  if(!id || !PAGES[id]){ buildNav(null); renderHome(); }
  else{
    buildNav(id);
    const t = PAGES[id].type;
    ({plan:renderPlan, launchpad:renderLaunchpad, help:renderHelp}[t] || renderStandard)(id);
    document.title = PAGES[id].title + " | Prezent Vivo Admin Guide";
  }
  if(!id) document.title = "Prezent Vivo Admin Best Practices Guide";
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);

/* ---------- Search ---------- */
function runSearch(q){
  q = q.trim().toLowerCase();
  if(!q) return [];
  return ORDER.map(id=>{
    const p = PAGES[id];
    const hay = [p.nav,p.title,p.summary,p.keywords].join(" ").toLowerCase();
    let s = 0;
    q.split(/\s+/).forEach(w=>{
      if(p.nav.toLowerCase().includes(w)) s+=3;
      else if(hay.includes(w)) s+=1; else s-=10;
    });
    return {id,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(x=>x.id);
}
function initSearch(id){
  const input = document.getElementById(id), box = document.getElementById(id+"-res");
  let sel = -1, list = [];
  const close = ()=>{box.classList.remove("show");input.setAttribute("aria-expanded","false");sel=-1};
  const draw = ()=>{
    list = runSearch(input.value);
    if(!input.value.trim()){close();return}
    box.innerHTML = list.length
      ? list.map((pid,i)=>`<li><a href="#/${pid}" class="${i===sel?"sel":""}" role="option"><b>${esc(PAGES[pid].nav)}</b><span>${esc(PAGES[pid].summary)}</span></a></li>`).join("")
      : `<li class="none">No match. Try a word like “users”, “credits” or “apps”.</li>`;
    box.classList.add("show"); input.setAttribute("aria-expanded","true");
  };
  input.addEventListener("input",()=>{sel=-1;draw()});
  input.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,list.length-1);draw()}
    else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(sel-1,0);draw()}
    else if(e.key==="Enter" && list.length){location.hash="#/"+list[Math.max(sel,0)];input.value="";close()}
    else if(e.key==="Escape"){close();input.blur()}
  });
  document.addEventListener("click",e=>{ if(!e.target.closest("#"+id) && !e.target.closest("#"+id+"-res")) close(); });
  box.addEventListener("click",()=>{input.value="";close()});
}
document.getElementById("topsearch").innerHTML = searchHTML("ts");
initSearch("ts");
document.addEventListener("keydown",e=>{
  if(e.key==="/" && !/input|textarea/i.test(document.activeElement.tagName)){
    e.preventDefault();
    (document.getElementById(document.body.classList.contains("is-home")?"hs":"ts")).focus();
  }
});

/* ---------- Toast for placeholder links ---------- */
const toastEl = document.getElementById("toast"); let tt;
document.addEventListener("click",e=>{
  const a = e.target.closest("[data-toast]");
  if(!a) return;
  e.preventDefault();
  toastEl.textContent = a.dataset.toast;
  toastEl.classList.add("show"); clearTimeout(tt);
  tt = setTimeout(()=>toastEl.classList.remove("show"),2800);
});

/* ---------- Screenshot lightbox ---------- */
const lb=document.getElementById("lb"), lbImg=lb.querySelector("img");
document.addEventListener("click",e=>{
  const z=e.target.closest(".zoom");
  if(z){lbImg.src=IMG[z.dataset.img];lbImg.alt=z.querySelector("img").alt;lb.hidden=false;return}
  if(!lb.hidden) lb.hidden=true;
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape") lb.hidden=true; });

/* ---------- Mobile menu ---------- */
document.getElementById("menu").addEventListener("click",()=>document.body.classList.toggle("open"));
document.getElementById("scrim").addEventListener("click",()=>document.body.classList.remove("open"));

route();
})();
