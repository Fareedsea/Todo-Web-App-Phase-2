# Phase II: Todo Full-Stack Web Application Constitution

<!--
SYNC IMPACT REPORT
==================
Version Change: [INITIAL] → 1.0.0
Rationale: Initial constitution for Phase II Hackathon Todo project

Added Principles:
- I. Spec-Driven Development Mandate
- II. Phase II Scope Boundaries
- III. Technology Stack Constraints
- IV. Agent Authority & Separation of Concerns
- V. Security-First Architecture
- VI. API Contract Enforcement

Added Sections:
- Implementation Governance
- Testing & Validation Requirements
- Change Management Protocol
- Phase Completion Criteria

Templates Status:
✅ spec-template.md - Aligned (scope definition matches)
✅ plan-template.md - Aligned (constitution check section references this file)
✅ tasks-template.md - Aligned (task categorization matches principles)

Follow-up Items: None
-->

## Purpose

This constitution defines the **mandatory rules, constraints, and execution order** for Phase II of the Hackathon Todo project.

Phase II transforms a console-based Todo application into a **secure, multi-user, full-stack web application** using a **Spec-Driven, Agentic Development Workflow**.

This constitution is **binding** on all agents, tools, and implementations.

---

## Core Principles

### I. Spec-Driven Development Mandate

**Non-Negotiable Rule**: No agent may write or modify code without an **approved specification**.

All work MUST follow this strict order:
1. **Specify** → Create or update specifications in `/specs/`
2. **Plan** → Generate architectural plan from spec
3. **Task Breakdown** → Decompose plan into executable tasks
4. **Implement** → Execute tasks using Claude Code
5. **Validate** → Integration testing and spec compliance audit

Any attempt to skip or reorder steps is a **constitutional violation**.

**Rationale**: Spec-driven development ensures alignment between requirements and implementation, enables traceability, and prevents scope creep through ad-hoc coding.

---

### II. Phase II Scope Boundaries

**In-Scope** (Mandatory):
- Full-stack web application
- Multi-user support with user isolation
- Persistent storage using Neon PostgreSQL
- JWT-based authentication via Better Auth
- RESTful API with `/api/` prefix
- Responsive frontend UI

**Out-of-Scope** (Prohibited):
- AI features
- Chatbot functionality
- Phase III or later features
- Non-specified enhancements
- Technology substitutions

**Enforcement**: Agents MUST NOT introduce out-of-scope functionality. Any feature not explicitly listed in approved specs is prohibited.

**Rationale**: Strict scope control prevents feature creep, maintains focus on Phase II deliverables, and ensures consistent evaluation against hackathon criteria.

---

### III. Technology Stack Constraints

**Non-Negotiable Technology Requirements**:

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | Next.js (App Router) | 16+ | Modern React framework with SSR/SSG |
| Backend | FastAPI | Latest | High-performance Python async API |
| ORM | SQLModel | Latest | Type-safe Pydantic + SQLAlchemy |
| Database | Neon PostgreSQL | Serverless | Managed PostgreSQL with instant scaling |
| Auth | Better Auth | Latest | Modern auth library with JWT support |
| Specs | Spec-Kit Plus | Current | Structured specification framework |
| Implementation | Claude Code | Current | AI-assisted development tool |

**No substitutions or alternatives are permitted** without constitutional amendment.

**Rationale**: Technology constraints ensure consistent architecture, enable agent specialization, and prevent integration conflicts.

---

### IV. Agent Authority & Separation of Concerns

Each agent has **exclusive authority** within its domain:

| Agent | Authority | Boundaries |
|-------|----------|------------|
| Spec Writer Agent | Create/update specifications in `/specs/` | Cannot implement code |
| Architecture Planner Agent | System architecture design in plan.md | Cannot write specs or code |
| Database Engineer Agent | Schema design, SQLModel models, migrations | Cannot modify API or UI |
| Backend Engineer Agent | FastAPI endpoints, business logic, JWT validation | Cannot modify frontend or schema |
| Frontend Engineer Agent | Next.js UI, API client, Better Auth integration | Cannot modify backend or API contracts |
| Integration Tester Agent | End-to-end validation, spec compliance audits | Cannot implement features |

**Prohibitions** (apply to all agents):
- No agent may perform another agent's role
- No agent may modify specs outside its authority
- No agent may implement without approved specs and plan

**Rationale**: Clear boundaries prevent conflicts, enable parallel work, and ensure accountability for deliverables.

