import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RepList from './components/RepList';
import ZoneSummary from './components/ZoneSummary';

/**
 * Main App component with routing and layout structure
 * Provides the application shell with navigation and content areas
 */
const App: React.FC = () => {
  return (
    <div role="application" aria-label="Velocity Zones Dashboard Application">
      <AppBar position="static" component="header">
        <Toolbar>
          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1 }}
            aria-label="Application title"
          >
            Velocity Zones Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{ mt: 4, mb: 4 }}
        component="main"
        role="main"
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reps" element={<RepList />} />
          <Route path="/zones" element={<ZoneSummary />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
