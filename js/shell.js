/* ============================================================
   KARIS MIND — Shell Functions
   js/shell.js

   Functions that run on every page — they control the
   permanent elements: sidebar, topbar, modal, toast, runner.

   Called by:
   - index.html boot script (initShell)
   - KarisRouter (setActiveNav, setBreadcrumb)
   - Page files (openModal, closeModal, openRunner, showTab)
   ============================================================ */


/* ──────────────────────────────────────────────────────────
   SIDEBAR — COLLAPSE / EXPAND
────────────────────────────────────────────────────────── */

let _sidebarCollapsed = false;

function toggleSidebar() {
  _sidebarCollapsed = !_sidebarCollapsed;
  const sidebar = document.getElementById('sidebar');
  const icon    = document.getElementById('collapse-icon');

  sidebar.classList.toggle('collapsed', _sidebarCollapsed);

  /*
    Flip the chevron icon direction:
    Expanded  → pointing left  (<<)
    Collapsed → pointing right (>>)
  */
  icon.innerHTML = _sidebarCollapsed
    ? `<path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/>`   /* >> */
    : `<path d="M11 19l-7-7 7-7"/><path d="M19 19l-7-7 7-7"/>`;  /* << */

  /* Persist across sessions */
  try { localStorage.setItem('km-sidebar-collapsed', _sidebarCollapsed); } catch(e) {}
}

function _restoreSidebarState() {
  try {
    const saved = localStorage.getItem('km-sidebar-collapsed');
    if (saved === 'true') {
      _sidebarCollapsed = true;
      const sidebar = document.getElementById('sidebar');
      const icon    = document.getElementById('collapse-icon');
      if (sidebar) sidebar.classList.add('collapsed');
      if (icon) icon.innerHTML = `<path d="M13 5l7 7-7 7"/><path d="M5 5l7 7-7 7"/>`;
    }
  } catch(e) {}
}


/* ──────────────────────────────────────────────────────────
   ACTIVE NAV ITEM
   Called by KarisRouter on every page change.
────────────────────────────────────────────────────────── */

function setActiveNav(pageId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === pageId) {
      item.classList.add('active');
    }
  });
}


/* ──────────────────────────────────────────────────────────
   BREADCRUMB
   Called by KarisRouter on every page change.

   items = array of { label, pageId?, clientId? }
   Last item is always the current page (no link).
────────────────────────────────────────────────────────── */

function setBreadcrumb(items) {
  const el = document.getElementById('breadcrumb');
  if (!el || !items.length) return;

  el.innerHTML = items.map((item, i) => {
    const isLast = i === items.length - 1;

    if (isLast) {
      return `<span class="breadcrumb-item current">${item.label}</span>`;
    }

    /*
      Build the onclick for clickable breadcrumb items.
      Navigates back to a page or a specific client record.
    */
    let onclick = '';
    if (item.clientId) {
      onclick = `KarisRouter.goToClient('${item.clientId}')`;
    } else if (item.pageId) {
      onclick = `KarisRouter.go('${item.pageId}')`;
    }

    return `
      <span class="breadcrumb-item" onclick="${onclick}">${item.label}</span>
      <span class="breadcrumb-sep">/</span>
    `;
  }).join('');
}


/* ──────────────────────────────────────────────────────────
   MODAL
   Opens and closes modal dialogs by their backdrop element id.
────────────────────────────────────────────────────────── */

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

/* Close modal when clicking outside (on backdrop) */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});


/* ──────────────────────────────────────────────────────────
   TOAST NOTIFICATION
   Brief feedback message — bottom right of the screen.
   Auto-dismisses after `duration` ms.
────────────────────────────────────────────────────────── */

function showToast(message, duration) {
  duration = duration || 3000;
  const toast = document.getElementById('km-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function() {
    toast.classList.remove('show');
  }, duration);
}


/* ──────────────────────────────────────────────────────────
   INSTRUMENT RUNNER
   Full-screen focused mode for running instruments.
   The sidebar and topbar are hidden — only the runner shows.
────────────────────────────────────────────────────────── */

function openRunner(instrument) {
  const overlay = document.getElementById('runner-' + instrument);
  if (!overlay) {
    console.warn('[Shell] Runner not found: runner-' + instrument);
    return;
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';  /* Prevent background scroll */
}

function closeRunner(instrument, returnToTab) {
  const overlay = document.getElementById('runner-' + instrument);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  /* Navigate back to the relevant instrument tab */
  if (returnToTab) {
    showTab(returnToTab);
  }
}


/* ──────────────────────────────────────────────────────────
   TAB SWITCHING
   Used on client record and other tabbed screens.
   showTab(tabId) shows the matching .tab-panel and marks
   the matching .tab as active.
────────────────────────────────────────────────────────── */

function showTab(tabId) {
  /* Hide all panels */
  document.querySelectorAll('.tab-panel').forEach(function(p) {
    p.classList.remove('active');
  });

  /* Deactivate all tabs */
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.remove('active');
  });

  /* Show target panel */
  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');

  /* Mark target tab active */
  const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (tab) tab.classList.add('active');

  KarisState.currentTab = tabId;
}


/* ──────────────────────────────────────────────────────────
   LIKERT SELECTION
   Handles option selection within a Likert scale question.
   Clicking one option deselects all others in the same scale.
────────────────────────────────────────────────────────── */

function selectLikert(el) {
  const siblings = el.closest('.likert-scale').querySelectorAll('.likert-option');
  siblings.forEach(function(o) { o.classList.remove('selected'); });
  el.classList.add('selected');
}


/* ──────────────────────────────────────────────────────────
   KEYBOARD SUPPORT
   Allow Enter/Space to activate nav items and buttons.
────────────────────────────────────────────────────────── */

document.addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('sidebar-logo')) {
    e.preventDefault();
    KarisRouter.go('dashboard');
  }
});


/* ──────────────────────────────────────────────────────────
   INIT SHELL
   Called once on DOMContentLoaded from index.html.
   Sets up the permanent shell elements with real user data.
────────────────────────────────────────────────────────── */

function initShell() {
  const user = KarisState.user;

  /* Sidebar user strip */
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const sidebarName   = document.getElementById('sidebar-name');
  const sidebarRole   = document.getElementById('sidebar-role');
  if (sidebarAvatar) sidebarAvatar.textContent = user.initials;
  if (sidebarName)   sidebarName.textContent   = user.name;
  if (sidebarRole)   sidebarRole.textContent   = user.role;

  /* Topbar avatar */
  const topbarAvatar = document.getElementById('topbar-avatar');
  if (topbarAvatar) {
    topbarAvatar.textContent = user.initials;
    topbarAvatar.title       = user.name;
  }

  /* Restore sidebar collapsed state from last session */
  _restoreSidebarState();
}