---

### V. Security-First Architecture

**Mandatory Security Requirements**:

1. **Authentication Enforcement**: All API endpoints MUST require a valid JWT token
2. **Backend Verification**: JWT tokens MUST be verified by the backend; client-provided user IDs are never trusted
3. **Data Ownership**: Backend MUST enforce user ownership at the query level (e.g., `WHERE user_id = authenticated_user.id`)
4. **Authorization Failures**: Unauthorized requests MUST return `401 Unauthorized`; forbidden access MUST return `403 Forbidden`
5. **No Trust Boundaries**: Frontend is untrusted; all validation and authorization happens on the backend

**Security is a constitutional requirement, not an implementation detail.**

**Rationale**: Multi-user applications require strict isolation to prevent data leaks, unauthorized access, and privilege escalation.

---

### VI. API Contract Enforcement

**Mandatory API Standards**:

1. **Spec Compliance**: REST API endpoints MUST match approved API specs exactly (path, method, request/response schemas)
2. **Route Prefix**: All routes MUST be prefixed with `/api/`
3. **Response Format**: All responses MUST be JSON with proper `Content-Type: application/json`
4. **Status Codes**: Errors MUST use proper HTTP status codes (400, 401, 403, 404, 422, 500)
5. **User Filtering**: Tasks MUST always be filtered by authenticated user (enforced at database query level)

**Rationale**: Contract enforcement ensures frontend-backend compatibility, enables independent development, and prevents runtime integration failures.

---

## Implementation Governance

### Monorepo & Spec-Kit Compliance

**Repository Structure** (Mandatory):

```
/                           # Monorepo root
├── specs/                  # All specifications (Spec-Kit Plus)
│   ├── features/          # Feature specifications
│   ├── api/               # API endpoint contracts
│   ├── database/          # Schema definitions
│   └── ui/                # UI component specs
├── backend/               # FastAPI application
│   ├── src/
│   ├── tests/
│   └── CLAUDE.md         # Backend-specific guidance
├── frontend/              # Next.js application
│   ├── src/
│   ├── tests/
│   └── CLAUDE.md         # Frontend-specific guidance
└── CLAUDE.md             # Root project guidance
```

**Spec Organization Rules**:
1. All specs MUST live under `/specs/` (never in code directories)
2. Spec subdirectories MUST follow Spec-Kit Plus conventions
3. Claude Code MUST reference specs using `@specs/...` syntax
4. Each workspace (backend, frontend) MUST have local `CLAUDE.md` with agent-specific guidance

**Rationale**: Consistent structure enables agent navigation, supports monorepo tooling, and separates specification from implementation.

---

### Execution Order & Approval Gates

**Mandatory Workflow** (violations block progress):

```
┌─────────────┐
│   Specify   │  Spec Writer Agent creates specifications
└──────┬──────┘
       │ ✓ Spec Approved
       ▼
┌─────────────┐
│    Plan     │  Architecture Planner generates design
└──────┬──────┘
       │ ✓ Plan Approved
       ▼
┌─────────────┐
│ Task Break  │  Generate tasks.md from plan
└──────┬──────┘
       │ ✓ Tasks Approved
       ▼
┌─────────────┐
│  Implement  │  Backend/Frontend/Database agents execute
└──────┬──────┘
       │ ✓ Implementation Complete
       ▼
┌─────────────┐
│  Validate   │  Integration Tester audits & verifies
└─────────────┘
```

**Approval Authority**:
- Spec approval: User or designated reviewer
- Plan approval: User or tech lead
- Task approval: Automatic (if generated from approved plan)
- Implementation approval: Integration Tester Agent

**Rationale**: Phased approval gates prevent rework, ensure alignment, and maintain traceability.

---

## Testing & Validation Requirements

### Mandatory Testing

**Integration Testing** (Non-Negotiable):
1. Every feature MUST be validated end-to-end before marking complete
2. Spec deviations MUST be reported and corrected (no silent drifts)
3. Security scenarios MUST be tested:
   - Missing JWT → `401 Unauthorized`
   - Invalid JWT → `401 Unauthorized`
   - Cross-user access attempts → `403 Forbidden` or filtered results
   - Expired JWT → `401 Unauthorized`

**Test Execution Authority**: Integration Tester Agent

**Acceptance Criteria**:
- All API endpoints respond per spec
- Authentication is enforced everywhere
- User data isolation is verified
- Frontend successfully communicates with backend
- Error handling matches specification

