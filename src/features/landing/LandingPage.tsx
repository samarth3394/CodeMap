import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LiveCodeGraphPlayground } from './LiveCodeGraphPlayground';
import { BentoGridFeatures } from './BentoGridFeatures';
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
  Lock,
  Copy,
  Check,
  Cpu,
  Database,
  Globe,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'map' | 'explorer' | 'ai' | 'impact'>('map');
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeHeroNode, setActiveHeroNode] = useState<string>('service');

  // Dynamic Animated Spinning/Blur Words with smooth 4s pacing
  const rotatingWords = [
    'Complex Microservices',
    'Distributed Systems',
    'Hidden Dependencies',
    'Blast Radius Risks',
    'Legacy Monoliths',
  ];
  const [displayWord, setDisplayWord] = useState(rotatingWords[0]);
  const [animClass, setAnimClass] = useState<'text-blur-in' | 'text-blur-out'>('text-blur-in');

  useEffect(() => {
    let wordIdx = 0;
    const interval = setInterval(() => {
      // 1. Smoothly blur and spin out upward (450ms)
      setAnimClass('text-blur-out');

      // 2. Switch word and spin in from below smoothly (650ms)
      setTimeout(() => {
        wordIdx = (wordIdx + 1) % rotatingWords.length;
        setDisplayWord(rotatingWords[wordIdx]);
        setAnimClass('text-blur-in');
      }, 450);
    }, 4000);

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx codemap analyze --repo .');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const faqs = [
    {
      q: 'What is CodeMap and how does it analyze codebases?',
      a: 'CodeMap parses source code into language-level Abstract Syntax Trees (ASTs) to extract symbols, dependencies, call hierarchies, and architectural boundaries. It builds an interactive topological map of your software architecture without executing untrusted code.',
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
    {
      q: 'How does Pre-Commit Impact Analysis prevent outages?',
      a: 'Before merging a pull request, CodeMap traverses the AST call graph to determine every direct and transitive caller of modified functions or schemas, verifying which test suites must be updated.',
    },
  ];

  const frameworks = [
    { name: 'FastAPI', type: 'Python Async', badge: 'Tier 1' },
    { name: 'TypeScript', type: 'Node / Express', badge: 'Tier 1' },
    { name: 'Go Fiber / gRPC', type: 'Golang Core', badge: 'Tier 1' },
    { name: 'SQLAlchemy 2.0', type: 'ORM Models', badge: 'Supported' },
    { name: 'Redis Pub/Sub', type: 'Lock Primitives', badge: 'Supported' },
    { name: 'Kafka Streams', type: 'Event Broker', badge: 'Supported' },
    { name: 'PostgreSQL', type: 'Asyncpg Driver', badge: 'Supported' },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen w-full overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Top Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 px-4 sm:px-8 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
        <Badge variant="blue" size="sm">
          Stage 1 Prototype Live
        </Badge>
        <span>
          Interactive architecture intelligence preview is ready.{' '}
          <Link to="/dashboard" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
            Open Workspace <ArrowRight className="w-3 h-3" />
          </Link>
        </span>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/95 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg">CodeMap</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-semibold">
                v1.0
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#playground" className="hover:text-blue-600 font-semibold transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Live Playground
            </a>
            <a href="#preview" className="hover:text-slate-900 transition-colors">
              Product Tour
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#comparison" className="hover:text-slate-900 transition-colors">
              Why CodeMap
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

      {/* Hero Section — Expansive 2-Column Full-Width Grid */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-white border-b border-slate-200">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column (7 cols): Copy & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 shadow-subtle">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                <span>AI-Powered Codebase Intelligence & AST Topology</span>
              </div>

              {/* Dynamic Headline with Animated Rotating Blur-Spin Text */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-[1.18]">
                Architectural clarity for
                <span className="block mt-2 sm:mt-3 perspective-1000 min-h-[1.3em]">
                  <span
                    key={displayWord}
                    className={`text-blue-600 font-extrabold inline-block pb-1 ${animClass}`}
                  >
                    {displayWord}
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Stop guessing how microservices and modules connect. CodeMap renders interactive spatial dependency graphs,
                AST symbol hierarchies, and pre-commit impact simulations before breaking changes reach production.
              </p>

              {/* Interactive Terminal Snippet */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl font-mono text-xs border border-slate-800 shadow-sm max-w-md w-full">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-blue-400 font-bold">$</span>
                    <span className="truncate">npx codemap analyze --repo .</span>
                  </div>
                  <button
                    onClick={handleCopyCli}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors ml-2 shrink-0"
                    title="Copy CLI command"
                  >
                    {copiedCli ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link to="/projects/proj-fastapi-commerce/codemap" className="w-full sm:w-auto">
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Explore Code Map
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button variant="secondary" size="md">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Architectural Metrics Guarantee Bar */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200">
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold text-slate-900">100% AST</div>
                  <div className="text-[11px] text-slate-500 font-medium">Static Parser Analysis</div>
                </div>
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold text-emerald-600">0 ms</div>
                  <div className="text-[11px] text-slate-500 font-medium">Zero Untrusted Execution</div>
                </div>
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold text-blue-600">&lt; 15s</div>
                  <div className="text-[11px] text-slate-500 font-medium">Full Graph Indexing</div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Live Interactive Architectural Blueprint */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden">
                {/* Blueprint Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 font-semibold ml-2">
                      Live Blueprint: fastapi-microcommerce
                    </span>
                  </div>
                  <Badge variant="blue" size="sm">
                    Interactive
                  </Badge>
                </div>

                {/* Blueprint Canvas Content */}
                <div className="p-5 bg-slate-50/50 space-y-3">
                  <div className="text-[11px] text-slate-500 mb-1 flex items-center justify-between">
                    <span>Click any node to inspect real-time topology:</span>
                    <span className="font-mono text-blue-600">4 Layers</span>
                  </div>

                  {/* Node 1: API */}
                  <div
                    onClick={() => setActiveHeroNode('api')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeHeroNode === 'api'
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>app.api.orders:router</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        API Layer
                      </span>
                    </div>
                    {activeHeroNode === 'api' && (
                      <div className="mt-2 text-[11px] text-slate-600 border-t border-blue-200/60 pt-2 flex items-center justify-between font-mono">
                        <span>180 LOC • 8 Symbols</span>
                        <span className="text-blue-600 font-semibold">Fan-out: 3</span>
                      </div>
                    )}
                  </div>

                  {/* Flow Connector Edge */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-4 bg-blue-300 relative">
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-r-2 border-blue-500 rotate-45" />
                    </div>
                  </div>

                  {/* Node 2: Service Orchestrator (Active by default) */}
                  <div
                    onClick={() => setActiveHeroNode('service')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeHeroNode === 'service'
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>services.checkout:CheckoutService</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
                        Service Layer
                      </span>
                    </div>
                    {activeHeroNode === 'service' && (
                      <div className="mt-2 text-[11px] text-slate-600 border-t border-blue-200/60 pt-2 flex items-center justify-between font-mono">
                        <span>385 LOC • 88.5% Coverage</span>
                        <span className="text-emerald-600 font-semibold">Two-Phase Lock</span>
                      </div>
                    )}
                  </div>

                  {/* Flow Connector Edge */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-4 bg-blue-300 relative">
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-r-2 border-blue-500 rotate-45" />
                    </div>
                  </div>

                  {/* Node 3: Infrastructure / Database */}
                  <div
                    onClick={() => setActiveHeroNode('db')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeHeroNode === 'db'
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                        <Database className="w-3.5 h-3.5 text-purple-600" />
                        <span>infrastructure.db:AsyncSessionPool</span>
                      </div>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono">
                        Postgres Pool
                      </span>
                    </div>
                    {activeHeroNode === 'db' && (
                      <div className="mt-2 text-[11px] text-slate-600 border-t border-blue-200/60 pt-2 flex items-center justify-between font-mono">
                        <span>20 Pool Size • Recycled 1800s</span>
                        <span className="text-purple-600 font-semibold">Asyncpg Driver</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blueprint Footer */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Selected: <span className="font-semibold text-slate-900">{activeHeroNode} layer</span>
                  </span>
                  <Link
                    to="/projects/proj-fastapi-commerce/codemap"
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 text-xs"
                  >
                    Open in Full Canvas <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Supported Ecosystem Bar */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Supported Ecosystems & Frameworks:
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {frameworks.map((fw) => (
                <div
                  key={fw.name}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs shadow-subtle hover:border-slate-300 transition-colors"
                >
                  <span className="font-semibold text-slate-800">{fw.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{fw.type}</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                    {fw.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Code vs Graph Topology Playground */}
      <div id="playground">
        <LiveCodeGraphPlayground />
      </div>

      {/* Modern Bento Grid Features Section */}
      <BentoGridFeatures />

      {/* Product Preview Section — Expansive Interactive Explorer */}
      <section id="preview" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="blue" size="md">
              Full Fidelity Developer Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3">
              Four unified lenses on your software architecture
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Eliminate architectural blind spots. Seamlessly transition from spatial 2D graphs to AST line-level source code inspection and AI inquiry.
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
            {/* Tab switcher */}
            <div className="border-b border-slate-200 px-6 py-3.5 bg-slate-50/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-xs font-mono text-slate-600 ml-2 font-medium">
                  fastapi-microcommerce • commit a8f9c1e
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setActivePreviewTab('map')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activePreviewTab === 'map'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Code Map (Spatial)
                </button>
                <button
                  onClick={() => setActivePreviewTab('explorer')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activePreviewTab === 'explorer'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AST Source Explorer
                </button>
                <button
                  onClick={() => setActivePreviewTab('ai')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activePreviewTab === 'ai'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Assistant (Citations)
                </button>
                <button
                  onClick={() => setActivePreviewTab('impact')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activePreviewTab === 'impact'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pre-Commit Impact
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6 lg:p-8">
              {activePreviewTab === 'map' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Map className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-bold text-slate-900">
                          Spatial Architecture Topology Map
                        </h3>
                        <Badge variant="blue" size="sm">
                          11 Verified Nodes
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Visualizes layer boundaries, entrypoints, and cross-module caller dependencies.
                      </p>
                    </div>
                    <Link to="/projects/proj-fastapi-commerce/codemap">
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Fullscreen Canvas
                      </Button>
                    </Link>
                  </div>

                  {/* 4-Layer Graphic Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-subtle hover:border-blue-300 transition-colors">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        01. API Routing Layer
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1.5 font-mono">app.main:create_app</div>
                      <div className="text-xs text-slate-500 mt-1">Routes: /orders, /auth, /healthz</div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-mono">
                        <span>4 fan-out</span>
                        <span>98% coverage</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-blue-300 ring-2 ring-blue-500/10 rounded-xl shadow-subtle">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                        02. Service Orchestrator
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1.5 font-mono">CheckoutService</div>
                      <div className="text-xs text-slate-500 mt-1">Two-phase Redis inventory reservation</div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-mono font-semibold">
                        <span>385 LOC</span>
                        <span>88.5% coverage</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-subtle hover:border-blue-300 transition-colors">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        03. Pure Domain Rules
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1.5 font-mono">TaxAndDiscountRules</div>
                      <div className="text-xs text-slate-500 mt-1">Pure deterministic business logic</div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>0 external deps</span>
                        <span>96% coverage</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-subtle hover:border-blue-300 transition-colors">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        04. Infrastructure & DB
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1.5 font-mono">Postgres & Redis</div>
                      <div className="text-xs text-slate-500 mt-1">Asyncpg pool & distributed lock</div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-purple-600 font-mono">
                        <span>20 pool size</span>
                        <span>300s TTL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'explorer' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono text-slate-700 font-semibold">
                      app/services/checkout_service.py:38-74
                    </span>
                    <Link to="/projects/proj-fastapi-commerce/explorer">
                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Full Explorer
                      </Button>
                    </Link>
                  </div>
                  <pre className="p-5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed">
                    <span className="text-blue-600 font-semibold">async def</span> <span className="text-indigo-600 font-semibold">execute_checkout</span>(self, user_id: UUID, items: List[OrderItem], payment_method_id: str) -&gt; Order:
                    {'\n'}    <span className="text-slate-400"># 1. Acquire Redis distributed stock reservation</span>
                    {'\n'}    reservation_token = <span className="text-blue-600">await</span> self.inventory.reserve_items(items=items, ttl_seconds=300)
                    {'\n'}    <span className="text-blue-600">if not</span> reservation_token:
                    {'\n'}        <span className="text-rose-600 font-semibold">raise</span> HTTPException(status_code=409, detail=<span className="text-emerald-700">"Cart items out of stock"</span>)
                    {'\n'}
                    {'\n'}    <span className="text-slate-400"># 2. Charge Stripe payment intent with idempotency</span>
                    {'\n'}    charge = <span className="text-blue-600">await</span> self.payment.charge_card(amount_cents=total, idempotency_key=key)
                    {'\n'}    <span className="text-blue-600">await</span> self.db.commit()
                  </pre>
                </div>
              )}

              {activePreviewTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-purple-900 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span>CodeMap AI Analysis with Verified File Line Citations</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Concurrency race conditions in the checkout pipeline are mitigated via two-phase Redis reservation in{' '}
                      <code className="bg-white px-2 py-0.5 rounded border border-purple-200 font-mono text-purple-800">
                        app/services/checkout_service.py:L42-L55
                      </code>{' '}
                      before calling the external Stripe charge gateway.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/projects/proj-fastapi-commerce/ai">
                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Ask Questions in AI Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activePreviewTab === 'impact' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-amber-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Simulated Pre-Commit Blast Radius: High Risk</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Changing signature of <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-semibold">calculate_total()</code> impacts 4 downstream files across 2 layers and requires updating 3 PyTest suites.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/projects/proj-fastapi-commerce/impact">
                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Simulate More Changes
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section — Full 3x2 Grid */}
      <section id="features" className="py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Engineered for staff engineers, tech leads, and architects
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Maintain speed without accumulating hidden technical debt or breaking production contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Interactive Spatial Code Map
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Render modules, classes, and microservices on a 2D spatial canvas. Detect circular dependencies and visualize layer violations in real time.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Pre-Commit Blast Radius
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Know what breaks before you merge. Simulate function signature changes and receive exact lists of affected callers and broken test suites.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Citation-Backed AI Assistant
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Query your architecture using natural language. Every response links directly to verified source code file lines and AST symbols.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                AST Symbol Explorer
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Navigate the codebase via semantic symbols—classes, async methods, and routes—with inline complexity and reference counts.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Zero-Trust SAST Audit
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Continuous static analysis scans for permissive CORS, token leakage, and vulnerable package dependencies with actionable remediation.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-all shadow-subtle group">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Living Architecture Docs
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Documentation that never goes stale. Automatically extract API schemas, service boundary contracts, and sequence lifecycle flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Section */}
      <section id="comparison" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Why leading engineering teams choose CodeMap
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Comparing traditional manual codebase onboarding with automated AST intelligence.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-4 px-6">Capability</th>
                  <th className="py-4 px-6 text-slate-400">Without CodeMap</th>
                  <th className="py-4 px-6 text-blue-700 bg-blue-50/50">With CodeMap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Architecture Onboarding</td>
                  <td className="py-4 px-6 text-slate-500">2-4 weeks reading outdated README files</td>
                  <td className="py-4 px-6 font-medium text-emerald-700 bg-blue-50/20">
                    Interactive 2D spatial canvas in 15 seconds
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Refactoring Confidence</td>
                  <td className="py-4 px-6 text-slate-500">Trial and error in staging / breaking CI</td>
                  <td className="py-4 px-6 font-medium text-emerald-700 bg-blue-50/20">
                    Pre-commit blast radius scoring & caller lists
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">AI Hallucinations</td>
                  <td className="py-4 px-6 text-slate-500">Generic guesses without repo awareness</td>
                  <td className="py-4 px-6 font-medium text-emerald-700 bg-blue-50/20">
                    Every answer backed by verified file line citations
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Architecture Documentation</td>
                  <td className="py-4 px-6 text-slate-500">Stale Confluence pages & outdated diagrams</td>
                  <td className="py-4 px-6 font-medium text-emerald-700 bg-blue-50/20">
                    Living sync automatically generated from AST trees
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How CodeMap works</h2>
            <p className="mt-3 text-sm text-slate-600">
              Three streamlined steps from repository connection to total architectural visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-subtle relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">01</div>
              <h3 className="text-base font-bold text-slate-900">AST Static Parsing</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                CodeMap traverses your Git tree and extracts language-specific Abstract Syntax Trees without building or executing untrusted code.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-subtle relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">02</div>
              <h3 className="text-base font-bold text-slate-900">Topological Graph Construction</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Edges are computed for imports, function invocations, inheritance, and message queues to form an architectural dependency graph.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-subtle relative">
              <div className="text-3xl font-bold text-blue-600 mb-3 font-mono">03</div>
              <h3 className="text-base font-bold text-slate-900">Query & Simulate</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Explore the interactive canvas, simulate refactorings, or query the codebase AI assistant with precise file line citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section id="security" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50/60 flex flex-col md:flex-row items-center gap-8">
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
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
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
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Ready to explore your codebase in full fidelity?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Experience the Stage 1 prototype now with preloaded demo architectures or import a repository into your local workspace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch CodeMap Prototype
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
