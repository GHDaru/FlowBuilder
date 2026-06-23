# Data Model: ui-refactor-material

## UI Local State

### SidebarPreference (LocalStorage)
Persists the user's sidebar toggle preference.
- `collapsed`: boolean (default: false)

### Theme Configuration (MUI)
The `materialTheme.ts` will define:
- `palette.primary`: `#6442D6`
- `palette.secondary`: `#C8B3FD`
- `palette.background.default`: `#0F172A`
- `palette.background.paper`: `#1E293B`
- `typography.fontFamily`: Inter/Roboto/Fira Code

## Component Hierarchy
- **App** (Root)
  - **ThemeProvider** (Theming)
  - **CssBaseline** (Reset)
  - **Layout** (Container)
    - **Sidebar** (Navigation - Collapsible)
    - **MainContent** (Dynamic view)
      - **Header** (Global actions)
      - **ActiveTab** (Component: Builder, History, etc.)
