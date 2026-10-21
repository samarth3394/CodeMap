import { Project, ActivityItem, OnboardingStep } from '../types/project';
import { GraphNode, GraphEdge } from '../types/graph';
import { FileTreeNode, FileContentDetails } from '../types/explorer';
import { Conversation, SuggestedPrompt } from '../types/assistant';
import {
  DependencyItem,
  ImpactChangeProposal,
  TestSuite,
  SecurityVulnerability,
  GeneratedDocSection,
  AnalysisRun,
} from '../types/analysis';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-fastapi-commerce',
    name: 'fastapi-microcommerce',
    description: 'High-throughput asynchronous e-commerce checkout & order processing engine with Redis caching and PostgreSQL.',
    repositoryUrl: 'https://github.com/enterprise-org/fastapi-microcommerce',
    defaultBranch: 'main',
    languages: [
      { name: 'Python', percentage: 78.4, color: '#3572A5' },
      { name: 'TypeScript', percentage: 14.2, color: '#3178C6' },
      { name: 'Docker', percentage: 7.4, color: '#384d54' } as any,
    ],
    status: 'ready',
    lastAnalyzedAt: '12 minutes ago',
    commitHash: 'a8f9c1e',
    stats: {
      filesCount: 142,
      linesOfCode: 18450,
      modulesCount: 28,
      symbolsCount: 612,
      testCoverage: 88.5,
      securityScore: 94,
      maintainabilityIndex: 86,
      dependencyCount: 34,
    },
    tags: ['Microservice', 'FastAPI', 'Production', 'AsyncIO'],
    isStarred: true,
  },
  {
    id: 'proj-nexus-auth',
    name: 'nexus-auth-service',
    description: 'OAuth2 / OpenID Connect token issuance, multi-tenant RBAC enforcement, and session revocation cluster.',
    repositoryUrl: 'https://github.com/enterprise-org/nexus-auth-service',
    defaultBranch: 'v2-stable',
    languages: [
      { name: 'TypeScript', percentage: 91.0, color: '#3178C6' },
      { name: 'Rust', percentage: 9.0, color: '#DEA584' },
    ],
    status: 'ready',
    lastAnalyzedAt: '1 hour ago',
    commitHash: '72b0394',
    stats: {
      filesCount: 89,
      linesOfCode: 12100,
      modulesCount: 19,
      symbolsCount: 420,
      testCoverage: 94.2,
      securityScore: 98,
      maintainabilityIndex: 91,
      dependencyCount: 22,
    },
    tags: ['Security', 'OAuth2', 'Zero-Trust'],
    isStarred: true,
  },
  {
    id: 'proj-datapipe-engine',
    name: 'datapipe-stream-core',
    description: 'Distributed event streaming and real-time telemetry aggregation pipeline processing Kafka topics.',
    repositoryUrl: 'https://github.com/enterprise-org/datapipe-stream-core',
    defaultBranch: 'main',
    languages: [
      { name: 'Go', percentage: 86.5, color: '#00ADD8' },
      { name: 'Python', percentage: 13.5, color: '#3572A5' },
    ],
    status: 'ready',
    lastAnalyzedAt: '4 hours ago',
    commitHash: 'f44211a',
    stats: {
      filesCount: 215,
      linesOfCode: 34900,
      modulesCount: 42,
      symbolsCount: 890,
      testCoverage: 81.0,
      securityScore: 89,
      maintainabilityIndex: 82,
      dependencyCount: 48,
    },
    tags: ['Streaming', 'Kafka', 'High-Load'],
    isStarred: false,
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    projectId: 'proj-fastapi-commerce',
    projectName: 'fastapi-microcommerce',
    type: 'impact_analysis',
    description: 'Simulated impact of refactoring OrderProcessor.apply_discount() across 14 downstream call sites.',
    timestamp: '15 mins ago',
    user: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces' },
    status: 'completed',
  },
  {
    id: 'act-2',
    projectId: 'proj-fastapi-commerce',
    projectName: 'fastapi-microcommerce',
    type: 'security_scan',
    description: 'Automated SAST scan finished: 0 critical, 1 medium advisory identified in CORS configuration.',
    timestamp: '1 hour ago',
    user: { name: 'CI/CD Pipeline', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=96&h=96&fit=crop' },
    status: 'completed',
  },
  {
    id: 'act-3',
    projectId: 'proj-nexus-auth',
    projectName: 'nexus-auth-service',
    type: 'git_sync',
    description: 'Re-indexed commit 72b0394: parsed 420 AST nodes and updated dependency edge topology.',
    timestamp: '2 hours ago',
    user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=faces' },
    status: 'completed',
  },
  {
    id: 'act-4',
    projectId: 'proj-datapipe-engine',
    projectName: 'datapipe-stream-core',
    type: 'ai_query',
    description: 'AI architectural synthesis generated for "Explain partition rebalancing strategy".',
    timestamp: '4 hours ago',
    user: { name: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces' },
    status: 'completed',
  },
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'step-1',
    title: 'Explore the Interactive Code Map',
    description: 'Visualize architectural layers, service boundaries, and circular dependency risks in a spatial canvas.',
    completed: true,
    linkText: 'Open Code Map',
    linkPath: '/projects/proj-fastapi-commerce/codemap',
  },
  {
    id: 'step-2',
    title: 'Inspect AST Symbols in Code Explorer',
    description: 'Browse the repository tree with integrated syntax highlighting and function signatures.',
    completed: true,
    linkText: 'Browse Explorer',
    linkPath: '/projects/proj-fastapi-commerce/explorer',
  },
  {
    id: 'step-3',
    title: 'Query the Codebase with AI Intelligence',
    description: 'Ask deep architectural questions with exact file line citations and rationale.',
    completed: false,
    linkText: 'Ask CodeMap AI',
    linkPath: '/projects/proj-fastapi-commerce/ai',
  },
  {
    id: 'step-4',
    title: 'Run a Pre-Commit Impact Analysis',
    description: 'Simulate changes before writing code to verify callers, affected tests, and breaking changes.',
    completed: false,
    linkText: 'Run Simulation',
    linkPath: '/projects/proj-fastapi-commerce/impact',
  },
];

