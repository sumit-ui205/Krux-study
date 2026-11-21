/**
 * KRUX STUDY — Shared Navigation & Homepage Interactions
 */

import { clearAllStudyData, getStorageSummary } from './js/storage.js';

export function initNavigation() {
  const toggleBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggleBtn || !mobileNav) {
    return;
  }

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open navigation menu');
  };

  const openMenu = () => {
    mobileNav.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close navigation menu');
  };

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileNav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

function initToolFilters() {
  const filterBar = document.getElementById('tool-filter-bar');
  const toolsGrid = document.getElementById('tools-grid');

  if (!filterBar || !toolsGrid) {
    return;
  }

  const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));
  const cards = Array.from(toolsGrid.querySelectorAll('.tool-card'));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter || 'all';

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      toolsGrid.classList.toggle('is-filtered', category !== 'all');

      cards.forEach((card) => {
        const cardCat = card.dataset.category || '';
        const matches = category === 'all' || cardCat === category;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

function initStoragePanel() {
  const statsContainer = document.getElementById('local-storage-stats');
  const clearBtn = document.getElementById('clear-all-data-btn');
  const cancelBtn = document.getElementById('cancel-clear-btn');
  const feedback = document.getElementById('clear-data-feedback');

  if (!statsContainer || !clearBtn) {
    return;
  }

  let awaitingConfirm = false;

  const renderSummary = () => {
    const summary = getStorageSummary();
    statsContainer.innerHTML = `
      <span>Planner tasks: <strong>${summary.tasks}</strong></span>
      <span>Exams: <strong>${summary.exams}</strong></span>
      <span>Assignments: <strong>${summary.assignments}</strong></span>
      <span>Notes: <strong>${summary.notes}</strong></span>
    `;
  };

  renderSummary();

  clearBtn.addEventListener('click', () => {
    if (!awaitingConfirm) {
      awaitingConfirm = true;
      clearBtn.textContent = 'Confirm Clear All Data';
      if (cancelBtn) {
        cancelBtn.hidden = false;
      }
      if (feedback) {
        feedback.textContent = 'Click again to erase all locally saved KRUX STUDY records.';
      }
      return;
    }

    clearAllStudyData();
    awaitingConfirm = false;
    clearBtn.textContent = 'Clear Saved Browser Data';
    if (cancelBtn) {
      cancelBtn.hidden = true;
    }
    renderSummary();
    if (feedback) {
      feedback.textContent = 'All locally saved study data has been cleared.';
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      awaitingConfirm = false;
      clearBtn.textContent = 'Clear Saved Browser Data';
      cancelBtn.hidden = true;
      if (feedback) {
        feedback.textContent = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initToolFilters();
  initStoragePanel();
});
