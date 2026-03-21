// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a nav link (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((el) => io.observe(el));

// Back to top
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (!toTop) return;
  toTop.style.display = window.scrollY > 500 ? "grid" : "none";
});
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Fake send button
document.getElementById("fakeSend")?.addEventListener("click", () => {
  alert("Message form is currently visual only. I can connect this to Formspree or an email workflow.");
});

/**
 * i18n Manager for Multi-language support
 */
class I18nManager {
  constructor() {
    this.languages = ['en', 'vi', 'th', 'ja', 'zh', 'ko', 'fil'];
    this.defaultLang = 'en';
    this.currentLang = this.getInitialLanguage();
    this.translations = {};
    
    this.init();
  }

  getInitialLanguage() {
    // 1. Check URL param
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && this.languages.includes(langParam)) return langParam;

    // 2. Check LocalStorage
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && this.languages.includes(saved)) return saved;

    // 3. Check Browser Language
    const browserLang = navigator.language.split('-')[0];
    if (this.languages.includes(browserLang)) return browserLang;

    return this.defaultLang;
  }

  async init() {
    await this.loadLanguage(this.currentLang);
    this.setupSwitcher();
    this.updateContent();
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      localStorage.setItem('selectedLanguage', lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error(`Could not load language ${lang}:`, error);
      if (lang !== this.defaultLang) {
        await this.loadLanguage(this.defaultLang);
      }
    }
  }

  updateContent() {
    const langData = this.translations[this.currentLang];
    const defaultData = this.translations[this.defaultLang];
    
    // Safety check: if no translation data is available (e.g., CORS error), exit silently
    if (!langData && !defaultData) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = (langData ? langData[key] : null) || (defaultData ? defaultData[key] : null);
      
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Update SEO tags safely
    const t = langData || defaultData;
    if (t) {
      if (t.seo_title) document.title = t.seo_title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && t.seo_description) metaDesc.content = t.seo_description;
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && t.seo_keywords) metaKeywords.content = t.seo_keywords;
    }

    this.updateSwitcherUI();
  }

  setupSwitcher() {
    const dropdown = document.querySelector('.lang-dropdown');
    const dropBtn = document.querySelector('.lang-drop-btn');
    const langBtns = document.querySelectorAll('.lang-btn');

    // Toggle Dropdown
    dropBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on click outside
    document.addEventListener('click', () => {
      dropdown?.classList.remove('open');
      dropBtn?.setAttribute('aria-expanded', 'false');
    });

    // Language selection
    langBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const lang = btn.getAttribute('data-lang');
        
        if (lang !== this.currentLang) {
          dropdown.classList.remove('open');
          dropBtn.setAttribute('aria-expanded', 'false');

          // Smooth transition effect
          document.body.style.transition = 'opacity 0.3s ease';
          document.body.style.opacity = '0';
          
          await this.loadLanguage(lang);
          this.updateContent();
          
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 50);
        }
      });
    });
  }

  updateSwitcherUI() {
    const currentBtn = document.querySelector(`.lang-btn[data-lang="${this.currentLang}"]`);
    const dropBtn = document.querySelector('.lang-drop-btn');
    
    if (currentBtn && dropBtn) {
      const flag = currentBtn.querySelector('span').textContent;
      const label = this.currentLang.toUpperCase();
      
      dropBtn.querySelector('.current-flag').textContent = flag;
      dropBtn.querySelector('.current-label').textContent = label;
      
      // Update active class in menu
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
      });
    }
  }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  new I18nManager();
});