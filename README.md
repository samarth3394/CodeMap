# CodeMap — AI-Powered Codebase Intelligence (Stage 1)

**CodeMap** is a developer platform for software architects, staff engineers, and tech leads maintaining complex microservice ecosystems. It parses source code into Abstract Syntax Trees (ASTs) to visualize architectural layers, dependency graphs, pre-commit blast radiuses, and context-aware AI explanations with direct line citations.

---

## 🎨 Strict White Design System

CodeMap strictly follows a high-clarity white design system engineered for developer productivity:
- **Background**: `#FFFFFF`
- **Secondary Background**: `#F8FAFC`
- **Surface & Cards**: `#FFFFFF` with `#E2E8F0` borders and subtle shadows
- **Text (Primary)**: `#0F172A`
- **Text (Secondary)**: `#64748B`
- **Hover States**: `#F1F5F9`
- **Primary Brand Accent**: `#2563EB` (Blue 600) with accessible focus states (`focus-visible:ring-2 focus-visible:ring-blue-600`)
- **Restrained Accents**:
  - Emerald (`#10B981` / `#ECFDF5`) for test coverage and healthy dependencies
  - Amber (`#F59E0B` / `#FFFBEB`) for medium impact and warnings
  - Rose (`#EF4444` / `#FEF2F2`) for critical blast radius and SAST findings
  - Purple (`#8B5CF6` / `#F5F3FF`) for AI reasoning and citations

---

## 🚀 Features Implemented in Stage 1

### 1. Landing Page (`/`)
- **Hero Banner**: Value proposition, primary/secondary calls to action, and static analysis guarantee badges.
- **Product Preview**: Interactive tabbed view showcasing the Code Map, AST Explorer, AI Assistant, and Impact Analysis.
- **Feature Grid**: Deep dependency graphs, pre-commit blast radius simulation, AST symbol trees, and living docs.
- **How It Works**: 3-step pipeline (AST Parsing -> Topological Graph Construction -> Query & Simulate).
- **Security & Privacy**: Zero untrusted binary execution, SOC-2 readiness, and air-gapped on-premise deployment mode.
- **FAQ Accordion & CTA**: Collapsible question modules with honest answers about Stage 1 demo vs backend pipelines.

### 2. Workspace Dashboard (`/dashboard`)
- **Metrics Bar**: Active repositories, indexed symbols (1,922+), average test coverage (87.9%), and security health score.
- **Onboarding Checklist**: Step-by-step progress guide tracking completed exploration workflows.
- **Featured Demo Repositories**: Quick-launch cards into `fastapi-microcommerce`, `nexus-auth-service`, and `datapipe-stream-core`.
- **Live Activity Feed**: Real-time event log for SAST scans, git synchronizations, impact simulations, and AI queries.

### 3. Projects Listing (`/projects`)
- **Real-Time Search**: Instant filtering by repository name, language, or tag.
- **Multi-Facet Controls**: Filter by language (`Python`, `TypeScript`, `Go`, `Rust`), sort by LOC/coverage/recency.
- **Grid vs List Toggle**: Switch between responsive card grids and dense enterprise table views.
- **Quick Project Creation**: Interactive dialog with pre-built template quick-fills.

### 4. Interactive Code Map (`/projects/:id/codemap`)
- **Spatial 2D Canvas**: Visual topological layout across 4 architectural tiers:
  1. *Presentation & API Routing*
  2. *Service Orchestration Layer*
  3. *Domain Rules & Pure Logic*
  4. *Infrastructure, Persistence & External APIs*
- **Interactive Connections**: SVG cubic bezier curves showing calls, imports, inheritance, and data flow.
- **Canvas Toolbar**: Zoom in/out, pan, reset view, layer filter, complexity filter, and live node/edge counters.
- **Node Detail Sidecar**: Inspect file paths, LOC, cyclomatic complexity, incoming callers (fan-in), and outgoing dependencies (fan-out).

### 5. AST Code Explorer (`/projects/:id/explorer`)
- **Repository File Tree**: Nested folder navigation with file extension icons, symbol counts, and line indicators.
- **Syntax-Highlighted Source Viewer**: Python code viewer with line numbers, keyword styling, and breadcrumbs.
- **Symbol Inspector**: Right-hand drawer listing parsed classes, methods, and functions with signatures, docstrings, and reference counts.

