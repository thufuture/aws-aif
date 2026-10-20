/**
 * AWS Certified AI Practitioner (AIF-C01) - Master Application Engine
 * Handles State, Quizzes, Mock Exam Simulation, Flashcards, Search, Audio & LocalStorage
 */

// Application State
const state = {
  currentView: "dashboard",
  theme: localStorage.getItem("aif_theme") || "light",
  soundEnabled: localStorage.getItem("aif_sound") !== "false",
  bookmarks: JSON.parse(localStorage.getItem("aif_bookmarks") || "[]"),
  masteredFlashcards: JSON.parse(localStorage.getItem("aif_mastered_fc") || "[]"),
  completedModules: JSON.parse(localStorage.getItem("aif_completed_modules") || "[]"),
  examHistory: JSON.parse(localStorage.getItem("aif_exam_history") || "[]"),

  // Current Quiz/Exam Session
  quizSession: {
    mode: "domain", // 'domain' or 'mock'
    domainId: 1,
    questions: [],
    currentIndex: 0,
    userAnswers: {}, // { questionId: selectedOptionIndex }
    flagged: {}, // { questionId: boolean }
    submitted: false,
    timerSeconds: 90 * 60,
    timerInterval: null
  },

  paletteFilter: "all",

  // Flashcards Session
  flashcardIndex: 0,
  flashcardDomainFilter: "all",
  flashcardFlipped: false,

  // Study Navigation Session
  activeStudyDomain: 1,
  openStudyDomains: new Set([1]),
  studySidebarCollapsed: localStorage.getItem("aif_sidebar_collapsed") === "1"
};

// Web Audio API Sound Synthesizer (No external audio file dependencies!)
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type, duration, startTime = 0) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn("Audio play prevented", e);
    }
  }

  playCorrect() {
    this.playTone(523.25, "sine", 0.15, 0);     // C5
    this.playTone(659.25, "sine", 0.15, 0.08);  // E5
    this.playTone(783.99, "sine", 0.35, 0.16);  // G5
  }

  playWrong() {
    this.playTone(220, "sawtooth", 0.15, 0);    // A3
    this.playTone(196, "sawtooth", 0.25, 0.1);  // G3
  }

  playClick() {
    this.playTone(400, "triangle", 0.05, 0);
  }
}

const sound = new SoundManager();

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupEventListeners();
  renderDashboard();
  renderStudySidebar();
  renderStudyContent(1);
  renderFlashcards();
  renderCheatSheet();
  updateReadinessBadge();
  if (state.studySidebarCollapsed) {
    const sb = document.getElementById("study-sidebar");
    if (sb) sb.classList.add("collapsed");
    updateSidebarToggleButton();
  }
  refreshIcons();
});

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================================================================
// THEME & SOUND CONTROLS
// ===================================================================
function initTheme() {
  if (state.theme === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("theme-toggle-icon")?.setAttribute("data-lucide", "sun");
  } else {
    document.body.classList.remove("dark-theme");
    document.getElementById("theme-toggle-icon")?.setAttribute("data-lucide", "moon");
  }
  updateSoundIcon();
}

function toggleTheme() {
  sound.playClick();
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  state.theme = isDark ? "dark" : "light";
  localStorage.setItem("aif_theme", state.theme);

  const icon = document.getElementById("theme-toggle-icon");
  if (icon) {
    icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
  }
  refreshIcons();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem("aif_sound", state.soundEnabled);
  updateSoundIcon();
  if (state.soundEnabled) sound.playClick();
}

function updateSoundIcon() {
  const icon = document.getElementById("sound-toggle-icon");
  if (icon) {
    icon.setAttribute("data-lucide", state.soundEnabled ? "volume-2" : "volume-x");
  }
  refreshIcons();
}

// ===================================================================
// NAVIGATION & VIEW SWITCHING
// ===================================================================
function switchView(viewName) {
  sound.playClick();
  state.currentView = viewName;

  // Update tabs
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
  });

  // Update view panels
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  const activePanel = document.getElementById(`view-${viewName}`);
  if (activePanel) {
    activePanel.classList.add("active");
  }

  // View specific setups
  if (viewName === "dashboard") {
    renderDashboard();
  } else if (viewName === "quiz") {
    renderCurrentQuestion();
    renderQuestionPalette();
  } else if (viewName === "flashcards") {
    renderFlashcards();
  } else if (viewName === "bookmarks") {
    renderBookmarksView();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      switchView(view);
    });
  });

  // Header buttons
  document.getElementById("btn-theme-toggle")?.addEventListener("click", toggleTheme);
  document.getElementById("btn-sound-toggle")?.addEventListener("click", toggleSound);
  document.querySelector(".brand-section")?.addEventListener("click", () => switchView("dashboard"));

  // Global search input
  const cheatSearch = document.getElementById("cheat-search-input");
  if (cheatSearch) {
    cheatSearch.addEventListener("input", (e) => {
      filterCheatSheet(e.target.value.toLowerCase());
    });
  }
}

