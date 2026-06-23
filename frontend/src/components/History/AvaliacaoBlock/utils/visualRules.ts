export const getBandColors = (faixa: string) => {
    switch (faixa?.toLowerCase()) {
        case 'exemplar':
            return { bg: '#e8f5e9', text: '#1b5e20', border: '#2e7d32' };
        case 'consistente':
            return { bg: '#f1f8e9', text: '#33691e', border: '#558b2f' };
        case 'adequado':
            return { bg: '#fff8e1', text: '#ff6f00', border: '#ff8f00' };
        case 'irregular':
            return { bg: '#ffebee', text: '#b71c1c', border: '#c62828' };
        case 'critico':
            return { bg: '#fde0e0', text: '#c62828', border: '#d32f2f' };
        default:
            return { bg: '#f5f5f5', text: '#616161', border: '#9e9e9e' };
    }
};

export const getNPSColors = (classificacao: string) => {
    switch (classificacao?.toLowerCase()) {
        case 'promotor':
            return { main: '#2e7d32', light: '#e8f5e9' };
        case 'passivo':
            return { main: '#f9a825', light: '#fffde7' };
        case 'detrator':
            return { main: '#d32f2f', light: '#ffebee' };
        default:
            return { main: '#757575', light: '#eeeeee' };
    }
};

export const getRuleBorderColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
        case 'contexto':
            return '#0288d1'; // Azul
        case 'piso_teto':
            return '#f57c00'; // Laranja
        case 'suspensao':
            return '#d32f2f'; // Vermelho
        default:
            return '#bdbdbd';
    }
};

export const getPolarityColor = (polaridade: string) => {
    switch (polaridade?.toLowerCase()) {
        case 'positiva':
            return '#2e7d32';
        case 'negativa':
            return '#d32f2f';
        default:
            return '#757575';
    }
};
