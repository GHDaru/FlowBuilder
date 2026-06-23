import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from '../Sidebar/Sidebar';
import EditorHeader from './EditorHeader';
import CodePanel from './CodePanel';
import CustomLLMNode from './CustomLLMNode';
import StartNode from './StartNode';
import ConditionNode from './ConditionNode';
import SqlNode from './SqlNode';
import FlowListView from './FlowListView';

import { Box, Alert, Snackbar, Typography, Tooltip, Fab, Menu, MenuItem, useTheme } from '@mui/material';
import { 
    Add as AddNodeIcon,
    SmartToy as LLMIcon,
    AltRoute as RouterIcon,
    Storage as StorageIcon
} from '@mui/icons-material';
import { flowService, type Flow } from '../../services/flowService';

const initialNodes: Node[] = [
  { 
    id: 'start-1', 
    type: 'start',
    position: { x: 50, y: 150 }, 
    data: { label: 'Início' } 
  },
];

const initialEdges: Edge[] = [];

const FlowBuilderInner: React.FC = () => {
  const theme = useTheme();
  const { setViewport, fitView } = useReactFlow();
  
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentFlow, setCurrentFlow] = useState<Flow | null>(null);
  const [jsonViewerOpen, setJsonViewerOpen] = useState(false);
  const [alert, setAlert] = useState<{show: boolean, msg: string, severity: 'success'|'error'}>({ show: false, msg: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const nodeTypes = useMemo(() => ({
    llm: CustomLLMNode,
    start: StartNode,
    condition: ConditionNode,
    sql: SqlNode
  }), []);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    if (window.confirm('Deseja excluir esta conexão?')) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  const onUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
    setSelectedNode(null);
  }, [setNodes]);

  const onAddNode = useCallback((type: 'llm' | 'condition' | 'sql' = 'llm') => {
    const horizontalSpacing = 60;
    const nodeWidth = 140; 
    
    let newX = 300;
    let newY = 150;

    if (nodes.length > 0) {
        const rightmostNode = nodes.reduce((prev, curr) => 
            (curr.position.x > prev.position.x) ? curr : prev
        );
        newX = rightmostNode.position.x + nodeWidth + horizontalSpacing;
        newY = rightmostNode.position.y;
    }

    const id = `${type}-${Date.now()}`;
    let data: any = {};
    if (type === 'llm') {
      data = { 
        label: `Nó LLM ${nodes.filter(n => n.type === 'llm').length + 1}`,
        prompt: '',
        schema: '{}',
        variables: []
      };
    } else if (type === 'condition') {
      data = {
        label: `Condição ${nodes.filter(n => n.type === 'condition').length + 1}`,
        rules: []
      };
    } else if (type === 'sql') {
      data = {
        label: `Nó SQL ${nodes.filter(n => n.type === 'sql').length + 1}`,
        database_type: 'sqlite',
        connection_details: { file_path: '' },
        sql_query: 'SELECT * FROM my_table WHERE id = {{id}}'
      };
    }

    const newNode: Node = {
      id,
      type,
      position: { x: newX, y: newY },
      data
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onNewFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
    setCurrentFlow(null);
    setView('editor');
  }, [setNodes, setEdges]);

  const onSaveFlow = useCallback(async () => {
    if (!currentFlow) return onSaveFlowAs();

    const flowData = {
      name: currentFlow.name,
      json_definition: JSON.stringify({ nodes, edges })
    };
    
    try {
      await flowService.updateFlow(currentFlow.id, flowData);
      setAlert({ show: true, msg: "Fluxo atualizado!", severity: 'success' });
    } catch (error) {
      setAlert({ show: true, msg: "Erro ao salvar.", severity: 'error' });
    }
  }, [currentFlow, nodes, edges]);

  const onSaveFlowAs = useCallback(async () => {
    const flowName = window.prompt("Salvar Como:", currentFlow?.name || "Novo Fluxo");
    if (!flowName) return;

    const flowData = {
      name: flowName,
      json_definition: JSON.stringify({ nodes, edges })
    };
    
    try {
      const saved = await flowService.createFlow(flowData as any);
      setCurrentFlow(saved);
      setAlert({ show: true, msg: "Fluxo salvo como novo!", severity: 'success' });
    } catch (error) {
      setAlert({ show: true, msg: "Erro ao salvar como.", severity: 'error' });
    }
  }, [currentFlow, nodes, edges]);

  const onLoadFlow = useCallback((flow: Flow) => {
    setCurrentFlow(flow);
    try {
        const def = JSON.parse(flow.json_definition || '{"nodes":[], "edges": []}');
        setNodes(def.nodes || []);
        setEdges(def.edges || []);
        setView('editor');
    } catch (e) {
        console.error("Failed to parse flow json:", e);
        setAlert({ show: true, msg: "Erro ao carregar dados do fluxo.", severity: 'error' });
    }
  }, [setNodes, setEdges]);

  const onRenameFlow = useCallback(async (newName: string) => {
    if (!currentFlow) {
        setCurrentFlow({ name: newName } as any);
        return;
    }
    
    try {
        const updated = await flowService.updateFlow(currentFlow.id, { name: newName });
        setCurrentFlow(updated);
        setAlert({ show: true, msg: "Fluxo renomeado!", severity: 'success' });
    } catch (error) {
        setAlert({ show: true, msg: "Erro ao renomear.", severity: 'error' });
    }
  }, [currentFlow]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'editor') return;
      
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
            onSaveFlowAs();
        } else {
            onSaveFlow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, onSaveFlow, onSaveFlowAs]);

  if (view === 'list') {
    return <FlowListView onSelect={onLoadFlow} onNew={onNewFlow} />;
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
      
      <EditorHeader 
        flowName={currentFlow?.name || ''}
        onRename={onRenameFlow}
        onSave={onSaveFlow}
        onSaveAs={onSaveFlowAs}
        onViewCode={() => setJsonViewerOpen(true)}
        onBack={() => setView('list')}
        isDraft={!currentFlow}
      />

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
        >
          <Background 
            color={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)'} 
            gap={20} 
            variant="dots"
          />
          <Controls />
        </ReactFlow>

        {/* Floating Add Node Button */}
        <Tooltip title="Adicionar Nó" placement="right">
          <Fab 
            color="primary" 
            size="medium"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <AddNodeIcon />
          </Fab>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        >
          <MenuItem onClick={() => { onAddNode('llm'); setAnchorEl(null); }}>
            <LLMIcon sx={{ mr: 1, fontSize: 18 }} /> Nó LLM
          </MenuItem>
          <MenuItem onClick={() => { onAddNode('condition'); setAnchorEl(null); }}>
            <RouterIcon sx={{ mr: 1, fontSize: 18 }} /> Condição (Router)
          </MenuItem>
          <MenuItem onClick={() => { onAddNode('sql'); setAnchorEl(null); }}>
            <StorageIcon sx={{ mr: 1, fontSize: 18 }} /> Nó SQL
          </MenuItem>
        </Menu>

        {selectedNode && (selectedNode.type === 'llm' || selectedNode.type === 'condition' || selectedNode.type === 'start' || selectedNode.type === 'sql') && (
          <Sidebar 
            selectedNode={selectedNode} 
            onUpdateNode={onUpdateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </Box>

      <CodePanel 
        open={jsonViewerOpen}
        onClose={() => setJsonViewerOpen(false)}
        flow={{
            name: currentFlow?.name || 'Novo Fluxo',
            nodes,
            edges
        }}
      />

      <Snackbar 
        open={alert.show} 
        autoHideDuration={4000} 
        onClose={() => setAlert({ ...alert, show: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
          {alert.msg}
        </Alert>
      </Snackbar>

      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        bgcolor: 'background.paper', 
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        px: 2, 
        py: 1, 
        borderRadius: 2, 
        pointerEvents: 'none' 
      }}>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
              {currentFlow ? `FLUXO ATIVO: ${currentFlow.name}` : 'RASCUNHO NÃO SALVO'}
          </Typography>
      </Box>
    </Box>
  );
};

const FlowBuilder: React.FC = () => (
    <ReactFlowProvider>
        <FlowBuilderInner />
    </ReactFlowProvider>
);

export default FlowBuilder;
