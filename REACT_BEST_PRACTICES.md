# React Development Best Practices Guide

This guide outlines the React development best practices implemented in the Velocity Zones Dashboard project.

## Component Architecture

### Component Definition

```typescript
// ✅ Good: Explicit React.FC typing with proper props interface
interface DashboardProps {
  // Define props here if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  // Component implementation
};

// ❌ Avoid: Function declarations without explicit typing
function Dashboard() {
  // Implementation
}
```

### Props Interface Definition

```typescript
// ✅ Good: Well-defined props interface
interface RepListProps {
  reps: Rep[];
  loading?: boolean;
  onRepClick?: (rep: Rep) => void;
}

const RepList: React.FC<RepListProps> = ({
  reps,
  loading = false,
  onRepClick,
}) => {
  // Implementation
};
```

## Accessibility Standards

### Semantic HTML

```typescript
// ✅ Good: Semantic HTML structure
return (
  <main role="main">
    <Container maxWidth="lg">
      <Typography variant="h1" component="h1" gutterBottom>
        Dashboard Title
      </Typography>
      <section aria-labelledby="overview-title">
        <Typography variant="h2" id="overview-title">
          Overview
        </Typography>
      </section>
    </Container>
  </main>
);
```

### ARIA Attributes

```typescript
// ✅ Good: Proper ARIA attributes
<Card
  role="region"
  aria-label="Zone Summary Card"
  aria-labelledby="zone-summary-title"
>
  <CardContent>
    <Typography id="zone-summary-title" variant="h6">
      Zone Summary
    </Typography>
  </CardContent>
</Card>
```

### Loading and Error States

```typescript
// ✅ Good: Accessible loading states
if (loading) {
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress aria-label="Loading zones" />
    </Box>
  );
}

if (error) {
  return (
    <Alert severity="error" role="alert">
      Failed to load data. Please try again.
    </Alert>
  );
}
```

## TypeScript Best Practices

### Type Safety

```typescript
// ✅ Good: Strict typing
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

const fetchReps = async (): Promise<ApiResponse<Rep[]>> => {
  // Implementation
};
```

### Union Types for State

```typescript
// ✅ Good: Union types for predictable states
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const [loadingState, setLoadingState] = useState<LoadingState>('idle');
```

## State Management

### Local State

```typescript
// ✅ Good: Proper state initialization and typing
const [reps, setReps] = useState<Rep[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

### Effect Hooks

```typescript
// ✅ Good: Proper effect cleanup and dependencies
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getReps();
      if (isMounted) {
        setReps(response.data);
      }
    } catch (err) {
      if (isMounted) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, []);
```

## Material UI Integration

### Theme Consistency

```typescript
// ✅ Good: Using theme values
const StyledCard = styled(Card)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));
```

### Responsive Design

```typescript
// ✅ Good: Responsive breakpoints
<Grid
  container
  spacing={{ xs: 2, sm: 3, md: 4 }}
  sx={{
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 2, sm: 3 },
  }}
>
  <Grid item xs={12} md={6} lg={4}>
    <ZoneCard />
  </Grid>
</Grid>
```

## Testing Best Practices

### Component Testing

```typescript
// ✅ Good: Comprehensive component tests
describe('Dashboard Component', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Velocity Zones Dashboard');
  });

  it('has proper accessibility attributes', () => {
    render(<Dashboard />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
```

### Custom Render Utility

```typescript
// ✅ Good: Reusable test utilities
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
  render(ui, { wrapper: TestWrapper, ...options });
```

## Error Handling

### Error Boundaries

```typescript
// ✅ Good: Error boundary implementation
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" role="alert">
          Something went wrong. Please refresh the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimization

### Memoization

```typescript
// ✅ Good: Strategic use of useMemo and useCallback
const expensiveValue = useMemo(() => {
  return reps.reduce((acc, rep) => acc + rep.totalTime, 0);
}, [reps]);

const handleRepClick = useCallback(
  (rep: Rep) => {
    onRepClick?.(rep);
  },
  [onRepClick]
);
```

### Code Splitting

```typescript
// ✅ Good: Lazy loading for non-critical components
const AdvancedAnalytics = lazy(() => import('./AdvancedAnalytics'));

const Dashboard: React.FC = () => (
  <Suspense fallback={<CircularProgress />}>
    <AdvancedAnalytics />
  </Suspense>
);
```

## Folder Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── Dashboard/
│   └── __tests__/       # Component tests
├── hooks/               # Custom hooks
├── types/               # Type definitions
├── utils/               # Utility functions
├── services/            # API services
└── test-utils.tsx       # Testing utilities
```

## Code Quality

### ESLint Rules

- Use explicit return types for functions
- Prefer const over let where possible
- Use TypeScript strict mode
- Implement proper error handling
- Follow accessibility guidelines

### Prettier Configuration

- 2-space indentation
- Single quotes for strings
- Trailing commas
- Line length: 100 characters

This guide ensures consistent, maintainable, and accessible React development practices across the project.
