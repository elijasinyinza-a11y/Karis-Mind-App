# Karis Mind — Workspace
`app.karismind.com` — Authenticated practitioner workspace.

## Structure
```
Karis-Mind-App/
├── index.html              Shell — sidebar, topbar, content mount
├── vercel.json             SPA routing
├── css/
│   ├── tokens.css          Design tokens (colours, type, spacing)
│   ├── shell.css           Layout, sidebar, topbar, runner, modal
│   ├── components.css      Reusable UI components (light theme)
│   └── utilities.css       Helper classes
├── js/
│   ├── state.js            App state + demo data
│   ├── api.js              Sole fetch layer (Supabase later)
│   ├── shell.js            Sidebar, modal, toast, tabs, runner
│   └── router.js           Page navigation + script execution
└── pages/
    ├── dashboard.html      ✓ built
    ├── clients.html        placeholder → Session 5
    ├── client-record.html  placeholder → Session 6
    ├── instruments/        → Sessions 7–9
    ├── tools/              → Sessions 10–12
    └── admin/              → Session 13
```

## Build status
- [x] Shell (index.html)
- [x] CSS (all four files, light theme)
- [x] JS (state, api, shell, router)
- [x] Dashboard
- [ ] Clients — next
- [ ] Client record
- [ ] Instruments (OCAM, GOLD, Strategy)
- [ ] Tools (Meetings, Cascade, Reports)
- [ ] Admin (Team, Settings)

## Deploy
GitHub → Vercel auto-deploy. Custom domain: app.karismind.com

## Key architecture note
Pages load via fetch + innerHTML. The router re-executes inline
<script> tags (browsers don't run them from innerHTML), which is
what makes each page's init_[page]() function work.
