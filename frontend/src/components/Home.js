import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

function Home({ user }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    fetch('https://music-backend-0j4q.onrender.com') // Updated URL
      .then(res => res.json())
      .then(data => setSongs(data.songs));
  }, []);

  return (
    <div className="home-container">
      <h2>Welcome, {user.name}!</h2>
      <div className="song-list">
        {songs.map((song) => (
          <div key={song.id} className="song-item" onClick={() => setCurrentSong(song)}>
            <div>
              <strong>{song.title}</strong> by {song.artist}
            </div>
            <div><em>{song.album}</em></div>
          </div>
        ))}
      </div>
      {currentSong && <MusicPlayer song={currentSong} />}
    </div>
  );
}

export default Home;
