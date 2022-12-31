import React,{useState} from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import {MobileView} from 'react-device-detect';

import {UserContext} from './context/UserContext';

import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import NewGame from './pages/NewGame';
import Game from './pages/Game';
import Home from './pages/Home';

import './App.css';




function App() {
  const [user,setUser] = useState(null);
  const [session,setSession] = useState(null);
  return (
    <>
    <MobileView>
    <Router>
      <UserContext.Provider value={{user,setUser}}>

    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/newgame' element={<NewGame />} />
      <Route path='/game/:sessionID' element={<Game />} />
      <Route path='/home' element={<Home />} />
    </Routes>

    </UserContext.Provider>
    </Router>
    </MobileView>
  </>
  );
}

export default App;
