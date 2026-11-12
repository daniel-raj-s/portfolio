/* ==========================================================================
   DANIEL RAJ S, PORTFOLIO INTERACTIVITY & SIMULATOR ENGINE
   Agentic Quality Engineer | AI-Driven Test Automation | Senior SDET
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initSimulator();
  initProjectFilters();
  initTerminal();
  initCopyButtons();
  initLiveClock();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('daniel-theme') || 'dark';
  
  setTheme(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('daniel-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    if (theme === 'light') {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      icon.setAttribute('title', 'Switch to Dark Mode');
    } else {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      icon.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ==========================================================================
   2. Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Scroll spy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Mobile menu toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.innerHTML = isOpen 
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }
}

/* ==========================================================================
   3. Interactive Simulator: Autonomous Playwright Trace Analysis
   ========================================================================== */
const SIMULATOR_DATA = {
  scenario1: {
    name: "Payment Gateway 502 with GraphQL Silent Failure",
    badge: { text: "REAL BUG · CRITICAL", type: "bug" },
    traceDuration: "31,450ms (TIMEOUT)",
    fingerprint: "sha256:7f4d2a9018e47bca8831f290d182",
    dedupVerdict: "CACHE MISS · New error fingerprint ingested",
    aiModel: "Claude Opus 5.5 (AWS Bedrock)",
    summary: "Checkout CTA remained permanently disabled because upstream `/api/v2/payment/session` threw 502 Bad Gateway and the companion GraphQL query masked error in HTTP 200 envelope.",
    failingAssertion: "tests/e2e/checkout-flow.spec.ts:84, expect(checkoutBtn).toBeEnabled() timed out",
    trigger: "POST /graphql/checkout-session returned 200 with response.errors[0].message = 'Downstream timeout: ServiceUnavailable'",
    suspectedPR: "PR #1084 (e4a7b21) by dev-infra: 'Migrate payment session to internal gateway proxy'",
    suggestedFix: "Fix retry interceptor in PaymentGatewayService & add graceful UI error banner handling in CheckoutModal.tsx.",
    slackBlockTitle: "🚨 High-Confidence E2E Failure Root Cause Triage",
    diff: `// Suggested Fix in tests/e2e/checkout-flow.spec.ts
- await page.locator('[data-testid="checkout-btn"]').click();
+ // Intercept 502 gateway error and verify graceful recovery banner
+ await page.route('**/api/v2/payment/session', route => route.fulfill({
+   status: 502,
+   contentType: 'application/json',
+   body: JSON.stringify({ error: 'Bad Gateway' })
+ }));
+ await expect(page.locator('[data-testid="payment-retry-alert"]')).toBeVisible();`
  },
  scenario2: {
    name: "Strict-Mode Locator Drift (Flaky UI Change)",
    badge: { text: "TEST CODE REPAIR · FLAKY", type: "flaky" },
    traceDuration: "420ms (DETERMINISTIC)",
    fingerprint: "sha256:1a8c4f923bde00911762cba182f0",
    dedupVerdict: "CACHE MISS · Prompt assembled with Git commit diff",
    aiModel: "GPT-6 (OpenAI Reasoning Engine)",
    summary: "Playwright strict-mode locator resolution failed because frontend A/B test added a secondary mobile 'Enroll Now' button matching `getByRole('button', { name: /enroll/i })`.",
    failingAssertion: "tests/c4b/enterprise-catalog.spec.ts:42, Error: strict mode violation: locator resolved to 2 elements",
    trigger: "Resolved to <button class='btn-desktop'>Enroll Now</button> and <button class='btn-mobile-sticky'>Enroll Now</button>",
    suspectedPR: "PR #1420 (a89df01) by product-growth: 'Introduce sticky bottom action bar on tablet viewports'",
    suggestedFix: "Scope locator to the desktop hero container or use explicit test id locator: `page.getByTestId('hero-enroll-cta')`.",
    slackBlockTitle: "⚠️ Playwright Strict-Mode Drift Detected",
    diff: `// Auto-generated Fix PR in tests/c4b/enterprise-catalog.spec.ts
- await page.getByRole('button', { name: /enroll now/i }).click();
+ // Scoped to visible hero viewport action to avoid mobile sticky bar collision
+ await page.getByTestId('hero-container').getByRole('button', { name: /enroll now/i }).click();`
  },
  scenario3: {
    name: "Transient DB Connection Pool Exhaustion (Zero-Token Deduplication)",
    badge: { text: "ZERO-TOKEN REUSE · CACHE HIT", type: "cache" },
    traceDuration: "12,180ms (DB TIMEOUT)",
    fingerprint: "sha256:6e108bb78f001cda84b1279a01f9",
    dedupVerdict: "CACHE HIT (0 Tokens Spent) · Reused prior verified triage from 2.4 hours ago",
    aiModel: "Zero AI Calls (Instant Deterministic Cache)",
    summary: "Exact normalized failure fingerprint matched active known issue INFRA-984. Instant triage returned in 120ms with 0 tokens spent.",
    failingAssertion: "tests/integration/lms-sync.spec.ts:19, Postgres connection pool timeout: client acquired 0/50",
    trigger: "Athena / Postgres sync worker pool stalled during scheduled ETL run",
    suspectedPR: "Linked Jira Incident: INFRA-984 (Database connection throttle during backup snapshot)",
    suggestedFix: "No test modification required. Pipeline retried automatically once DB pool stabilized.",
    slackBlockTitle: "♻️ Reused Analysis: Known Incident INFRA-984 (0 AI Tokens Used)",
    diff: `// No PR opened, Incident automatically linked to existing Jira ticket:
// Ticket: INFRA-984
// Status: INVESTIGATING (Cloud Infrastructure Team)
// Dedup Fingerprint: sha256:6e108bb78f001cda84b1279a01f9`
  }
};

