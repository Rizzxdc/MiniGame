const axios = require('axios');
const { URLSearchParams } = require('url');

async function tiktokDl(url) {
    try {
        const response = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url: url, count: 12, cursor: 0, web: 1, hd: 1 }));
        const data = response.data.data;
        
        if (!data) throw new Error("Video not found / Private");

        const domain = 'https://www.tikwm.com';
        
        let videoUrl = data.play;
        let musicUrl = data.music;
        let coverUrl = data.cover;

        if (videoUrl && !videoUrl.startsWith('http')) videoUrl = domain + videoUrl;
        if (musicUrl && !musicUrl.startsWith('http')) musicUrl = domain + musicUrl;
        if (coverUrl && !coverUrl.startsWith('http')) coverUrl = domain + coverUrl;

        let images = [];
        if (data.images && Array.isArray(data.images)) {
            images = data.images.map(img => !img.startsWith('http') ? domain + img : img);
        }

        return {
            author: data.author.nickname,
            unique_id: data.author.unique_id,
            title: data.title,
            video: videoUrl,
            cover: coverUrl,
            audio: musicUrl,
            images: images
        };
    } catch (e) {
        throw new Error("Gagal mengambil data TikTok");
    }
}

module.exports = { tiktokDl };
