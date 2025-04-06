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
    const response = await api.get('v1/admin/suggestion-songs');
    let suggestions;

    if (typeof response.data === 'object' && !Array.isArray(response.data) && response.data !== null) {
      const possibleArrayProperties = Object.keys(response.data).filter(key => 
        Array.isArray(response.data[key])
      );
      
      if (possibleArrayProperties.length > 0) {
        const arrayProperty = possibleArrayProperties[0];
        suggestions = response.data[arrayProperty];
      }
    } else {
      suggestions = response.data;
    }

    // Ordena as sugestões para que 'pending' apareça primeiro
    return suggestions.sort((a: any, b: any) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });

  } catch (error) {
    console.error('Erro ao buscar sugestões pendentes:', error);
    return [];
  }
};

export const approveSuggestion = async (id: number) => {
  const response = await api.post(`v1/admin/suggestion-songs/${id}/approve`);
  return response.data;
};

export const rejectSuggestion = async (id: number) => {
  const response = await api.post(`v1/admin/suggestion-songs/${id}/reject`);
  return response.data;
};

