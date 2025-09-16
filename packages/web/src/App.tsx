import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RepList from './components/RepList';
import ZoneSummary from './components/ZoneSummary';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Velocity Zones Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reps" element={<RepList />} />
          <Route path="/zones" element={<ZoneSummary />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
