# React Component Development Checklist

Use this checklist to ensure all React components meet our development standards.

## ✅ Component Structure

- [ ] Component uses explicit `React.FC<Props>` typing
- [ ] Props interface is properly defined with descriptive names
- [ ] Component file is named using PascalCase
- [ ] Default export is used for the main component
- [ ] Named exports are used for sub-components and utilities

## ✅ TypeScript Implementation

- [ ] All props have proper TypeScript interfaces
- [ ] Optional props use the `?` operator
- [ ] Default values are provided for optional props
- [ ] State variables have explicit typing
- [ ] Event handlers have proper typing
- [ ] API responses use defined interfaces from shared package

## ✅ Accessibility Standards

- [ ] Semantic HTML elements are used (`main`, `section`, `article`, `nav`)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Interactive elements have proper ARIA labels
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states are clearly visible
- [ ] Screen reader friendly error messages

## ✅ Material UI Best Practices

- [ ] Theme values used instead of hardcoded styles
- [ ] Responsive breakpoints implemented
- [ ] Consistent spacing using theme spacing
- [ ] Proper Material UI component variants
- [ ] Custom styles use `styled()` or `sx` prop
- [ ] Icons have appropriate size and color

## ✅ State Management

- [ ] State is properly typed with TypeScript
- [ ] Initial state values are meaningful
- [ ] State updates are immutable
- [ ] Loading states are handled gracefully
- [ ] Error states provide helpful feedback
- [ ] Empty states are informative

## ✅ Performance Considerations

- [ ] `useMemo` used for expensive calculations
- [ ] `useCallback` used for event handlers passed to children
- [ ] `React.lazy` used for code splitting when appropriate
- [ ] Unnecessary re-renders are avoided
- [ ] Large lists use virtualization if needed

## ✅ Error Handling

- [ ] API errors are caught and displayed to users
- [ ] Fallback UI provided for error states
- [ ] Error boundaries wrap risky components
- [ ] Network failures are handled gracefully
- [ ] User-friendly error messages

## ✅ Testing Coverage

- [ ] Component renders without crashing
- [ ] Key user interactions are tested
- [ ] Props variations are tested
- [ ] Accessibility features are tested
- [ ] Error states are tested
- [ ] Loading states are tested

## ✅ Code Quality

- [ ] No console.log statements in production code
- [ ] No unused imports or variables
- [ ] ESLint rules pass without warnings
- [ ] Prettier formatting is applied
- [ ] Code is self-documenting with clear naming

## ✅ User Experience

- [ ] Loading indicators for async operations
- [ ] Smooth transitions and animations
- [ ] Responsive design across devices
- [ ] Intuitive navigation and interactions
- [ ] Helpful feedback for user actions

## ✅ Documentation

- [ ] Props interface is documented with JSDoc comments
- [ ] Complex logic has explanatory comments
- [ ] Component purpose is clear from name and structure
- [ ] Usage examples in Storybook (if applicable)

## Example Component Template

```typescript
/**
 * Props for the ExampleComponent
 */
interface ExampleComponentProps {
  /** The title to display */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Click handler for the action button */
  onAction?: () => void;
  /** Whether the component is in loading state */
  loading?: boolean;
}

/**
 * ExampleComponent displays a title and optional action button
 */
const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  subtitle,
  onAction,
  loading = false,
}) => {
  // Component implementation
  return (
    <Card role="region" aria-labelledby="example-title">
      <CardContent>
        <Typography id="example-title" variant="h5" component="h2">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {onAction && (
          <Button
            onClick={onAction}
            disabled={loading}
            aria-label={loading ? 'Loading...' : 'Perform action'}
          >
            {loading ? <CircularProgress size={20} /> : 'Action'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExampleComponent;
```

## Review Process

Before submitting a component for review:

1. Run through this checklist
2. Test the component manually
3. Run automated tests
4. Check accessibility with screen reader
5. Verify responsive behavior
6. Ensure TypeScript compilation passes
7. Confirm ESLint rules pass

This checklist ensures consistent, high-quality React components across the project.