**Rationale**: Integration testing catches contract mismatches, security gaps, and spec deviations before deployment.

---

### Validation Protocols

**Spec Compliance Audit**:
1. Compare implemented API contracts against `/specs/api/`
2. Verify database schema matches `/specs/database/`
3. Confirm UI behavior matches `/specs/ui/`
4. Report deviations with severity (Critical, Major, Minor)

**Security Audit**:
1. Test all endpoints without JWT → expect `401`
2. Test all endpoints with invalid JWT → expect `401`
3. Attempt cross-user access → expect `403` or empty results
4. Verify user filtering in all queries

**Rationale**: Systematic audits ensure implementation fidelity and prevent security vulnerabilities.

---

## Change Management Protocol

### Spec-First Change Process

**Any requirement change MUST follow this process**:

1. **Identify Change**: Document requested change and rationale
2. **Update Spec**: Spec Writer Agent updates relevant spec in `/specs/`
3. **Update Plan**: Architecture Planner revises plan.md if architectural impact
4. **Update Tasks**: Regenerate tasks.md if task breakdown changes
5. **Implement**: Backend/Frontend agents execute updated tasks
6. **Revalidate**: Integration Tester Agent re-runs full test suite

**Prohibited Actions**:
- No code changes without updated specs
- No "quick fixes" that bypass spec updates
- No spec updates without user approval

**Rationale**: Spec-first changes maintain traceability, prevent drift, and ensure all artifacts stay synchronized.

---

### Version Control & Branching

**Branch Strategy**:
- `main` or `master`: Production-ready code only
- Feature branches: `###-feature-name` (e.g., `001-authentication`, `002-task-crud`)
- Spec changes: Commit to feature branch alongside code

**Commit Standards**:
- Prefix: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Include spec reference: `feat: implement task CRUD (per @specs/features/task-crud.md)`
- Co-authored by: `Co-Authored-By: Claude Code <noreply@anthropic.com>`

**Rationale**: Structured branching and commits enable traceability and rollback.

---

## Phase Completion Criteria

Phase II is considered **complete** ONLY when:

### Functional Completeness
- [ ] All Phase II specs are implemented per approved specifications
- [ ] Authentication flow is complete (register, login, logout, token refresh)
- [ ] Task CRUD operations work (create, read, update, delete)
- [ ] User data isolation is enforced (users only see their own tasks)
- [ ] Data persistence works correctly (Neon PostgreSQL)
- [ ] Frontend and backend communicate successfully

### Security Validation
- [ ] All API endpoints require valid JWT
- [ ] JWT verification is backend-enforced
- [ ] Cross-user access is prevented
- [ ] Unauthorized requests return proper status codes

### Integration Validation
- [ ] Integration Tester Agent has completed full audit
- [ ] No critical or major spec deviations remain
- [ ] All security tests pass
- [ ] Frontend-backend contracts validated

### Documentation Completeness
- [ ] All specs in `/specs/` are current and approved
- [ ] Architecture plan matches implementation
- [ ] CLAUDE.md files are accurate for each workspace

**Rationale**: Clear completion criteria prevent premature deployment and ensure hackathon requirements are fully met.

---

## Governance

### Constitutional Authority

1. **Supremacy**: This constitution supersedes all other practices, conventions, and informal agreements
2. **Amendments**: Require explicit user approval and version increment
3. **Compliance**: All PRs and reviews MUST verify constitutional compliance
4. **Justification**: Complexity or deviations MUST be justified in plan.md "Complexity Tracking" section
5. **Enforcement**: Integration Tester Agent has authority to block non-compliant implementations

### Amendment Process

**To amend this constitution**:
1. Propose change with rationale
2. Update this document via `/sp.constitution` command
3. Increment version per semantic versioning rules
4. Propagate changes to dependent templates
5. Notify all agents of constitutional updates

### Runtime Guidance

**For operational development guidance**, refer to:
- Root: `CLAUDE.md` (project-level guidance)
- Backend: `backend/CLAUDE.md` (FastAPI-specific guidance)
- Frontend: `frontend/CLAUDE.md` (Next.js-specific guidance)

**For architectural decisions**, document in:
- `history/adr/` (Architecture Decision Records)

**For prompt history**, store in:
- `history/prompts/` (Prompt History Records)

---

**Version**: 1.0.0
**Ratified**: 2026-02-04
**Last Amended**: 2026-02-04