let currentScenarioKey = 'scenario1';
let currentTabKey = 'verdict';
let isRunningSim = false;

function initSimulator() {
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const outputTabs = document.querySelectorAll('.output-tab');
  const runSimBtn = document.getElementById('run-sim-btn');

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunningSim) return;
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenarioKey = btn.dataset.scenario;
      renderSimulatorOutput();
    });
  });

  outputTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      outputTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTabKey = tab.dataset.tab;
      renderSimulatorOutput();
    });
  });

  if (runSimBtn) {
    runSimBtn.addEventListener('click', () => {
      runSimulation();
    });
  }

  // Initial render
  renderSimulatorOutput();
}

function runSimulation() {
  if (isRunningSim) return;
  isRunningSim = true;
  const stages = document.querySelectorAll('.stage-step');
  const outputEl = document.getElementById('sim-output-body');
  const runBtn = document.getElementById('run-sim-btn');

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.innerHTML = `<span>Simulating...</span>`;
  }

  // Reset stages
  stages.forEach(st => {
    st.classList.remove('active', 'completed');
  });

  outputEl.innerHTML = `
    <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
      <div class="pulse-dot" style="margin: 0 auto 1rem; width: 14px; height: 14px;"></div>
      <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-cyan);">[Stage 1/4] Ingesting Playwright trace archive & parsing DOM timelines...</p>
    </div>
  `;

  // Stage 1
  stages[0].classList.add('active');

  setTimeout(() => {
    stages[0].classList.remove('active');
    stages[0].classList.add('completed');
    stages[1].classList.add('active');
    outputEl.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <div class="pulse-dot" style="margin: 0 auto 1rem; width: 14px; height: 14px;"></div>
        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-cyan);">[Stage 2/4] Computing normalized error fingerprint & checking zero-token deduplication cache...</p>
      </div>
    `;
  }, 900);

  // Stage 2
  setTimeout(() => {
    stages[1].classList.remove('active');
    stages[1].classList.add('completed');
    stages[2].classList.add('active');
    const isCache = currentScenarioKey === 'scenario3';
    outputEl.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <div class="pulse-dot" style="margin: 0 auto 1rem; width: 14px; height: 14px;"></div>
        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-cyan);">
          ${isCache ? '[Stage 3/4] Cache HIT! Skipping LLM invocation (0 tokens spent)...' : '[Stage 3/4] Invoking Claude Opus 5.5 on Bedrock with extracted trace context...'}
        </p>
      </div>
    `;
  }, 1900);

  // Stage 3
  setTimeout(() => {
    stages[2].classList.remove('active');
    stages[2].classList.add('completed');
    stages[3].classList.add('active');
    outputEl.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <div class="pulse-dot" style="margin: 0 auto 1rem; width: 14px; height: 14px;"></div>
        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-cyan);">[Stage 4/4] Generating auto-fix PR spec, Slack Block Kit card, and updating Jira...</p>
      </div>
    `;
  }, 2900);

  // Stage 4 Completion
  setTimeout(() => {
    stages[3].classList.remove('active');
    stages[3].classList.add('completed');
    isRunningSim = false;
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = `<span>Run Simulated RCA</span>`;
    }
    renderSimulatorOutput();
    showToast("Autonomous Triage Complete (20m TTR standard)");
  }, 3800);
}

function renderSimulatorOutput() {
  const data = SIMULATOR_DATA[currentScenarioKey];
  const outputEl = document.getElementById('sim-output-body');
  if (!outputEl) return;

  if (currentTabKey === 'verdict') {
    outputEl.innerHTML = `
      <div class="verdict-card">
        <div class="verdict-badge ${data.badge.type}">
          <span>●</span> ${data.badge.text}
        </div>
        <h4 class="verdict-title">${data.name}</h4>
        <p class="verdict-detail">${data.summary}</p>
        <div class="verdict-spec">
          <strong>Failing Assertion:</strong> ${data.failingAssertion}<br>
          <strong>Root Trigger:</strong> ${data.trigger}
        </div>
      </div>
      <div class="sim-meta-table">
        <div class="meta-row">
          <span class="meta-key">Suspected Origin</span>
          <span class="meta-val"><strong style="color: var(--accent-cyan);">${data.suspectedPR}</strong></span>
        </div>
        <div class="meta-row">
          <span class="meta-key">AI Engine</span>
          <span class="meta-val"><strong style="color: var(--accent-emerald);">${data.aiModel}</strong></span>
        </div>
        <div class="meta-row">
          <span class="meta-key">Fingerprint Gate</span>
          <span class="meta-val"><code>${data.fingerprint}</code> (${data.dedupVerdict})</span>
        </div>
        <div class="meta-row">
          <span class="meta-key">Actionable Fix</span>
          <span class="meta-val">${data.suggestedFix}</span>
        </div>
      </div>
    `;
  } else if (currentTabKey === 'json') {
    const jsonOutput = {
      classification: data.badge.text,
      confidence: "high",
      traceDuration: data.traceDuration,
      errorFingerprint: data.fingerprint,
      dedupStatus: data.dedupVerdict,
      aiProvider: data.aiModel,
      summary: data.summary,
      failingAssertion: data.failingAssertion,
      trigger: data.trigger,
      suspectedPR: data.suspectedPR,
      suggestedFix: data.suggestedFix
    };
    outputEl.innerHTML = `
      <pre class="code-snippet"><code>${JSON.stringify(jsonOutput, null, 2)}</code></pre>
    `;
  } else if (currentTabKey === 'slack') {
    outputEl.innerHTML = `
      <div class="slack-preview-card">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-weight: 700; color: #ffffff;">Playwright Quality Bot</span>
          <span style="font-size: 0.72rem; color: #868686; background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px;">APP</span>
          <span style="font-size: 0.75rem; color: #868686;">Today at 5:24 PM</span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: #ffffff;">
          ${data.slackBlockTitle}
        </div>
        <p style="margin-bottom: 8px; font-size: 0.88rem;">${data.summary}</p>
        <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; font-size: 0.8rem; font-family: var(--font-mono); margin-bottom: 12px;">
          • <strong>Failing Spec:</strong> ${data.failingAssertion}<br>
          • <strong>Trigger:</strong> ${data.trigger}<br>
          • <strong>PR:</strong> ${data.suspectedPR}
        </div>
        <div style="display: flex; gap: 8px;">
          <button style="background: #007a5a; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.78rem; font-weight: 600;">View HTML Report</button>
          <button style="background: #1264a3; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.78rem; font-weight: 600;">View Fix PR</button>
          <button style="background: transparent; border: 1px solid #555; color: #ccc; padding: 4px 10px; border-radius: 4px; font-size: 0.78rem;">Mark False Positive</button>
        </div>
      </div>
    `;
  } else if (currentTabKey === 'diff') {
    outputEl.innerHTML = `
      <div style="margin-bottom: 0.75rem; font-size: 0.82rem; color: var(--text-secondary);">
        <strong>Auto-Generated Playwright Fix PR:</strong>
      </div>
      <pre class="code-snippet"><code>${escapeHtml(data.diff)}</code></pre>
    `;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ==========================================================================
   4. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.project-card:not(.featured-card)');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Developer CLI Terminal
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('cli-input');
  const screen = document.getElementById('cli-screen');
  const chips = document.querySelectorAll('.cmd-chip');

  if (!input || !screen) return;

  const COMMANDS = {
    help: () => `
<div class="t-block">
  <span class="t-highlight">Available Commands:</span><br>
  • <strong>skills</strong>       - List core SDET & agentic quality engineering stack<br>
  • <strong>experience</strong>   - View career milestones (Coursera, Tegna, BNY Mellon, TCS)<br>
  • <strong>projects</strong>     - Inspect open-source production blueprints on GitHub<br>
  • <strong>stats</strong>        - View quantitative impact metrics & SLO scores<br>
  • <strong>resume</strong>       - Download official ATS-optimized SDET resume PDF<br>
  • <strong>contact</strong>      - Display direct phone, email, and social coordinates<br>
  • <strong>clear</strong>        - Clear the terminal screen buffer
</div>`,
    skills: () => `
<div class="t-block">
  <span class="t-highlight">Technical Arsenal:</span><br>
  • <strong>Agentic AI:</strong> Claude Opus 5.5, GPT-6, Claude Code/Skills, AWS Bedrock, Multi-Model RCA, Playwright MCP, Local LLMs<br>
  • <strong>Test Automation:</strong> Playwright (TS/Python), Selenium (Java), Cucumber BDD, Rest Assured, Appium, a11y (axe-core)<br>
  • <strong>Observability:</strong> SLO burn rates, error budgets, quality scoring, Allure, Slack Block Kit<br>
  • <strong>CI/CD & Cloud:</strong> GitHub Actions, GitLab CI/CD, Jenkins, Docker, AWS (EC2/S3), SonarQube<br>
  • <strong>Databases:</strong> PostgreSQL, Snowflake, AWS Athena, SQL
</div>`,
    experience: () => `
<div class="t-block">
  <span class="t-highlight">Career Milestones:</span><br>
  1. <strong style="color: #00f2fe;">Coursera</strong> (Jul 2025 – Present) | Test Engineer 2 (IC3)<br>
     Sole QA gatekeeper for Integration POD. Architected AI QE Intelligence Dashboard & Playwright trace RCA pipeline (TTR: 2h → 20m).<br><br>
  2. <strong style="color: #a855f7;">Tegna (Premion)</strong> (Jul 2024 – Jul 2025) | Senior Automation Engineer & Scrum Lead<br>
     Scrum Lead. Built hybrid Playwright + TS + Cucumber framework; boosted coverage 45% → 85%, cut regression from 2 days to 6h.<br><br>
  3. <strong style="color: #38bdf8;">Bank of New York Mellon</strong> (Jun 2022 – Apr 2024) | QA Analyst<br>
     Java Selenium POM automation with Apache POI & GitLab Runner. Migrated 150+ manual regression suites.<br><br>
  4. <strong style="color: #10b981;">Tata Consultancy Services</strong> (Dec 2019 – May 2022) | QA Engineer I<br>
     Java Selenium WebDriver automation & TestNG across Agile sprints.
</div>`,
    projects: () => `
<div class="t-block">
  <span class="t-highlight">Open Source Blueprints (GitHub: daniel-raj-s):</span><br>
  • <strong>playwright-trace-analysis-pipeline</strong>: Multi-model AI root-cause diagnosis & 0-token dedup<br>
  • <strong>playwright-enterprise-architecture-blueprint</strong>: Parallelized E2E + 15-min cron synthetics<br>
  • <strong>visual-regression</strong>: Cross-device pixelmatch with dynamic locator masking<br>
  • <strong>network-interception</strong>: Backend API stubbing, client error injection & schema validation<br>
  • <strong>playwright-ts-cucumber</strong>: Modular UI/API framework with Postgres DB integration<br>
  • <strong>java-cucumber-framework</strong>: Banking-grade Selenium POM with ExtentReports
</div>`,
    stats: () => `
<div class="t-block">
  <span class="t-highlight">Quantitative Performance Impact:</span><br>
  • <strong>Time-to-Resolution (TTR):</strong> Cut by 83% (2 hours → 20 minutes) via autonomous triage<br>
  • <strong>Automation Coverage:</strong> Elevated from 45% to 85% at Tegna (Premion)<br>
  • <strong>Regression Speedup:</strong> Cut from 2 full days down to 6 hours<br>
  • <strong>CI/CD Pipelines:</strong> 12+ production pipelines engineered & maintained<br>
  • <strong>Code Violations:</strong> Reduced critical code issues by 30% pre-merge via SonarQube<br>
  • <strong>Honors:</strong> Won "Best Automation Hack" (Octillion 2024)
</div>`,
    resume: () => {
      window.open('resume/Daniel_Raj_S_SDET_Resume.pdf', '_blank');
      return `<div class="t-block t-success">✓ Initiating download for Daniel_Raj_S_SDET_Resume.pdf...</div>`;
    },
    contact: () => `
<div class="t-block">
  <span class="t-highlight">Direct Coordinates:</span><br>
  • <strong>Email:</strong> danielraj2@outlook.com<br>
  • <strong>Phone:</strong> +91 8124263675<br>
  • <strong>Location:</strong> Chennai, Tamil Nadu, India (Open to Remote / Hybrid)<br>
  • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/danielraj2" target="_blank" style="color: #00f2fe; text-decoration: underline;">linkedin.com/in/danielraj2</a><br>
  • <strong>GitHub:</strong> <a href="https://github.com/daniel-raj-s" target="_blank" style="color: #00f2fe; text-decoration: underline;">github.com/daniel-raj-s</a>
</div>`,
    clear: () => {
      screen.innerHTML = '';
      return '';
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawVal = input.value.trim();
      if (!rawVal) return;

      executeCommand(rawVal);
      input.value = '';
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      executeCommand(cmd);
    });
  });

  function executeCommand(cmdStr) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="t-prompt">daniel@sdet:~$</span> <span class="t-cmd">${escapeHtml(cmdStr)}</span>`;
    screen.appendChild(line);

    const key = cmdStr.toLowerCase();
    if (COMMANDS[key]) {
      const res = COMMANDS[key]();
      if (res) {
        const out = document.createElement('div');
        out.innerHTML = res;
        screen.appendChild(out);
      }
    } else {
      const err = document.createElement('div');
      err.className = 't-comment';
      err.innerHTML = `command not found: ${escapeHtml(cmdStr)}. Type <strong style="color: #00f2fe;">help</strong> for available commands.`;
      screen.appendChild(err);
    }

    screen.scrollTop = screen.scrollHeight;
  }
}

/* ==========================================================================
   6. Copy-to-Clipboard & Toast Alerts
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Selected: ${textToCopy}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. Live Chennai Local Time Clock
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('chennai-clock');
  if (!clockEl) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockEl.textContent = `${formatter.format(new Date())} IST (UTC+5:30)`;
    } catch (e) {
      clockEl.textContent = 'Asia/Kolkata (UTC+5:30)';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