export const MOCK_GRAPH_NODES: GraphNode[] = [
  // Layer 1: API (presentation)
  {
    id: 'node-api-main',
    name: 'app.main:create_app',
    path: 'app/main.py',
    type: 'module',
    layer: 'api',
    x: 500,
    y: 70,
    size: 26,
    complexity: 'low',
    linesOfCode: 95,
    fanIn: 0,
    fanOut: 4,
    testCoverage: 98,
    tags: ['FastAPI', 'Bootstrap', 'Lifecycle'],
    description: 'Main application entrypoint. Configures middleware, exception handlers, and registers routers.',
    symbolsCount: 5,
    isEntrypoint: true,
  },
  {
    id: 'node-router-orders',
    name: 'api.orders:router',
    path: 'app/api/orders.py',
    type: 'service',
    layer: 'api',
    x: 200,
    y: 200,
    size: 24,
    complexity: 'medium',
    linesOfCode: 180,
    fanIn: 1,
    fanOut: 3,
    testCoverage: 92,
    tags: ['REST', 'Orders', 'HTTP'],
    description: 'REST routes for order creation, cancellation, status polling, and customer receipt generation.',
    symbolsCount: 8,
  },
  {
    id: 'node-router-auth',
    name: 'api.auth:router',
    path: 'app/api/auth.py',
    type: 'service',
    layer: 'api',
    x: 840,
    y: 200,
    size: 22,
    complexity: 'low',
    linesOfCode: 140,
    fanIn: 1,
    fanOut: 2,
    testCoverage: 95,
    tags: ['JWT', 'OAuth2', 'Security'],
    description: 'Authentication endpoints: JWT bearer token exchange, MFA validation, and refresh rotation.',
    symbolsCount: 6,
  },

  // Layer 2: Service Layer (orchestration)
  {
    id: 'node-service-payment',
    name: 'services.payment:StripeGateway',
    path: 'app/services/payment_gateway.py',
    type: 'class',
    layer: 'service',
    x: 80,
    y: 370,
    size: 24,
    complexity: 'medium',
    linesOfCode: 195,
    fanIn: 1,
    fanOut: 2,
    testCoverage: 88,
    tags: ['Stripe', 'Webhooks', 'Idempotent'],
    description: 'Payment authorization wrapper with automatic exponential backoff and idempotency keys.',
    symbolsCount: 8,
  },
  {
    id: 'node-service-checkout',
    name: 'services.checkout:CheckoutService',
    path: 'app/services/checkout_service.py',
    type: 'class',
    layer: 'service',
    x: 500,
    y: 370,
    size: 32,
    complexity: 'high',
    linesOfCode: 385,
    fanIn: 2,
    fanOut: 5,
    testCoverage: 86,
    tags: ['CoreFlow', 'Transactions', 'Orchestrator'],
    description: 'Primary checkout coordinator. Validates stock, locks cart, coordinates payment gateway, and fires events.',
    symbolsCount: 14,
  },
  {
    id: 'node-service-inventory',
    name: 'services.inventory:InventoryService',
    path: 'app/services/inventory_service.py',
    type: 'class',
    layer: 'service',
    x: 920,
    y: 370,
    size: 24,
    complexity: 'medium',
    linesOfCode: 210,
    fanIn: 1,
    fanOut: 3,
    testCoverage: 91,
    tags: ['Warehouse', 'StockReserve'],
    description: 'Atomic inventory management with distributed Redis locks to prevent overselling.',
    symbolsCount: 9,
  },

  // Layer 3: Domain Rules & External
  {
    id: 'node-ext-stripe',
    name: 'stripe.api.v1:ExternalAPI',
    path: 'external://api.stripe.com',
    type: 'external',
    layer: 'external',
    x: 80,
    y: 540,
    size: 20,
    complexity: 'low',
    linesOfCode: 0,
    fanIn: 1,
    fanOut: 0,
    testCoverage: 100,
    tags: ['ThirdParty', 'PaymentPCI'],
    description: 'External payment processing endpoint via Stripe REST API.',
    symbolsCount: 0,
  },
  {
    id: 'node-domain-pricing',
    name: 'domain.pricing:TaxAndDiscountRules',
    path: 'app/domain/pricing_rules.py',
    type: 'class',
    layer: 'domain',
    x: 460,
    y: 540,
    size: 26,
    complexity: 'medium',
    linesOfCode: 220,
    fanIn: 2,
    fanOut: 1,
    testCoverage: 96,
    tags: ['PureLogic', 'NoDependencies', 'Tax'],
    description: 'Deterministic pure pricing engine: discounts, tiered volume coupons, and regional VAT calculation.',
    symbolsCount: 11,
  },
  {
    id: 'node-model-order',
    name: 'models.order:OrderEntity',
    path: 'app/models/order.py',
    type: 'class',
    layer: 'domain',
    x: 860,
    y: 540,
    size: 22,
    complexity: 'low',
    linesOfCode: 150,
    fanIn: 4,
    fanOut: 1,
    testCoverage: 99,
    tags: ['Pydantic', 'SQLAlchemy', 'Schema'],
    description: 'Canonical order domain aggregate root and state transition validations.',
    symbolsCount: 7,
  },

  // Layer 4: Infrastructure & Storage
  {
    id: 'node-db-postgres',
    name: 'infrastructure.db:AsyncSessionPool',
    path: 'app/core/database.py',
    type: 'database',
    layer: 'infrastructure',
    x: 460,
    y: 720,
    size: 28,
    complexity: 'medium',
    linesOfCode: 110,
    fanIn: 4,
    fanOut: 1,
    testCoverage: 90,
    tags: ['PostgreSQL', 'SQLAlchemy-2.0', 'Pool'],
    description: 'Asyncpg connection pool with health probes, connection recycling, and read-replica routing.',
    symbolsCount: 4,
  },
  {
    id: 'node-cache-redis',
    name: 'infrastructure.cache:RedisCluster',
    path: 'app/core/redis.py',
    type: 'database',
    layer: 'infrastructure',
    x: 860,
    y: 720,
    size: 24,
    complexity: 'low',
    linesOfCode: 85,
    fanIn: 3,
    fanOut: 1,
    testCoverage: 93,
    tags: ['Redis', 'DistributedLock', 'SessionStore'],
    description: 'Redis client managing cart ttl caches, rate limiter buckets, and lock primitives.',
    symbolsCount: 5,
  },
];

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'node-api-main', target: 'node-router-orders', type: 'imports', weight: 3, label: 'include_router' },
  { id: 'e2', source: 'node-api-main', target: 'node-router-auth', type: 'imports', weight: 3, label: 'include_router' },
  { id: 'e3', source: 'node-router-orders', target: 'node-service-checkout', type: 'calls', weight: 5, label: 'process_checkout()' },
  { id: 'e4', source: 'node-service-checkout', target: 'node-service-payment', type: 'calls', weight: 4, label: 'charge_card()' },
  { id: 'e5', source: 'node-service-checkout', target: 'node-service-inventory', type: 'calls', weight: 4, label: 'reserve_items()' },
  { id: 'e6', source: 'node-service-checkout', target: 'node-domain-pricing', type: 'calls', weight: 3, label: 'compute_totals()' },
  { id: 'e7', source: 'node-service-checkout', target: 'node-model-order', type: 'data_flow', weight: 4, label: 'persists' },
  { id: 'e8', source: 'node-service-payment', target: 'node-ext-stripe', type: 'data_flow', weight: 5, label: 'HTTPS POST' },
  { id: 'e9', source: 'node-service-inventory', target: 'node-cache-redis', type: 'calls', weight: 4, label: 'acquire_lock()' },
  { id: 'e10', source: 'node-service-checkout', target: 'node-db-postgres', type: 'calls', weight: 5, label: 'commit_tx()' },
  { id: 'e11', source: 'node-domain-pricing', target: 'node-model-order', type: 'imports', weight: 2 },
  { id: 'e12', source: 'node-router-auth', target: 'node-cache-redis', type: 'calls', weight: 3, label: 'verify_token()' },
  { id: 'e13', source: 'node-model-order', target: 'node-db-postgres', type: 'inherits', weight: 2, label: 'BaseModel' },
];

