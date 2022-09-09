import logo from './logo.svg';
import {useEffect, useState} from 'react';
import './App.css';
import Login from './Pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import Location from './Pages/Location/Location';
import { Routes, Route, Link } from "react-router-dom";
import Incidents from './Pages/Incidents/Incidents';

function App() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])
/*

{loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser}/>}          
*/

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser}/>} />
          <Route path="/locations" element={<Location/>}/>
          <Route path="/incidents" element={<Incidents/>}/>
        </Routes>                 
    </div>
  );
}

export default App;
