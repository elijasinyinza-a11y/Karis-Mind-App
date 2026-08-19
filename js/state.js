/* ============================================================
   KARIS MIND — App State
   js/state.js

   Central data store for the workspace.
   All demo data lives here during frontend-only phase.
   When the Supabase backend is live, KarisAPI calls (api.js)
   will populate this object from real database records.

   Rules:
   - No other file writes directly to KarisState properties
   - All reads go through KarisState helper methods where possible
   - When replacing demo data with real API data, update the
     shape here first so all page files continue to work
   ============================================================ */

const KarisState = {

  /* ──────────────────────────────────────────────────────────
     AUTHENTICATED USER
     Hardcoded for frontend phase.
     Replace with Supabase auth user object when backend is live.
  ────────────────────────────────────────────────────────── */
  user: {
    id:       'user-elijah-001',
    name:     'Elijah Nkonde',
    initials: 'EN',
    role:     'Org Admin',       /* Org Admin | Practitioner | Viewer */
    org:      'Karis Technologies (Pty) Ltd',
    email:    'elijah@karismind.com'
  },

  /* ──────────────────────────────────────────────────────────
     NAVIGATION STATE
     Tracks where the practitioner currently is.
     Updated by KarisRouter on every navigation.
  ────────────────────────────────────────────────────────── */
  currentPage:     'dashboard',
  currentClientId:  null,
  currentTab:       null,

  /* ──────────────────────────────────────────────────────────
     SUBDOMAIN URLS
     Instrument public-facing subdomains.
     Used in anchor tags across the workspace.
  ────────────────────────────────────────────────────────── */
  subdomains: {
    ocam:     'https://ocam.karismind.com',
    gold:     'https://gold.karismind.com',
    strategy: 'https://strategy.karismind.com'
  },

  /* ──────────────────────────────────────────────────────────
     CLIENTS
     Demo client records. Each client holds:
     - Identity: id, name, fullName, sector, location, contact
     - Status: active | dormant | new
     - Instrument state: status per instrument + key metrics
     - lastActivity: display date string

     Instrument status values:
       'not-started' — no run begun
       'in-progress' — run started but not complete
       'complete'    — at least one full run done

     When backend is live, this array is populated by:
     KarisAPI.getClients() → returns same shape from Supabase.
  ────────────────────────────────────────────────────────── */
  clients: [
    {
      id:           'lpwsc',
      name:         'LpWSC',
      fullName:     'Lusaka & Luapula Water and Sewerage Company',
      sector:       'Utilities',
      location:     'Nchelenge & Kafue Districts',
      contact: {
        name:  'Thandiwe Mwansa',
        email: 'tmwansa@lpwsc.zm'
      },
      status:       'active',
      lastActivity: '14 Aug 2026',
      notes:        'Nchelenge project is priority. Board review scheduled September. OCAM results needed before strategy work begins.',
      instruments: {
        ocam: {
          status:       'in-progress',
          lastRun:      '14 Aug 2026',
          progress:     '4 of 7 subscales',
          progressPct:  57,
          score:        3.6,                /* partial average so far */
          subscales: {
            clarity:       { score: 3.6, pct: 72 },
            cohesion:      { score: 3.2, pct: 64 },
            commitment:    { score: 4.0, pct: 80 },
            communication: { score: 3.0, pct: 60 },
            competence:    null,            /* not yet complete */
            creativity:    null,
            character:     null
          }
        },
        gold: {
          status:       'complete',
          lastRun:      '28 Jul 2026',
          participants: 6,
          groupScore:   72,
          band:         'Developing',
          individuals: [
            { initials: 'TM', name: 'Thandiwe Mwansa',   score: 84, band: 'Established' },
            { initials: 'CM', name: 'Charles Mwila',      score: 71, band: 'Developing' },
            { initials: 'NK', name: 'Nalishebo Kasonde',  score: 68, band: 'Developing' },
            { initials: 'BL', name: 'Bupe Lungu',         score: 75, band: 'Developing' },
            { initials: 'JM', name: 'John Mulenga',       score: 70, band: 'Developing' },
            { initials: 'SM', name: 'Stella Mutale',      score: 66, band: 'Foundation'  }
          ]
        },
        strategy: {
          status:   'not-started',
          lastRun:  null,
          stage:    0               /* 0 = not started, 1–7 = current stage */
        }
      },
      activity: [
        { type: 'ocam',   label: 'OCAM diagnostic started',     date: '14 Aug 2026', user: 'Elijah Nkonde' },
        { type: 'gold-i', label: 'GOLD assessment completed',   date: '28 Jul 2026', user: 'Elijah Nkonde' }
      ],
      reports: [
        { id: 'rpt-001', instrument: 'gold', label: 'GOLD™ Leadership Assessment — Round 1', date: '28 Jul 2026' }
      ]
    },

    {
      id:           'cec',
      name:         'Copperbelt Energy Corp',
      fullName:     'Copperbelt Energy Corporation PLC',
      sector:       'Energy',
      location:     'Kitwe',
      contact: {
        name:  'Charles Mwila',
        email: 'cmwila@cec.zm'
      },
      status:       'active',
      lastActivity: '11 Aug 2026',
      notes:        '',
      instruments: {
        ocam: {
          status:  'complete',
          lastRun: '5 Aug 2026',
          score:   3.9,
          subscales: {
            clarity:       { score: 4.0, pct: 80 },
            cohesion:      { score: 3.8, pct: 76 },
            commitment:    { score: 4.2, pct: 84 },
            communication: { score: 3.6, pct: 72 },
            competence:    { score: 3.9, pct: 78 },
            creativity:    { score: 3.7, pct: 74 },
            character:     { score: 4.2, pct: 84 }
          }
        },
        gold: {
          status:       'complete',
          lastRun:      '11 Aug 2026',
          participants: 4,
          groupScore:   78,
          band:         'Developing',
          individuals: [
            { initials: 'CM', name: 'Charles Mwila',    score: 82, band: 'Established' },
            { initials: 'PK', name: 'Patricia Kabwe',   score: 76, band: 'Developing'  },
            { initials: 'DM', name: 'Daniel Mutinta',   score: 74, band: 'Developing'  },
            { initials: 'RL', name: 'Ruth Lungu',       score: 80, band: 'Developing'  }
          ]
        },
        strategy: { status: 'not-started', lastRun: null, stage: 0 }
      },
      activity: [
        { type: 'gold-i', label: 'GOLD assessment completed',  date: '11 Aug 2026', user: 'Elijah Nkonde' },
        { type: 'ocam',   label: 'OCAM report generated',      date: '5 Aug 2026',  user: 'Elijah Nkonde' }
      ],
      reports: [
        { id: 'rpt-002', instrument: 'ocam',   label: 'OCAM™ Diagnostic Report — Round 1',     date: '5 Aug 2026'  },
        { id: 'rpt-003', instrument: 'gold-i', label: 'GOLD™ Leadership Assessment — Round 1', date: '11 Aug 2026' }
      ]
    },

    {
      id:           'zesco',
      name:         'ZESCO Limited',
      fullName:     'Zambia Electricity Supply Corporation',
      sector:       'Energy',
      location:     'Lusaka',
      contact: {
        name:  'Nalishebo Kasonde',
        email: 'nkasonde@zesco.co.zm'
      },
      status:       'active',
      lastActivity: '8 Aug 2026',
      notes:        '',
      instruments: {
        ocam:     { status: 'not-started', lastRun: null },
        gold:     { status: 'not-started', lastRun: null },
        strategy: {
          status:  'in-progress',
          lastRun: '8 Aug 2026',
          stage:   3,              /* Currently on stage 3: Confirmation */
          stages: [
            { name: 'Conception',   done: true  },
            { name: 'Consultation', done: true  },
            { name: 'Confirmation', done: false, current: true },
            { name: 'Composition',  done: false },
            { name: 'Communication',done: false },
            { name: 'Coordination', done: false },
            { name: 'Controlling',  done: false }
          ]
        }
      },
      activity: [
        { type: 'strategy', label: 'Strategy — Confirmation stage started', date: '8 Aug 2026', user: 'Elijah Nkonde' }
      ],
      reports: []
    },

    {
      id:           'zanaco',
      name:         'ZANACO',
      fullName:     'Zambia National Commercial Bank',
      sector:       'Financial Services',
      location:     'Lusaka',
      contact:      null,
      status:       'new',
      lastActivity: '1 Aug 2026',
      notes:        '',
      instruments: {
        ocam:     { status: 'not-started', lastRun: null },
        gold:     { status: 'not-started', lastRun: null },
        strategy: { status: 'not-started', lastRun: null, stage: 0 }
      },
      activity: [
        { type: 'system', label: 'Client record created', date: '1 Aug 2026', user: 'Elijah Nkonde' }
      ],
      reports: []
    }
  ],

  /* ──────────────────────────────────────────────────────────
     GLOBAL ACTIVITY FEED (dashboard)
     Most recent actions across all clients.
     In live app: fetched from activity_log table.
  ────────────────────────────────────────────────────────── */
  recentActivity: [
    { type: 'ocam',     label: 'OCAM diagnostic started',              client: 'LpWSC',                 date: '14 Aug 2026' },
    { type: 'gold-i',   label: 'GOLD assessment completed',            client: 'Copperbelt Energy Corp', date: '11 Aug 2026' },
    { type: 'strategy', label: 'Strategy — Confirmation stage started', client: 'ZESCO Limited',         date: '8 Aug 2026'  },
    { type: 'ocam',     label: 'OCAM report generated',                client: 'Copperbelt Energy Corp', date: '5 Aug 2026'  }
  ],

  /* ──────────────────────────────────────────────────────────
     MEETINGS
     Demo meeting records for Meeting Toolkit page.
  ────────────────────────────────────────────────────────── */
  meetings: [
    { id: 'mtg-001', date: '20 Aug 2026', title: 'OCAM feedback session',              instrument: 'ocam',     clientId: 'lpwsc',  status: 'planned'  },
    { id: 'mtg-002', date: '14 Aug 2026', title: 'GOLD debrief — leadership team',     instrument: 'gold-i',   clientId: 'cec',    status: 'complete' },
    { id: 'mtg-003', date: '8 Aug 2026',  title: 'Strategy — Confirmation stage session', instrument: 'strategy', clientId: 'zesco', status: 'complete' }
  ],

  /* ──────────────────────────────────────────────────────────
     TEAM MEMBERS
  ────────────────────────────────────────────────────────── */
  team: [
    { initials: 'EN', name: 'Elijah Nkonde',    email: 'elijah@karistech.co.zm',    role: 'Org Admin',    status: 'active',  isCurrentUser: true,  joined: '1 Jul 2026'  },
    { initials: 'TM', name: 'Thandiwe Mwansa',  email: 'thandiwe@karistech.co.zm',  role: 'Practitioner', status: 'active',  isCurrentUser: false, joined: '12 Jul 2026' },
    { initials: 'NK', name: 'Nomvula Khumalo',  email: 'nomvula@karistech.co.zm',   role: 'Practitioner', status: 'active',  isCurrentUser: false, joined: '20 Jul 2026' },
    { initials: 'OA', name: 'Oluwaseun Adeyemi', email: 'seun@karistech.co.zm',     role: 'Viewer',       status: 'pending', isCurrentUser: false, joined: '—'          }
  ],

  /* ──────────────────────────────────────────────────────────
     HELPER METHODS
  ────────────────────────────────────────────────────────── */

  /* Get a client by id */
  getClient(id) {
    return this.clients.find(c => c.id === id) || null;
  },

  /* Get the currently active client */
  getActiveClient() {
    return this.getClient(this.currentClientId);
  },

  /* Get the most recently active client (for dashboard banner) */
  getMostRecentClient() {
    return this.clients.find(c => c.status === 'active') || this.clients[0];
  },

  /* Get instrument status label for display */
  getStatusLabel(status) {
    const labels = {
      'not-started': 'Not started',
      'in-progress':  'In progress',
      'complete':     'Complete'
    };
    return labels[status] || status;
  },

  /* Get badge class for client status */
  getStatusBadgeClass(status) {
    const classes = {
      'active':  'badge-success',
      'new':     'badge-muted',
      'dormant': 'badge-muted'
    };
    return classes[status] || 'badge-muted';
  },

  /* Get badge class for instrument status */
  getInstrumentBadgeClass(status) {
    const classes = {
      'not-started': 'badge-muted',
      'in-progress':  'badge-warning',
      'complete':     'badge-success'
    };
    return classes[status] || 'badge-muted';
  }
};