export const MOCK_FILE_TREE: FileTreeNode = {
  id: 'root',
  name: 'fastapi-microcommerce',
  path: '',
  type: 'directory',
  children: [
    {
      id: 'dir-app',
      name: 'app',
      path: 'app',
      type: 'directory',
      children: [
        {
          id: 'file-main-py',
          name: 'main.py',
          path: 'app/main.py',
          type: 'file',
          extension: 'py',
          sizeBytes: 3120,
          linesCount: 95,
          symbolsCount: 5,
        },
        {
          id: 'dir-api',
          name: 'api',
          path: 'app/api',
          type: 'directory',
          children: [
            {
              id: 'file-orders-py',
              name: 'orders.py',
              path: 'app/api/orders.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 5400,
              linesCount: 180,
              symbolsCount: 8,
            },
            {
              id: 'file-auth-py',
              name: 'auth.py',
              path: 'app/api/auth.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 4200,
              linesCount: 140,
              symbolsCount: 6,
            },
          ],
        },
        {
          id: 'dir-services',
          name: 'services',
          path: 'app/services',
          type: 'directory',
          children: [
            {
              id: 'file-checkout-service-py',
              name: 'checkout_service.py',
              path: 'app/services/checkout_service.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 12400,
              linesCount: 385,
              symbolsCount: 14,
            },
            {
              id: 'file-inventory-service-py',
              name: 'inventory_service.py',
              path: 'app/services/inventory_service.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 6800,
              linesCount: 210,
              symbolsCount: 9,
            },
            {
              id: 'file-payment-gateway-py',
              name: 'payment_gateway.py',
              path: 'app/services/payment_gateway.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 5900,
              linesCount: 195,
              symbolsCount: 8,
            },
          ],
        },
        {
          id: 'dir-domain',
          name: 'domain',
          path: 'app/domain',
          type: 'directory',
          children: [
            {
              id: 'file-pricing-rules-py',
              name: 'pricing_rules.py',
              path: 'app/domain/pricing_rules.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 7100,
              linesCount: 220,
              symbolsCount: 11,
            },
          ],
        },
        {
          id: 'dir-models',
          name: 'models',
          path: 'app/models',
          type: 'directory',
          children: [
            {
              id: 'file-order-py',
              name: 'order.py',
              path: 'app/models/order.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 4800,
              linesCount: 150,
              symbolsCount: 7,
            },
          ],
        },
        {
          id: 'dir-core',
          name: 'core',
          path: 'app/core',
          type: 'directory',
          children: [
            {
              id: 'file-config-py',
              name: 'config.py',
              path: 'app/core/config.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 3200,
              linesCount: 110,
              symbolsCount: 4,
            },
            {
              id: 'file-database-py',
              name: 'database.py',
              path: 'app/core/database.py',
              type: 'file',
              extension: 'py',
              sizeBytes: 3900,
              linesCount: 115,
              symbolsCount: 6,
            },
          ],
        },
      ],
    },
    {
      id: 'dir-tests',
      name: 'tests',
      path: 'tests',
      type: 'directory',
      children: [
        {
          id: 'file-test-checkout-py',
          name: 'test_checkout.py',
          path: 'tests/test_checkout.py',
          type: 'file',
          extension: 'py',
          sizeBytes: 6100,
          linesCount: 190,
          symbolsCount: 12,
        },
        {
          id: 'file-test-pricing-py',
          name: 'test_pricing.py',
          path: 'tests/test_pricing.py',
          type: 'file',
          extension: 'py',
          sizeBytes: 4400,
          linesCount: 130,
          symbolsCount: 8,
        },
      ],
    },
    {
      id: 'file-pyproject-toml',
      name: 'pyproject.toml',
      path: 'pyproject.toml',
      type: 'file',
      extension: 'toml',
      sizeBytes: 2100,
      linesCount: 75,
      symbolsCount: 0,
    },
    {
      id: 'file-dockerfile',
      name: 'Dockerfile',
      path: 'Dockerfile',
      type: 'file',
      extension: '',
      sizeBytes: 1400,
      linesCount: 48,
      symbolsCount: 0,
    },
  ],
};

