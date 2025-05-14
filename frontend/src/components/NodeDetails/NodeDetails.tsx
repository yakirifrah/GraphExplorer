import {
  Box,
  Typography,
  Divider,
  Drawer,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Node, Relation } from '../../utils/api';
import { fetchNodeRelations } from '../../utils/api';
import React, { useEffect, useState } from "react";

interface NodeDetailsProps {
  node: Node | null;
  open: boolean;
  onClose: () => void;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node, open, onClose }) => {
  const [relatedEntities, setRelatedEntities] = useState<Relation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRelatedEntities = async () => {
      if (!node) return;
      setIsLoading(true);
      try {
        console.log({ node });
        const relations = await fetchNodeRelations(node?.identity?.low.toString() || node.id);
        setRelatedEntities(relations);
      } catch (error) {
        console.error('Error fetching related entities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedEntities();
  }, [node]);

  const renderRelatedEntity = (relation: Relation, isFrom: boolean) => {
    const relatedNode = isFrom ? relation.to : relation.from;
    const label = relatedNode.properties?.title || relatedNode.properties?.name || 'unknown';
    
    return (
      <ListItem key={`${relation.id}-${isFrom ? 'to' : 'from'}`} disablePadding sx={{ py: 0.5 }}>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={relatedNode.labels[0]}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" component="span">
                {label}
              </Typography>
            </Box>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {isFrom ? '→' : '←'} {relation.type}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Node Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {node ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ID
              </Typography>
              <Typography variant="body1">{node.id}</Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Labels
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {node.labels?.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Properties
              </Typography>
              <List dense disablePadding>
                {Object.entries(node.properties).map(([key, value]) => (
                  <ListItem key={key} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="span">
                          <strong>{key}:</strong>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Related Entities
              </Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : relatedEntities.length > 0 ? (
                <List dense disablePadding>
                  {relatedEntities.map((relation) => (
                    <React.Fragment key={relation.id}>
                      {renderRelatedEntity(relation, true)}
                      {renderRelatedEntity(relation, false)}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No related entities found
                </Typography>
              )}
            </Paper>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No node selected
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default NodeDetails; 
