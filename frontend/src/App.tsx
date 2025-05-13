import { useEffect, useState } from 'react';
import type { Node, Relation } from './utils/api';
import { fetchInitialData, fetchNodeDetails, fetchIMDBRating } from './utils/api';
import SearchBar from './components/Search/SearchBar';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import NodeDetails from './components/NodeDetails/NodeDetails';

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
    const searchEvent = new CustomEvent('search', { detail: query });
    window.dispatchEvent(searchEvent);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Neo4j Recommendations Explorer</h1>
      <div>
        {!isLoading && (
          <>
            <SearchBar onSearch={handleSearch} />
            <NetworkGraph
              nodes={nodes}
              relations={relations}
              onNodeClick={handleNodeClick}
            />
          </> 
        )}
      </div>

      <NodeDetails
        node={selectedNode}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