export const MOCK_FILE_CONTENT: Record<string, FileContentDetails> = {
  'app/services/checkout_service.py': {
    path: 'app/services/checkout_service.py',
    language: 'python',
    linesCount: 75,
    sizeFormatted: '12.4 KB',
    lastModified: '2026-10-18 14:32:00',
    content: `"""
FastAPI Microcommerce Checkout Service
Orchestrates order validation, distributed inventory reservations,
payment capture via Stripe, and transactional database persistence.
"""
from typing import Optional, List
from uuid import UUID, uuid4
import structlog
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderStatus, OrderItem
from app.services.inventory_service import InventoryService
from app.services.payment_gateway import StripeGateway, PaymentIntentResult
from app.domain.pricing_rules import TaxAndDiscountEngine
from app.core.exceptions import InventoryExhaustedError, PaymentFailedError

logger = structlog.get_logger(__name__)


class CheckoutService:
    """
    Core checkout orchestrator.
    Guarantees two-phase reservation before debiting external payment providers.
    """

    def __init__(
        self,
        db_session: AsyncSession,
        inventory_service: InventoryService,
        payment_gateway: StripeGateway,
        pricing_engine: Optional[TaxAndDiscountEngine] = None,
    ):
        self.db = db_session
        self.inventory = inventory_service
        self.payment = payment_gateway
        self.pricing = pricing_engine or TaxAndDiscountEngine()

    async def execute_checkout(
        self,
        user_id: UUID,
        items: List[OrderItem],
        payment_method_id: str,
        idempotency_key: str,
    ) -> Order:
        """
        Execute atomic checkout transaction with Redis reservation lock.
        
        Args:
            user_id: Authenticated customer UUID.
            items: Non-empty list of validated cart items.
            payment_method_id: Stripe payment method token.
            idempotency_key: Unique client request nonce.
        """
        correlation_id = str(uuid4())
        log = logger.bind(correlation_id=correlation_id, user_id=str(user_id))
        log.info("checkout.started", items_count=len(items))

        # 1. Calculate pricing & tax rules
        price_summary = self.pricing.calculate_total(items=items)

        # 2. Acquire inventory lock with 300s TTL
        reservation_token = await self.inventory.reserve_items(
            items=items,
            ttl_seconds=300,
        )
        if not reservation_token:
            log.warn("checkout.inventory_insufficient")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="One or more items in your cart are no longer available.",
            )

        try:
            # 3. Process payment through idempotent gateway
            charge: PaymentIntentResult = await self.payment.charge_card(
                amount_cents=price_summary.final_amount_cents,
                currency="USD",
                payment_method_id=payment_method_id,
                idempotency_key=f"chk_{idempotency_key}",
            )

            if not charge.success:
                await self.inventory.release_reservation(reservation_token)
                raise PaymentFailedError(charge.error_message)

            # 4. Commit order entity into PostgreSQL
            order = Order(
                id=uuid4(),
                user_id=user_id,
                status=OrderStatus.CONFIRMED,
                total_cents=price_summary.final_amount_cents,
                payment_intent_id=charge.payment_intent_id,
            )
            self.db.add(order)
            await self.db.commit()
            await self.db.refresh(order)

            # 5. Confirm permanent inventory decrement
            await self.inventory.commit_reservation(reservation_token)
            log.info("checkout.completed", order_id=str(order.id))
            return order

        except Exception as exc:
            log.error("checkout.failed", error=str(exc))
            await self.inventory.release_reservation(reservation_token)
            raise
`,
    symbols: [
      {
        id: 'sym-checkout-service',
        name: 'CheckoutService',
        kind: 'class',
        line: 21,
        endLine: 74,
        signature: 'class CheckoutService',
        docstring: 'Core checkout orchestrator. Guarantees two-phase reservation before debiting external payment providers.',
        visibility: 'public',
        referencesCount: 6,
        complexityScore: 12,
      },
      {
        id: 'sym-init',
        name: '__init__',
        kind: 'method',
        line: 27,
        endLine: 36,
        signature: 'def __init__(self, db_session, inventory_service, payment_gateway, pricing_engine=None)',
        visibility: 'public',
        referencesCount: 2,
        complexityScore: 2,
      },
      {
        id: 'sym-execute-checkout',
        name: 'execute_checkout',
        kind: 'method',
        line: 38,
        endLine: 74,
        signature: 'async def execute_checkout(self, user_id: UUID, items: List[OrderItem], payment_method_id: str, idempotency_key: str) -> Order',
        docstring: 'Execute atomic checkout transaction with Redis reservation lock.',
        visibility: 'public',
        referencesCount: 4,
        complexityScore: 8,
        calls: ['pricing.calculate_total', 'inventory.reserve_items', 'payment.charge_card', 'db.commit'],
      },
    ],
  },
  'app/main.py': {
    path: 'app/main.py',
    language: 'python',
    linesCount: 32,
    sizeFormatted: '3.1 KB',
    lastModified: '2026-10-18 10:15:00',
    content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.orders import router as orders_router
from app.api.auth import router as auth_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="FastAPI Microcommerce Engine",
    version="1.4.0",
    description="High-performance asynchronous checkout microservice",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(orders_router, prefix="/api/v1/orders", tags=["Orders"])

@app.get("/healthz")
async def health_check():
    return {"status": "ok", "service": "fastapi-microcommerce"}
`,
    symbols: [
      {
        id: 'sym-app',
        name: 'app',
        kind: 'variable',
        line: 9,
        endLine: 13,
        signature: 'app = FastAPI(...)',
        visibility: 'public',
        referencesCount: 3,
        complexityScore: 1,
      },
      {
        id: 'sym-health-check',
        name: 'health_check',
        kind: 'function',
        line: 25,
        endLine: 27,
        signature: 'async def health_check() -> dict',
        docstring: 'Kubernetes liveness and readiness probe endpoint.',
        visibility: 'public',
        referencesCount: 1,
        complexityScore: 1,
      },
    ],
  },
  'app/api/orders.py': {
    path: 'app/api/orders.py',
    language: 'python',
    linesCount: 45,
    sizeFormatted: '5.4 KB',
    lastModified: '2026-10-18 12:10:00',
    content: `from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.models.order import Order, OrderCreateRequest, OrderResponse
from app.services.checkout_service import CheckoutService
from app.core.dependencies import get_current_user, get_checkout_service

router = APIRouter()

@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order_endpoint(
    payload: OrderCreateRequest,
    current_user = Depends(get_current_user),
    service: CheckoutService = Depends(get_checkout_service),
) -> OrderResponse:
    """
    Initiate checkout for authenticated customer.
    Validates inventory stock and creates payment intent with idempotency.
    """
    order = await service.execute_checkout(
        user_id=current_user.id,
        items=payload.items,
        payment_method_id=payload.payment_method_id,
        idempotency_key=payload.idempotency_key,
    )
    return OrderResponse.from_orm(order)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: UUID,
    current_user = Depends(get_current_user),
) -> OrderResponse:
    """Retrieve details and fulfillment state of an existing order."""
    return OrderResponse(id=order_id, status="CONFIRMED")
`,
    symbols: [
      {
        id: 'sym-create-order-endpoint',
        name: 'create_order_endpoint',
        kind: 'function',
        line: 11,
        endLine: 28,
        signature: 'async def create_order_endpoint(payload, current_user, service) -> OrderResponse',
        docstring: 'Initiate checkout for authenticated customer.',
        visibility: 'public',
        referencesCount: 5,
        complexityScore: 4,
      },
      {
        id: 'sym-get-order-by-id',
        name: 'get_order_by_id',
        kind: 'function',
        line: 30,
        endLine: 36,
        signature: 'async def get_order_by_id(order_id: UUID, current_user) -> OrderResponse',
        docstring: 'Retrieve details and fulfillment state of an existing order.',
        visibility: 'public',
        referencesCount: 2,
        complexityScore: 2,
      },
    ],
  },
  'app/api/auth.py': {
    path: 'app/api/auth.py',
    language: 'python',
    linesCount: 38,
    sizeFormatted: '4.2 KB',
    lastModified: '2026-10-17 16:45:00',
    content: `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password, create_access_token
from app.core.database import get_db_session

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session = Depends(get_db_session),
):
    """Verify credentials and issue signed asymmetric JWT token."""
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"sub": str(user.id), "roles": user.roles})
    return {"access_token": access_token, "token_type": "bearer"}
