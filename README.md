# Velocity Zones Dashboard

A dashboard application to ingest strength training rep samples, compute per-rep velocity, and segment them into training zones.

## 🎯 Project Overview

This project provides a comprehensive solution for analyzing strength training data by categorizing rep velocities into distinct training zones. It helps athletes and coaches understand their training intensity distribution and optimize their workout programming.

## 🏗️ Architecture

This is a **Turborepo monorepo** with **pnpm workspaces** containing:

### Packages

- **`packages/web`** - React + Vite frontend with Material UI
- **`packages/api`** - Node.js backend with DDD + Hexagonal Architecture
- **`packages/shared`** - Shared TypeScript types and interfaces

### Backend Architecture (DDD + Hexagonal)

```
packages/api/src/
├── domain/           # Entities, value objects, aggregates
├── application/      # Use cases, input/output ports
├── interfaces/       # REST controllers
└── infrastructure/   # In-memory persistence adapters
```

## 🚀 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Material UI** for components
- **React Router** for routing
- **Vitest** for testing

### Backend

- **Node.js** with TypeScript
- **Express.js** for REST API
- **Domain-Driven Design** principles
- **Hexagonal Architecture** pattern
- **Vitest** for unit testing

### Tooling

- **Turborepo** for monorepo management
- **pnpm** for package management
- **ESLint** + **Prettier** for code quality
- **TypeScript** project references

## 📦 Available Commands

```bash
# Install dependencies
pnpm install

# Development (runs all packages in dev mode)
pnpm dev

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Format code
pnpm format
```

## 🏃‍♂️ Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development servers:**

   ```bash
   pnpm dev
   ```

   This will start:
   - Frontend at `http://localhost:3000`
   - API server at `http://localhost:3001`

3. **Build for production:**
   ```bash
   pnpm build
   ```

## 🔌 API Endpoints

### POST /reps

Create a new rep sample

```json
{
  "exerciseId": "string",
  "velocity": number,
  "metadata": {} // optional
}
```

### GET /zones

Get velocity zones with rep counts

```json
[
  {
    "id": "string",
    "name": "string",
    "minVelocity": number,
    "maxVelocity": number,
    "color": "string",
    "description": "string",
    "repCount": number
  }
]
```

### GET /health

Health check endpoint

## 🎯 Velocity Zones

The system categorizes rep velocities into four training zones:

1. **Strength Zone** (0.0 - 0.3 m/s) - Heavy resistance training
2. **Power Zone** (0.3 - 0.6 m/s) - Power development
3. **Speed-Strength Zone** (0.6 - 1.0 m/s) - Speed-strength development
4. **Speed Zone** (1.0 - 2.0 m/s) - Maximum speed training

## 🧪 Testing

Each package includes Vitest for testing:

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
pnpm --filter @velocity-zones/api test
pnpm --filter @velocity-zones/web test
pnpm --filter @velocity-zones/shared test
```

## 📁 Project Structure

```
velocity-zones-dashboard/
├── packages/
│   ├── api/                 # Node.js backend
│   │   ├── src/
│   │   │   ├── domain/      # Business logic
│   │   │   ├── application/ # Use cases
│   │   │   ├── interfaces/  # Controllers
│   │   │   └── infrastructure/ # Data persistence
│   │   └── package.json
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   └── test/        # Test utilities
│   │   └── package.json
│   └── shared/              # Shared types
│       ├── src/
│       └── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── package.json
```

## 🔧 Development Notes

- The project uses **TypeScript project references** for fast builds
- **In-memory persistence** is used for simplicity (no database required)
- **DDD principles** ensure clean separation of business logic
- **Hexagonal architecture** makes the system easily testable and adaptable
- All packages are configured with **ESLint** and **Prettier**

## 📝 TODO

This is a scaffolding project. Future enhancements could include:

- [ ] Real database integration (PostgreSQL, MongoDB)
- [ ] Authentication and user management
- [ ] Data visualization with charts
- [ ] Real-time updates with WebSockets
- [ ] Exercise management functionality
- [ ] Advanced analytics and reporting
- [ ] Mobile app support

---

**Built with ❤️ using Turborepo + pnpm**
