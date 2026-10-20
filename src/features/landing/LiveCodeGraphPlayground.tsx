import React, { useState } from 'react';
import {
  Layers,
  Database,
  Globe,
  CreditCard,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Code2,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface Scenario {
  id: string;
  title: string;
  fileName: string;
  language: string;
  badge: string;
  description: string;
  codeLines: {
    lineNum: number;
    text: string;
    symbolId?: string;
    isHighlighted?: boolean;
    hasDiff?: boolean;
    diffType?: 'add' | 'modify';
  }[];
  nodes: {
    id: string;
    name: string;
    type: 'api' | 'service' | 'queue' | 'db' | 'external';
    symbol: string;
    badge: string;
    x: number; // percentage coordinate
    y: number;
    details: {
      complexity: number;
      callers: number;
      downstream: number;
      coverage: string;
    };
  }[];
  edges: {
    from: string;
    to: string;
    label: string;
    animated?: boolean;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'checkout',
    title: 'FastAPI Order Checkout',
    fileName: 'app/routers/checkout.py',
    language: 'Python',
    badge: 'FastAPI + SQLAlchemy + Kafka',
    description: 'Track how an async HTTP checkout route dispatches DB transactions and queues asynchronous notifications.',
    codeLines: [
      { lineNum: 1, text: 'from fastapi import APIRouter, Depends, HTTPException' },
      { lineNum: 2, text: 'from app.services.payment import PaymentGateway' },
      { lineNum: 3, text: 'from app.infrastructure.database import get_db, AsyncSession' },
      { lineNum: 4, text: 'from app.events.publisher import EventBus' },
      { lineNum: 5, text: '' },
      { lineNum: 6, text: '@router.post("/checkout/orders", status_code=201)', symbolId: 'node-api' },
      { lineNum: 7, text: 'async def process_checkout(', symbolId: 'node-service' },
      { lineNum: 8, text: '    payload: OrderCreateRequest,' },
      { lineNum: 9, text: '    db: AsyncSession = Depends(get_db),' },
      { lineNum: 10, text: '    bus: EventBus = Depends(get_event_bus),' },
      { lineNum: 11, text: ') -> OrderResponse:' },
      { lineNum: 12, text: '    # 1. Authorize Stripe Transaction' },
      { lineNum: 13, text: '    charge = await PaymentGateway.charge(', symbolId: 'node-payment' },
      { lineNum: 14, text: '        amount=payload.total_cents, currency="usd"' },
      { lineNum: 15, text: '    )' },
      { lineNum: 16, text: '    # 2. Persist Order in PostgreSQL' },
      { lineNum: 17, text: '    order = OrderRecord(user_id=payload.user_id, status="PAID")', symbolId: 'node-db' },
      { lineNum: 18, text: '    db.add(order)' },
      { lineNum: 19, text: '    await db.commit()' },
      { lineNum: 20, text: '    # 3. Publish Event to Kafka Queue' },
      { lineNum: 21, text: '    await bus.publish("order.created", {"order_id": order.id})', symbolId: 'node-queue' },
      { lineNum: 22, text: '    return OrderResponse.from_orm(order)' },
    ],
    nodes: [
      {
        id: 'node-api',
        name: 'POST /checkout/orders',
        type: 'api',
        symbol: 'routers.checkout:process_checkout',
        badge: 'REST Route',
        x: 12,
        y: 20,
        details: { complexity: 2, callers: 5, downstream: 3, coverage: '98%' },
      },
      {
        id: 'node-service',
        name: 'OrderProcessor',
        type: 'service',
        symbol: 'services.order:OrderProcessor',
        badge: 'Core Service',
        x: 42,
        y: 20,
        details: { complexity: 5, callers: 2, downstream: 3, coverage: '94%' },
      },
      {
        id: 'node-payment',
        name: 'Stripe Gateway',
        type: 'external',
        symbol: 'services.payment:PaymentGateway',
        badge: '3rd Party API',
        x: 78,
        y: 12,
        details: { complexity: 3, callers: 4, downstream: 1, coverage: '90%' },
      },
      {
        id: 'node-db',
        name: 'PostgreSQL DB',
        type: 'db',
        symbol: 'models.order:OrderRecord',
        badge: 'ACID Storage',
        x: 78,
        y: 50,
        details: { complexity: 1, callers: 7, downstream: 0, coverage: '100%' },
      },
      {
        id: 'node-queue',
        name: 'Kafka Broker',
        type: 'queue',
        symbol: 'events:orders.created',
        badge: 'Event Stream',
        x: 42,
        y: 65,
        details: { complexity: 2, callers: 3, downstream: 2, coverage: '96%' },
      },
      {
        id: 'node-notification',
        name: 'Email Worker',
        type: 'service',
        symbol: 'workers.notify:send_receipt',
        badge: 'Consumer',
        x: 78,
        y: 80,
        details: { complexity: 3, callers: 1, downstream: 1, coverage: '88%' },
      },
    ],
    edges: [
      { from: 'node-api', to: 'node-service', label: 'HTTP / Invoke', animated: true },
      { from: 'node-service', to: 'node-payment', label: 'Auth & Charge', animated: true },
      { from: 'node-service', to: 'node-db', label: 'Async Write', animated: false },
      { from: 'node-service', to: 'node-queue', label: 'Produce Event', animated: true },
      { from: 'node-queue', to: 'node-notification', label: 'Async Consume', animated: true },
    ],
  },
  {
    id: 'auth',
    title: 'TypeScript JWT Session Guard',
    fileName: 'src/middleware/authGuard.ts',
    language: 'TypeScript',
    badge: 'Express + Redis Cache',
    description: 'Inspect token decoding, Redis token blacklist validation, and user profile injection.',
    codeLines: [
      { lineNum: 1, text: 'import { Request, Response, NextFunction } from "express";' },
      { lineNum: 2, text: 'import { verifyJwtToken } from "../security/jwt";' },
      { lineNum: 3, text: 'import { redisClient } from "../cache/redis";' },
      { lineNum: 4, text: 'import { UserRepository } from "../data/userRepo";' },
      { lineNum: 5, text: '' },
      { lineNum: 6, text: 'export async function authGuard(', symbolId: 'node-api' },
      { lineNum: 7, text: '  req: Request, res: Response, next: NextFunction', symbolId: 'node-service' },
      { lineNum: 8, text: ') {' },
      { lineNum: 9, text: '  const token = req.headers.authorization?.split(" ")[1];' },
      { lineNum: 10, text: '  if (!token) throw new UnauthorizedError();' },
      { lineNum: 11, text: '  // 1. Check Redis Revocation Cache' },
      { lineNum: 12, text: '  const isRevoked = await redisClient.get(`blacklist:${token}`);', symbolId: 'node-queue' },
      { lineNum: 13, text: '  if (isRevoked) return res.status(401).json({ error: "Revoked" });' },
      { lineNum: 14, text: '  // 2. Cryptographic Verification' },
      { lineNum: 15, text: '  const claims = verifyJwtToken(token);', symbolId: 'node-payment' },
      { lineNum: 16, text: '  // 3. Hydrate User Record' },
      { lineNum: 17, text: '  req.user = await UserRepository.findById(claims.sub);', symbolId: 'node-db' },
      { lineNum: 18, text: '  return next();' },
      { lineNum: 19, text: '}' },
    ],
    nodes: [
      {
        id: 'node-api',
        name: 'HTTP Middleware',
        type: 'api',
        symbol: 'middleware.auth:authGuard',
        badge: 'Pipeline Interceptor',
        x: 12,
        y: 25,
        details: { complexity: 4, callers: 18, downstream: 3, coverage: '97%' },
      },
      {
        id: 'node-payment',
        name: 'JWT Signer & Verifier',
        type: 'external',
        symbol: 'security.jwt:verifyJwtToken',
        badge: 'Crypto Util',
        x: 48,
        y: 15,
        details: { complexity: 2, callers: 12, downstream: 0, coverage: '100%' },
      },
      {
        id: 'node-queue',
        name: 'Redis Cache (TTL)',
        type: 'queue',
        symbol: 'cache.redis:BlacklistStore',
        badge: 'In-Memory Store',
        x: 48,
        y: 65,
        details: { complexity: 1, callers: 6, downstream: 0, coverage: '99%' },
      },
      {
        id: 'node-db',
        name: 'User Repository',
        type: 'db',
        symbol: 'data.user:UserRepository',
        badge: 'Postgres Entity',
        x: 82,
        y: 40,
        details: { complexity: 3, callers: 9, downstream: 1, coverage: '92%' },
      },
    ],
    edges: [
      { from: 'node-api', to: 'node-payment', label: 'Verify Sig', animated: true },
      { from: 'node-api', to: 'node-queue', label: 'Check Revocation', animated: true },
      { from: 'node-api', to: 'node-db', label: 'Find User By ID', animated: false },
    ],
  },
];

export const LiveCodeGraphPlayground: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const scenario = SCENARIOS[selectedScenarioIndex];

  const [activeSymbolId, setActiveSymbolId] = useState<string>('node-service');
  const [isSimulateMode, setIsSimulateMode] = useState<boolean>(false);

  const activeNode = scenario.nodes.find((n) => n.id === activeSymbolId) || scenario.nodes[0];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'api':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800',
          glow: 'ring-blue-400/40',
        };
      case 'service':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-400',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800',
          glow: 'ring-emerald-400/40',
        };
      case 'queue':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800',
          glow: 'ring-amber-400/40',
        };
      case 'db':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-400',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-800',
          glow: 'ring-purple-400/40',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-300',
          text: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-800',
          glow: 'ring-slate-400/40',
        };
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Globe className="w-3.5 h-3.5" />;
      case 'service':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'queue':
        return <Zap className="w-3.5 h-3.5" />;
      case 'db':
        return <Database className="w-3.5 h-3.5" />;
      default:
        return <CreditCard className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-20 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Code vs Graph Topology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            See the Architecture Living Inside Every Line of Code
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Hover or click any symbol in the code editor to watch the architectural topology light up. Switch simulation mode to preview blast radius before opening a Pull Request.
          </p>
        </div>

        {/* Playground Shell */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
          {/* Top Control Bar */}
          <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Scenario Switcher Tabs */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
                Scenario:
              </span>
              {SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setActiveSymbolId(sc.nodes[0].id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedScenarioIndex === idx
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{sc.title}</span>
                </button>
              ))}
            </div>

            {/* Simulation Mode Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-subtle hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={isSimulateMode}
                  onChange={(e) => setIsSimulateMode(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${isSimulateMode ? 'text-amber-500' : 'text-slate-400'}`} />
                  Simulate Breaking Change
                </span>
                {isSimulateMode && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                    Risk Alert
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Interactive Split Body: Code (Left) vs Graph (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[500px]">
            {/* LEFT: Code Editor Window (7 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col bg-white">
              {/* Editor Header Bar */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-slate-700 font-semibold ml-2">
                    {scenario.fileName}
                  </span>
                </div>
                <Badge variant="blue" size="sm">
                  {scenario.language}
                </Badge>
              </div>

              {/* Code Content */}
              <div className="p-4 font-mono text-xs overflow-x-auto flex-1 bg-white select-none space-y-0.5">
                {scenario.codeLines.map((line) => {
                  const isMatchingNode = line.symbolId && line.symbolId === activeSymbolId;
                  const isChangedLine = isSimulateMode && (line.lineNum === 7 || line.lineNum === 13);

                  return (
                    <div
                      key={line.lineNum}
                      onMouseEnter={() => {
                        if (line.symbolId) setActiveSymbolId(line.symbolId);
                      }}
                      onClick={() => {
                        if (line.symbolId) setActiveSymbolId(line.symbolId);
                      }}
                      className={`flex items-center gap-3 px-2 py-1 rounded transition-colors group ${
                        line.symbolId ? 'cursor-pointer' : ''
                      } ${
                        isMatchingNode
                          ? 'bg-blue-50/90 text-blue-900 border-l-2 border-blue-600 font-semibold'
                          : isChangedLine
                          ? 'bg-rose-50 text-rose-900 border-l-2 border-rose-500'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {/* Line Number */}
                      <span className="w-6 text-right text-slate-400 select-none text-[11px]">
                        {line.lineNum}
                      </span>

                      {/* Code Text with Symbol Tagging */}
                      <span className="flex-1 whitespace-pre leading-relaxed">
                        {line.text}
                      </span>

                      {/* Interactive Badge on Symbol Lines */}
                      {line.symbolId && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 transition-opacity ${
                            isMatchingNode
                              ? 'bg-blue-600 text-white font-bold opacity-100'
                              : 'bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          mapped symbol
                        </span>
                      )}

                      {/* Simulation Diff Badge */}
                      {isChangedLine && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                          modified signature
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Editor Tip */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>💡 Tip: Click or hover any highlighted line to focus its topology node</span>
                <span className="font-mono text-slate-400">AST parsed: 18 nodes</span>
              </div>
            </div>

            {/* RIGHT: Architecture Topology Canvas (6 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col bg-slate-50/40 relative">
              {/* Canvas Header */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    Live Architectural Graph
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-slate-500 font-medium">Real-time sync</span>
                </div>
              </div>

              {/* Canvas Area with Dot Grid & Graph Nodes */}
              <div className="relative flex-1 p-6 min-h-[360px] overflow-hidden flex flex-col justify-between">
                {/* Dot grid pattern background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(#94A3B8 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Simulated Blast Radius Alert Banner */}
                {isSimulateMode && (
                  <div className="relative z-10 p-3 bg-amber-50/95 border border-amber-300 rounded-xl mb-4 text-xs shadow-sm flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">
                        Pre-Commit Impact Detected: 2 Downstream Dependents
                      </div>
                      <div className="text-amber-800 text-[11px] mt-0.5">
                        Changing <code className="font-mono font-semibold">process_checkout()</code> affects{' '}
                        <span className="font-semibold underline">Stripe Gateway</span> and{' '}
                        <span className="font-semibold underline">Kafka Event Consumer</span>. Update test suites
                        before merging!
                      </div>
                    </div>
                  </div>
                )}

                {/* Architectural Node Cards */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto">
                  {scenario.nodes.map((node) => {
                    const isSelected = node.id === activeSymbolId;
                    const colors = getNodeColor(node.type);
                    const isImpacted = isSimulateMode && (node.id === 'node-payment' || node.id === 'node-queue');

                    return (
                      <div
                        key={node.id}
                        onClick={() => setActiveSymbolId(node.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all bg-white relative ${
                          isSelected
                            ? `border-blue-500 ring-2 ${colors.glow} shadow-md`
                            : isImpacted
                            ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 shadow-subtle'
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 truncate">
                            <span className={`p-1 rounded ${colors.bg} ${colors.text}`}>
                              {getNodeIcon(node.type)}
                            </span>
                            <span className="truncate">{node.name}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${colors.badge}`}>
                            {node.badge}
                          </span>
                        </div>

                        {/* Symbol path */}
                        <div className="font-mono text-[10px] text-slate-500 truncate">
                          {node.symbol}
                        </div>

                        {/* Downstream Risk Flag */}
                        {isImpacted && (
                          <div className="mt-2 text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Direct Downstream Risk</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Node Inspector Drawer */}
                <div className="relative z-10 mt-4 p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      AST Node Inspection: <span className="font-mono text-blue-700">{activeNode.name}</span>
                    </span>
                    <Badge variant="blue" size="sm">
                      {activeNode.badge}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Complexity</div>
                      <div className="font-bold text-slate-800">{activeNode.details.complexity}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Callers</div>
                      <div className="font-bold text-slate-800">{activeNode.details.callers}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Downstream</div>
                      <div className="font-bold text-slate-800">{activeNode.details.downstream}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Coverage</div>
                      <div className="font-bold text-emerald-600">{activeNode.details.coverage}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