`,
    symbols: [
      {
        id: 'sym-login-for-access-token',
        name: 'login_for_access_token',
        kind: 'function',
        line: 9,
        endLine: 24,
        signature: 'async def login_for_access_token(form_data, session) -> dict',
        docstring: 'Verify credentials and issue signed asymmetric JWT token.',
        visibility: 'public',
        referencesCount: 4,
        complexityScore: 3,
      },
    ],
  },
  'app/domain/pricing_rules.py': {
    path: 'app/domain/pricing_rules.py',
    language: 'python',
    linesCount: 52,
    sizeFormatted: '7.1 KB',
    lastModified: '2026-10-18 09:20:00',
    content: `from typing import List
from dataclasses import dataclass
from app.models.order import OrderItem

@dataclass(frozen=True)
class PriceSummary:
    subtotal_cents: int
    discount_cents: int
    tax_cents: int
    final_amount_cents: int

class TaxAndDiscountEngine:
    """Deterministic calculation of volume discounts and state tax rules."""

    def calculate_total(self, items: List[OrderItem], state_code: str = "CA") -> PriceSummary:
        subtotal = sum(item.price_cents * item.quantity for item in items)
        
        # Tiered volume discount
        discount = 0
        if subtotal > 10000:  # $100+
            discount = int(subtotal * 0.10)
        
        taxable_amount = subtotal - discount
        tax_rate = 0.0825 if state_code == "CA" else 0.05
        tax = int(taxable_amount * tax_rate)

        return PriceSummary(
            subtotal_cents=subtotal,
            discount_cents=discount,
            tax_cents=tax,
            final_amount_cents=taxable_amount + tax,
        )
`,
    symbols: [
      {
        id: 'sym-pricing-engine',
        name: 'TaxAndDiscountEngine',
        kind: 'class',
        line: 12,
        endLine: 35,
        signature: 'class TaxAndDiscountEngine',
        docstring: 'Deterministic calculation of volume discounts and state tax rules.',
        visibility: 'public',
        referencesCount: 5,
        complexityScore: 6,
      },
      {
        id: 'sym-calc-total',
        name: 'calculate_total',
        kind: 'method',
        line: 15,
        endLine: 35,
        signature: 'def calculate_total(self, items: List[OrderItem], state_code: str = "CA") -> PriceSummary',
        visibility: 'public',
        referencesCount: 4,
        complexityScore: 4,
      },
    ],
  },
  'app/models/order.py': {
    path: 'app/models/order.py',
    language: 'python',
    linesCount: 48,
    sizeFormatted: '4.8 KB',
    lastModified: '2026-10-17 11:30:00',
    content: `from enum import Enum
from uuid import UUID, uuid4
from pydantic import BaseModel, Field
from typing import List, Optional

