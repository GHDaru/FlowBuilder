export const exportFlowToJson = (flow: any) => {
    const exportData = {
        name: flow.name,
        version: '1.0',
        exportedAt: new Date().toISOString(),
        json_definition: flow.json_definition,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow.name.replace(/\s+/g, '_') || 'fluxo'}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const parseFlowImport = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (!json.json_definition && (!json.nodes || !json.edges)) {
                    throw new Error("Formato de fluxo inválido.");
                }
                
                // Compatibility layer: if it was exported with direct nodes/edges, wrap it
                if (!json.json_definition) {
                    json.json_definition = JSON.stringify({ nodes: json.nodes, edges: json.edges });
                }
                
                resolve({
                    name: json.name || 'Fluxo Importado',
                    json_definition: json.json_definition
                });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
