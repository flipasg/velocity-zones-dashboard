import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

/**
 * Dashboard component displaying the main overview of velocity zones data
 * Features recent reps, zone distribution, and performance metrics
 */
const Dashboard: React.FC = () => {
  return (
    <Box component="main" role="main">
      <Typography variant="h4" component="h1" gutterBottom>
        Velocity Zones Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 2 }}
            elevation={2}
            aria-labelledby="recent-reps-heading"
          >
            <Typography
              id="recent-reps-heading"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Recent Reps
            </Typography>
            <Typography color="text.secondary">
              Placeholder for recent rep samples
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 2 }}
            elevation={2}
            aria-labelledby="zone-distribution-heading"
          >
            <Typography
              id="zone-distribution-heading"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Zone Distribution
            </Typography>
            <Typography color="text.secondary">
              Placeholder for velocity zone chart
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{ p: 2 }}
            elevation={2}
            aria-labelledby="performance-overview-heading"
          >
            <Typography
              id="performance-overview-heading"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Performance Overview
            </Typography>
            <Typography color="text.secondary">
              Placeholder for performance metrics and trends
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
