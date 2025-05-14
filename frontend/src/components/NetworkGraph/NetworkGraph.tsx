import React, { useEffect, useRef } from 'react';
import { Network, type Data, type Node as VisNode, type Edge as VisEdge } from 'vis-network';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import type { Node, Relation } from '../../utils/api';
import {getNodeColor} from '../../utils/helper'
interface NetworkGraphProps {
  onNodeClick: (nodeId: string) => void;
  nodes: Node[];
  relations: Relation[];
  isLoading: boolean;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  onNodeClick,
  nodes,
  relations,
  isLoading
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  // Subscribe to search events
  const searchHandler = (event: CustomEvent<string>) => {
    handleSearch(event.detail);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const visNodes: VisNode[] = nodes.map((n) => {
      const label = n.properties?.title || n.properties?.name || 'unknown';
      return {
        id: n?.identity?.low.toString(),
        label: label.length > 15 ? label.substring(0, 15) + '...' : label,
        group: n.labels?.[0] || 'Default',
        title: `${n.labels?.[0] || 'Unknown'}: ${label}`, // Full text in tooltip
        color: {
          background: getNodeColor(n.labels?.[0]),
          border: '#ffffff',
          highlight: {
            background: '#ffd700',
            border: '#000000'
          },
          hover: {
            background: '#ffd700',
            border: '#000000'
          }
        },
        font: {
          color: '#ffffff',
          size: 12,
          face: 'arial',
          multi: true,
          align: 'center'
        },
        shape: 'circle',
        size: 30,
        labelHighlightBold: true,
        shadow: true,
        borderWidth: 2,
        borderWidthSelected: 3
      };
    });
    const visEdges: VisEdge[] = relations.map((r) => ({
      id: r.id,
      from: r.from.id,
      to: r.to.id,
      label: r.type,
      arrows: {
        to: { enabled: true, scaleFactor: 1 }
      },
      color: {
        color: '#666666',
        highlight: '#ffd700',
        hover: '#ffd700'
      },
      font: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        background: 'none',
        strokeWidth: 2, // px
        strokeColor: '#ffffff',
        align: 'horizontal',
        multi: false,
        vadjust: 0,
      },
      smooth: {
        enabled: true,
        type: 'cubicBezier',
        roundness: 0.5
      }
    }));
    const data: Data = {
      nodes: visNodes,
      edges: visEdges
    };
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true,
        font: {
          multi: true,
          align: 'center'
        }
      },
      edges: {
        width: 1.5,
        shadow: true
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          fit: true
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        hoverConnectedEdges: true
      },
      layout: {
        improvedLayout: true,
        randomSeed: 42
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length === 1) {
        onNodeClick(params.nodes[0]);
      }
    });

    window.addEventListener('search', searchHandler as EventListener);
    return () => {
      window.removeEventListener('search', searchHandler as EventListener);
      network.destroy();
    };
  }, [nodes, relations, onNodeClick, searchHandler]);

  const handleSearch = (query: string) => {
    if (!networkRef.current || !query) return;

    const q = query.toLowerCase();
    const allNodes = networkRef.current.body.data.nodes.get();
    const allEdges = networkRef.current.body.data.edges.get();

    const nodeMatch = allNodes.find((node: VisNode) =>
      node.label?.toLowerCase().includes(q)
    );

    if (nodeMatch) {
      networkRef.current.selectNodes([nodeMatch.id]);
      networkRef.current.focus(nodeMatch.id, { scale: 1.5, animation: true });
      networkRef.current.body.data.nodes.update(nodeMatch.id, {
        color: { 
          background: '#ffd700',
          border: '#000000',
          highlight: {
            background: '#ffd700',
            border: '#000000'
          }
        }
      });

      setTimeout(() => {
        networkRef.current?.updateNode(nodeMatch.id, { 
          color: {
            background: getNodeColor(nodeMatch.group as string),
            border: '#ffffff',
            highlight: {
              background: '#ffd700',
              border: '#000000'
            }
          }
        });
      }, 2000);
      return;
    }

    const edgeMatch = allEdges.find((edge: VisEdge) =>
      edge.label?.toLowerCase().includes(q)
    );

    if (edgeMatch) {
      const { from, to } = edgeMatch;
      networkRef.current.selectEdges([edgeMatch.id]);
      networkRef.current.fit({ nodes: [from, to], animation: true });
      networkRef.current.updateEdge(edgeMatch.id, {
        color: { 
          color: '#ffd700',
          highlight: '#ffd700',
          hover: '#ffd700'
        }
      });

      setTimeout(() => {
        networkRef.current?.updateEdge(edgeMatch.id, { 
          color: {
            color: '#666666',
            highlight: '#ffd700',
            hover: '#ffd700'
          }
        });
      }, 2000);
    }
  };


  return (
    <Paper
      elevation={3}
      sx={{
        height: 'calc(100vh - 100px)',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="white" sx={{ mt: 1 }}>
              Loading graph...
            </Typography>
          </Box>
        </Box>
      )}
      <div 
        ref={containerRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: 'transparent'
        }} 
      />
    </Paper>
  );
};

export default NetworkGraph;
