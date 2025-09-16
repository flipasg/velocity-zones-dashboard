import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Test theme
const testTheme = createTheme();

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={testTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderResult => render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export test utilities
export { testTheme, TestWrapper };
