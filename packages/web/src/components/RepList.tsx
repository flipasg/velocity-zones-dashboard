import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

function RepList() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rep Samples
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="No rep samples yet"
              secondary="Create rep samples through the API to see them here"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default RepList;
