import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Node {
  id: string;
  identity: { low: number };
  labels: string[];
  properties: {
    title?: string;
    name?: string;
    [key: string]: any;
  };
}

export interface Relation {
  id: string;
  type: string;
  from: Node;
  to: Node;
}

export const fetchInitialData = async () => {
  const [nodesResponse, relationsResponse] = await Promise.all([
    axios.get(`${API_BASE_URL}/nodes`),
    axios.get(`${API_BASE_URL}/relations`)
  ]);
  return {
    nodes: nodesResponse.data,
    relations: relationsResponse.data
  };
};

export const fetchNodeDetails = async (nodeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/nodes/${nodeId}`);
  return response.data;
};

export const fetchNodeRelations = async (nodeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/relations/by-node?nodeId=${nodeId}`);
  return response.data;
};

export const fetchIMDBRating = async (nodeId: string, title: string) => {
  const response = await axios.post(`${API_BASE_URL}/ratings/${nodeId}`, { title });
  return response.data;
}; 