class OrderStatus(str, Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    SHIPPED = "SHIPPED"

class OrderItem(BaseModel):
    sku: str
    quantity: int
    price_cents: int

class Order(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    status: OrderStatus = OrderStatus.PENDING_PAYMENT
    total_cents: int
    payment_intent_id: Optional[str] = None
`,
    symbols: [
      {
        id: 'sym-order-status',
        name: 'OrderStatus',
        kind: 'class',
        line: 6,
        endLine: 11,
        signature: 'class OrderStatus(str, Enum)',
        visibility: 'public',
        referencesCount: 8,
        complexityScore: 1,
      },
      {
        id: 'sym-order',
        name: 'Order',
        kind: 'class',
        line: 18,
        endLine: 25,
        signature: 'class Order(BaseModel)',
        visibility: 'public',
        referencesCount: 6,
        complexityScore: 1,
      },
    ],
  },
  'tests/test_checkout.py': {
    path: 'tests/test_checkout.py',
    language: 'python',
    linesCount: 42,
    sizeFormatted: '6.1 KB',
    lastModified: '2026-10-18 15:00:00',
    content: `import pytest
from uuid import uuid4
from app.models.order import OrderItem, OrderStatus
from app.services.checkout_service import CheckoutService

@pytest.mark.asyncio
async def test_successful_checkout_flow(mock_db, mock_inventory, mock_stripe):
    """Verify standard happy path execution commits reservation and order."""
    service = CheckoutService(
        db_session=mock_db,
        inventory_service=mock_inventory,
        payment_gateway=mock_stripe,
    )
    items = [OrderItem(sku="SKU-881", quantity=2, price_cents=2500)]
    order = await service.execute_checkout(
        user_id=uuid4(),
        items=items,
        payment_method_id="pm_card_visa",
        idempotency_key="test_nonce_99",
    )
    assert order.status == OrderStatus.CONFIRMED
    assert mock_inventory.reserve_called_with_ttl == 300
    assert mock_db.committed is True
`,
    symbols: [
      {
        id: 'sym-test-checkout-flow',
        name: 'test_successful_checkout_flow',
        kind: 'function',
        line: 7,
        endLine: 24,
        signature: 'async def test_successful_checkout_flow(mock_db, mock_inventory, mock_stripe)',
        docstring: 'Verify standard happy path execution commits reservation and order.',
        visibility: 'public',
        referencesCount: 1,
        complexityScore: 2,
      },
    ],
  },
  'pyproject.toml': {
    path: 'pyproject.toml',
    language: 'toml',
    linesCount: 30,
    sizeFormatted: '2.1 KB',
    lastModified: '2026-10-15 08:00:00',
    content: `[project]
name = "fastapi-microcommerce"
version = "1.4.0"
description = "High-performance asynchronous checkout microservice"
dependencies = [
    "fastapi>=0.110.1",
    "pydantic>=2.7.0",
    "sqlalchemy[asyncio]>=2.0.29",
    "asyncpg>=0.29.0",
    "redis>=5.0.3",
    "stripe>=8.4.0",
    "structlog>=24.1.0",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
`,
    symbols: [],
  },
  'Dockerfile': {
    path: 'Dockerfile',
    language: 'dockerfile',
    linesCount: 20,
    sizeFormatted: '1.4 KB',
    lastModified: '2026-10-14 19:12:00',
    content: `FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`,
    symbols: [],
  },
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Checkout Transaction & Race Conditions',
    createdAt: 'Today, 2:15 PM',
    lastMessageSnippet: 'The checkout flow prevents overselling using a 2-phase Redis TTL lock before calling Stripe...',
    projectId: 'proj-fastapi-commerce',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        timestamp: '2:14 PM',
        text: 'How does the CheckoutService guarantee that two users buying the last item in stock do not oversell?',
      },
      {
        id: 'm2',
        sender: 'assistant',
        timestamp: '2:15 PM',
        text: `In **fastapi-microcommerce**, concurrency guarantees are implemented through a two-phase reservation pattern coordinated in [\`app/services/checkout_service.py\`](file:///app/services/checkout_service.py#L42-L55):

1. **Pre-Payment Lock (Reservation Token)**:
   Before debiting Stripe, [\`CheckoutService.execute_checkout\`](file:///app/services/checkout_service.py#L38) invokes [\`InventoryService.reserve_items()\`](file:///app/services/inventory_service.py#L45) with an explicit \`ttl_seconds=300\`. This executes an atomic Redis Lua script that checks the available stock bucket and decrements it within a single atomic cycle.

2. **Rejection on Conflict**:
   If stock is 0 or insufficient, \`reserve_items()\` returns \`None\`. The service raises an HTTP 409 Conflict immediately, before charging the customer's credit card.

3. **Compensating Rollback**:
   If the subsequent payment call fails or throws an exception, the \`try...except\` block releases the reservation token immediately:
   \`\`\`python
   except Exception as exc:
       await self.inventory.release_reservation(reservation_token)
       raise
   \`\`\`

4. **Permanent State Commit**:
   Only after Stripe confirms the transaction with \`charge.success = True\` and the PostgreSQL order row is committed does \`commit_reservation()\` lock the stock permanently.`,
        references: [
          { path: 'app/services/checkout_service.py', lines: '42-55', symbolName: 'execute_checkout' },
          { path: 'app/services/inventory_service.py', lines: '45-68', symbolName: 'reserve_items' },
        ],
        suggestedFollowUps: [
          'What happens if Redis becomes temporarily unreachable during checkout?',
          'How can we increase the Redis lock TTL for high-latency 3D Secure payments?',
          'Simulate the architectural impact of moving inventory to an event-driven Kafka stream.',
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Database Connection Pool Architecture',
    createdAt: 'Yesterday, 4:40 PM',
    lastMessageSnippet: 'The AsyncSessionPool in app/core/database.py uses asyncpg with pool_size=20 and max_overflow=10...',
    projectId: 'proj-fastapi-commerce',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        timestamp: 'Yesterday',
        text: 'What are the current PostgreSQL pool settings and how are read replicas routed?',
      },
      {
        id: 'm4',
        sender: 'assistant',
        timestamp: 'Yesterday',
        text: `The PostgreSQL layer is configured in [\`app/core/database.py\`](file:///app/core/database.py):

- **Driver**: \`postgresql+asyncpg\`
- **Base Pool Size**: \`20\` persistent connections per worker
- **Max Overflow**: \`10\` bursting connections
- **Connection Recycle**: \`1800\` seconds (30 minutes) to avoid stale socket drops behind AWS RDS load balancers.`,
        references: [
          { path: 'app/core/database.py', lines: '18-35', symbolName: 'AsyncSessionPool' },
        ],
        suggestedFollowUps: [
          'Show connection leak detection flags',
          'How to configure read-replica session routing for reports',
        ],
      },
    ],
  },
];

export const MOCK_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'sp-1',
    category: 'architecture',
    prompt: 'Explain the end-to-end order processing pipeline from HTTP ingress to database commit.',
    description: 'High-level architectural walkthrough across all microservice layers.',
  },
  {
    id: 'sp-2',
    category: 'impact',
    prompt: 'What happens if we rename OrderStatus.CONFIRMED or change its enum serialization?',
    description: 'Call graph impact analysis on databases, serializers, and frontend consumers.',
  },
  {
    id: 'sp-3',
    category: 'security',
    prompt: 'Audit the authentication flow and evaluate token expiration vulnerabilities.',
    description: 'Zero-trust verification on JWT claims, refresh rotation, and Redis blacklist.',
  },
  {
    id: 'sp-4',
    category: 'refactor',
    prompt: 'How could we decouple the Stripe payment gateway into an async webhook event?',
    description: 'Design recommendations for asynchronous event-driven payment confirmation.',
  },
];