### 6. Context-Aware AI Assistant (`/projects/:id/ai`)
- **Conversation List**: Multi-thread inquiry management.
- **Citation-Backed Responses**: AI answers that cite exact repository file paths and line ranges (e.g. `app/services/checkout_service.py:L42-L55`).
- **Prompt Suggestions**: Pre-populated architectural queries and follow-up chips.

### 7. Pre-Commit Impact Analysis (`/projects/:id/impact`)
- **Blast Radius Simulator**: Evaluate signature changes and deprecations prior to committing code.
- **Direct & Transitive Callers**: Detailed breakdown of downstream files impacted by method changes.
- **Affected Test Suites**: Clear identification of test cases that must be updated.

### 8. Quality & Intelligence Views
- **Dependencies (`/projects/:id/dependencies`)**: Package version audit, licenses, health scores, and outdated version indicators.
- **Tests & Coverage (`/projects/:id/tests`)**: Execution durations, assertion failures, and symbol coverage targets.
- **Security Audit (`/projects/:id/security`)**: SAST vulnerability scanner with CWE mappings, status triage, and remediation advice.
- **Living Docs (`/projects/:id/docs`)**: Auto-synthesized architecture summaries, sequence diagrams, and interface catalogs.
- **Analysis History (`/projects/:id/history`)**: Commit timeline tracking metric variations across git revisions.
- **Project Settings (`/projects/:id/settings`)**: Configurable ignore patterns, default branch selection, and indexing hooks.

### 9. Global Navigation & Interactions
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Rapid keyboard-first search to navigate any page, project, or feature.
- **Collapsible Sidebar**: Full labels or condensed icon rail mode with reactive mobile drawer.
- **Toast Notifications**: Accessible notification toasts for feedback on user actions.

---

## 🛠️ Technology Stack

- **Runtime & Bundler**: Vite 8.3
- **Framework**: React 19 + TypeScript (Strict mode)
- **Styling**: Tailwind CSS v3 with strict custom design tokens
- **Routing**: React Router v7
- **Icons**: Lucide Icons (`lucide-react`)
- **Architecture**: Modular, feature-based directory structure

---

## 📂 Project Directory Structure

```
src/
├── types/                  # TypeScript domain models (projects, graph, AST, assistant, analysis)
├── data/                   # Realistic demo repositories and mock AST graphs
├── context/                # ProjectContext, NotificationContext, CommandPaletteContext
├── components/
│   ├── common/             # Button, Badge, Modal, Input, Tabs, EmptyState, LoadingSkeleton
│   ├── layout/             # Header, Sidebar, AppLayout, CommandPalette
│   └── modals/             # NewProjectModal
├── features/
│   ├── landing/            # Public marketing and architecture landing page
│   ├── dashboard/          # Metric dashboard and onboarding checklist
│   ├── projects/           # Repository listing, search, and filters
│   └── workspace/          # Project overview, Code Map, Explorer, AI, Impact, Tests, Security, Docs, History, Settings
└── routes/                 # React Router route hierarchy
```

---

## 🏃 Running the Application

### Prerequisites
- Node.js `v18+` (Tested on `v24.13.0`)
- npm `v9+` (Tested on `v11.6.2`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Builds the bundle into `dist/` with full TypeScript type checks (`tsc -b && vite build`).

### 4. Run Linter
```bash
npm run lint
```
Runs `oxlint` across all files.

---

## 🗺️ Stage 2 Roadmap (Backend Integration)

When ready to transition from Stage 1 prototype to Stage 2:
1. **Tree-sitter Parser Integration**: Wire web worker or native WebAssembly Tree-sitter parsers for live AST generation.
2. **Git Repository Ingestion**: Connect GitHub/GitLab OAuth APIs and local filesystem indexing agents.
3. **Graph Database**: Back topological nodes and edges with Neo4j or Postgres recursive CTEs.
4. **Streaming LLM Agent**: Connect OpenAI / Anthropic / Google Gemini streaming endpoints with RAG over AST chunks.
