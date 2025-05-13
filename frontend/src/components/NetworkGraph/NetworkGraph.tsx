import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import type { Node, Relation } from '../../utils/api';

interface NetworkGraphProps {
  onNodeClick: (nodeId: string) => void;
  nodes: Node[];
  relations: Relation[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  onNodeClick,
  nodes,
  relations
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  // Subscribe to search events
  const searchHandler = (event: CustomEvent<string>) => {
    handleSearch(event.detail);
  };
  useEffect(() => {
    if (!containerRef.current) return;

    const visNodes = nodes.map((n) => ({
      id: n?.identity?.low.toString(),
      label: n.properties?.title || n.properties?.name || 'unknown',
      group: n.labels?.[0] || 'Default'
    }));

    const visEdges = relations.map((r) => ({
      id: r.id,
      from: r.from.id,
      to: r.to.id,
      label: r.type
    }));

    const data = {
      nodes: visNodes,
      edges: visEdges
    };

    const options = {
      nodes: {
        shape: 'dot',
        size: 18,
        font: { size: 14 }
      },
      edges: {
        arrows: 'to',
        font: { align: 'middle' }
      },
      physics: {
        stabilization: false
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length === 1) {
        onNodeClick(params.nodes[0]);
      }
    });
    window.addEventListener('search' as any, searchHandler);
    return () => {
      window.removeEventListener('search' as any, searchHandler);

      network.destroy();
    };
  }, [nodes, relations, onNodeClick]);

  const handleSearch = (query: string) => {
    if (!networkRef.current || !query) return;

    const q = query.toLowerCase();
    const allNodes = networkRef.current.body.data.nodes.get();
    const allEdges = networkRef.current.body.data.edges.get();

    const nodeMatch = allNodes.find((node) =>
      node.label?.toLowerCase().includes(q)
    );

    if (nodeMatch) {
      networkRef.current.selectNodes([nodeMatch.id]);
      networkRef.current.focus(nodeMatch.id, { scale: 1.5, animation: true });
      networkRef.current.body.data.nodes.update({
        id: nodeMatch.id,
        color: { background: '#ff0', border: '#000' }
      });

      setTimeout(() => {
        networkRef.current?.body.data.nodes.update({ id: nodeMatch.id, color: undefined });
      }, 2000);
      return;
    }

    const edgeMatch = allEdges.find((edge) =>
      edge.label?.toLowerCase().includes(q)
    );

    if (edgeMatch) {
      const { from, to } = edgeMatch;
      networkRef.current.selectEdges([edgeMatch.id]);
      networkRef.current.fit({ nodes: [from, to], animation: true });
      networkRef.current.body.data.edges.update({
        id: edgeMatch.id,
        color: { color: '#f00' }
      });

      setTimeout(() => {
        networkRef.current?.body.data.edges.update({ id: edgeMatch.id, color: undefined });
      }, 2000);
    }
  };

  return (
    <div ref={containerRef} style={{ height: '70vh', width: '70vw', margin: 'auto', border: '1px solid #ccc' }} />
  );
};

export default NetworkGraph;