export const MOCK_DEPENDENCIES: DependencyItem[] = [
  {
    id: 'dep-fastapi',
    name: 'fastapi',
    version: '0.110.1',
    latestVersion: '0.111.0',
    type: 'runtime',
    license: 'MIT',
    vulnerabilitiesCount: 0,
    healthScore: 98,
    usedInModulesCount: 12,
    isOutdated: true,
  },
  {
    id: 'dep-pydantic',
    name: 'pydantic',
    version: '2.7.0',
    latestVersion: '2.7.1',
    type: 'runtime',
    license: 'MIT',
    vulnerabilitiesCount: 0,
    healthScore: 99,
    usedInModulesCount: 22,
    isOutdated: false,
  },
  {
    id: 'dep-sqlalchemy',
    name: 'sqlalchemy[asyncio]',
    version: '2.0.29',
    latestVersion: '2.0.30',
    type: 'runtime',
    license: 'MIT',
    vulnerabilitiesCount: 0,
    healthScore: 96,
    usedInModulesCount: 16,
    isOutdated: false,
  },
  {
    id: 'dep-redis',
    name: 'redis-py',
    version: '5.0.3',
    latestVersion: '5.0.4',
    type: 'runtime',
    license: 'MIT',
    vulnerabilitiesCount: 0,
    healthScore: 94,
    usedInModulesCount: 8,
    isOutdated: false,
  },
  {
    id: 'dep-stripe',
    name: 'stripe',
    version: '8.4.0',
    latestVersion: '9.1.0',
    type: 'runtime',
    license: 'Apache-2.0',
    vulnerabilitiesCount: 1,
    healthScore: 82,
    usedInModulesCount: 3,
    isOutdated: true,
  },
  {
    id: 'dep-pytest',
    name: 'pytest-asyncio',
    version: '0.23.6',
    latestVersion: '0.23.6',
    type: 'dev',
    license: 'MIT',
    vulnerabilitiesCount: 0,
    healthScore: 97,
    usedInModulesCount: 6,
    isOutdated: false,
  },
];

export const MOCK_IMPACT_PROPOSALS: ImpactChangeProposal[] = [
  {
    id: 'prop-1',
    title: 'Modify TaxAndDiscountEngine.calculate_total() to require CurrencyCode',
    targetSymbol: 'TaxAndDiscountEngine.calculate_total',
    targetFile: 'app/domain/pricing_rules.py',
    changeType: 'signature_change',
    riskScore: 'high',
    impactedFiles: [
      {
        path: 'app/services/checkout_service.py',
        affectedSymbols: ['CheckoutService.execute_checkout'],
        riskLevel: 'direct',
        lines: [42],
      },
      {
        path: 'app/api/orders.py',
        affectedSymbols: ['preview_cart_pricing', 'create_order_endpoint'],
        riskLevel: 'transitive',
        lines: [68, 114],
      },
      {
        path: 'tests/test_pricing.py',
        affectedSymbols: ['test_single_item_tax', 'test_coupon_discount'],
        riskLevel: 'direct',
        lines: [22, 54],
      },
      {
        path: 'tests/test_checkout.py',
        affectedSymbols: ['test_successful_checkout_flow'],
        riskLevel: 'direct',
        lines: [88],
      },
    ],
    impactedTests: [
      { testFile: 'tests/test_pricing.py', testName: 'test_single_item_tax', mustUpdate: true },
      { testFile: 'tests/test_pricing.py', testName: 'test_coupon_discount', mustUpdate: true },
      { testFile: 'tests/test_checkout.py', testName: 'test_successful_checkout_flow', mustUpdate: true },
    ],
  },
  {
    id: 'prop-2',
    title: 'Deprecate OrderStatus.PENDING_PAYMENT in favor of PAYMENT_PROCESSING',
    targetSymbol: 'OrderStatus',
    targetFile: 'app/models/order.py',
    changeType: 'deprecation',
    riskScore: 'medium',
    impactedFiles: [
      {
        path: 'app/services/checkout_service.py',
        affectedSymbols: ['CheckoutService.execute_checkout'],
        riskLevel: 'direct',
        lines: [62],
      },
      {
        path: 'app/api/orders.py',
        affectedSymbols: ['poll_order_status'],
        riskLevel: 'direct',
        lines: [142],
      },
    ],
    impactedTests: [
      { testFile: 'tests/test_checkout.py', testName: 'test_order_status_progression', mustUpdate: true },
    ],
  },
];

