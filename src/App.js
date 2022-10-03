import logo from './logo.svg';
import {useEffect, useState} from 'react';
import './App.css';
import Login from './Pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import Location from './Pages/SASPpages/Location/Location';
import Daily from "./Pages/SASPpages/Daily/Daily"
import { Routes, Route, Link, Navigate} from "react-router-dom";
import Incidents from './Pages/SASPpages/Incidents/Incidents';
import { post } from './Utils/API';
import { API_URL } from './Utils/API';
import Register from './Pages/Register/Register';
import ChangePassword from './Pages/ChangePassword/ChangePassword';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  async function autoLogin() {
    var tokenVerification
    var storedToken = localStorage.getItem("token")

    if (storedToken !== null) {
      tokenVerification = await post(API_URL + "/validate-token", {token: storedToken})
      if (tokenVerification.message === "verified") {
        setLoggedIn(true)
        setLoggedInUser(tokenVerification.user)
      }
    }
  }


/*

{loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser}/>}          
*/
//<Route path='/sasp-eval-for-trainee' element={() => { window.location.href = 'https://google.com'; return null;} }/>
  return (
    <div className="App">
        <Routes>
          {/* general routes */}
          <Route path="/" element={loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser} autoLogin={() => autoLogin()}/> } />
          <Route path="/locations" element={<Location setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/incidents" element={<Incidents setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/register-accounts" element={<Register setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/change-passwords" element={<ChangePassword setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>

          {/* sasp routes */}
          <Route path="/SASPpages/daily" element={<Daily setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>

        </Routes>                 
    </div>
  );
}

export default App;