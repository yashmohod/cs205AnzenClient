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
import { userSliceActions } from './Redux/user';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null)
  const  loggedIn = useSelector((state) => state.user.isLoggedIn)
  const dispatch = useDispatch()

  async function autoLogin() {
    var tokenVerification
    var storedToken = localStorage.getItem("token")

    if (storedToken !== null) {
      tokenVerification = await post(API_URL + "/validate-token", {token: storedToken})
      if (tokenVerification.message === "verified") {
        dispatch(userSliceActions.setLoggedIn(true))
        setLoggedInUser(tokenVerification.user)
        return true
      }
      else{
        localStorage.setItem("message", "Login Session expired!")
        dispatch(userSliceActions.setLoggedIn(false))
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
 
          <Route path="/" element={loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser}/> :  <Login loggedIn={loggedIn} setLoggedIn={userSliceActions.setLoggedIn} setLoggedInUser={setLoggedInUser} autoLogin={() => autoLogin()}/> } />
          <Route path="/register-accounts" element={<Register setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/change-passwords" element={<ChangePassword setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/employee-accounts" element={<EmployeeAccounts setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/time-cards" element={<TimeCards setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>

          {/* sasp routes */}
          <Route path="/SASPpages/daily" element={<Daily setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/locations" element={<Location setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/incidents" element={<Incidents setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/Records" element={<Records setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>
          <Route path="/SASPpages/referrals" element={<Referals setLoggedIn={userSliceActions.setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>
        </Routes>                 
    </div>
  );
}

export default App;