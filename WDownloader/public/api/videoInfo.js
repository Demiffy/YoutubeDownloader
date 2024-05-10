// /api/videoInfo.js
const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    const videoURL = req.query.url;
    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).json({ success: false, message: 'Invalid URL' });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const videoDetails = {
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            formats: info.formats.filter(format => format.hasAudio && format.hasVideo)
        };
        res.status(200).json({ success: true, info: videoDetails });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch video information', error: error.message });
    }
};
