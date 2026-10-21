import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileCode2,
  Lock,
  GitPullRequest,
  Check,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const BentoGridFeatures: React.FC = () => {
  // CARD 1: AST Node Filter State
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'api' | 'db' | 'events'>('all');
  const [activeAstNode, setActiveAstNode] = useState<string>('checkout');

  const astNodes = [
    { id: 'auth', name: 'AuthMiddleware', type: 'api', callers: 8, complexity: 3, loc: 140 },
    { id: 'checkout', name: 'CheckoutRouter', type: 'api', callers: 12, complexity: 5, loc: 290 },
    { id: 'order_service', name: 'OrderService', type: 'api', callers: 6, complexity: 4, loc: 380 },
    { id: 'order_model', name: 'OrderRecord', type: 'db', callers: 9, complexity: 1, loc: 95 },
    { id: 'user_model', name: 'UserAccount', type: 'db', callers: 14, complexity: 1, loc: 110 },
    { id: 'kafka_pub', name: 'OrderEventProducer', type: 'events', callers: 4, complexity: 2, loc: 85 },
    { id: 'email_worker', name: 'NotificationConsumer', type: 'events', callers: 2, complexity: 3, loc: 160 },
  ];

  // CARD 2: Blast Radius PR Diff Toggle State
  const [prRiskLevel, setPrRiskLevel] = useState<'low' | 'medium' | 'high'>('high');

  const riskScenarios = {
    low: {
      title: 'Minor Docstring & Logging Update',
      diff: '+4 -1 in app/utils/logger.py',
      affectedServices: 1,
      affectedEndpoints: 0,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      status: 'Safe to Merge',
      testsCount: '1 Suite',
    },
    medium: {
      title: 'Added Optional Parameter to PaymentGateway',
      diff: '+12 -2 in app/services/payment.py',
      affectedServices: 2,
      affectedEndpoints: 3,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      status: 'Requires Review',
      testsCount: '3 Suites',
    },
    high: {
      title: 'Modified Core Async Session Signature',
      diff: '+28 -14 in app/infrastructure/db.py',
      affectedServices: 5,
      affectedEndpoints: 14,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      status: 'Critical Blast Radius',
      testsCount: '7 Suites',
    },
  };

  const currentRisk = riskScenarios[prRiskLevel];

  // CARD 3: AI Query Simulator
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);

  const aiQueries = [
    {
      q: 'How does our checkout handle payment timeouts?',
      answer:
        'When PaymentGateway.charge() times out after 4500ms, CheckoutService rolls back the DB transaction and dispatches a dead-letter event to Kafka.',
      citation: 'services/checkout.py:L48',
      snippet: 'except TimeoutError:\n    await db.rollback()\n    await bus.publish("order.failed", {"reason": "timeout"})',
    },
    {
      q: 'Where is the Redis distributed lock configured?',
      answer:
        'Redis distributed locking is managed via AsyncRedisLock with a 300-second TTL to avoid race conditions during inventory reservations.',
      citation: 'infrastructure/redis.py:L22',
      snippet: 'async with redis_pool.lock(f"inventory:{sku}", timeout=300):\n    await reserve_stock(sku, qty)',
    },
    {
      q: 'Which database tables are modified during user registration?',
      answer:
        'User registration writes to the `users` credentials table and triggers an async event that initializes the `user_profiles` record.',
      citation: 'services/auth.py:L94',
      snippet: 'user = User(email=payload.email, hashed_pw=hashed)\ndb.add(user)\nawait db.commit()',
    },
  ];

  // CARD 4: Security Audit State
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const triggerAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 800);
  };

  return (
    <section id="features" className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Background Grid Polish */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge variant="blue" size="md">
            Built for High-Velocity Engineering Teams
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mt-3">
            Everything you need to master complex architectures
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminate architectural blind spots, quantify downstream blast radius before PR merges, and chat with your codebase using line-level citations.
          </p>
        </div>

        {/* 2x2 Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ========================================================= */}
          {/* CARD 1: Spatial AST Topology & Symbol Hierarchy (7 cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between transition-all group">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-subtle">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Spatial AST Topology & Symbol Graphs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-language AST parsing across Python, TypeScript, and Go
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold hidden sm:inline-block">
                  Sub-second Parse
                </span>
              </div>

              {/* Interactive Filter Pills */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
                {(['all', 'api', 'db', 'events'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors capitalize ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {filter === 'all' ? 'All AST Nodes (7)' : filter === 'api' ? 'API Routes' : filter === 'db' ? 'SQLAlchemy Models' : 'Kafka Events'}
                  </button>
                ))}
              </div>

              {/* Interactive Node Grid Canvas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                {astNodes
                  .filter((n) => selectedFilter === 'all' || n.type === selectedFilter)
                  .map((node) => {
                    const isSelected = activeAstNode === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setActiveAstNode(node.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-900 truncate">
                            {node.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {node.loc} LOC
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
                          <span>{node.callers} upstream callers</span>
                          <span className="text-blue-600 font-semibold">Cplx: {node.complexity}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                Selected AST Node: <strong className="text-slate-800">{activeAstNode}</strong>
              </span>
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                Zero Code Execution <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: Pre-Commit Blast Radius Calculator (5 cols)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between transition-all">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-subtle">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Blast Radius Calculator
                    </h3>
                    <p className="text-xs text-slate-500">
                      Predict breaking changes before PR review
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Level Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-slate-700">Simulate PR Proposal:</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold text-center">
                  {(['low', 'medium', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setPrRiskLevel(lvl)}
                      className={`py-1.5 rounded-lg transition-all capitalize ${
                        prRiskLevel === lvl
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl} Risk
                    </button>
                  ))}
                </div>
              </div>

              {/* PR Diff Visualizer Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate mr-2">
                    {currentRisk.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono shrink-0 ${currentRisk.badgeColor}`}>
                    {currentRisk.status}
                  </span>
                </div>

                <div className="p-2 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] flex items-center justify-between">
                  <span className="text-amber-400 font-bold">$ git diff --stat</span>
                  <span className="text-emerald-400 font-bold">{currentRisk.diff}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-sans">Services</div>
                    <div className="font-bold text-slate-900 text-sm">{currentRisk.affectedServices}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-sans">Endpoints</div>
                    <div className="font-bold text-slate-900 text-sm">{currentRisk.affectedEndpoints}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-sans">Required Tests</div>
                    <div className="font-bold text-blue-600 text-sm">{currentRisk.testsCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-commit GitHub Action Ready</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-600 font-semibold">0 False Positives</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 3: AI Codebase Intelligence & Line Citations (6 cols)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between transition-all">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-subtle">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      AI Architecture Assistant
                    </h3>
                    <p className="text-xs text-slate-500">
                      Context-aware answers with verified line-level citations
                    </p>
                  </div>
                </div>
                <Badge variant="blue" size="sm">
                  AST Augmented
                </Badge>
              </div>

              {/* Sample Question Pills */}
              <div className="space-y-1.5 mb-3">
                {aiQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveQueryIndex(idx);
                      setExpandedCitation(null);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all truncate flex items-center gap-2 ${
                      activeQueryIndex === idx
                        ? 'bg-purple-100/70 text-purple-900 font-semibold border border-purple-200'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                    <span className="truncate">{item.q}</span>
                  </button>
                ))}
              </div>

              {/* AI Response Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="text-xs text-slate-700 leading-relaxed">
                  {aiQueries[activeQueryIndex].answer}
                </div>

                {/* Clickable Citation Pill */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setExpandedCitation(
                        expandedCitation === aiQueries[activeQueryIndex].citation
                          ? null
                          : aiQueries[activeQueryIndex].citation
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-[11px] font-semibold transition-colors"
                  >
                    <FileCode2 className="w-3 h-3" />
                    <span>{aiQueries[activeQueryIndex].citation}</span>
                    <span className="text-[9px] bg-blue-200 text-blue-800 px-1 rounded">View snippet</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">AST Grounded</span>
                </div>

                {/* Expanded Snippet */}
                {expandedCitation && (
                  <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] whitespace-pre overflow-x-auto border border-slate-800">
                    {aiQueries[activeQueryIndex].snippet}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Grounds responses in AST graphs, not hallucinations</span>
              <span className="text-purple-600 font-semibold font-mono text-[11px]">Strict Verification</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 4: Zero Code Execution & Security Sandbox (6 cols)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between transition-all">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-subtle">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Zero Execution Security Sandbox
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enterprise-grade isolation for private repositories
                    </p>
                  </div>
                </div>
                <button
                  onClick={triggerAudit}
                  disabled={isAuditing}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-1 disabled:opacity-75"
                >
                  <Check className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
                </button>
              </div>

              {/* 4 Security Guarantees Checklist */}
              <div className="space-y-2.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Code Execution (Static AST Only)</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Anti-Zip Slip & Canonical Path Boundary Protection</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Decompression Bomb Throttling (250MB Safe Limit)</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Air-Gapped & VPC On-Premise Deployment Ready</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-emerald-700 font-semibold text-[11px]">
                16/16 Automated Tests Verified
              </span>
              <span className="text-slate-400 font-mono text-[10px]">SOC2 Type II Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
