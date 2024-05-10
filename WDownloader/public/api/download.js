// /api/download.js
const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    const videoURL = req.query.url;
    const itag = req.query.itag;
    if (ytdl.validateURL(videoURL)) {
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        const stream = ytdl(videoURL, { quality: itag });
        stream.pipe(res).on('error', error => {
            console.error('Download error:', error);
            res.status(500).send('Failed to download video.');
        });
    } else {
        res.status(400).send('Invalid URL');
    }
};
