/* ============================================================
   KARIS MIND — API Layer
   js/api.js

   THE ONLY FILE THAT MAKES BACKEND CALLS.
   No fetch() calls anywhere else in the codebase — ever.

   Current state: all methods return demo data from KarisState.
   When the Supabase backend is live:
   - Replace the return statements with real fetch() calls
   - Update BASE_URL to the live API endpoint
   - Add auth token headers using the Supabase session token
   - Error handling is already structured — just fill it in

   Method naming convention:
   - get*()    → read data
   - create*() → insert new record
   - update*() → modify existing record
   - delete*() → remove record
   ============================================================ */

const KarisAPI = {

  BASE_URL: 'https://api.karismind.com',
  /*
    Will become the Supabase project URL when backend is live.
    e.g. 'https://xyzabc.supabase.co/rest/v1'
  */


  /* ──────────────────────────────────────────────────────────
     AUTH
  ────────────────────────────────────────────────────────── */

  async signIn(email, password) {
    /*
      TODO (live):
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    */
    console.log('[API] signIn →', email);
    return { user: KarisState.user, token: 'demo-token-001' };
  },

  async signOut() {
    /*
      TODO (live):
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    */
    console.log('[API] signOut');
    return true;
  },

  async getSession() {
    /*
      TODO (live):
      const { data } = await supabase.auth.getSession();
      return data.session;
    */
    return { user: KarisState.user, token: 'demo-token-001' };
  },


  /* ──────────────────────────────────────────────────────────
     CLIENTS
  ────────────────────────────────────────────────────────── */

  async getClients() {
    /*
      TODO (live):
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    */
    console.log('[API] getClients');
    return KarisState.clients;
  },

  async getClient(id) {
    /*
      TODO (live):
      const { data, error } = await supabase
        .from('clients')
        .select('*, instrument_runs(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    */
    console.log('[API] getClient →', id);
    return KarisState.getClient(id);
  },

  async createClient(payload) {
    /*
      payload = { name, fullName, sector, location, contact }

      TODO (live):
      const { data, error } = await supabase
        .from('clients')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    */
    console.log('[API] createClient →', payload);
    const newClient = {
      id:           'client-' + Date.now(),
      name:         payload.name,
      fullName:     payload.fullName || payload.name,
      sector:       payload.sector || '',
      location:     payload.location || '',
      contact:      payload.contact || null,
      status:       'new',
      lastActivity: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      notes:        '',
      instruments: {
        ocam:     { status: 'not-started', lastRun: null },
        gold:     { status: 'not-started', lastRun: null },
        strategy: { status: 'not-started', lastRun: null, stage: 0 }
      },
      activity: [
        { type: 'system', label: 'Client record created', date: 'Today', user: KarisState.user.name }
      ],
      reports: []
    };
    KarisState.clients.unshift(newClient);
    return newClient;
  },

  async updateClient(id, payload) {
    /*
      TODO (live):
      const { data, error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    */
    console.log('[API] updateClient →', id, payload);
    const client = KarisState.getClient(id);
    if (client) Object.assign(client, payload);
    return client;
  },

  async updateClientNotes(id, notes) {
    console.log('[API] updateClientNotes →', id);
    return this.updateClient(id, { notes });
  },


  /* ──────────────────────────────────────────────────────────
     INSTRUMENT DEFINITIONS
     Questions fetched at runtime — never hardcoded.
  ────────────────────────────────────────────────────────── */

  async getInstrumentDefinition(instrument, version = 'latest') {
    /*
      Returns the question set for an instrument from the
      instrument_definitions table. JSONB format.

      TODO (live):
      const { data, error } = await supabase
        .from('instrument_definitions')
        .select('*')
        .eq('instrument', instrument)
        .eq('version', version)
        .single();
      if (error) throw error;
      return data;
    */
    console.log('[API] getInstrumentDefinition →', instrument, version);
    /*
      Demo: returns null — pages handle null gracefully
      and fall back to hardcoded demo questions for now.
    */
    return null;
  },


  /* ──────────────────────────────────────────────────────────
     INSTRUMENT RUNS
  ────────────────────────────────────────────────────────── */

  async startRun(clientId, instrument) {
    /*
      Creates a new instrument run record in the database.

      TODO (live):
      const { data, error } = await supabase
        .from('instrument_runs')
        .insert([{ client_id: clientId, instrument, status: 'in-progress' }])
        .select()
        .single();
      if (error) throw error;
      return data;
    */
    console.log('[API] startRun →', clientId, instrument);
    return { runId: 'run-' + Date.now(), clientId, instrument, status: 'in-progress' };
  },

  async saveRunProgress(runId, progressData) {
    /*
      Saves partial responses for a run in progress.
      JSONB stored in instrument_runs.response_data.

      TODO (live):
      const { error } = await supabase
        .from('instrument_runs')
        .update({ response_data: progressData, updated_at: new Date() })
        .eq('id', runId);
      if (error) throw error;
    */
    console.log('[API] saveRunProgress →', runId);
    return true;
  },

  async completeRun(runId, results) {
    /*
      Marks a run complete and stores final scored results.
      results = JSONB object with scores per subscale/dimension.

      TODO (live):
      const { error } = await supabase
        .from('instrument_runs')
        .update({ status: 'complete', results, completed_at: new Date() })
        .eq('id', runId);
      if (error) throw error;
    */
    console.log('[API] completeRun →', runId, results);
    return true;
  },

  async getRunsForClient(clientId, instrument) {
    /*
      Returns all completed runs for a client + instrument.

      TODO (live):
      const { data, error } = await supabase
        .from('instrument_runs')
        .select('*')
        .eq('client_id', clientId)
        .eq('instrument', instrument)
        .eq('status', 'complete')
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data;
    */
    console.log('[API] getRunsForClient →', clientId, instrument);
    return [];
  },


  /* ──────────────────────────────────────────────────────────
     REPORTS
  ────────────────────────────────────────────────────────── */

  async generateReport(clientId, instrument, runId) {
    /*
      Triggers report generation on the backend.
      Backend calls Anthropic API for AI narrative,
      combines with scores, produces PDF.

      TODO (live):
      const res = await fetch(`${this.BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ clientId, instrument, runId })
      });
      return res.json();
    */
    console.log('[API] generateReport →', clientId, instrument, runId);
    return { reportId: 'rpt-' + Date.now(), status: 'generating' };
  },

  async getReports(clientId) {
    /*
      TODO (live):
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    */
    console.log('[API] getReports →', clientId);
    const client = KarisState.getClient(clientId);
    return client ? client.reports : [];
  },


  /* ──────────────────────────────────────────────────────────
     MEETINGS
  ────────────────────────────────────────────────────────── */

  async getMeetings(clientId) {
    console.log('[API] getMeetings →', clientId || 'all');
    if (clientId) {
      return KarisState.meetings.filter(m => m.clientId === clientId);
    }
    return KarisState.meetings;
  },

  async createMeeting(payload) {
    console.log('[API] createMeeting →', payload);
    const meeting = { id: 'mtg-' + Date.now(), status: 'planned', ...payload };
    KarisState.meetings.unshift(meeting);
    return meeting;
  },


  /* ──────────────────────────────────────────────────────────
     AI NARRATIVE
     Called after instrument run completes.
     Backend injects scores into Anthropic system prompt.
  ────────────────────────────────────────────────────────── */

  async generateNarrative(instrument, scores, clientContext) {
    /*
      TODO (live):
      const res = await fetch(`${this.BASE_URL}/narrative/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ instrument, scores, clientContext })
      });
      const data = await res.json();
      return data.narrative;
    */
    console.log('[API] generateNarrative →', instrument);
    return null;
  },


  /* ──────────────────────────────────────────────────────────
     TEAM
  ────────────────────────────────────────────────────────── */

  async getTeam() {
    console.log('[API] getTeam');
    return KarisState.team;
  },

  async inviteMember(email, role) {
    /*
      TODO (live): send Supabase invite email
    */
    console.log('[API] inviteMember →', email, role);
    return { status: 'invited', email, role };
  },

  /* ──────────────────────────────────────────────────────────
     SETTINGS / PROFILE
  ────────────────────────────────────────────────────────── */

  async updateProfile(fields) {
    /*
      TODO (live): UPDATE users SET ... WHERE id = auth.uid()
    */
    console.log('[API] updateProfile →', fields);
    Object.assign(KarisState.user, fields);
    return { status: 'saved', user: KarisState.user };
  },

  async updatePreferences(prefs) {
    /*
      TODO (live): UPDATE user_preferences SET ... WHERE user_id = auth.uid()
    */
    console.log('[API] updatePreferences →', prefs);
    KarisState.preferences = Object.assign(KarisState.preferences || {}, prefs);
    return { status: 'saved', preferences: KarisState.preferences };
  },

  /* ──────────────────────────────────────────────────────────
     CASCADE — WORKPLANS
  ────────────────────────────────────────────────────────── */

  async getWorkplans(clientId) {
    console.log('[API] getWorkplans →', clientId || 'all');
    if (clientId) {
      return KarisState.workplans.filter(w => w.clientId === clientId);
    }
    return KarisState.workplans;
  },

  async createWorkplan(payload) {
    /*
      TODO (live): INSERT INTO cascade_workplans (...)
      payload: { title, clientId, source, workstreams }
    */
    console.log('[API] createWorkplan →', payload);
    const workplan = {
      id: 'wp-' + Date.now(),
      created: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }),
      workstreams: [],
      ...payload
    };
    KarisState.workplans.unshift(workplan);
    return workplan;
  },

  async updateTaskStatus(workplanId, workstreamIdx, taskIdx, status) {
    /*
      TODO (live): UPDATE cascade_tasks SET status = ... WHERE id = ...
    */
    console.log('[API] updateTaskStatus →', workplanId, workstreamIdx, taskIdx, status);
    const wp = KarisState.workplans.find(w => w.id === workplanId);
    if (wp && wp.workstreams[workstreamIdx] && wp.workstreams[workstreamIdx].tasks[taskIdx]) {
      wp.workstreams[workstreamIdx].tasks[taskIdx].status = status;
    }
    return { status: 'saved' };
  }

};
