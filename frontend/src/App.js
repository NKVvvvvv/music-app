import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Search from './components/Search';
import Playlist from './components/Playlist';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/search">Search</Link>
              <Link to="/playlist">Playlist</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/search" element={<Search />} />
              <Route path="/playlist" element={<Playlist user={user} />} />
            </Routes>
          </>
        ) : (
          <Login setUser={setUser} />
        )}
      </div>
    </Router>
  );
}

export default App;
