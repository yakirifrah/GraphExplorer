import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {CssBaseline, Box, AppBar, Toolbar,Typography,CircularProgress, Container} from "@mui/material";
import type {Node, Relation} from './utils/api';
import { fetchInitialData, fetchNodeDetails, fetchIMDBRating } from './utils/api';
import SearchBar from './components/Search/SearchBar';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import NodeDetails from './components/NodeDetails/NodeDetails';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { nodes: initialNodes, relations: initialRelations } = await fetchInitialData();
        setNodes(initialNodes);
        setRelations(initialRelations);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleNodeClick = async (nodeId: string) => {
    try {
      const node = await fetchNodeDetails(nodeId);
      const isMovie = node.labels[0] === 'Movie';
      
      if (isMovie) {
        const title = node.properties.title;
        const imdbData = await fetchIMDBRating(nodeId, title);
        node.properties.updateRatingFromIdbm = imdbData.properties.rating;
        node.properties.updateVotesFromIdbm = imdbData.properties.votes;
      }
      setSelectedNode(node);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching node details:', error);
    }
  };

  const handleSearch = (query: string) => {
    // Dispatch a custom event that NetworkGraph will listen to
    const searchEvent = new CustomEvent('search', { detail: query });
    window.dispatchEvent(searchEvent);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Neo4j Recommendations Explorer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ flexGrow: 1, position: 'relative' }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, width: '33vw' }}>
                <SearchBar onSearch={handleSearch} />
              </Box>
              <NetworkGraph
                isLoading={isLoading}
                nodes={nodes}
                relations={relations}
                onNodeClick={handleNodeClick}
              />
            </Box>
          )}
        </Container>

        <NodeDetails
          node={selectedNode}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
