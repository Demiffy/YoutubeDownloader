const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/download', (req, res) => {
    const videoURL = req.query.url;
    const itag = req.query.itag;
    if (ytdl.validateURL(videoURL)) {
        res.header('Content-Disposition', `attachment; filename="video.mp4"`);
        ytdl(videoURL, { quality: itag }).pipe(res).on('error', error => {
            console.error('Download error:', error);
            res.status(500).send('Failed to download video.');
        });
    } else {
        res.status(400).send('Invalid URL');
    }
});

app.get('/videoInfo', (req, res) => {
    const videoURL = req.query.url;
    if (ytdl.validateURL(videoURL)) {
        ytdl.getInfo(videoURL).then(info => {
            res.json({
                success: true,
                info: {
                    thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                    title: info.videoDetails.title,
                    author: info.videoDetails.author.name,
                    formats: info.formats.filter(format => format.hasAudio && format.hasVideo)
                }
            });
        }).catch(err => {
            console.error(err);
            res.json({success: false, message: 'Could not fetch video information'});
        });
    } else {
        res.json({success: false, message: 'Invalid URL'});
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
