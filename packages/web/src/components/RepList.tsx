import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import type { RepResponseDto } from '@velocity-zones/shared';
import React from 'react';

interface RepListProps {
  /** Array of rep samples to display */
  reps?: RepResponseDto[];
  /** Loading state indicator */
  loading?: boolean;
  /** Error message to display */
  error?: string;
}

/**
 * RepList component for displaying velocity rep samples
 * Shows a list of training reps with their velocities and metadata
 */
const RepList: React.FC<RepListProps> = ({
  reps = [],
  loading = false,
  error,
}) => {
  const hasReps = reps.length > 0;

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby="rep-samples-heading"
    >
      <Typography
        id="rep-samples-heading"
        variant="h4"
        component="h1"
        gutterBottom
      >
        Rep Samples
      </Typography>

      <Paper sx={{ mt: 2 }} elevation={2}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Loading rep samples...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">
              Error loading rep samples: {error}
            </Typography>
          </Box>
        ) : hasReps ? (
          <List aria-label="Rep samples">
            {reps.map((rep) => (
              <ListItem key={rep.id} divider>
                <ListItemText
                  primary={`Velocity: ${rep.velocity.toFixed(2)} m/s`}
                  secondary={`Exercise: ${rep.exerciseId} | ${new Date(rep.timestamp).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ListItem>
              <ListItemText
                primary="No rep samples yet"
                secondary="Create rep samples through the API to see them here"
              />
            </ListItem>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RepList;
