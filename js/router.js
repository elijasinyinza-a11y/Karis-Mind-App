/* ============================================================
   KARIS MIND — Router
   js/router.js

   Handles all navigation between pages.
   Every page transition in the app goes through KarisRouter.

   How it works:
   1. KarisRouter.go(pageId) is called from nav items or links
   2. Router fetches the page HTML file from /pages/
   3. Injects it into #content in index.html
   4. Updates nav, breadcrumb, and page title
   5. Calls the page's init function if one exists

   Page init functions:
   Each page HTML file can define a function named
   init_[pageId]() — e.g. init_dashboard(), init_clients().
   The router calls it automatically after the page loads.
   Use it to populate the page with data from KarisState.
   ============================================================ */

const KarisRouter = {

  /* ──────────────────────────────────────────────────────────
     ROUTE DEFINITIONS
     Maps pageId → { file, breadcrumb, title }
  ────────────────────────────────────────────────────────── */
  routes: {
    'dashboard': {
      file:       'pages/dashboard.html',
      title:      'Dashboard — Karis Mind',
      breadcrumb: [{ label: 'Dashboard' }]
    },
    'clients': {
      file:       'pages/clients.html',
      title:      'Clients — Karis Mind',
      breadcrumb: [{ label: 'Clients' }]
    },
    'meetings': {
      file:       'pages/tools/meetings.html',
      title:      'Meeting Toolkit — Karis Mind',
      breadcrumb: [{ label: 'Meeting Toolkit' }]
    },
    'cascade': {
      file:       'pages/tools/cascade.html',
      title:      'Cascade — Karis Mind',
      breadcrumb: [{ label: 'Cascade' }]
    },
    'reports': {
      file:       'pages/tools/reports.html',
      title:      'Reports — Karis Mind',
      breadcrumb: [{ label: 'Reports' }]
    },
    'team': {
      file:       'pages/admin/team.html',
      title:      'Team — Karis Mind',
      breadcrumb: [{ label: 'Team' }]
    },
    'settings': {
      file:       'pages/admin/settings.html',
      title:      'Settings — Karis Mind',
      breadcrumb: [{ label: 'Settings' }]
    }
  },


  /* ──────────────────────────────────────────────────────────
     INIT
     Called once from index.html on DOMContentLoaded.
     Restores the last visited page from sessionStorage,
     or defaults to dashboard.
  ────────────────────────────────────────────────────────── */
  init() {
    this._contentEl = document.getElementById('content');

    const lastPage     = sessionStorage.getItem('km-page')     || 'dashboard';
    const lastClientId = sessionStorage.getItem('km-client-id');

    if (lastPage === 'client-record' && lastClientId) {
      const lastTab = sessionStorage.getItem('km-client-tab') || 'overview';
      this.goToClient(lastClientId, lastTab);
    } else {
      this.go(lastPage);
    }
  },


  /* ──────────────────────────────────────────────────────────
     GO — navigate to a standard page
  ────────────────────────────────────────────────────────── */
  async go(pageId) {
    const route = this.routes[pageId];

    /* Fallback to dashboard for unknown routes */
    if (!route) {
      console.warn('[Router] Unknown pageId:', pageId, '— falling back to dashboard');
      return this.go('dashboard');
    }

    /* Update state */
    KarisState.currentPage     = pageId;
    KarisState.currentClientId = null;

    /* Persist navigation */
    try {
      sessionStorage.setItem('km-page', pageId);
      sessionStorage.removeItem('km-client-id');
      sessionStorage.removeItem('km-client-tab');
    } catch(e) {}

    /* Load page HTML */
    await this._loadPage(route.file);

    /* Update shell */
    document.title = route.title;
    setActiveNav(pageId);
    setBreadcrumb(route.breadcrumb);

    /* Scroll content back to top */
    if (this._contentEl) this._contentEl.scrollTop = 0;

    /* Call page init function if defined */
    this._callPageInit(pageId);
  },


  /* ──────────────────────────────────────────────────────────
     GO TO CLIENT — navigate to a client record
  ────────────────────────────────────────────────────────── */
  async goToClient(clientId, tab) {
    tab = tab || 'overview';
    const client = KarisState.getClient(clientId);

    if (!client) {
      console.warn('[Router] Client not found:', clientId);
      return this.go('clients');
    }

    /* Update state */
    KarisState.currentPage     = 'client-record';
    KarisState.currentClientId = clientId;

    /* Persist navigation */
    try {
      sessionStorage.setItem('km-page',       'client-record');
      sessionStorage.setItem('km-client-id',  clientId);
      sessionStorage.setItem('km-client-tab', tab);
    } catch(e) {}

    /* Load the client record page template */
    await this._loadPage('pages/client-record.html');

    /* Update shell */
    document.title = client.name + ' — Karis Mind';
    setActiveNav('clients');
    setBreadcrumb([
      { label: 'Clients',   pageId: 'clients' },
      { label: client.name }
    ]);

    /* Scroll to top */
    if (this._contentEl) this._contentEl.scrollTop = 0;

    /* Init the client record page with this client's data */
    if (typeof init_client_record === 'function') {
      init_client_record(clientId, tab);
    }
  },


  /* ──────────────────────────────────────────────────────────
     INTERNAL: load page HTML into #content
  ────────────────────────────────────────────────────────── */
  async _loadPage(filePath) {
    if (!this._contentEl) {
      this._contentEl = document.getElementById('content');
    }

    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' — ' + filePath);
      }

      const html = await response.text();
      this._contentEl.innerHTML = html;

      /*
        CRITICAL: Browsers do NOT execute <script> tags that are
        inserted via innerHTML. We must find every script in the
        injected page and re-create it so it actually runs.
        This is what makes each page's init_[page]() function exist.
      */
      this._executeScripts(this._contentEl);

    } catch (err) {
      console.error('[Router] Failed to load page:', err);
      this._contentEl.innerHTML = `
        <div class="empty-state" style="margin-top: 80px">
          <div class="empty-state-icon">⚠</div>
          <div class="empty-state-title">Page could not be loaded</div>
          <div class="empty-state-sub">${err.message}</div>
          <button class="btn btn-primary" onclick="KarisRouter.go('dashboard')">
            Return to Dashboard
          </button>
        </div>
      `;
    }
  },


  /* ──────────────────────────────────────────────────────────
     INTERNAL: re-execute <script> tags from an injected page
     innerHTML does not run scripts — we clone each script into
     a fresh element and append it so the browser executes it.
  ────────────────────────────────────────────────────────── */
  _executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(function(oldScript) {
      const newScript = document.createElement('script');

      /* Copy any attributes (e.g. src, type) */
      Array.from(oldScript.attributes).forEach(function(attr) {
        newScript.setAttribute(attr.name, attr.value);
      });

      /* Copy the inline code */
      newScript.textContent = oldScript.textContent;

      /* Replace the old (inert) script with the new (live) one */
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },


  /* ──────────────────────────────────────────────────────────
     INTERNAL: call the page's init function if it exists
     Convention: function init_[pageId]() in the page HTML file.
     Hyphens in pageId are converted to underscores.
     e.g. 'client-record' → init_client_record()
  ────────────────────────────────────────────────────────── */
  _callPageInit(pageId) {
    const fnName = 'init_' + pageId.replace(/-/g, '_');
    if (typeof window[fnName] === 'function') {
      try {
        window[fnName]();
      } catch (err) {
        console.error('[Router] Error in ' + fnName + '():', err);
      }
    }
  }

};
