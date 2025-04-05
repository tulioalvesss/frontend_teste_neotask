import api from './api';

export const createSuggestion = async (suggestion: { title: string; link: string }) => {
  const response = await api.post('v1/suggestion-songs', {
    title: suggestion.title,
    link: suggestion.link,
    status: 'pending'
  });
  return response.data;
};

export const getPendingSuggestions = async () => {
  try {
    const response = await api.get('v1/suggestion-songs');
    if (typeof response.data === 'object' && !Array.isArray(response.data) && response.data !== null) {
      const possibleArrayProperties = Object.keys(response.data).filter(key => 
        Array.isArray(response.data[key])
      );
      
      if (possibleArrayProperties.length > 0) {
        const arrayProperty = possibleArrayProperties[0];
        console.log(`Retornando array da propriedade: ${arrayProperty}`);
        return response.data[arrayProperty];
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sugestões pendentes:', error);
    return [];
  }
};

export const approveSuggestion = async (id: number) => {
  const response = await api.post(`v1/suggestion-songs/${id}/approve`);
  return response.data;
};

export const rejectSuggestion = async (id: number) => {
  const response = await api.post(`v1/suggestion-songs/${id}/reject`);
  return response.data;
};

