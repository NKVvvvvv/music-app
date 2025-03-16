import React, { useState } from 'react';
import MusicPlayer from './MusicPlayer';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await fetch(`https://music-backend-0j4q.onrender.com/api/music/search?query=${query}`); // Updated URL
    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div className="search-container">
      <h2>Search Music</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by song, artist, album"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="search-results">
        {results.map((song) => (
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

export default Search;