export const MOCK_TEST_SUITES: TestSuite[] = [
  {
    id: 'suite-1',
    name: 'Unit Tests: Checkout & Orders',
    file: 'tests/test_checkout.py',
    total: 18,
    passed: 17,
    failed: 1,
    skipped: 0,
    durationSeconds: 2.4,
    cases: [
      {
        id: 'tc-1',
        name: 'test_successful_checkout_with_stripe_confirmation',
        file: 'tests/test_checkout.py',
        durationMs: 240,
        status: 'passed',
        coverageTarget: 'app.services.checkout_service:CheckoutService',
      },
      {
        id: 'tc-2',
        name: 'test_inventory_exhaustion_raises_409',
        file: 'tests/test_checkout.py',
        durationMs: 110,
        status: 'passed',
        coverageTarget: 'app.services.checkout_service:CheckoutService',
      },
      {
        id: 'tc-3',
        name: 'test_card_declined_releases_redis_lock',
        file: 'tests/test_checkout.py',
        durationMs: 195,
        status: 'failed',
        errorMessage: 'AssertionError: Redis lock key "resv_cart_88" was not expired within timeout window.',
        coverageTarget: 'app.services.checkout_service:CheckoutService',
      },
      {
        id: 'tc-4',
        name: 'test_idempotent_duplicate_submission',
        file: 'tests/test_checkout.py',
        durationMs: 140,
        status: 'passed',
        coverageTarget: 'app.services.checkout_service:CheckoutService',
      },
    ],
  },
  {
    id: 'suite-2',
    name: 'Domain Tests: Pricing Rules & Tax Engine',
    file: 'tests/test_pricing.py',
    total: 14,
    passed: 14,
    failed: 0,
    skipped: 0,
    durationSeconds: 0.8,
    cases: [
      {
        id: 'tc-5',
        name: 'test_tiered_volume_discount_thresholds',
        file: 'tests/test_pricing.py',
        durationMs: 45,
        status: 'passed',
        coverageTarget: 'app.domain.pricing_rules:TaxAndDiscountEngine',
      },
      {
        id: 'tc-6',
        name: 'test_california_state_tax_computation',
        file: 'tests/test_pricing.py',
        durationMs: 38,
        status: 'passed',
        coverageTarget: 'app.domain.pricing_rules:TaxAndDiscountEngine',
      },
    ],
  },
];

export const MOCK_SECURITY_FINDINGS: SecurityVulnerability[] = [
  {
    id: 'sec-1',
    title: 'Permissive CORS configuration in development environment',
    severity: 'medium',
    cwe: 'CWE-942',
    file: 'app/main.py',
    line: 18,
    description: 'CORS policy enables allow_origins="*" if environment variable CORS_ALLOWED_ORIGINS is not explicitly defined.',
    remediation: 'Require strict domain whitelist or reject requests lacking Origin validation in production configs.',
    status: 'open',
  },
  {
    id: 'sec-2',
    title: 'Outdated Stripe SDK dependency contains minor advisory',
    severity: 'low',
    cwe: 'CWE-1104',
    file: 'pyproject.toml',
    line: 14,
    description: 'stripe==8.4.0 is susceptible to rare timeout leakage when handling high-concurrency webhook bursts.',
    remediation: 'Upgrade to stripe>=9.1.0 in pyproject.toml.',
    status: 'triaged',
  },
];

export const MOCK_DOC_SECTIONS: GeneratedDocSection[] = [
  {
    id: 'doc-1',
    title: 'Architecture Overview & Flow Diagrams',
    modulePath: 'app/services/checkout_service.py',
    summary: 'The checkout subsystem coordinates transactional e-commerce order fulfillment via two-phase distributed reservations.',
    architectureNotes: `Flow Lifecycle:
1. Client POST /api/v1/orders/checkout with items & idempotency token.
2. In-memory pricing engine calculates taxes and cart discounts.
3. Redis cluster acquires atomic reservation with 5-minute lease.
4. Stripe REST API confirms payment authorization.
5. PostgreSQL async transaction commits order record.
6. Reservation committed permanently.`,
    endpointsOrInterfaces: [
      {
        name: 'CheckoutService.execute_checkout',
        signature: 'async def execute_checkout(user_id, items, payment_method_id, idempotency_key) -> Order',
        description: 'Orchestrates the complete atomic order fulfillment cycle with distributed safety.',
      },
    ],
    lastGenerated: '2 hours ago',
  },
  {
    id: 'doc-2',
    title: 'Authentication & Session Boundary',
    modulePath: 'app/api/auth.py',
    summary: 'Handles JWT bearer token issuance, password hashing via bcrypt, and refresh token blacklist validation.',
    architectureNotes: 'Stateless access tokens expire every 15 minutes. Long-lived refresh tokens are stored in encrypted Redis hashes with automatic revocation lists.',
    endpointsOrInterfaces: [
      {
        name: 'POST /api/v1/auth/token',
        signature: 'async def login(credentials: OAuth2PasswordRequestForm) -> TokenResponse',
        description: 'Verifies user identity and issues asymmetric RS256 signed JWT tokens.',
      },
    ],
    lastGenerated: '3 hours ago',
  },
];

export const MOCK_ANALYSIS_RUNS: AnalysisRun[] = [
  {
    id: 'run-104',
    branch: 'main',
    commitHash: 'a8f9c1e',
    commitMessage: 'feat(checkout): add redis two-phase reservation lock to prevent oversell',
    timestamp: 'Today, 2:10 PM',
    durationSeconds: 14,
    status: 'success',
    changesCount: 6,
    metricsDiff: {
      complexityDiff: 0.2,
      testCoverageDiff: 1.4,
      securityScoreDiff: 0.0,
    },
  },
  {
    id: 'run-103',
    branch: 'main',
    commitHash: '91bc442',
    commitMessage: 'fix(tax): California state county tax boundary rounding fix',
    timestamp: 'Yesterday, 5:30 PM',
    durationSeconds: 11,
    status: 'success',
    changesCount: 2,
    metricsDiff: {
      complexityDiff: -0.1,
      testCoverageDiff: 0.3,
      securityScoreDiff: 0.0,
    },
  },
  {
    id: 'run-102',
    branch: 'feat/stripe-v9',
    commitHash: '34e12da',
    commitMessage: 'chore(deps): bump stripe sdk to 8.4.0',
    timestamp: 'Oct 17, 11:20 AM',
    durationSeconds: 16,
    status: 'warning',
    changesCount: 1,
    metricsDiff: {
      complexityDiff: 0.0,
      testCoverageDiff: 0.0,
      securityScoreDiff: -2.0,
    },
  },
];
