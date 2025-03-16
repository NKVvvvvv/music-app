import React, { useState, useEffect } from 'react';

function Playlist({ user }) {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [message, setMessage] = useState('');

  const fetchPlaylists = async () => {
    const res = await fetch('https://music-backend.onrender.com/api/playlists'); // Updated URL
    const data = await res.json();
    // Filter playlists to only show those created by the current user
    setPlaylists(data.playlists.filter(p => p.userId === user.id));
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const res = await fetch('https://music-backend.onrender.com/api/playlists', { // Updated URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, name: newPlaylistName, songs: [] })
    });
    const data = await res.json();
    if (data.playlist) {
      setMessage('Playlist created successfully!');
      fetchPlaylists();
      setNewPlaylistName('');
    }
  };

  return (
    <div className="playlist-container">
      <h2>Your Playlists</h2>
      <form onSubmit={createPlaylist}>
        <input
          type="text"
          placeholder="New Playlist Name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button type="submit">Create Playlist</button>
      </form>
      {message && <div>{message}</div>}
      <div className="playlist-list">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-item">
            <h3>{playlist.name}</h3>
            {/* Song management for playlists can be added here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
