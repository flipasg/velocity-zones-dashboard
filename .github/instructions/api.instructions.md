---
description: 'Clean Architecture implementation with Domain Driven Design, SOLID principles, and TypeScript best practices for scalable backend APIs.'
applyTo: 'packages/api/**/*.ts'
---

# GitHub Copilot Instructions - Clean Architecture & DDD

**Description**: Clean Architecture implementation with Domain Driven Design, SOLID principles, and TypeScript best practices for scalable backend APIs.

**Apply To**: `packages/api/**/*`

## Project Structure & Naming Conventions

### Folder Structure (lowercase)

```
src/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   └── valueobjects/
├── application/
│   ├── usecases/
│   ├── dto/
│   └── ports/
├── infrastructure/
│   ├── database/
│   ├── http/
│   └── external/
└── presentation/
    ├── controllers/
    ├── middleware/
    └── routes/
```

### File Naming (PascalCase)

- Files: `UserEntity.ts`, `CreateUserUseCase.ts`, `UserRepository.ts`
- No "I" prefix for interfaces: `UserRepository.ts` (not `IUserRepository.ts`)
- Use descriptive suffixes: `Entity`, `Repository`, `UseCase`, `Dto`, `Controller`

## Code Generation Guidelines

### 1. Layered Architecture

- **Domain Layer**: Core business logic, entities, value objects
- **Application Layer**: Use cases, DTOs, application services
- **Infrastructure Layer**: Database, external APIs, frameworks
- **Presentation Layer**: Controllers, routes, middleware

### 2. Domain Driven Design

- Create rich domain entities with business logic
- Use value objects for complex data types
- Implement repository pattern for data access
- Apply domain services for cross-entity operations

### 3. SOLID Principles

- **Single Responsibility**: One class, one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable
- **Interface Segregation**: Many specific interfaces over one general
- **Dependency Inversion**: Depend on abstractions, not concretions

### 4. TypeScript Best Practices

- Use strict mode and enable all strict checks
- Prefer `type` over `interface` for unions and primitives
- Use `interface` for object shapes and extensibility
- Apply proper generics with meaningful constraints
- Utilize utility types: `Partial`, `Pick`, `Omit`, `Record`

## Code Templates

### Domain Entity

```typescript
export class UserEntity {
  private constructor(
    private readonly id: string,
    private email: string,
    private name: string
  ) {}

  static create(props: CreateUserProps): UserEntity {
    // Validation logic
    return new UserEntity(props.id, props.email, props.name);
  }

  updateEmail(newEmail: string): void {
    // Business logic
    this.email = newEmail;
  }

  getEmail(): string {
    return this.email;
  }
}
```

### Repository Pattern

```typescript
export abstract class UserRepository {
  abstract save(user: UserEntity): Promise<void>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
```

### Use Case

```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = UserEntity.create(dto);
    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user.getEmail());

    return UserResponseDto.fromEntity(user);
  }
}
```

## Dependency Injection Patterns

### Constructor Injection (Preferred)

```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly logger: Logger
  ) {}
}
```

### Container Registration

```typescript
// Container.ts
export class Container {
  private services = new Map<string, any>();

  register<T>(token: string, factory: () => T): void {
    this.services.set(token, factory);
  }

  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) throw new Error(`Service ${token} not found`);
    return factory();
  }
}

// Bootstrap.ts
export function configureContainer(): Container {
  const container = new Container();

  container.register('UserRepository', () => new DatabaseUserRepository());
  container.register('EmailService', () => new SmtpEmailService());
  container.register(
    'CreateUserUseCase',
    () =>
      new CreateUserUseCase(
        container.resolve('UserRepository'),
        container.resolve('EmailService')
      )
  );

  return container;
}
```

### Service Locator Pattern (Alternative)

```typescript
export class ServiceLocator {
  private static instance: ServiceLocator;
  private services = new Map<string, any>();

  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  get<T>(key: string): T {
    return this.services.get(key);
  }
}
```

### Factory Pattern Integration

```typescript
export class UseCaseFactory {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  createUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.userRepository, this.emailService);
  }

  updateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(this.userRepository);
  }
}
```

### Composition Root

```typescript
// Main.ts - Application entry point
class Application {
  private container: Container;

  constructor() {
    this.container = this.setupDependencies();
  }

  private setupDependencies(): Container {
    const container = new Container();

    // Infrastructure
    container.register('Database', () => new PostgreSQLDatabase());
    container.register('UserRepository', () =>
      new DatabaseUserRepository(container.resolve('Database'))
    );

    // Application Services
    container.register('CreateUserUseCase', () =>
      new CreateUserUseCase(container.resolve('UserRepository'))
    );

    // Presentation
    container.register('UserController', () =>
      new UserController(container.resolve('CreateUserUseCase'))
    );

    return container;
  }

  start(): void {
    const userController = this.container.resolve<UserController>('UserController');
    // Setup routes, etc.
  }
}

## Error Handling
- Create custom domain exceptions
- Use Result pattern or Either monad for error handling
- Validate inputs at boundaries
- Handle errors at appropriate layers

## Testing Guidelines
- Unit tests for domain entities and use cases
- Integration tests for repositories
- Mock external dependencies
- Test business rules and edge cases

## Performance Considerations
- Use lazy loading for large datasets
- Implement caching at infrastructure layer
- Apply database indexing strategies
- Consider pagination for list operations

---

When generating code, always follow these patterns and ensure proper separation of concerns across layers.
```
