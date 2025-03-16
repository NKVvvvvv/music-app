import React, { useState, useRef, useEffect } from 'react';

function MusicPlayer({ song }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (playing) audioRef.current.play();
    }
  }, [song]);

  const togglePlayPause = () => {
    if (!playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.play();
    } else {
      setPlaying(false);
      // Placeholder: implement automatic next song logic or shuffle selection here.
    }
  };

  return (
    <div className="player-container">
      <h3>Now Playing: {song.title} - {song.artist}</h3>
      <audio ref={audioRef} onEnded={handleEnded} controls={false} preload="metadata">
        <source src={`https://music-api.onrender.com/api/music/stream/${song.id}`} type="audio/mpeg" />
        Your browser does not support this audio format.
      </audio>
      <div className="controls">
        <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
        <button onClick={() => {/* Placeholder for Previous song logic */}}>Previous</button>
        <button onClick={() => {/* Placeholder for Next song logic */}}>Next</button>
        <button onClick={() => setRepeat(!repeat)}>Repeat {repeat ? "On" : "Off"}</button>
        <button onClick={() => setShuffle(!shuffle)}>Shuffle {shuffle ? "On" : "Off"}</button>
        <label>
          Volume:
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
        </label>
      </div>
    </div>
  );
}

export default MusicPlayer;