// ===================================================================
// DASHBOARD RENDERING
// ===================================================================
function renderDashboard() {
  updateReadinessBadge();

  // Render 5 Domain Cards
  const domainsContainer = document.getElementById("dashboard-domains-grid");
  if (!domainsContainer) return;

  domainsContainer.innerHTML = THEORY_DATA.map(domain => {
    const questionsCount = QUESTIONS_DATA.filter(q => q.domainId === domain.domainNumber).length;
    const completedInDomain = state.completedModules.filter(mId => mId.startsWith(`d${domain.domainNumber}-`)).length;
    const totalModules = domain.modules.length;
    const percent = Math.round((completedInDomain / totalModules) * 100);

    return `
      <div class="domain-card">
        <div>
          <div class="domain-header">
            <div class="domain-badge-wrap">
              <span class="domain-pill" style="background: ${domain.color}22; color: ${domain.color}">
                Domain ${domain.domainNumber}
              </span>
              <span class="domain-weight">${domain.weight}</span>
            </div>
            <i data-lucide="${domain.icon}" style="color: ${domain.color}; width: 24px; height: 24px;"></i>
          </div>
          <h4>${domain.title}</h4>
          <div class="subtitle-vi">${domain.titleVi}</div>
          <p class="summary">${domain.summary}</p>
        </div>

        <div>
          <div class="domain-progress-row">
            <div class="progress-header">
              <span>Tiến độ lý thuyết</span>
              <span>${percent}% (${completedInDomain}/${totalModules} bài)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percent}%; background: ${domain.color};"></div>
            </div>
          </div>

          <div class="domain-actions">
            <button class="btn-learn" onclick="startLearningDomain(${domain.domainNumber})">
              <i data-lucide="book-open"></i> Học bài
            </button>
            <button class="btn-quiz" onclick="startDomainQuiz(${domain.domainNumber})">
              <i data-lucide="check-circle-2"></i> Thi thử (${questionsCount} câu)
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  refreshIcons();
}

function updateReadinessBadge() {
  const totalModules = THEORY_DATA.reduce((acc, d) => acc + d.modules.length, 0);
  const totalQuestions = QUESTIONS_DATA.length;
  
  const completedModCount = state.completedModules.length;
  const answeredQCount = Object.keys(state.quizSession.userAnswers).length;

  const scoreRatio = Math.min(100, Math.round(((completedModCount / totalModules) * 50) + ((answeredQCount / totalQuestions) * 50)));

  const badgeEl = document.getElementById("readiness-score-text");
  const fillEl = document.getElementById("readiness-fill-mini");
  if (badgeEl) badgeEl.innerText = `${scoreRatio}% Sẵn sàng`;
  if (fillEl) fillEl.style.width = `${scoreRatio}%`;

  const heroBadge = document.getElementById("hero-ready-percent");
  if (heroBadge) heroBadge.innerText = `${scoreRatio}%`;
}

// ===================================================================
// STUDY CENTER (HỌC LÝ THUYẾT & MỤC LỤC TƯƠNG TÁC)
// ===================================================================
function renderStudySidebar() {
  const navList = document.getElementById("study-domain-nav");
  if (!navList) return;

  const activeDomNum = state.activeStudyDomain || 1;
  if (!state.openStudyDomains) {
    state.openStudyDomains = new Set([activeDomNum]);
  }

  navList.innerHTML = THEORY_DATA.map(domain => {
    const isActive = domain.domainNumber === activeDomNum;
    const isOpen = state.openStudyDomains.has(domain.domainNumber);
    const domainLabel = domain.domainNumber === 6 ? '⭐ THỦ KHOA' : `DOMAIN ${domain.domainNumber}`;
    const domainShort = domain.domainNumber === 6 ? '⭐' : `D${domain.domainNumber}`;
    const domainFullName = domain.domainNumber === 6 ? 'Kinh nghiệm ôn tập & mẹo thi' : domain.titleVi;

    return `
      <div class="domain-nav-item ${isActive ? 'active' : ''} ${isOpen ? 'expanded' : ''}" 
           data-domain="${domain.domainNumber}"
           title="${domainShort}: ${domainFullName} (${domain.weight})"
           onclick="handleDomainCardClick(${domain.domainNumber})">
        
        <!-- Compact icon badge when sidebar is collapsed -->
        <div class="domain-nav-compact-badge" style="background: ${domain.color}18; color: ${domain.color}; border: 1.5px solid ${domain.color}55;">
          ${domainShort}
        </div>

        <!-- Full content when sidebar is expanded -->
        <div class="domain-nav-content">
          <div class="domain-nav-top">
            <span class="domain-nav-tag" style="background: ${domain.color}15; color: ${domain.color}; border: 1px solid ${domain.color}35;">
              ${domainLabel}
            </span>
            <div class="domain-nav-top-right">
              <span class="domain-nav-weight" style="color: ${domain.color}; font-weight: 700;">${domain.weight}</span>
              <button class="domain-chevron-btn" 
                      title="${isOpen ? 'Thu gọn mục lục' : 'Mở rộng mục lục'}"
                      onclick="event.stopPropagation(); toggleDomainAccordion(${domain.domainNumber});">
                <i data-lucide="chevron-down" class="domain-collapse-chevron ${isOpen ? 'open' : ''}"></i>
              </button>
            </div>
          </div>
          <div class="domain-nav-name">${domainFullName}</div>
          
          ${isOpen ? `
            <div class="domain-toc-list">
              ${domain.modules.map(mod => {
                const isDone = state.completedModules.includes(mod.id);
                const parts = mod.title.split(' ');
                const num = parts[0];
                const restTitle = parts.slice(1).join(' ');
                return `
                  <div class="toc-item" onclick="event.stopPropagation(); scrollToStudyModule('${mod.id}', ${domain.domainNumber})">
                    <span class="toc-num">${num}</span>
                    <span class="toc-title" title="${mod.title}">${restTitle || mod.title}</span>
                    ${isDone ? '<i data-lucide="check" class="toc-check"></i>' : ''}
                  </div>
                `;
              }).join("")}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  refreshIcons();
}

function handleDomainCardClick(domainNumber) {
  sound.playClick();
  if (!state.openStudyDomains) {
    state.openStudyDomains = new Set([state.activeStudyDomain || 1]);
  }

  // Always ensure the selected domain's TOC is open and active
  state.openStudyDomains.add(domainNumber);

  if (state.activeStudyDomain !== domainNumber) {
    state.activeStudyDomain = domainNumber;
    renderStudyContent(domainNumber);
  }

  renderStudySidebar();
}

function toggleDomainAccordion(domainNumber) {
  sound.playClick();
  if (!state.openStudyDomains) {
    state.openStudyDomains = new Set([state.activeStudyDomain || 1]);
  }

  if (state.openStudyDomains.has(domainNumber)) {
    state.openStudyDomains.delete(domainNumber);
  } else {
    state.openStudyDomains.add(domainNumber);
    if (state.activeStudyDomain !== domainNumber) {
      state.activeStudyDomain = domainNumber;
      renderStudyContent(domainNumber);
    }
  }

  renderStudySidebar();
}

function switchStudyDomain(domainNumber) {
  handleDomainCardClick(domainNumber);
}

function toggleStudySidebarCollapse() {
  sound.playClick();
  const sidebar = document.getElementById("study-sidebar");
  if (!sidebar) return;

  state.studySidebarCollapsed = !state.studySidebarCollapsed;
  localStorage.setItem("aif_sidebar_collapsed", state.studySidebarCollapsed ? "1" : "0");

  if (state.studySidebarCollapsed) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }

  updateSidebarToggleButton();
  renderStudySidebar();
  refreshIcons();
}

function updateSidebarToggleButton() {
  const toggleBtn = document.getElementById("btn-toggle-study-sidebar");
  if (!toggleBtn) return;

  if (state.studySidebarCollapsed) {
    toggleBtn.innerHTML = '<i data-lucide="panel-left-open"></i>';
    toggleBtn.setAttribute("title", "Mở rộng menu Domain");
  } else {
    toggleBtn.innerHTML = '<i data-lucide="panel-left-close"></i>';
    toggleBtn.setAttribute("title", "Thu gọn menu (mở rộng vùng học)");
  }
}

function scrollToStudyModule(modId, domainNumber) {
  sound.playClick();
  if (!state.openStudyDomains) state.openStudyDomains = new Set();
  state.openStudyDomains.add(domainNumber);

  if (state.activeStudyDomain !== domainNumber) {
    state.activeStudyDomain = domainNumber;
    renderStudySidebar();
    renderStudyContent(domainNumber);
  }
  
  setTimeout(() => {
    const modEl = document.getElementById(`mod-${modId}`);
    if (!modEl) return;
    const body = modEl.querySelector(".module-body");
    const arrow = modEl.querySelector(".module-arrow");
    if (body) {
      body.style.display = "block";
      if (arrow) arrow.style.transform = "rotate(0deg)";
    }
    const offset = 70;
    const elementPosition = modEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
    modEl.classList.remove("toc-target-highlight");
    void modEl.offsetWidth; // trigger reflow
    modEl.classList.add("toc-target-highlight");
  }, 100);
}

function renderStudyContent(domainNumber) {
  const domain = THEORY_DATA.find(d => d.domainNumber === domainNumber);
  if (!domain) return;

  const contentPanel = document.getElementById("study-content-panel");
  if (!contentPanel) return;

  contentPanel.innerHTML = `
    <div class="study-header">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
        <div>
          <span class="domain-pill" style="background: ${domain.color}18; color: ${domain.color}; font-weight: 700;">
            ${domain.domainNumber === 6 ? 'Kinh Nghiệm Thực Chiến' : `Domain ${domain.domainNumber}`} &bull; ${domain.weight}
          </span>
          <h2 style="margin-top: 0.5rem;">${domain.title}</h2>
          <p>${domain.titleVi}</p>
        </div>
        ${domain.domainNumber === 6 ? `
          <button class="btn-primary" onclick="startMockExam()">
            <i data-lucide="play-circle"></i> Bắt đầu thi thử 65 câu
          </button>
        ` : `
          <button class="btn-primary" onclick="startDomainQuiz(${domain.domainNumber})">
            <i data-lucide="play-circle"></i> Làm đề trắc nghiệm Domain này
          </button>
        `}
      </div>
    </div>

    <div class="modules-accordion">
      ${domain.modules.map(mod => {
        const isDone = state.completedModules.includes(mod.id);
        return `
          <div class="module-block" id="mod-${mod.id}">
            <div class="module-header" onclick="toggleModuleAccordion('${mod.id}')">
              <div class="module-title-group">
                <input type="checkbox" class="module-check" 
                       ${isDone ? 'checked' : ''} 
                       onclick="event.stopPropagation(); toggleModuleCompletion('${mod.id}')" />
                <h4>${mod.title}</h4>
                <span class="module-badge">${mod.badge}</span>
              </div>
              <i data-lucide="chevron-down" class="module-arrow"></i>
            </div>
            <div class="module-body">
              ${mod.content}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  refreshIcons();
}

function toggleModuleAccordion(modId) {
  const modEl = document.getElementById(`mod-${modId}`);
  if (!modEl) return;
  const body = modEl.querySelector(".module-body");
  const arrow = modEl.querySelector(".module-arrow");
  if (body.style.display === "none") {
    body.style.display = "block";
    if (arrow) arrow.style.transform = "rotate(0deg)";
  } else {
    body.style.display = "none";
    if (arrow) arrow.style.transform = "rotate(-90deg)";
  }
}

function toggleModuleCompletion(modId) {
  sound.playClick();
  if (state.completedModules.includes(modId)) {
    state.completedModules = state.completedModules.filter(id => id !== modId);
  } else {
    state.completedModules.push(modId);
    sound.playCorrect();
  }
  localStorage.setItem("aif_completed_modules", JSON.stringify(state.completedModules));
  updateReadinessBadge();
  renderStudySidebar();
}

function startLearningDomain(domainNumber) {
  switchView("study");
  switchStudyDomain(domainNumber);
}

// ===================================================================
// QUIZ & MOCK EXAM ENGINE
// ===================================================================
function startDomainQuiz(domainNumber) {
  sound.playClick();
  const domainQuestions = QUESTIONS_DATA.filter(q => q.domainId === domainNumber);
  if (!domainQuestions.length) return;

  state.quizSession = {
    mode: "domain",
    domainId: domainNumber,
    questions: domainQuestions,
    currentIndex: 0,
    userAnswers: {},
    checkedAnswers: {},
    showTranslation: {},
    flagged: {},
    submitted: false,
    timerSeconds: domainQuestions.length * 90, // 1.5 mins per question
    timerInterval: null
  };

  switchView("quiz");
  startTimer();
  renderCurrentQuestion();
  renderQuestionPalette();
}

function startMockExam() {
  sound.playClick();
  // Use the scored-content domain proportions (rounded to 65 practice questions).
  // This mock does not reproduce AWS's 50 scored + 15 unscored selection.
  const targetCounts = { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 };
  const shuffled = Object.entries(targetCounts).flatMap(([domainId, count]) =>
    QUESTIONS_DATA
      .filter(q => q.domainId === Number(domainId))
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  ).sort(() => Math.random() - 0.5);

  state.quizSession = {
    mode: "mock",
    domainId: null,
    questions: shuffled,
    currentIndex: 0,
    userAnswers: {},
    checkedAnswers: {},
    showTranslation: {},
    flagged: {},
    submitted: false,
    timerSeconds: 90 * 60, // 90 minutes full exam
    timerInterval: null
  };

  switchView("quiz");
  startTimer();
  renderCurrentQuestion();
  renderQuestionPalette();
}

function startTimer() {
  if (state.quizSession.timerInterval) {
    clearInterval(state.quizSession.timerInterval);
  }

  updateTimerDisplay();

  state.quizSession.timerInterval = setInterval(() => {
    if (state.quizSession.submitted) {
      clearInterval(state.quizSession.timerInterval);
      return;
    }

    state.quizSession.timerSeconds--;
    updateTimerDisplay();

    if (state.quizSession.timerSeconds <= 0) {
      clearInterval(state.quizSession.timerInterval);
      alert("Hết thời gian làm bài! Hệ thống sẽ tự động nộp bài.");
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("quiz-timer-display");
  if (!timerEl) return;

  const minutes = Math.floor(state.quizSession.timerSeconds / 60);
  const seconds = state.quizSession.timerSeconds % 60;
  timerEl.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getQuestionType(question) {
  return question.type || "single";
}

function isQuestionAnswered(question, answer) {
  if (answer === undefined || answer === null) return false;
  const type = getQuestionType(question);
  if (type === "single") return Number.isInteger(answer);
  if (!Array.isArray(answer)) return false;
  if (type === "multiple-response" || type === "ordering") return answer.length > 0;
  if (type === "matching") return answer.length === question.prompts.length && answer.every(value => Number.isInteger(value) && value >= 0);
  return false;
}

function isAnswerCorrect(question, answer) {
  if (!isQuestionAnswered(question, answer)) return false;
  const expected = question.correct;
  if (!Array.isArray(expected)) return answer === expected;
  return Array.isArray(answer) && answer.length === expected.length && answer.every((value, index) => value === expected[index]);
}

function formatCorrectAnswer(question) {
  if (getQuestionType(question) === "matching") {
    return question.prompts.map((prompt, index) => `${prompt.en} → ${question.matches[question.correct[index]].en}`).join("; ");
  }
  if (getQuestionType(question) === "ordering") {
    return question.correct.map(index => question.options[index].en).join(" → ");
  }
  const indexes = Array.isArray(question.correct) ? question.correct : [question.correct];
  return indexes.map(index => question.options[index].id).join(", ");
}

function renderQuestionInputs(question, answer, isChecked, isTranslated) {
  const type = getQuestionType(question);
  if (type === "matching") {
    const selected = Array.isArray(answer) ? answer : [];
    return `<div class="matching-list">${question.prompts.map((prompt, index) => {
      const isPairCorrect = isChecked && selected[index] === question.correct[index];
      const isPairWrong = isChecked && selected[index] !== question.correct[index];
      return `
      <label class="matching-row ${isPairCorrect ? "correct" : ""} ${isPairWrong ? "wrong" : ""}"><span><strong>${prompt.id}.</strong> ${prompt.en}${isTranslated ? `<small>${prompt.vi}</small>` : ""}</span>
      <select ${isChecked ? "disabled" : ""} onchange="selectMatch(${index}, this.value)">
        <option value="">Chọn mục ghép</option>
        ${question.matches.map((item, matchIndex) => `<option value="${matchIndex}" ${selected[index] === matchIndex ? "selected" : ""}>${item.en}${isTranslated ? ` — ${item.vi}` : ""}</option>`).join("")}
      </select>${isChecked ? `<small class="matching-result">${isPairCorrect ? "Đúng" : `Đáp án: ${question.matches[question.correct[index]].en}`}</small>` : ""}</label>`;
    }).join("")}</div>`;
  }

  const order = type === "ordering"
    ? (Array.isArray(answer) ? answer : question.options.map((_, index) => index))
    : null;
  const selected = type === "multiple-response" || type === "ordering"
    ? (Array.isArray(answer) ? answer : [])
    : [];

  if (type === "ordering") {
    return `<div class="options-list">${order.map((optionIndex, position) => {
      const option = question.options[optionIndex];
      const expectedPosition = question.correct.indexOf(optionIndex);
      const correctHere = isChecked && expectedPosition === position;
      const wrongHere = isChecked && expectedPosition !== position;
      return `<div class="option-item ${correctHere ? "correct" : ""} ${wrongHere ? "wrong" : ""}">
        <div class="option-left-content"><span class="order-number">${position + 1}</span><div class="option-text-wrap"><div class="option-en">${option.en}</div>${isTranslated ? `<div class="option-vi">${option.vi}</div>` : ""}</div></div>
        ${!isChecked ? `<div class="order-controls"><button type="button" onclick="moveOrderingItem('${question.id}', ${position}, -1)" ${position === 0 ? "disabled" : ""} aria-label="Move up">↑</button><button type="button" onclick="moveOrderingItem('${question.id}', ${position}, 1)" ${position === order.length - 1 ? "disabled" : ""} aria-label="Move down">↓</button></div>` : (correctHere ? "✔" : "✖")}
      </div>`;
    }).join("")}</div>`;
  }

  return `<div class="options-list">${question.options.map((option, optionIndex) => {
    const isSelected = type === "single" ? answer === optionIndex : selected.includes(optionIndex);
    const isCorrectOption = Array.isArray(question.correct) ? question.correct.includes(optionIndex) : question.correct === optionIndex;
    const extraClass = `${isSelected ? "selected" : ""} ${isChecked && isCorrectOption ? "correct" : ""} ${isChecked && isSelected && !isCorrectOption ? "wrong" : ""}`;
    const marker = type === "multiple-response" ? "checkbox" : "radio";
    return `<div class="option-item ${extraClass}" onclick="selectQuizOption(${optionIndex})" role="${marker === "checkbox" ? "checkbox" : "radio"}" aria-checked="${isSelected}" tabindex="0">
      <div class="option-left-content"><div class="option-${marker}"></div><div class="option-text-wrap"><div class="option-en">${option.en}</div>${isTranslated ? `<div class="option-vi">${option.vi}</div>` : ""}</div></div>
      ${isChecked && isCorrectOption ? `<span class="option-result-icon correct">✔</span>` : isChecked && isSelected ? `<span class="option-result-icon wrong">✖</span>` : ""}
    </div>`;
  }).join("")}</div>`;
}

function renderCurrentQuestion() {
  const mainCard = document.getElementById("quiz-main-card");
  if (!mainCard) return;

  const { questions, currentIndex, userAnswers, flagged, submitted, mode } = state.quizSession;
  const q = questions[currentIndex];

  if (!q) {
    mainCard.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <div class="stat-icon orange" style="margin: 0 auto 1.5rem auto; width: 64px; height: 64px;">
          <i data-lucide="check-square" style="width: 36px; height: 36px;"></i>
        </div>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Trung Tâm Luyện Trắc Nghiệm AIF-C01</h2>
        <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem auto;">
          Chọn chế độ thi thử toàn diện 65 câu tính giờ như thi thật hoặc ôn tập theo từng Domain độc lập với giải thích chi tiết ngay lập tức.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; text-align: left; max-width: 850px; margin: 0 auto;">
          <div class="domain-card" style="border-color: var(--aws-orange); background: var(--aws-orange-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="domain-pill" style="background: var(--aws-orange); color: white;">KHUYÊN DÙNG</span>
              <span class="domain-weight">90 Phút</span>
            </div>
            <h4>Thi Thử Toàn Diện (65 Câu)</h4>
            <p class="summary">Bài luyện 65 câu trong 90 phút, lấy theo tỷ trọng 5 domain. AWS có 50 câu tính điểm và 15 câu không tính điểm; điểm luyện tập chỉ là ước lượng, không phải scaled score của AWS.</p>
            <button class="btn-primary" style="width: 100%; justify-content: center;" onclick="startMockExam()">
              <i data-lucide="play"></i> Bắt đầu thi thử 65 câu
            </button>
          </div>

          ${THEORY_DATA.slice(0, 5).map(dom => {
            const count = QUESTIONS_DATA.filter(q => q.domainId === dom.domainNumber).length;
            return `
              <div class="domain-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span class="domain-pill" style="background: ${dom.color}18; color: ${dom.color};">DOMAIN ${dom.domainNumber} (${dom.weight})</span>
                  <span class="domain-weight" style="color: ${dom.color}; font-weight: 700;">${count} câu</span>
                </div>
                <h4>${dom.titleVi}</h4>
                <p class="summary">${dom.summary}</p>
                <button class="btn-learn" style="width: 100%; justify-content: center;" onclick="startDomainQuiz(${dom.domainNumber})">
                  <i data-lucide="play"></i> Luyện Domain ${dom.domainNumber} (${count} câu)
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
    refreshIcons();
    return;
  }

  const isBookmarked = state.bookmarks.includes(q.id);
  const isFlagged = !!flagged[q.id];
  const selectedOption = userAnswers[q.id];
  const questionType = getQuestionType(q);
  const isAnswered = isQuestionAnswered(q, selectedOption);
  const isCorrect = isAnswerCorrect(q, selectedOption);
  
  // Track if this question has been checked via "Kiểm tra đáp án" or if exam was submitted
  state.quizSession.checkedAnswers = state.quizSession.checkedAnswers || {};
  state.quizSession.showTranslation = state.quizSession.showTranslation || {};
  const isChecked = !!state.quizSession.checkedAnswers[q.id] || submitted;
  const isTranslated = !!state.quizSession.showTranslation[q.id];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  mainCard.innerHTML = `
    <div>
      <!-- Top Progress Bar (DevCloudly Style) -->
      <div class="exam-progress-bar-wrap">
        <div class="exam-progress-track">
          <div class="exam-progress-fill" style="width: ${progressPct}%;"></div>
        </div>
        <span class="exam-progress-text">${currentIndex + 1} / ${questions.length}</span>
        <button class="btn-secondary" style="color: #0284c7; border-color: #bae6fd; font-weight: 700; padding: 0.35rem 0.85rem;" onclick="submitQuiz()">
          Nộp bài
        </button>
      </div>

      <!-- Question Title & Status Bar -->
      <div class="quiz-header-bar">
        <div class="q-title-left">
          <button class="icon-btn" onclick="toggleBookmark('${q.id}')" title="Lưu câu hỏi">
            <i data-lucide="bookmark" style="${isBookmarked ? 'fill: var(--aws-orange); color: var(--aws-orange);' : ''}"></i>
          </button>
          <h3>Câu hỏi ${currentIndex + 1}</h3>
          ${!isChecked ? 
            (isAnswered ? '<span class="q-status-badge pending" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">Đã chọn &bull; Chờ kiểm tra</span>' : '<span class="q-status-badge pending">Chưa làm</span>') : 
            (isAnswered ? (isCorrect ? '<span class="q-status-badge correct">Chính xác</span>' : '<span class="q-status-badge wrong">Không chính xác</span>') : '<span class="q-status-badge wrong">Chưa trả lời</span>')}
        </div>
        <div class="quiz-meta-actions">
          <button class="btn-flag ${isFlagged ? 'flagged' : ''}" onclick="toggleFlagQuestion('${q.id}')">
            <i data-lucide="flag"></i> ${isFlagged ? 'Đã gắn cờ' : 'Gắn cờ'}
          </button>
        </div>
      </div>

      <!-- Service Tags & Translation Toggle -->
      <div class="service-tags-row" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="service-tag-pill">${q.service}</span>
          <span class="service-tag-pill">Domain ${q.domainId}: ${q.domainName}</span>
          <span class="service-tag-pill">AIF-C01</span>
        </div>
        <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.3rem 0.75rem; border-color: #bae6fd; background: #f0f9ff; color: #0284c7; display: inline-flex; align-items: center; gap: 0.35rem;" onclick="toggleTranslation('${q.id}')">
          <i data-lucide="languages" style="width: 14px; height: 14px;"></i>
          ${isTranslated ? 'Ẩn bản dịch' : 'Dịch tiếng Việt'}
        </button>
      </div>

      <!-- Question Text (Full Authentic English by Default) -->
      <div class="question-en">${q.questionEn}</div>
      <div class="question-type-hint">${questionType === "multiple-response" ? "Chọn tất cả đáp án đúng" : questionType === "ordering" ? "Sắp xếp các bước theo đúng thứ tự" : questionType === "matching" ? "Ghép từng mục ở cột trái với lựa chọn phù hợp" : "Chọn một đáp án đúng nhất"}</div>

      <!-- Vietnamese Translation Box (Shown only when toggled) -->
      ${isTranslated ? `
        <div class="question-vi" style="margin-bottom: 1.25rem;">
          <i data-lucide="languages" style="display: inline; vertical-align: middle; margin-right: 4px; width: 16px;"></i>
          <strong>Bản dịch câu hỏi:</strong> ${q.questionVi}
        </div>
      ` : ''}

      <!-- Options List (Full English by default) -->
      ${renderQuestionInputs(q, selectedOption, isChecked, isTranslated)}

      <!-- Check Answer Button (Bấm vào đây để kiểm tra và hiện giải thích chi tiết) -->
      ${!isChecked ? `
        <div style="margin: 1.25rem 0;">
          <button class="btn-primary" style="background: #0284c7; border-color: #0284c7; font-size: 0.95rem; padding: 0.7rem 1.5rem;" onclick="checkCurrentAnswer()">
            <i data-lucide="check-circle-2"></i> Kiểm tra đáp án (Check Answer)
          </button>
          <span style="margin-left: 0.75rem; font-size: 0.85rem; color: var(--text-dim);">
            ${isAnswered ? 'Nhấn để xem giải thích và phân tích' : questionType === "multiple-response" ? 'Chọn đủ các phương án rồi kiểm tra' : questionType === "ordering" ? 'Dùng nút lên/xuống để sắp xếp rồi kiểm tra' : questionType === "matching" ? 'Ghép tất cả các mục rồi kiểm tra' : 'Chọn một đáp án rồi kiểm tra'}
          </span>
        </div>
      ` : ''}

      <!-- Explanation Card (Detailed English + Vietnamese + Why Wrong Analysis) -->
      ${isChecked ? `
        <div class="explanation-card">
          <div class="explanation-header ${isCorrect ? 'correct' : 'wrong'}">
            <i data-lucide="${isCorrect ? 'check-circle-2' : 'alert-circle'}"></i>
            ${isCorrect ? 'Chính xác!' : `Chưa chính xác &bull; Đáp án đúng: ${formatCorrectAnswer(q)}`}
          </div>
          <div class="exp-section">
            <strong>✅ Vì sao đáp án đúng:</strong>
            <p style="margin-bottom: 0.4rem;">${q.explanation.correctReason}</p>
          </div>
          <div class="exp-section">
            <strong>❌ Tại sao các đáp án còn lại sai (Chi tiết phân tích từng lựa chọn):</strong>
            <p style="white-space: pre-line;">${q.explanation.incorrectReason}</p>
          </div>
          <div class="exp-tip-box">
            <strong>💡 Từ khóa tình huống:</strong> ${q.explanation.examTip}
          </div>
        </div>
      ` : ''}
    </div>

    <!-- DevCloudly Footer Navigation -->
    <div class="quiz-footer">
      <button class="btn-secondary" onclick="prevQuestion()" ${currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
        <i data-lucide="chevron-left"></i> Câu trước
      </button>

      <div>
        ${currentIndex === questions.length - 1 ? `
          <button class="btn-green-next" onclick="submitQuiz()">
            <i data-lucide="send"></i> Nộp bài thi
          </button>
        ` : `
          <button class="btn-green-next" onclick="nextQuestion()">
            Tiếp theo <i data-lucide="chevron-right"></i>
          </button>
        `}
      </div>
    </div>
  `;

  renderQuestionPalette();
  refreshIcons();
}

function selectQuizOption(optIdx) {
  const { questions, currentIndex, submitted } = state.quizSession;
  if (submitted) return;

  const q = questions[currentIndex];
  const type = getQuestionType(q);
  if (type === "multiple-response") {
    const selected = Array.isArray(state.quizSession.userAnswers[q.id]) ? [...state.quizSession.userAnswers[q.id]] : [];
    const existingIndex = selected.indexOf(optIdx);
    if (existingIndex >= 0) selected.splice(existingIndex, 1);
    else selected.push(optIdx);
    state.quizSession.userAnswers[q.id] = selected.sort((a, b) => a - b);
  } else if (type === "single") {
    state.quizSession.userAnswers[q.id] = optIdx;
  } else {
    return;
  }
  sound.playClick();

  renderCurrentQuestion();
}

function moveOrderingItem(questionId, position, delta) {
  const session = state.quizSession;
  if (session.submitted) return;
  const question = session.questions[session.currentIndex];
  if (!question || question.id !== questionId) return;
  const order = Array.isArray(session.userAnswers[questionId])
    ? [...session.userAnswers[questionId]]
    : question.options.map((_, index) => index);
  const target = position + delta;
  if (target < 0 || target >= order.length) return;
  [order[position], order[target]] = [order[target], order[position]];
  session.userAnswers[questionId] = order;
  sound.playClick();
  renderCurrentQuestion();
}

function selectMatch(promptIndex, value) {
  const session = state.quizSession;
  if (session.submitted) return;
  const question = session.questions[session.currentIndex];
  if (!question || getQuestionType(question) !== "matching") return;
  const matches = Array.isArray(session.userAnswers[question.id])
    ? [...session.userAnswers[question.id]]
    : Array(question.prompts.length).fill(-1);
  const nextValue = value === "" ? -1 : Number(value);
  if (nextValue >= 0) {
    matches.forEach((match, index) => {
      if (index !== promptIndex && match === nextValue) matches[index] = -1;
    });
  }
  matches[promptIndex] = nextValue;
  session.userAnswers[question.id] = matches;
  sound.playClick();
  renderCurrentQuestion();
}

function checkCurrentAnswer() {
  const { questions, currentIndex, userAnswers } = state.quizSession;
  const q = questions[currentIndex];
  if (!q) return;

  const selected = userAnswers[q.id];
  if (!isQuestionAnswered(q, selected)) {
    alert("Hãy hoàn thành lựa chọn/sắp xếp/ghép cặp trước khi kiểm tra.");
    return;
  }

  state.quizSession.checkedAnswers = state.quizSession.checkedAnswers || {};
  state.quizSession.checkedAnswers[q.id] = true;

  if (isAnswerCorrect(q, selected)) {
    sound.playCorrect();
  } else {
    sound.playWrong();
  }

  renderCurrentQuestion();
  renderQuestionPalette();
  updateReadinessBadge();
}

function toggleTranslation(qId) {
  state.quizSession.showTranslation = state.quizSession.showTranslation || {};
  state.quizSession.showTranslation[qId] = !state.quizSession.showTranslation[qId];
  sound.playClick();
  renderCurrentQuestion();
}

function prevQuestion() {
  if (state.quizSession.currentIndex > 0) {
    sound.playClick();
    state.quizSession.currentIndex--;
    renderCurrentQuestion();
  }
}

function nextQuestion() {
  if (state.quizSession.currentIndex < state.quizSession.questions.length - 1) {
    sound.playClick();
    state.quizSession.currentIndex++;
    renderCurrentQuestion();
  }
}

function jumpToQuestion(index) {
  sound.playClick();
  state.quizSession.currentIndex = index;
  renderCurrentQuestion();
}

function toggleFlagQuestion(qId) {
  sound.playClick();
  state.quizSession.flagged[qId] = !state.quizSession.flagged[qId];
  renderCurrentQuestion();
}

function toggleBookmark(qId) {
  sound.playClick();
  if (state.bookmarks.includes(qId)) {
    state.bookmarks = state.bookmarks.filter(id => id !== qId);
  } else {
    state.bookmarks.push(qId);
  }
  localStorage.setItem("aif_bookmarks", JSON.stringify(state.bookmarks));
  renderCurrentQuestion();
}

function filterPaletteQuestions(filterVal) {
  state.paletteFilter = filterVal;
  renderQuestionPalette();
}

function renderQuestionPalette() {
  const paletteGrid = document.getElementById("palette-buttons-grid");
  if (!paletteGrid) return;

  const { questions, currentIndex, userAnswers, flagged } = state.quizSession;

  if (!questions || !questions.length) {
    const counterEl = document.getElementById("sidebar-q-counter");
    if (counterEl) counterEl.innerText = "0 / 0";
    paletteGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem 0.5rem; color: var(--text-dim); font-size: 0.85rem;">
        <i data-lucide="layers" style="width: 28px; height: 28px; margin-bottom: 0.5rem; color: var(--aws-orange);"></i>
        <p>Vui lòng chọn bài thi bên phải để bắt đầu</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  // Update question counter e.g. "4 / 65"
  const answeredCount = Object.keys(userAnswers).length;
  const counterEl = document.getElementById("sidebar-q-counter");
  if (counterEl) {
    counterEl.innerText = `${answeredCount} / ${questions.length}`;
  }

  // Filter questions based on dropdown
  const filter = state.paletteFilter || "all";

  paletteGrid.innerHTML = questions.map((q, idx) => {
    // Filter logic
    let shouldShow = true;
    if (filter === "d1") shouldShow = q.domainId === 1;
    else if (filter === "d2") shouldShow = q.domainId === 2;
    else if (filter === "d3") shouldShow = q.domainId === 3;
    else if (filter === "d4") shouldShow = q.domainId === 4;
    else if (filter === "d5") shouldShow = q.domainId === 5;
    else if (filter === "pending") shouldShow = !isQuestionAnswered(q, userAnswers[q.id]);
    else if (filter === "correct") shouldShow = isAnswerCorrect(q, userAnswers[q.id]);
    else if (filter === "wrong") shouldShow = isQuestionAnswered(q, userAnswers[q.id]) && !isAnswerCorrect(q, userAnswers[q.id]);
    else if (filter === "flagged") shouldShow = !!flagged[q.id];

    if (!shouldShow) return "";

    let classes = "palette-btn";
    const isChecked = !!(state.quizSession.checkedAnswers && state.quizSession.checkedAnswers[q.id]) || state.quizSession.submitted;

    if (idx === currentIndex) {
      classes += " current";
    } else if (isChecked && isQuestionAnswered(q, userAnswers[q.id])) {
      if (isAnswerCorrect(q, userAnswers[q.id])) {
        classes += " correct";
      } else {
        classes += " wrong";
      }
    } else if (isQuestionAnswered(q, userAnswers[q.id])) {
      classes += " selected-pending"; // Highlighted as selected pending check
    }
    if (flagged[q.id]) classes += " flagged";

    return `
      <button class="${classes}" onclick="jumpToQuestion(${idx})" title="Câu ${idx + 1}">
        ${idx + 1}
      </button>
    `;
  }).join("");
}

function submitQuiz() {
  sound.playClick();
  if (state.quizSession.timerInterval) {
    clearInterval(state.quizSession.timerInterval);
  }

  state.quizSession.submitted = true;

  // Calculate score
  let correctCount = 0;
  const domainBreakdown = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 }, 4: { c: 0, t: 0 }, 5: { c: 0, t: 0 } };

  state.quizSession.questions.forEach(q => {
    domainBreakdown[q.domainId].t++;
    if (isAnswerCorrect(q, state.quizSession.userAnswers[q.id])) {
      correctCount++;
      domainBreakdown[q.domainId].c++;
    }
  });

  const total = state.quizSession.questions.length;
  // Report raw practice accuracy; AWS scaled scores cannot be inferred from this bank.
  const practicePercent = Math.round((correctCount / total) * 100);

  // Save history
  state.examHistory.push({
    date: new Date().toLocaleDateString("vi-VN"),
    score: practicePercent,
    correctCount,
    total,
    passed: null,
    isPracticeResult: true
  });
  localStorage.setItem("aif_exam_history", JSON.stringify(state.examHistory));

  // Show Modal Result
  showExamResultModal({
    practicePercent,
    correctCount,
    total,
    domainBreakdown
  });

  renderCurrentQuestion();
}

function showExamResultModal(result) {
  const modal = document.getElementById("exam-result-modal");
  if (!modal) return;

  sound.playClick();

  modal.innerHTML = `
    <div class="modal-box">
      <div class="score-badge-circle">
        <span class="score-num" style="color: var(--aws-orange);">
          ${result.practicePercent}%
        </span>
        <span class="score-max">đúng</span>
      </div>

      <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">
        KẾT QUẢ LUYỆN TẬP
      </h3>
      <p style="color: var(--text-muted); margin-bottom: 1.25rem;">
        Bạn làm đúng <strong>${result.correctCount} / ${result.total} câu</strong>. Đây là tỷ lệ đúng trên bộ câu hỏi luyện tập, không phải điểm scaled của AWS và không xác định đỗ/trượt. Dùng kết quả từng domain để chọn phần cần ôn lại.
      </p>

      <div class="domain-breakdown-list">
        ${Object.keys(result.domainBreakdown).map(dId => {
          const item = result.domainBreakdown[dId];
          if (!item || item.t === 0) return '';
          const pct = Math.round((item.c / item.t) * 100);
          const domObj = THEORY_DATA.find(d => d.domainNumber === parseInt(dId));
          const domTitle = domObj ? domObj.titleVi : `Domain ${dId}`;
          return `
            <div class="db-item">
              <span>Domain ${dId}: ${domTitle}</span>
              <strong style="color: ${pct >= 70 ? 'var(--accent-green-text)' : 'var(--accent-rose-text)'};">
                ${item.c}/${item.t} (${pct}%)
              </strong>
            </div>
          `;
        }).join("")}
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <button class="btn-primary" onclick="closeResultModal()">
          <i data-lucide="check"></i> Xem lại đáp án chi tiết
        </button>
        <button class="btn-secondary" onclick="startMockExam()">
          <i data-lucide="rotate-ccw"></i> Thi lại đề mới
        </button>
      </div>
    </div>
  `;

  modal.classList.add("active");
  refreshIcons();
}

function closeResultModal() {
  const modal = document.getElementById("exam-result-modal");
  if (modal) modal.classList.remove("active");
}

// ===================================================================
// FLASHCARDS ENGINE
// ===================================================================
function renderFlashcards() {
  const container = document.getElementById("flashcards-card-scene");
  if (!container) return;

  const filteredCards = FLASHCARDS_DATA.filter(c => {
    if (state.flashcardDomainFilter === "all") return true;
    return c.domainId === parseInt(state.flashcardDomainFilter);
  });

  if (!filteredCards.length) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có flashcard nào trong mục này.</p>`;
    return;
  }

  if (state.flashcardIndex >= filteredCards.length) {
    state.flashcardIndex = 0;
  }

  const current = filteredCards[state.flashcardIndex];
  const isMastered = state.masteredFlashcards.includes(current.id);

  container.innerHTML = `
    <div class="fc-card ${state.flashcardFlipped ? 'is-flipped' : ''}" onclick="flipFlashcard()">
      <!-- Face Front -->
      <div class="fc-face fc-front">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="fc-category-badge">Domain ${current.domainId} &bull; ${current.category}</span>
          <span style="font-size: 0.8rem; color: var(--text-dim); font-weight: 700;">
            ${state.flashcardIndex + 1} / ${filteredCards.length}
          </span>
        </div>
        <div>
          <div class="fc-term-main">${current.term}</div>
          <div class="fc-term-vi">${current.termVi}</div>
        </div>
        <div class="fc-flip-hint">
          <i data-lucide="rotate-3d"></i> Chạm hoặc nhấp chuột để lật mặt sau
        </div>
      </div>

      <!-- Face Back -->
      <div class="fc-face fc-back">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="fc-category-badge" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-green);">
            Ý nghĩa & Từ khóa đề thi
          </span>
          <span style="font-size: 0.8rem; color: var(--text-dim); font-weight: 700;">
            ${state.flashcardIndex + 1} / ${filteredCards.length}
          </span>
        </div>
        <div class="fc-definition-text">
          ${current.definition}
        </div>
        <div class="fc-exam-keyword-box">
          <strong>🎯 Từ khóa nhận diện đề thi:</strong> ${current.examKeyword}
        </div>
      </div>
    </div>
  `;

  // Update progress text
  const progressText = document.getElementById("fc-mastered-counter");
  if (progressText) {
    progressText.innerText = `${state.masteredFlashcards.length} / ${FLASHCARDS_DATA.length} thẻ đã thuộc`;
  }

  refreshIcons();
}

function flipFlashcard() {
  sound.playClick();
  state.flashcardFlipped = !state.flashcardFlipped;
  const card = document.querySelector(".fc-card");
  if (card) card.classList.toggle("is-flipped", state.flashcardFlipped);
}

function prevFlashcard() {
  sound.playClick();
  state.flashcardFlipped = false;
  if (state.flashcardIndex > 0) {
    state.flashcardIndex--;
  } else {
    state.flashcardIndex = FLASHCARDS_DATA.length - 1;
  }
  renderFlashcards();
}

function nextFlashcard() {
  sound.playClick();
  state.flashcardFlipped = false;
  if (state.flashcardIndex < FLASHCARDS_DATA.length - 1) {
    state.flashcardIndex++;
  } else {
    state.flashcardIndex = 0;
  }
  renderFlashcards();
}

function markFlashcard(mastered) {
  const current = FLASHCARDS_DATA[state.flashcardIndex];
  if (!current) return;

  if (mastered) {
    sound.playCorrect();
    if (!state.masteredFlashcards.includes(current.id)) {
      state.masteredFlashcards.push(current.id);
    }
  } else {
    sound.playClick();
    state.masteredFlashcards = state.masteredFlashcards.filter(id => id !== current.id);
  }

  localStorage.setItem("aif_mastered_fc", JSON.stringify(state.masteredFlashcards));
  nextFlashcard();
}

function filterFlashcards(domainId) {
  sound.playClick();
  state.flashcardDomainFilter = domainId;
  state.flashcardIndex = 0;
  state.flashcardFlipped = false;
  renderFlashcards();
}

// ===================================================================
// CHEAT SHEET & SERVICES DIRECTORY
// ===================================================================
function renderCheatSheet() {
  const servicesGrid = document.getElementById("cheat-services-grid");
  if (!servicesGrid) return;

  servicesGrid.innerHTML = CHEATSHEET_DATA.serviceMatrix.map(item => `
    <div class="cheat-card">
      <h5>${item.service}</h5>
      <p style="font-size: 0.88rem; color: var(--text-muted);">${item.purpose}</p>
      <div class="cheat-keywords">
        <i data-lucide="tag" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i>
        ${item.keywords}
      </div>
    </div>
  `).join("");

  // Golden Exam Tips
  const tipsGrid = document.getElementById("cheat-tips-grid");
  if (tipsGrid) {
    tipsGrid.innerHTML = CHEATSHEET_DATA.goldenExamTips.map(tip => `
      <div class="cheat-card" style="border-left: 4px solid var(--aws-orange);">
        <h5 style="color: var(--aws-orange);">${tip.title}</h5>
        <p style="font-size: 0.9rem; line-height: 1.6;">${tip.desc}</p>
      </div>
    `).join("");
  }

  // Hyperparameters
  const paramsGrid = document.getElementById("cheat-params-grid");
  if (paramsGrid) {
    paramsGrid.innerHTML = CHEATSHEET_DATA.hyperparameters.map(hp => `
      <div class="cheat-card">
        <h5 style="color: var(--accent-violet);">${hp.name}</h5>
        <p><strong>Hành vi:</strong> ${hp.behavior}</p>
        <p style="margin-top: 0.4rem; color: var(--accent-green); font-size: 0.85rem;">
          <strong>🎯 Tình huống chọn:</strong> ${hp.bestFor}
        </p>
      </div>
    `).join("");
  }

  refreshIcons();
}

function filterCheatSheet(query) {
  const cards = document.querySelectorAll(".cheat-grid .cheat-card");
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
}

// ===================================================================
// BOOKMARKS VIEW
// ===================================================================
function renderBookmarksView() {
  const container = document.getElementById("bookmarks-content-panel");
  if (!container) return;

  if (state.bookmarks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i data-lucide="bookmark" style="width: 56px; height: 56px; color: var(--text-dim); margin-bottom: 1rem;"></i>
        <h3>Chưa có câu hỏi nào được lưu</h3>
        <p>Khi làm bài luyện tập hoặc thi thử, bạn có thể bấm biểu tượng Bookmark để lưu lại những câu cần ôn tập kỹ!</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  const bookmarkedQuestions = QUESTIONS_DATA.filter(q => state.bookmarks.includes(q.id));

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3>Danh sách ${bookmarkedQuestions.length} câu hỏi cần lưu ý</h3>
      <button class="btn-primary" onclick="practiceBookmarkedQuestions()">
        <i data-lucide="play"></i> Luyện riêng các câu này
      </button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${bookmarkedQuestions.map((q, idx) => `
        <div class="cheat-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <span class="domain-pill" style="background: rgba(255, 153, 0, 0.2); color: var(--aws-orange);">
              Domain ${q.domainId} &bull; ${q.service}
            </span>
            <button class="icon-btn" onclick="toggleBookmark('${q.id}'); renderBookmarksView();" title="Bỏ lưu">
              <i data-lucide="trash-2" style="color: var(--accent-rose); width: 16px;"></i>
            </button>
          </div>
          <div style="font-weight: 700; margin-bottom: 0.4rem;">${idx + 1}. ${q.questionEn}</div>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">${q.questionVi}</div>
          <div class="exp-tip-box" style="margin-top: 0.5rem;">
            <strong>Dạng câu hỏi:</strong> ${{single: "Chọn một", "multiple-response": "Chọn nhiều", ordering: "Sắp xếp", matching: "Ghép cặp"}[getQuestionType(q)]}<br>
            <strong>Đáp án chuẩn:</strong> ${formatCorrectAnswer(q)}<br>
            <strong>Mẹo thi:</strong> ${q.explanation.examTip}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  refreshIcons();
}

function practiceBookmarkedQuestions() {
  const bookmarkedQuestions = QUESTIONS_DATA.filter(q => state.bookmarks.includes(q.id));
  if (!bookmarkedQuestions.length) return;

  state.quizSession = {
    mode: "domain",
    domainId: null,
    questions: bookmarkedQuestions,
    currentIndex: 0,
    userAnswers: {},
    checkedAnswers: {},
    showTranslation: {},
    flagged: {},
    submitted: false,
    timerSeconds: bookmarkedQuestions.length * 90,
    timerInterval: null
  };

  switchView("quiz");
  startTimer();
  renderCurrentQuestion();
  renderQuestionPalette();
}
