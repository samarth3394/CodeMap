import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Compass,
  ArrowRight,
  Map,
  FileCode,
  Zap,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'map' | 'explorer' | 'ai' | 'impact'>('map');

  const faqs = [
    {
      q: 'What is CodeMap and how does it analyze codebases?',
      a: 'CodeMap parses source code into Abstract Syntax Trees (ASTs) to extract symbols, dependencies, call hierarchies, and architectural boundaries. It creates an interactive topological map of your software architecture without executing untrusted code.',
    },
    {
      q: 'What is included in Stage 1?',
      a: 'Stage 1 delivers the complete user experience foundation: interactive architectural maps, file AST tree explorers, simulated impact analyses, AI assistant threads with line citations, and workspace navigation across multiple repositories.',
    },
    {
      q: 'Does CodeMap send my private source code to external servers?',
      a: 'In full deployment, CodeMap can operate completely self-hosted inside your VPC or local workstation. In this Stage 1 frontend demo, all operations run 100% locally in your browser with realistic demo data.',
    },
    {
      q: 'Which programming languages are supported?',
      a: 'CodeMap is designed for multi-language architectures. The current preview showcases deep Python, TypeScript, and Go symbol trees, with Rust, Java, and C# parsers planned for upcoming stages.',
    },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Top Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 px-4 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
        <Badge variant="blue" size="sm">
          Stage 1 Prototype
        </Badge>
        <span>
          Frontend architecture preview is live with interactive demo repositories.{' '}
          <Link to="/dashboard" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
            Open App <ArrowRight className="w-3 h-3" />
          </Link>
        </span>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">CodeMap</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-slate-900 transition-colors">
              Product Preview
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#security" className="hover:text-slate-900 transition-colors">
              Security
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/projects/proj-fastapi-commerce/codemap">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch Code Map
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 mb-6 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Codebase Intelligence & Architectural Mapping</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            Architectural clarity for <br className="hidden sm:block" />
            <span className="text-blue-600">complex codebases</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop guessing how microservices and modules connect. CodeMap renders interactive spatial dependency graphs,
            AST symbol hierarchies, and pre-commit impact simulations before breaking changes reach production.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/projects/proj-fastapi-commerce/codemap">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Interactive Code Map
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                View Workspace Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left border border-slate-200 rounded-xl p-4 bg-slate-50/70">
            <div>
              <div className="text-xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500">AST Static Analysis</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0 ms</div>
              <div className="text-xs text-slate-500">Code Execution Risk</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">&lt; 15s</div>
              <div className="text-xs text-slate-500">Full Graph Indexing</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">Pre-Commit</div>
              <div className="text-xs text-slate-500">Blast Radius Scoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              A high-precision developer workspace
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Switch between interactive architectural graph mapping, symbol trees, and AI-assisted deep dives.
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
            {/* Tab switcher */}
            <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-xs font-mono text-slate-500 ml-2">fastapi-microcommerce • main</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setActivePreviewTab('map')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activePreviewTab === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Code Map
                </button>
                <button
                  onClick={() => setActivePreviewTab('explorer')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activePreviewTab === 'explorer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AST Explorer
                </button>
                <button
                  onClick={() => setActivePreviewTab('ai')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activePreviewTab === 'ai' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Assistant
                </button>
                <button
                  onClick={() => setActivePreviewTab('impact')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activePreviewTab === 'impact' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Impact Analysis
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6">
              {activePreviewTab === 'map' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-900">Spatial Architecture Topology</span>
                      <Badge variant="blue" size="sm">11 Nodes Active</Badge>
                    </div>
                    <Link to="/projects/proj-fastapi-commerce/codemap">
                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Fullscreen Canvas
                      </Button>
                    </Link>
                  </div>
                  {/* Schematic Graph Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="text-[11px] font-bold uppercase text-slate-400">1. API Entrypoints</div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">app.main:create_app</div>
                      <div className="text-[11px] text-slate-500 mt-1">Routes: /orders, /auth</div>
                      <div className="mt-2 text-[10px] text-blue-600 font-mono">fan-out: 4 modules</div>
                    </div>
                    <div className="p-3 bg-white border border-blue-200 ring-1 ring-blue-500/20 rounded-lg shadow-sm">
                      <div className="text-[11px] font-bold uppercase text-blue-600">2. Service Orchestrator</div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">CheckoutService</div>
                      <div className="text-[11px] text-slate-500 mt-1">Two-phase reservation coordinator</div>
                      <div className="mt-2 text-[10px] text-emerald-600 font-medium">88.5% test coverage</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="text-[11px] font-bold uppercase text-slate-400">3. Domain Logic</div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">TaxAndDiscountRules</div>
                      <div className="text-[11px] text-slate-500 mt-1">Pure deterministic calculations</div>
                      <div className="mt-2 text-[10px] text-slate-500">0 external dependencies</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="text-[11px] font-bold uppercase text-slate-400">4. Infrastructure</div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">PostgreSQL & Redis</div>
                      <div className="text-[11px] text-slate-500 mt-1">Asyncpg pool & Redis lock</div>
                      <div className="mt-2 text-[10px] text-purple-600 font-mono">20 pool size</div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'explorer' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-mono text-slate-600">app/services/checkout_service.py</span>
                    <Link to="/projects/proj-fastapi-commerce/explorer">
                      <Button variant="secondary" size="sm">Inspect Symbols</Button>
                    </Link>
                  </div>
                  <pre className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed">
                    <span className="text-blue-600 font-semibold">async def</span> <span className="text-indigo-600 font-semibold">execute_checkout</span>(self, user_id: UUID, items: List[OrderItem]) -&gt; Order:
                    {'\n'}    <span className="text-slate-400"># 1. Acquire Redis distributed stock reservation</span>
                    {'\n'}    reservation_token = <span className="text-blue-600">await</span> self.inventory.reserve_items(items, ttl_seconds=300)
                    {'\n'}    <span className="text-blue-600">if not</span> reservation_token:
                    {'\n'}        <span className="text-rose-600">raise</span> HTTPException(status_code=409, detail=<span className="text-amber-700">"Inventory exhausted"</span>)
                  </pre>
                </div>
              )}

              {activePreviewTab === 'ai' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700">
                    <div className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span>CodeMap AI Answer with Source Citations</span>
                    </div>
                    The checkout flow guarantees zero overselling through a 2-phase reservation lock in <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-700">app/services/checkout_service.py:42</code> before external Stripe debits occur.
                  </div>
                  <Link to="/projects/proj-fastapi-commerce/ai">
                    <Button variant="secondary" size="sm">Ask Architectural Questions</Button>
                  </Link>
                </div>
              )}

              {activePreviewTab === 'impact' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs">
                    <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Simulated Change Blast Radius: High Risk</span>
                    </div>
                    Modifying <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800">calculate_total()</code> directly impacts 4 downstream files and requires updating 3 test suites.
                  </div>
                  <Link to="/projects/proj-fastapi-commerce/impact">
                    <Button variant="secondary" size="sm">View Full Blast Radius</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Everything engineering teams need to understand their code
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Built from the ground up for software architects, staff engineers, and tech leads maintaining production services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Interactive Spatial Code Map
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Render modules, classes, and microservices on a 2D spatial canvas. Detect circular dependencies and visualize layer violations in real time.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Pre-Commit Impact Simulation
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Know what breaks before you merge. Simulate function signature changes and receive exact lists of affected callers and broken test suites.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Context-Aware AI Assistant
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Query your architecture using natural language. Every response links directly to verified source code file lines and symbols.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                AST Symbol Explorer
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Navigate the codebase via semantic symbols—classes, async methods, and routes—with inline complexity and reference counts.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Zero-Trust Security & SAST
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Continuous static analysis scans for permissive CORS, token leakage, and vulnerable package dependencies with actionable remediation.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Living Architecture Docs
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Documentation that never goes stale. Automatically extract API schemas, service boundary contracts, and sequence lifecycle flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How CodeMap works</h2>
            <p className="mt-3 text-sm text-slate-600">
              Three streamlined steps from repository connection to total architectural visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">01</div>
              <h3 className="text-base font-semibold text-slate-900">AST Static Parsing</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                CodeMap traverses your Git tree and extracts language-specific Abstract Syntax Trees without building or executing untrusted code.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">02</div>
              <h3 className="text-base font-semibold text-slate-900">Topological Graph Construction</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Edges are computed for imports, function invocations, inheritance, and message queues to form an architectural dependency graph.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">03</div>
              <h3 className="text-base font-semibold text-slate-900">Query & Simulate</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Explore the interactive canvas, simulate refactorings, or query the codebase AI assistant with precise file line citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section id="security" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50/50 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Lock className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">Enterprise Security & Strict Privacy by Design</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                CodeMap operates on static analysis primitives. We never execute arbitrary code, run untrusted Docker containers, or expose your proprietary algorithms. In self-hosted enterprise deployments, all parsing, graph indexing, and embeddings run within your private VPC boundary.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Air-gapped VPC Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Untrusted Execution</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strict Role-Based Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-subtle"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to explore your codebase in full fidelity?
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Experience the Stage 1 prototype now with preloaded demo architectures or import a repository into your local workspace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch CodeMap Prototype
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">CodeMap</span>
            <span>— AI-Powered Codebase Intelligence (Stage 1)</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/projects" className="hover:text-slate-900">Projects</Link>
            <Link to="/projects/proj-fastapi-commerce/codemap" className="hover:text-slate-900">Code Map</Link>
            <span className="text-slate-400">Strict White Design System</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
