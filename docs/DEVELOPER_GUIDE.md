# Developer Guide

## Architecture

The application follows **Clean Architecture** with clear separation of concerns:

```
Request → Route → Controller → Service → Repository → Database
                ↓
            Validator (Zod)
                ↓
            Middleware (Auth, Error)
```

### Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| **Routes** | HTTP endpoint definitions, middleware chaining |
| **Controllers** | Request/response handling, no business logic |
| **Services** | Business logic, orchestration |
| **Repositories** | Database queries only |
| **Validators** | Input validation with Zod schemas |
| **Middlewares** | Cross-cutting concerns (auth, errors, upload) |
| **Helpers/Utils** | Reusable utility functions |

## Backend Conventions

### API Response

Always use `ApiResponse.success()` and `ApiResponse.error()`:

```javascript
return ApiResponse.success(res, 'Message', data);
return ApiResponse.error(res, 'Error message', errors, statusCode);
```

### Error Handling

Throw `AppError` for operational errors:

```javascript
throw new AppError('Contact not found', 404);
```

The centralized `errorHandler` middleware catches all errors.

### Validation

Define Zod schemas in `validators/index.js`. Apply via middleware:

```javascript
router.post('/', validate(contactSchema), contactController.create);
```

### Authentication

JWT payload: `{ id, email, role, name }`

Role-based access:
```javascript
router.use(authenticate, authorize('super_admin'));
router.use(authenticate, authorize('user'));
```

## Frontend Conventions

### Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
│   ├── ui/       # Generic UI (Button, Input, Modal)
│   └── layout/   # Layout components (Sidebar, DashboardLayout)
├── contexts/     # React contexts (Auth)
├── lib/          # API client
└── types/        # TypeScript interfaces
```

### API Client

Use the centralized `api` client:

```typescript
const res = await api.get<DashboardStats>('/dashboard/stats');
if (res.success && res.data) { /* use data */ }
```

### Auth Flow

1. Login stores JWT + user in localStorage
2. `AuthProvider` wraps the app
3. Protected routes redirect to `/login`
4. API client attaches Bearer token automatically

## Database

- Migrations in `backend/database/migrations/`
- Use Knex query builder in repositories
- Never write raw SQL in services/controllers

## Adding a New Feature

1. Create migration if new table needed
2. Add repository methods
3. Add service with business logic
4. Add Zod validator schema
5. Add controller methods
6. Register routes
7. Add frontend page/components
8. Update API documentation

## Code Style

- Use async/await (no callbacks)
- Descriptive variable names
- No business logic in controllers
- No HTTP concerns in services
- Sanitize HTML content in templates
- Hash passwords with bcrypt (12 rounds)

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| DB_* | backend/.env | MySQL connection |
| JWT_SECRET | backend/.env | JWT signing key |
| FRONTEND_URL | backend/.env | CORS origin |
| NEXT_PUBLIC_API_URL | frontend/.env.local | API base URL |

## Version 2 Roadmap

- Campaign management and scheduling
- Email analytics (open/click tracking)
- Drag-and-drop email builder
- Login as user (impersonation)
- Background job queue for bulk sending
- Payment/subscription system
- Email automation workflows
