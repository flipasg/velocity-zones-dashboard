import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import type { ZoneResponseDto } from '@velocity-zones/shared';
import React, { useMemo } from 'react';

interface ZoneSummaryProps {
  /** Array of velocity zones with rep counts */
  zones?: ZoneResponseDto[];
  /** Loading state indicator */
  loading?: boolean;
  /** Error message to display */
  error?: string;
}

interface DefaultZone {
  name: string;
  color: string;
  description: string;
  repCount: number;
}

/**
 * ZoneSummary component for displaying velocity zones with rep counts
 * Shows training zones with color coding and statistics
 */
const ZoneSummary: React.FC<ZoneSummaryProps> = ({
  zones,
  loading = false,
  error,
}) => {
  const defaultZones: DefaultZone[] = useMemo(
    () => [
      {
        name: 'Strength',
        color: '#ff4444',
        description: 'Heavy resistance training zone',
        repCount: 0,
      },
      {
        name: 'Power',
        color: '#ffaa00',
        description: 'Power development zone',
        repCount: 0,
      },
      {
        name: 'Speed-Strength',
        color: '#44ff44',
        description: 'Speed-strength development zone',
        repCount: 0,
      },
      {
        name: 'Speed',
        color: '#4444ff',
        description: 'Maximum speed zone',
        repCount: 0,
      },
    ],
    []
  );

  const displayZones = zones || defaultZones;

  if (loading) {
    return (
      <Box
        component="section"
        role="region"
        aria-labelledby="velocity-zones-heading"
      >
        <Typography
          id="velocity-zones-heading"
          variant="h4"
          component="h1"
          gutterBottom
        >
          Velocity Zones
        </Typography>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Loading velocity zones...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        component="section"
        role="region"
        aria-labelledby="velocity-zones-heading"
      >
        <Typography
          id="velocity-zones-heading"
          variant="h4"
          component="h1"
          gutterBottom
        >
          Velocity Zones
        </Typography>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">Error loading zones: {error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby="velocity-zones-heading"
    >
      <Typography
        id="velocity-zones-heading"
        variant="h4"
        component="h1"
        gutterBottom
      >
        Velocity Zones
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {displayZones.map((zone) => (
          <Grid item xs={12} sm={6} md={3} key={zone.name}>
            <Card
              sx={{
                borderLeft: `4px solid ${zone.color}`,
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
              role="article"
              aria-labelledby={`zone-${zone.name.toLowerCase()}-heading`}
            >
              <CardContent>
                <Typography
                  id={`zone-${zone.name.toLowerCase()}-heading`}
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 'medium' }}
                >
                  {zone.name}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  {zone.description}
                </Typography>
                <Typography
                  sx={{ mt: 1 }}
                  variant="h4"
                  component="div"
                  color="primary.main"
                  aria-label={`${zone.repCount} reps in ${zone.name} zone`}
                >
                  {zone.repCount}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  component="span"
                >
                  {zone.repCount === 1 ? 'rep' : 'reps'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ZoneSummary;
