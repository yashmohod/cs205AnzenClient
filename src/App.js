import logo from './logo.svg';
import {useEffect, useState} from 'react';
import Login from './Pages/GeneralPages/Login/Login';
import Dashboard from './Pages/GeneralPages/Dashboard/Dashboard';
import Location from './Pages/SASPpages/Location/Location';
import Daily from "./Pages/SASPpages/Daily/Daily"
import Records from "./Pages/SASPpages/Records/Records"
import Referals from "./Pages/SASPpages/Referals/Referals"
import { Routes, Route, Link, Navigate} from "react-router-dom";
import Incidents from './Pages/SASPpages/Incidents/Incidents';
import { post } from './Utils/API';
import { API_URL } from './Utils/API';
import Register from './Pages/GeneralPages/Register/Register';
import ChangePassword from './Pages/GeneralPages/ChangePassword/ChangePassword';
import EmployeeAccounts from './Pages/GeneralPages/EmployeeAccounts/EmployeeAccounts';
import TimeCards from './Pages/GeneralPages/TimeCards/TimeCards';
import { useNavigate } from "react-router-dom";
import 'rsuite/styles/index.less';
import 'rsuite/dist/rsuite.min.css'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const navigate = useNavigate();
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
        return true
      }
      else{
        localStorage.setItem("message", "Login Session expired!")
        setLoggedIn(false)
        navigate("/")
        return false
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
 
          <Route path="/" element={loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser} autoLogin={() => autoLogin()}/> } />
          {/* <Route path="/register-accounts" element={<Register setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/> */}
          <Route path="/change-passwords" element={<ChangePassword setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/employee-accounts" element={<EmployeeAccounts setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/time-cards" element={<TimeCards setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>

          {/* sasp routes */}
          <Route path="/SASPpages/daily" element={<Daily setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/locations" element={<Location setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/incidents" element={<Incidents setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/Records" element={<Records setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>
          <Route path="/SASPpages/referrals" element={<Referals setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>

        </Routes>                 
    </div>
  );
}

export default App;