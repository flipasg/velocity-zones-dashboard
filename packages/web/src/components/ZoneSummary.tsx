import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

function ZoneSummary() {
  const zones = [
    {
      name: 'Strength',
      color: '#ff4444',
      description: 'Heavy resistance training zone',
    },
    { name: 'Power', color: '#ffaa00', description: 'Power development zone' },
    {
      name: 'Speed-Strength',
      color: '#44ff44',
      description: 'Speed-strength development zone',
    },
    { name: 'Speed', color: '#4444ff', description: 'Maximum speed zone' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Velocity Zones
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {zones.map((zone) => (
          <Grid item xs={12} sm={6} md={3} key={zone.name}>
            <Card sx={{ borderLeft: `4px solid ${zone.color}` }}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {zone.name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {zone.description}
                </Typography>
                <Typography sx={{ mt: 1 }} variant="h4">
                  0
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  reps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ZoneSummary;
