import { Box, Typography, Divider, Drawer } from '@mui/material';
import { Node } from '../../utils/api';

interface NodeDetailsProps {
  node: Node | null;
  open: boolean;
  onClose: () => void;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node, open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, padding: 2 }}>
        <Typography variant="h6">Node Details</Typography>
        <Divider sx={{ my: 1 }} />

        {node && (
          <>
            <Typography variant="subtitle2">ID: {node.id}</Typography>
            <Typography variant="subtitle2">Labels: {node.labels?.join(', ')}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1">Properties:</Typography>
            {Object.entries(node.properties).map(([key, value]) => (
              <Typography key={key} variant="body2">
                <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Typography>
            ))}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default NodeDetails; 
