# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

The Velocity Zones Dashboard is a Turborepo monorepo application for analyzing strength training data. It categorizes rep velocities into training zones (Strength, Power, Speed-Strength, Speed) to help athletes and coaches optimize workout programming.

## Architecture

This is a **Turborepo monorepo** with **pnpm workspaces** containing three packages:

- **`packages/web`** - React 18 + Vite frontend with Material UI and TypeScript
- **`packages/api`** - Node.js backend using Domain-Driven Design + Hexagonal Architecture  
- **`packages/shared`** - Shared TypeScript types and interfaces

### Backend Architecture (DDD + Hexagonal)

The API follows a clean architecture pattern:
```
packages/api/src/
├── domain/           # Core business entities and value objects
├── application/      # Use cases and business logic orchestration  
├── presentation/     # REST controllers and HTTP routes
└── infrastructure/   # In-memory data persistence adapters
```

Key architectural principles:
- **Domain-Driven Design**: Rich domain entities with business logic
- **Hexagonal Architecture**: Ports and adapters pattern for testability
- **Dependency Inversion**: Application layer depends on domain abstractions
- **In-memory persistence**: No database required, uses in-memory repositories

### Frontend Architecture

React application following modern patterns:
- **Component-based architecture** with TypeScript interfaces
- **Material UI v6** for consistent design system
- **Accessibility-first approach** with proper ARIA labels and semantic HTML
- **React Router** for client-side navigation
- **Shared types** from `@velocity-zones/shared` package

## Development Commands

### Core Commands (run from root)
```bash
# Install all dependencies
pnpm install

# Start all services in development mode  
pnpm dev
# This starts:
# - Frontend at http://localhost:3000
# - API server at http://localhost:3001

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint all packages  
pnpm lint

# Format all code
pnpm format
```

### Package-Specific Commands
```bash
# Run tests for specific package
pnpm --filter @velocity-zones/api test
pnpm --filter @velocity-zones/web test  
pnpm --filter @velocity-zones/shared test

# Run single test file
pnpm --filter @velocity-zones/api test -- RepEntity.test.ts

# API development
cd packages/api
pnpm dev          # Start API server only
pnpm build        # Build API package
pnpm start        # Run built API

# Frontend development  
cd packages/web
pnpm dev          # Start Vite dev server
pnpm build        # Build React app
pnpm preview      # Preview built app
```

## API Endpoints

### Core Endpoints
- **POST /reps** - Create rep sample with exerciseId, velocity, optional metadata
- **GET /zones** - Get velocity zones with rep counts and statistics
- **GET /health** - Health check endpoint

### Velocity Zone Classification
1. **Strength Zone** (0.0 - 0.3 m/s) - Heavy resistance training
2. **Power Zone** (0.3 - 0.6 m/s) - Power development  
3. **Speed-Strength Zone** (0.6 - 1.0 m/s) - Speed-strength development
4. **Speed Zone** (1.0 - 2.0 m/s) - Maximum speed training

## Code Standards & Patterns

### TypeScript Guidelines
- Strict TypeScript configuration across all packages
- Shared types in `@velocity-zones/shared` prevent type drift
- Explicit interfaces for all component props and API responses
- Use `type` for unions/primitives, `interface` for extensible objects

### React Component Standards  
All components must follow these patterns:
- Explicit `React.FC<Props>` typing with comprehensive interfaces
- Semantic HTML with proper ARIA attributes for accessibility
- Material UI theme integration using `sx` prop or `styled()` 
- Loading, error, and empty states with user-friendly messaging
- Responsive design using Material UI breakpoints

### Backend DDD Patterns
- **Entities**: Rich domain objects with business logic and validation
- **Value Objects**: Immutable objects representing domain concepts  
- **Repositories**: Abstract interfaces for data access (implemented by infrastructure)
- **Use Cases**: Application services orchestrating domain logic
- **Domain Services**: Cross-entity business operations

### File Naming Conventions
- **Backend**: PascalCase files (e.g., `UserEntity.ts`, `CreateUserUseCase.ts`)  
- **Frontend**: PascalCase for components (e.g., `Dashboard.tsx`, `RepList.tsx`)
- **Shared**: PascalCase for types and interfaces
- No "I" prefix for interfaces, use descriptive suffixes

## Development Workflow

### Adding New Features
1. **Define types** in `packages/shared/src` first
2. **Implement domain logic** in `packages/api/src/domain`  
3. **Create use cases** in `packages/api/src/application`
4. **Add API endpoints** in `packages/api/src/presentation`
5. **Build UI components** in `packages/web/src/components`
6. **Write tests** for all layers using Vitest

### Testing Strategy
- **Unit tests** for domain entities and value objects
- **Integration tests** for use cases and repositories  
- **Component tests** using React Testing Library
- **API tests** using supertest for HTTP endpoints
- Tests run automatically in Turborepo pipeline

### Code Quality
- **ESLint** with TypeScript rules enforced across packages
- **Prettier** for consistent formatting  
- **TypeScript strict mode** with project references for fast incremental builds
- **Turborepo caching** for efficient builds and tests

## Troubleshooting

### Common Issues
- **Port conflicts**: Default ports are 3000 (web) and 3001 (api)
- **Type errors**: Ensure `packages/shared` is built before other packages
- **Dependency issues**: Use `pnpm install` from root, not individual packages
- **Build failures**: Check TypeScript project references in tsconfig.json files

### Performance Notes  
- Uses **TypeScript project references** for fast incremental builds
- **Turborepo task caching** speeds up repeated operations
- **Vite HMR** provides instant feedback during frontend development
- **In-memory persistence** eliminates database setup complexity

## GitHub Copilot Instructions

The repository includes detailed Copilot instructions for clean architecture implementation:
- DDD principles with proper entity/value object patterns
- Hexagonal architecture with ports and adapters
- SOLID principles throughout the codebase
- TypeScript best practices with strict typing
- Dependency injection patterns using container registration

Refer to `.github/instructions/api.instructions.md` for comprehensive backend development guidelines.