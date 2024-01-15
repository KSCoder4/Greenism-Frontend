import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import Log from './Log';
import Welcome from './Welcome';
import Sign from './Sign';
import UserList from './UserList';
import Preferences from './Preferences';
import NotFound from './NotFound';
import { api } from './api.js';
import Space from './Space/space.js'
import BobuxClicker from './BobuxClicker/BobuxClicker';
import Techtree from './BobuxClicker/Techtree';
import Chat from './Chat/chat.js'

function App() {
  return (
    <Router>
      <div className='app'>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <NavBar />
        <div className='contentDiv'>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/log" element={<Log />} />
            <Route path="/sign" element={<Sign />} />
						<Route path="/techtree" element={<Techtree />} />
            <Route path="/userlist" element={<ProtectedElement element={<UserList/> } />} />
            <Route path="/clicker" element={<ProtectedElement element={<BobuxClicker/> } />} />
            <Route path="/space" element={<ProtectedElement element={<Space/> } />} />
						<Route path="/chat" element={<ProtectedElement element={<Chat/> } />} />
						<Route path="/settings" element={<ProtectedElement element={<Preferences/> } />} />

						<Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function ProtectedElement(props) {
  if (api.checkLoggedInStatus()) {
    return props.element;
  } else {
    alert("Access denied. Please sign up and log in. "); 
    return <Navigate to="/log" />;
  }
}

export default App;
