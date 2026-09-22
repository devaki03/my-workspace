/**
 * Devika Wakode - Personal Portfolio & Project Showcase
 * Main Application Logic
 */

const GITHUB_USERNAME = 'devaki03';
let allProjects = [];
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initProjects();
  initContactForm();
  initBackToTop();
  updateCurrentYear();
});

/* -------------------------------------------------------------
 * 1. THEME SWITCHER (Dark / Light)
 * ------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* -------------------------------------------------------------
 * 2. MOBILE NAVIGATION
 * ------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* -------------------------------------------------------------
 * 3. GITHUB PROJECTS INTEGRATION
 * ------------------------------------------------------------- */
async function initProjects() {
  const container = document.getElementById('projects-grid');
  const searchInput = document.getElementById('project-search');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!container) return;

  // Show loading spinner / skeleton
  container.innerHTML = `
    <div class="projects-loading">
      <div class="spinner"></div>
      <p>Fetching repositories from GitHub...</p>
    </div>
  `;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    const repos = await response.json();
    
    // Filter out forks or keep meaningful projects
    allProjects = repos.map(repo => ({
      name: repo.name,
      description: repo.description || 'No description provided yet.',
      language: repo.language || 'Code',
      html_url: repo.html_url,
      homepage: repo.homepage,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      topics: repo.topics || []
    }));

    if (allProjects.length === 0) {
      allProjects = fallbackProjects;
    }
  } catch (error) {
    console.warn('Could not fetch from live GitHub API, using fallback data:', error);
    allProjects = (typeof fallbackProjects !== 'undefined') ? fallbackProjects : [];
  }

  // Populate language filter options dynamically
  setupFilters(allProjects);
  renderProjects(allProjects);

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterAndRender(e.target.value, activeFilter);
    });
  }

  // Filter button handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      const term = searchInput ? searchInput.value : '';
      filterAndRender(term, activeFilter);
    });
  });
}

function setupFilters(projects) {
  const filterContainer = document.getElementById('project-filters');
  if (!filterContainer) return;

  const languages = new Set();
  projects.forEach(p => {
    if (p.language && p.language !== 'Code') languages.add(p.language);
  });

  languages.forEach(lang => {
    const exists = filterContainer.querySelector(`[data-filter="${lang.toLowerCase()}"]`);
    if (!exists) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.setAttribute('data-filter', lang.toLowerCase());
      btn.textContent = lang;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = lang.toLowerCase();
        const searchInput = document.getElementById('project-search');
        filterAndRender(searchInput ? searchInput.value : '', activeFilter);
      });
      filterContainer.appendChild(btn);
    }
  });
}

function filterAndRender(searchTerm, filter) {
  const term = searchTerm.toLowerCase().trim();
  const filtered = allProjects.filter(project => {
    const matchesSearch = !term ||
      project.name.toLowerCase().includes(term) ||
      (project.description && project.description.toLowerCase().includes(term)) ||
      (project.language && project.language.toLowerCase().includes(term));
    
    const matchesFilter = filter === 'all' ||
      (project.language && project.language.toLowerCase() === filter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  renderProjects(filtered);
}

function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="no-projects">
        <p>No projects found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(project => {
    const languageBadge = project.language
      ? `<span class="badge badge-lang">${escapeHtml(project.language)}</span>`
      : '';
    
    const demoLink = project.homepage
      ? `<a href="${escapeHtml(project.homepage)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-accent" title="Live Preview">
           Live Demo ↗
         </a>`
      : '';

    return `
      <article class="project-card">
        <div class="project-card-header">
          <div class="project-type-icon">📦</div>
          <div class="project-stats">
            <span title="GitHub Stars">⭐ ${project.stargazers_count}</span>
            <span title="Forks">🍴 ${project.forks_count}</span>
          </div>
        </div>
        <h3 class="project-title">${escapeHtml(formatRepoName(project.name))}</h3>
        <p class="project-description">${escapeHtml(project.description)}</p>
        <div class="project-meta">
          ${languageBadge}
        </div>
        <div class="project-links">
          <a href="${escapeHtml(project.html_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
            Source Code
          </a>
          ${demoLink}
        </div>
      </article>
    `;
  }).join('');
}

function formatRepoName(name) {
  return name.replace(/[-_]/g, ' ');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* -------------------------------------------------------------
 * 4. CONTACT FORM
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const message = document.getElementById('contact-message')?.value || '';

      if (!name || !email || !message) {
        showFeedback('Please fill out all fields.', 'error');
        return;
      }

      // Simulate successful dispatch
      form.reset();
      showFeedback(`Thank you, ${name}! Your message has been prepared. You can also connect via GitHub.`, 'success');
    });
  }

  function showFeedback(text, type) {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }
}

/* -------------------------------------------------------------
 * 5. BACK TO TOP BUTTON
 * ------------------------------------------------------------- */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function updateCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
