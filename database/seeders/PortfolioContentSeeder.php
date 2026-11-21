<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\Admin\ClearPortfolioCacheAction;
use App\Models\Article;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SkillGroup;
use App\Models\User;
use App\Support\MarkdownRenderer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

final class PortfolioContentSeeder extends Seeder
{
    public function __construct(
        private readonly MarkdownRenderer $markdown,
        private readonly ClearPortfolioCacheAction $clearCache,
    ) {}

    public function run(): void
    {
        $this->seedOwnerAccount();
        $this->seedSiteSettings();
        $this->seedProjects();
        $this->seedArticles();
        $this->seedExperiences();
        $this->seedSkillGroups();

        $this->clearCache->execute();
    }

    private function seedOwnerAccount(): void
    {
        $email = (string) env('PORTFOLIO_ADMIN_EMAIL', 'manoj@manojshrestha.dev');
        $password = (string) env('PORTFOLIO_ADMIN_PASSWORD', 'ChangeMeInProduction!2026');

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Manoj Shrestha',
                'password' => Hash::make($password),
                'is_owner' => true,
                'email_verified_at' => now(),
            ],
        );
    }

    private function seedSiteSettings(): void
    {
        $settings = [
            'hero' => [
                'headline' => 'Enterprise SaaS & Industrial Systems Architecture.',
                'subheadline' => 'Manoj Shrestha engineers high-throughput Laravel multi-tenant platforms, streaming ETL pipelines, and RS-232 hardware-to-web automation deployed across 500+ industrial terminals.',
                'availability_status' => 'Available for Principal/Staff Engineering & Enterprise Architecture',
            ],
            'telemetry' => [
                'items' => [
                    ['label' => 'Enterprise Paint Brands', 'value' => '10', 'unit' => 'Deployed'],
                    ['label' => 'Retail Dealer Terminals', 'value' => '500+', 'unit' => 'Active'],
                    ['label' => 'ETL Runtime Reduction', 'value' => '95%', 'unit' => '<45s / 64MB'],
                    ['label' => 'Mobile API Reduction', 'value' => '51%', 'unit' => '80 -> 39 Routes'],
                ],
            ],
            'cv' => [
                'active_pdf_path' => null,
            ],
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value_json' => $value],
            );
        }
    }

    private function seedProjects(): void
    {
        $now = Carbon::now();

        $projects = [
            [
                'slug' => 'industrial-paint-formulation-dispensing-suite',
                'title' => 'Industrial Paint Formulation & Dispensing Automation Suite',
                'category' => 'Industrial Automation & Streaming ETL',
                'is_flagship' => true,
                'summary' => 'Production paint tinting and robotic dispenser control platform deployed across 10 enterprise paint brands in Nepal (Apollo Paints, Pashupati, Everest Colour Spectra, Kanchanjunga, Siddhartha) powering 500+ retail dealer terminals.',
                'metrics_json' => [
                    ['label' => 'Enterprise Brands', 'value' => '10', 'unit' => 'Production Deployments'],
                    ['label' => 'Dealer Terminals', 'value' => '500+', 'unit' => 'Active Retail Nodes'],
                    ['label' => 'ETL Speedup', 'value' => '95%', 'unit' => '<45s on 64MB RAM'],
                    ['label' => 'Dispense Precision', 'value' => '1/192', 'unit' => 'fl oz via RS-232/FFM'],
                ],
                'tech_stack_json' => [
                    'Laravel',
                    'PHP 8.4',
                    'MySQL 8.0',
                    'Streaming XML/Excel ETL',
                    'RS-232 Serial Bridge',
                    'FFM Protocol',
                    '3D Euclidean RGB Matching',
                ],
                'body_markdown' => <<<'MD'
## Architectural Context

Industrial paint dealers operate under strict color accuracy tolerances across thousands of shade formulas, base cans, and colorant canisters. Legacy spreadsheet ingestion regularly exhausted PHP memory limits and stalled formula rollouts across retail dealer networks.

## Key Engineering Decisions

- **Streaming Formula ETL (`tint-data-upload-application`)**: Replaced full-workbook DOM parsing with chunked streaming readers capable of ingesting 15+ MB workbooks containing 100,000+ Excel formula cells in under 45 seconds within a 64MB RAM envelope, achieving a 95% runtime reduction.
- **3D Euclidean RGB Color Matching**: Implemented nearest-neighbor color lookup across calibrated shade spaces so operators can resolve target formulations deterministically.
- **RS-232 & FFM Hardware Bridge**: Engineered deterministic command serialization for Santint, Corob, and Hero robotic dispensers down to 1/192 fl oz volumetric precision.

## Production Footprint

Deployed across 10 enterprise paint brands in Nepal—including Apollo Paints, Pashupati, Everest Colour Spectra, Kanchanjunga, and Siddhartha—powering more than 500 retail dealer terminals.
MD,
                'diagram_mermaid' => <<<'MERMAID'
flowchart LR
    A[15MB+ Excel Formulas\n100k+ Cells] --> B[Streaming ETL Pipeline\n<45s / 64MB RAM]
    B --> C[(Normalized Formula DB\n10 Paint Brands)]
    C --> D[3D Euclidean RGB\nColor Matcher]
    D --> E[RS-232 / FFM Bridge\n1/192 fl oz]
    E --> F[Santint / Corob / Hero\n500+ Dealer Terminals]
MERMAID,
                'preview_image_path' => null,
                'sort_order' => 1,
                'published_at' => $now->copy()->subDays(40),
            ],
            [
                'slug' => 'fieldma-enterprise-multi-tenant-saas',
                'title' => 'FieldMA Enterprise Multi-Tenant SaaS Evolution',
                'category' => 'Multi-Tenant Enterprise SaaS',
                'is_flagship' => true,
                'summary' => 'Migrated a single-tenant field-operations monolith into a database-per-tenant SaaS platform on Laravel 13 + stancl/tenancy, cutting client onboarding from 3 days to under 5 minutes while eliminating 51% of legacy mobile API routes.',
                'metrics_json' => [
                    ['label' => 'Client Onboarding', 'value' => '<5 min', 'unit' => 'Down from 3 Days'],
                    ['label' => 'API Surface', 'value' => '39', 'unit' => 'Reduced from 80 (-51%)'],
                    ['label' => 'Isolation Model', 'value' => 'DB/Tenant', 'unit' => 'stancl/tenancy'],
                    ['label' => 'Field Telemetry', 'value' => 'Real-Time', 'unit' => 'GPS & Cash Audits'],
                ],
                'tech_stack_json' => [
                    'Laravel 13',
                    'stancl/tenancy',
                    'MySQL 8.0',
                    'Redis',
                    'REST API',
                    'GPS Telemetry',
                ],
                'body_markdown' => <<<'MD'
## Architectural Context

FieldMA began as a single-tenant field sales and cash-collection monolith where every new enterprise client required manual server cloning, divergent schema hotfixes, and 3 days of provisioning work.

## Key Engineering Decisions

- **Database-Per-Tenant Isolation**: Re-architected provisioning with `stancl/tenancy` so new enterprise workspaces spin up isolated databases in under 5 minutes.
- **Solving the "Early-Return" Migration Trap**: Eliminated conditional schema migrations that broke tenant parity. All tenants now share uniform schemas while plan capabilities are enforced strictly at the middleware feature-gating layer.
- **Mobile API Consolidation**: Audited and consolidated the mobile API surface from 80 legacy endpoints down to 39 strictly typed endpoints (a 51% dead route elimination).
- **Field Operations Integrity**: Delivered real-time GPS tracking and structured cash denomination auditing for distributed field representatives.
MD,
                'diagram_mermaid' => <<<'MERMAID'
flowchart TD
    A[Central Control Plane\nTenant Provisioning <5m] --> B[Middleware Feature Gates\nUniform Schema Guarantee]
    B --> C[(Tenant DB A)]
    B --> D[(Tenant DB B)]
    B --> E[(Tenant DB N)]
    F[Mobile Clients\n39 Typed Endpoints] --> B
MERMAID,
                'preview_image_path' => null,
                'sort_order' => 2,
                'published_at' => $now->copy()->subDays(32),
            ],
            [
                'slug' => 'algorithmic-bikram-sambat-date-engine',
                'title' => 'Algorithmic Bikram Sambat (BS) to Gregorian (AD) Date Engine',
                'category' => 'Algorithmic Systems & Ephemeris Engine',
                'is_flagship' => true,
                'summary' => 'Deterministic lunisolar calendar conversion engine backed by a 91-year astronomical ephemeris dataset (2000 BS – 2090 BS) anchored to 2000-09-17 BS <-> 1944-01-01 AD with sub-millisecond conversion latency and a zero-dependency Devanagari UI datepicker.',
                'metrics_json' => [
                    ['label' => 'Ephemeris Span', 'value' => '91 Years', 'unit' => '2000 BS – 2090 BS'],
                    ['label' => 'Epoch Anchor', 'value' => '1944-01-01', 'unit' => '2000-09-17 BS'],
                    ['label' => 'Conversion Latency', 'value' => '<1 ms', 'unit' => 'Deterministic'],
                    ['label' => 'UI Dependencies', 'value' => '0', 'unit' => 'Devanagari Picker'],
                ],
                'tech_stack_json' => [
                    'PHP 8.4',
                    'TypeScript',
                    'Lunisolar Ephemeris Matrix',
                    'Zero-Dependency DOM UI',
                ],
                'body_markdown' => <<<'MD'
## Architectural Context

Enterprise accounting, payroll, and compliance software in Nepal requires exact round-trip conversion between the lunisolar Bikram Sambat (BS) calendar—where month lengths vary between 29 and 32 days—and the Gregorian (AD) calendar.

## Key Engineering Decisions

- **91-Year Ephemeris Matrix**: Encoded verified month-length lookup tables spanning 2000 BS through 2090 BS.
- **Exact Epoch Anchor**: Anchored cumulative day-offset arithmetic to `2000-09-17 BS <-> 1944-01-01 AD` for deterministic, drift-free bidirectional conversion.
- **Sub-Millisecond Execution & Zero-Dependency UI**: Designed both the conversion engine and the Devanagari UI datepicker with zero runtime dependencies for drop-in use across enterprise ERP and SaaS applications.
MD,
                'diagram_mermaid' => <<<'MERMAID'
flowchart LR
    A[BS or AD Input Date] --> B[Epoch Anchor\n2000-09-17 BS = 1944-01-01 AD]
    B --> C[91-Year Ephemeris Matrix\n2000 BS – 2090 BS]
    C --> D[Cumulative Day Offset\n<1ms Deterministic]
    D --> E[Gregorian Output / Devanagari Datepicker]
MERMAID,
                'preview_image_path' => null,
                'sort_order' => 3,
                'published_at' => $now->copy()->subDays(25),
            ],
            [
                'slug' => 'bihani-zero-trust-licensing-gateway',
                'title' => 'Bihani Subscription System (Zero-Trust Licensing Gateway)',
                'category' => 'Security Architecture & SaaS Licensing',
                'is_flagship' => true,
                'summary' => 'Cryptographic licensing and entitlement gateway enforcing HMAC SHA-256 request signing, Redis nonce caching (600s TTL), 300-second timestamp drift defense against replay attacks, and MD5 state-version hashing for remote cache invalidation.',
                'metrics_json' => [
                    ['label' => 'Request Signing', 'value' => 'HMAC-256', 'unit' => 'Zero-Trust Auth'],
                    ['label' => 'Nonce Cache TTL', 'value' => '600s', 'unit' => 'Redis Replay Guard'],
                    ['label' => 'Clock Drift Window', 'value' => '300s', 'unit' => 'Timestamp Defense'],
                    ['label' => 'State Sync', 'value' => 'MD5 Hash', 'unit' => 'Entitlement Invalidation'],
                ],
                'tech_stack_json' => [
                    'Laravel',
                    'Redis',
                    'HMAC SHA-256',
                    'MySQL 8.0',
                    'Replay-Attack Defense',
                ],
                'body_markdown' => <<<'MD'
## Architectural Context

Distributed on-premise and dealer-installed software products require resilient license verification without exposing static bearer tokens or suffering from replay attacks and stale local entitlement caches.

## Key Engineering Decisions

- **HMAC SHA-256 Request Signing**: Every licensing heartbeat signs canonical payload fields, timestamp, and cryptographic nonce before reaching the gateway.
- **Replay-Attack Mitigation**: Rejects requests outside a 300-second timestamp drift window and records seen nonces in Redis with a 600-second TTL so captured packets cannot be replayed.
- **Deterministic Entitlement Synchronization**: Returns an MD5 state-version hash representing active subscription modules, allowing client terminals to invalidate local entitlement caches immediately when plans change.
MD,
                'diagram_mermaid' => <<<'MERMAID'
sequenceDiagram
    participant Client as Dealer Terminal
    participant Gateway as Bihani Licensing Gateway
    participant Redis as Redis Nonce Store
    Client->>Gateway: Signed Request (HMAC-SHA256 + Timestamp + Nonce)
    Gateway->>Gateway: Verify Signature & <=300s Drift
    Gateway->>Redis: SETNX Nonce (TTL 600s)
    Redis-->>Gateway: Unique Nonce Confirmed
    Gateway-->>Client: Entitlements + MD5 State-Version Hash
MERMAID,
                'preview_image_path' => null,
                'sort_order' => 4,
                'published_at' => $now->copy()->subDays(18),
            ],
            [
                'slug' => 'painter-loyalty-anti-counterfeit-qr',
                'title' => 'Multi-Tenant Painter Loyalty & Anti-Counterfeit QR Platform',
                'category' => 'Supply Chain & Fraud Prevention',
                'is_flagship' => false,
                'summary' => 'Multi-tenant supply-chain loyalty engine (`painter` / `neply-bPainter`) enforcing a 5-stage QR finite state machine (`Issued -> Dispatched -> Scanned -> Collected -> Verified`) paired with a `Qrscam` fraud detection trap.',
                'metrics_json' => [
                    ['label' => 'QR State Machine', 'value' => '5 Stages', 'unit' => 'Issued -> Verified'],
                    ['label' => 'Fraud Defense', 'value' => 'Qrscam', 'unit' => 'Counterfeit Trap'],
                ],
                'tech_stack_json' => ['Laravel', 'MySQL 8.0', 'QR Finite State Machine', 'Multi-Tenant', 'Anti-Counterfeit'],
                'body_markdown' => <<<'MD'
## Overview

Built for paint manufacturers (`painter` / `neply-bPainter`) to prevent duplicate voucher redemption and counterfeit bucket infiltration across retail distribution chains.

## Engineering Highlights

- **5-Stage QR Finite State Machine**: Enforces strict state transitions (`Issued -> Dispatched -> Scanned -> Collected -> Verified`) preventing out-of-order or duplicate reward claims.
- **`Qrscam` Fraud Trap**: Logs anomalous scan sequences, repeated invalid tokens, and geographic/actor collisions for compliance review.
MD,
                'diagram_mermaid' => <<<'MERMAID'
stateDiagram-v2
    [*] --> Issued
    Issued --> Dispatched
    Dispatched --> Scanned
    Scanned --> Collected
    Collected --> Verified
    Scanned --> Qrscam: Duplicate / Invalid Token
MERMAID,
                'preview_image_path' => null,
                'sort_order' => 5,
                'published_at' => $now->copy()->subDays(15),
            ],
            [
                'slug' => 'nyef-enterprise-community-portal',
                'title' => 'NYEF Enterprise Community & Event Portal',
                'category' => 'Enterprise Community Platform',
                'is_flagship' => false,
                'summary' => 'Multi-chapter member and event management platform (`nyef-web`) combining Spatie RBAC, real-time Ably WebSocket chat, Google FCM push notifications, and QR ticket verification.',
                'metrics_json' => [
                    ['label' => 'Access Control', 'value' => 'Multi-Chapter', 'unit' => 'Spatie RBAC'],
                    ['label' => 'Real-Time Layer', 'value' => 'Ably + FCM', 'unit' => 'WebSockets & Push'],
                ],
                'tech_stack_json' => ['Laravel', 'Spatie RBAC', 'Ably WebSockets', 'Google FCM', 'QR Ticketing'],
                'body_markdown' => <<<'MD'
## Overview

Enterprise portal (`nyef-web`) supporting regional chapters, executive committees, member directories, and live event check-ins.

## Engineering Highlights

- **Multi-Chapter Spatie RBAC**: Scoped permissions per regional chapter and committee hierarchy.
- **Real-Time Messaging & Push**: Integrated Ably WebSockets for low-latency chat and Google FCM for mobile event notifications.
- **QR Ticket Verification**: Fast on-site attendee validation with single-use check-in guards.
MD,
                'diagram_mermaid' => null,
                'preview_image_path' => null,
                'sort_order' => 6,
                'published_at' => $now->copy()->subDays(12),
            ],
            [
                'slug' => 'circular-fashion-consignment-platform',
                'title' => 'Circular Fashion Consignment Platform',
                'category' => 'Commerce & Financial Ledgers',
                'is_flagship' => false,
                'summary' => 'Consignment inventory and settlement platform (`thrift-store`) utilizing MySQL insert triggers for deterministic inventory code generation and dual-pricing margin ledgers.',
                'metrics_json' => [
                    ['label' => 'Inventory Codes', 'value' => 'MySQL Triggers', 'unit' => 'Atomic Generation'],
                    ['label' => 'Accounting Model', 'value' => 'Dual-Pricing', 'unit' => 'Margin Ledgers'],
                ],
                'tech_stack_json' => ['Laravel', 'MySQL 8.0 Triggers', 'Dual-Pricing Ledgers', 'Consignment ERP'],
                'body_markdown' => <<<'MD'
## Overview

Architected `thrift-store` to manage high-SKU-variance consignment inventory where every physical garment has unique ownership, condition grading, and payout splits.

## Engineering Highlights

- **MySQL Insert Triggers**: Guaranteed collision-free inventory code generation directly at the database layer.
- **Dual-Pricing Margin Ledgers**: Separated consignor payout liability from retail margin tracking for accurate settlement reporting.
MD,
                'diagram_mermaid' => null,
                'preview_image_path' => null,
                'sort_order' => 7,
                'published_at' => $now->copy()->subDays(9),
            ],
            [
                'slug' => 'wp-everest-security-overhaul',
                'title' => 'WP Everest Security Overhaul',
                'category' => 'Application Security & Modernization',
                'is_flagship' => false,
                'summary' => 'Structured 6-phase OWASP security remediation (`wp-everest`) migrating legacy password hashing to Bcrypt, converting raw SQL to parameterized PDO, and containerizing on PHP 8.5-FPM.',
                'metrics_json' => [
                    ['label' => 'Remediation Plan', 'value' => '6 Phases', 'unit' => 'OWASP Hardening'],
                    ['label' => 'Runtime Upgrade', 'value' => 'PHP 8.5-FPM', 'unit' => 'Dockerized'],
                ],
                'tech_stack_json' => ['PHP 8.5-FPM', 'Parameterized PDO', 'Bcrypt', 'OWASP Remediation', 'Docker'],
                'body_markdown' => <<<'MD'
## Overview

Led a 6-phase security overhaul of `wp-everest` to eliminate injection vectors, weak credential storage, and environment drift without interrupting production continuity.

## Engineering Highlights

- **Credential & Query Hardening**: Migrated legacy password hashes to Bcrypt and refactored dynamic SQL queries to parameterized PDO prepared statements.
- **Modern Container Runtime**: Packaged the hardened application onto PHP 8.5-FPM Docker containers with strict configuration hygiene.
MD,
                'diagram_mermaid' => null,
                'preview_image_path' => null,
                'sort_order' => 8,
                'published_at' => $now->copy()->subDays(6),
            ],
        ];

        foreach ($projects as $data) {
            $data['body_html'] = $this->markdown->toHtml($data['body_markdown']);
            Project::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
        }
    }

    private function seedArticles(): void
    {
        $now = Carbon::now();

        $articles = [
            [
                'slug' => 'bridging-web-software-and-industrial-automation-rs232-ffm',
                'title' => 'Bridging Web Software and Industrial Automation via RS-232 & FFM',
                'excerpt' => 'How to translate browser-calculated paint formulations into deterministic RS-232 and FFM command frames for Santint, Corob, and Hero dispensers down to 1/192 fl oz.',
                'target_audience' => 'Systems Architects & Industrial SaaS Engineers',
                'tags_json' => ['Industrial Automation', 'RS-232', 'FFM', 'Hardware Bridge'],
                'body_markdown' => <<<'MD'
## Why Browser Apps Struggle with Factory Hardware

Web applications operate asynchronously over HTTP, while robotic paint dispensers expect tightly framed serial packets over RS-232 or FFM file drop protocols with strict acknowledgment loops.

## Deterministic Command Framing

Across 500+ retail dealer terminals spanning 10 paint brands, separating formula calculation (3D Euclidean RGB matching and base-can scaling) from hardware dispatch ensures that a flaky serial cable never corrupts inventory state. Commands are quantized to 1/192 fl oz increments, checksummed, and acknowledged before marking a dispense transaction complete.
MD,
                'published_at' => $now->copy()->subDays(56),
            ],
            [
                'slug' => 'evolving-enterprise-monolith-to-multi-tenant-saas-laravel',
                'title' => 'Evolving an Enterprise Monolith to Multi-Tenant SaaS in Laravel',
                'excerpt' => 'Lessons from migrating FieldMA from a single-tenant monolith to database-per-tenant Laravel + stancl/tenancy, cutting onboarding from 3 days to under 5 minutes.',
                'target_audience' => 'Staff Engineers & CTOs',
                'tags_json' => ['Laravel', 'Multi-Tenancy', 'SaaS Architecture', 'stancl/tenancy'],
                'body_markdown' => <<<'MD'
## The Single-Tenant Ceiling

Cloning repositories and provisioning isolated VPS instances works for the first five enterprise accounts—and collapses by the twentieth. Onboarding took 3 days and schema drift made security patches hazardous.

## Database-Per-Tenant with Typed Boundaries

By introducing `stancl/tenancy` with automated tenant database provisioning and auditing the mobile API down from 80 routes to 39 strictly typed endpoints, onboarding dropped below 5 minutes while preserving hard data isolation per enterprise client.
MD,
                'published_at' => $now->copy()->subDays(49),
            ],
            [
                'slug' => 'early-return-migration-trap-multi-tenant-laravel',
                'title' => 'The "Early-Return" Migration Trap in Multi-Tenant Laravel',
                'excerpt' => 'Why conditional early returns inside tenant migrations silently fracture database parity—and how uniform schemas with middleware feature gating eliminate schema drift.',
                'target_audience' => 'Senior Laravel & Backend Engineers',
                'tags_json' => ['Laravel', 'MySQL', 'Migrations', 'Multi-Tenancy'],
                'body_markdown' => <<<'MD'
## How Schema Drift Starts Innocently

Developers frequently guard optional feature tables inside a migration using an early `if (! $tenant->hasFeature('x')) return;`. Months later, when that tenant upgrades plans, the migration table claims the migration already ran—yet the physical tables do not exist.

## The Structural Fix

Every tenant database must execute the exact same DDL schema unconditionally. Feature availability belongs strictly in stateless middleware and policy gates, never in migration control flow.
MD,
                'published_at' => $now->copy()->subDays(42),
            ],
            [
                'slug' => 'engineering-bikram-sambat-to-gregorian-lunisolar-date-engine',
                'title' => 'Engineering a Bikram Sambat to Gregorian Lunisolar Date Engine',
                'excerpt' => 'Designing a sub-millisecond BS <-> AD date conversion engine over a 91-year ephemeris dataset anchored to 2000-09-17 BS <-> 1944-01-01 AD.',
                'target_audience' => 'Backend & Algorithmic Engineers',
                'tags_json' => ['Algorithms', 'Calendars', 'PHP 8.4', 'TypeScript'],
                'body_markdown' => <<<'MD'
## Lunisolar Irregularity

Unlike Gregorian leap rules, Bikram Sambat month lengths depend on solar-lunar transit timings and range from 29 to 32 days. Analytical approximations drift across decades.

## Anchored Ephemeris Arithmetic

By encoding a verified 91-year month-length matrix (2000 BS – 2090 BS) and computing exact day deltas from the epoch anchor `2000-09-17 BS <-> 1944-01-01 AD`, bidirectional conversion executes in sub-millisecond constant memory and powers a zero-dependency Devanagari UI datepicker.
MD,
                'published_at' => $now->copy()->subDays(35),
            ],
            [
                'slug' => 'zero-trust-saas-licensing-architecting-hmac-signed-gateways',
                'title' => 'Zero-Trust SaaS Licensing: Architecting HMAC Signed Gateways',
                'excerpt' => 'Defending distributed licensing endpoints with HMAC SHA-256 request signing, 600s Redis nonce TTLs, 300s clock-drift windows, and MD5 entitlement hashes.',
                'target_audience' => 'Security Architects & SaaS Engineers',
                'tags_json' => ['Security', 'HMAC', 'Redis', 'Licensing'],
                'body_markdown' => <<<'MD'
## Beyond Static API Keys

Static license keys are trivial to intercept and replay across unauthorized terminals.

## Layered Defense in Bihani

1. **HMAC SHA-256 Signatures**: Bind HTTP method, path, body digest, timestamp, and unique nonce.
2. **300-Second Drift Window**: Rejects stale captures immediately.
3. **Redis Nonce Store (600s TTL)**: Guarantees single-use request envelopes across concurrent workers.
4. **MD5 State-Version Hashing**: Enables instant remote entitlement cache invalidation when subscriptions change.
MD,
                'published_at' => $now->copy()->subDays(28),
            ],
            [
                'slug' => 'high-throughput-excel-ingestion-100k-cells-64mb-ram',
                'title' => 'High-Throughput Excel Ingestion: Processing 100k Cells on 64MB RAM',
                'excerpt' => 'How streaming XML parsing and batched MySQL upserts reduced 15+ MB formula workbook ingestion by 95% to under 45 seconds within 64MB RAM.',
                'target_audience' => 'Performance & Data Pipeline Engineers',
                'tags_json' => ['ETL', 'Performance', 'PHP', 'MySQL'],
                'body_markdown' => <<<'MD'
## Why Standard Spreadsheet Libraries OOM

Loading a 15+ MB `.xlsx` workbook with 100,000+ formula cells into an in-memory object graph rapidly spikes PHP memory past 512MB and triggers worker kills.

## Streaming Row Generators & Batched Upserts

In `tint-data-upload-application`, switching to a streaming XML reader with bounded row buffers and chunked MySQL upserts dropped total runtime by 95%—completing full brand formula imports in under 45 seconds inside a strict 64MB RAM ceiling.
MD,
                'published_at' => $now->copy()->subDays(21),
            ],
            [
                'slug' => 'anti-counterfeit-supply-chain-loyalty-5-stage-qr-state-machines',
                'title' => 'Anti-Counterfeit Supply Chain Loyalty: 5-Stage QR State Machines',
                'excerpt' => 'Modeling QR token lifecycles (`Issued -> Dispatched -> Scanned -> Collected -> Verified`) with a `Qrscam` trap to neutralize counterfeit redemption.',
                'target_audience' => 'Domain Architects & Backend Engineers',
                'tags_json' => ['State Machines', 'Fraud Prevention', 'Laravel', 'Supply Chain'],
                'body_markdown' => <<<'MD'
## Closing the Loyalty Loop

A boolean `is_redeemed` column cannot distinguish between legitimate dealer handoffs, stolen factory sheets, and counterfeit photocopies.

## Explicit 5-Stage Transitions

Modeling every QR token through `Issued -> Dispatched -> Scanned -> Collected -> Verified` makes illegal state jumps immediately detectable. Any scan against an undispatched or previously collected token routes into the `Qrscam` fraud trap for audit telemetry.
MD,
                'published_at' => $now->copy()->subDays(14),
            ],
            [
                'slug' => 'hardening-legacy-php-monoliths-6-phase-owasp-guide',
                'title' => 'Hardening Legacy PHP Monoliths: A Practical 6-Phase OWASP Guide',
                'excerpt' => 'A repeatable remediation sequence from WP Everest: Bcrypt password migration, parameterized PDO refactoring, and PHP 8.5-FPM Dockerization.',
                'target_audience' => 'Engineering Leads & Security Engineers',
                'tags_json' => ['OWASP', 'PHP', 'Security', 'Docker'],
                'body_markdown' => <<<'MD'
## Incremental Hardening Without Rewrites

Legacy PHP systems rarely allow a six-month feature freeze. A phased OWASP remediation sequence retires the highest-severity risks first while keeping production online.

## Six Practical Phases

1. Perimeter & header hygiene
2. Parameterized PDO query replacement
3. Transparent Bcrypt password rehashing on login
4. Strict upload MIME validation & storage isolation
5. Dependency and session hardening
6. Immutable PHP 8.5-FPM containerization
MD,
                'published_at' => $now->copy()->subDays(7),
            ],
        ];

        foreach ($articles as $data) {
            $data['body_html'] = $this->markdown->toHtml($data['body_markdown']);
            $data['reading_time_mins'] = $this->markdown->estimateReadingTimeMins($data['body_markdown']);

            Article::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
        }
    }

    private function seedExperiences(): void
    {
        $experiences = [
            [
                'role_title' => 'Senior Full-Stack Software Engineer & Systems Architect',
                'organization' => 'Enterprise SaaS & Industrial Automation Systems (13 Repositories)',
                'period' => '6+ Years Production Engineering',
                'highlights_json' => [
                    'Architected and deployed the Industrial Paint Formulation & Dispensing Automation Suite across 10 enterprise paint brands powering 500+ retail dealer terminals with RS-232/FFM hardware bridging down to 1/192 fl oz.',
                    'Engineered streaming Excel ETL ingestion (`tint-data-upload-application`) processing 15+ MB / 100,000+ formula cells in <45s on 64MB RAM, delivering a 95% runtime reduction.',
                    'Led FieldMA migration from single-tenant monolith to database-per-tenant SaaS on Laravel 13 + stancl/tenancy, reducing onboarding from 3 days to <5 minutes and cutting mobile API endpoints from 80 to 39 (-51%).',
                    'Designed the Bihani zero-trust licensing gateway (HMAC SHA-256, 600s Redis nonce cache, 300s timestamp drift defense, MD5 state-version hashing) and the 91-year Bikram Sambat lunisolar date engine.',
                ],
                'sort_order' => 1,
            ],
            [
                'role_title' => 'Backend & Security Modernization Lead',
                'organization' => 'Supply Chain, Community & Consignment Platforms',
                'period' => 'Multi-Domain Enterprise Delivery',
                'highlights_json' => [
                    'Built the multi-tenant Painter Loyalty & Anti-Counterfeit QR platform (`painter` / `neply-bPainter`) featuring a 5-stage QR finite state machine and `Qrscam` fraud trap.',
                    'Delivered the NYEF Enterprise Community & Event Portal (`nyef-web`) with multi-chapter Spatie RBAC, Ably WebSocket chat, Google FCM notifications, and QR ticket validation.',
                    'Implemented MySQL insert triggers and dual-pricing margin ledgers for the Circular Fashion Consignment Platform (`thrift-store`).',
                    'Executed a 6-phase OWASP security overhaul on `wp-everest`, migrating credentials to Bcrypt, refactoring queries to parameterized PDO, and containerizing on PHP 8.5-FPM.',
                ],
                'sort_order' => 2,
            ],
        ];

        foreach ($experiences as $data) {
            Experience::query()->updateOrCreate(
                [
                    'role_title' => $data['role_title'],
                    'organization' => $data['organization'],
                ],
                $data,
            );
        }
    }

    private function seedSkillGroups(): void
    {
        $groups = [
            [
                'category' => 'Enterprise Backend & Multi-Tenant SaaS',
                'skills_json' => [
                    'Laravel 13 (PHP 8.4+)',
                    'stancl/tenancy (Database-per-Tenant)',
                    'MySQL 8.0 & Schema Architecture',
                    'Redis & Laravel Horizon',
                    'Spatie RBAC',
                    'REST API Design & Consolidation',
                ],
                'sort_order' => 1,
            ],
            [
                'category' => 'Industrial Automation & Algorithmic Systems',
                'skills_json' => [
                    'RS-232 Serial Hardware Bridging',
                    'FFM Robotic Dispenser Protocols',
                    'Streaming XML/Excel ETL (64MB RAM)',
                    '3D Euclidean RGB Color Matching',
                    'Lunisolar Ephemeris Date Engines',
                    'Finite State Machines',
                ],
                'sort_order' => 2,
            ],
            [
                'category' => 'Security, Licensing & Real-Time',
                'skills_json' => [
                    'HMAC SHA-256 Request Signing',
                    'Redis Nonce & Replay Defense',
                    'OWASP Remediation & PDO Hardening',
                    'Ably WebSockets',
                    'Google FCM Push Pipelines',
                    'Anti-Counterfeit QR Verification',
                ],
                'sort_order' => 3,
            ],
            [
                'category' => 'Frontend & Interactive Architecture',
                'skills_json' => [
                    'Inertia.js',
                    'React 19 & Strict TypeScript',
                    'Tailwind CSS v4 & shadcn/ui',
                    'Three.js & GLSL WebGL Shaders',
                    'Lenis, GSAP ScrollTrigger & Framer Motion',
                    'Docker Compose Local Parity',
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($groups as $data) {
            SkillGroup::query()->updateOrCreate(
                ['category' => $data['category']],
                $data,
            );
        }
    }
}
