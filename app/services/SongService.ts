import api from './api';

export const getAllSongs = async () => {
    const response = await api.get('v1/songs');
    
    // Ordena os dados por viewCount em ordem decrescente
    response.data.sort((a: any, b: any) => b.viewCount - a.viewCount);
    
    response.data.forEach((song: any) => {
        const views = song.viewCount;
        if (views >= 1000000) {
            song.viewCount = `${(views / 1000000).toFixed(1)}M visualizações`;
        } else if (views >= 1000) {
            song.viewCount = `${(views / 1000).toFixed(1)}K visualizações`;
        } else {
            song.viewCount = `${views} visualizações`;
        }
    });
    return response.data;
};

export const createSong = async (link: string) => {
    const response = await api.post('v1/admin/insert-song',{
        link: link,
    });
    return response.data;
};

export const updateSong = async (id: number, song: any) => {
    const response = await api.put(`v1/admin/songs`, {
        id: id,
        title: song.title,
        viewCount: song.viewCount,
        link: song.link,
        image: song.image,
    });
    return response.data;
};

export const deleteSong = async (id: number) => {
    const response = await api.delete(`v1/admin/songs`, {
        data: {
            id: id
        }
    });
    return response.data;
};

