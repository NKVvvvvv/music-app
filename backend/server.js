const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Configure CORS to allow access only from your deployed frontend
app.use(cors({
  origin: 'https://your-username.github.io' // Replace with your actual GitHub Pages domain if needed
}));

app.use(bodyParser.json());

// ------- In-Memory Datastore for Demo Purposes -------
let users = [];       // Example: { id, name }
let playlists = [];   // Example: { id, userId, name, songs: [song IDs] }
let likes = {};       // Mapping: userId -> array of liked song IDs

// Dummy songs data—and ensure MP3 files with these names exist in the /music folder.
const songs = [
  {
    id: 1,
    title: "Song One",
    artist: "Artist One",
    album: "Album One",
    file: "song1.mp3"
  },
  {
    id: 2,
    title: "Song Two",
    artist: "Artist Two",
    album: "Album Two",
    file: "song2.mp3"
  },
  {
    id: 3,
    title: "Song Three",
    artist: "Artist One",
    album: "Album Two",
    file: "song3.mp3"
  }
];

// ------- Routes -------

// Registration (name-only authentication)
app.post('/api/auth/register', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const user = { id: users.length + 1, name };
  users.push(user);
  likes[user.id] = []; // Initialize liked songs list for the user
  res.json({ user });
});

// Get full list of songs
app.get('/api/music', (req, res) => {
  res.json({ songs });
});

// Search songs by title, artist, or album
app.get('/api/music/search', (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  const lowerQuery = query.toLowerCase();
  const results = songs.filter(song =>
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album.toLowerCase().includes(lowerQuery)
  );
  res.json({ results });
});

// Like a specific song
app.post('/api/music/:songId/like', (req, res) => {
  const { userId } = req.body;
  const songId = parseInt(req.params.songId, 10);
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!songs.find(song => song.id === songId)) {
    return res.status(404).json({ error: 'Song not found' });
  }
  if (!likes[userId]) likes[userId] = [];
  if (!likes[userId].includes(songId)) likes[userId].push(songId);
  res.json({ message: 'Song liked successfully', likes: likes[userId] });
});

// Stream a song with HTTP Range support for efficient playback
app.get('/api/music/stream/:songId', (req, res) => {
  const songId = parseInt(req.params.songId, 10);
  const song = songs.find(s => s.id === songId);
  if (!song) return res.status(404).send('Song not found');

  const filePath = path.resolve(__dirname, 'music', song.file);
  fs.stat(filePath, (err, stats) => {
    if (err) return res.status(404).send('Song file not found');

    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stats.size
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
    const chunksize = end - start + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stats.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mpeg"
    });
    fileStream.pipe(res);
  });
});

// ------- Playlist Endpoints -------

// Get all playlists
app.get('/api/playlists', (req, res) => {
  res.json({ playlists });
});

// Create a new playlist
app.post('/api/playlists', (req, res) => {
  const { userId, name, songs: songIds } = req.body;
  if (!userId || !name) return res.status(400).json({ error: 'User ID and playlist name are required' });
  const newPlaylist = { id: playlists.length + 1, userId, name, songs: songIds || [] };
  playlists.push(newPlaylist);
  res.json({ playlist: newPlaylist });
});

// Update an existing playlist (for adding/removing songs)
app.put('/api/playlists/:id', (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  const { songs: songIds } = req.body;
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  playlist.songs = songIds;
  res.json({ playlist });
});

// Delete a playlist
app.delete('/api/playlists/:id', (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  playlists = playlists.filter(p => p.id !== playlistId);
  res.json({ message: 'Playlist deleted' });
});

// Start the server on the provided port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
