import {useCallback} from 'react';
import Login from './Pages/GeneralPages/Login/Login';
import Dashboard from './Pages/GeneralPages/Dashboard/Dashboard';
import Location from './Pages/SASPpages/Location/Location';
import Daily from "./Pages/SASPpages/Daily/Daily"
import Records from "./Pages/SASPpages/Records/Records"
import Referals from "./Pages/SASPpages/Referals/Referals"
import { Routes, Route, Link, Navigate} from "react-router-dom";
import Incidents from './Pages/SASPpages/Incidents/Incidents';
import ChangePassword from './Pages/GeneralPages/ChangePassword/ChangePassword';
import EmployeeAccounts from './Pages/GeneralPages/EmployeeAccounts/EmployeeAccounts';
import TimeCards from './Pages/GeneralPages/TimeCards/TimeCards';
import UserPersonalProfile from './Pages/GeneralPages/UserPersonalProfile/UserPersonalProfile'
import Positions from './Pages/GeneralPages/Positions/Positions'
import Shifts from './Pages/GeneralPages/Shifts/Shifts';
import Links from './Pages/GeneralPages/Links/links';
import { useNavigate } from "react-router-dom";
import 'rsuite/styles/index.less';
import 'rsuite/dist/rsuite.min.css'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './redux/slices/user';
import Nav from './Components/Nav/Nav';
import useFetch from './hooks/useFetch';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {REQUEST: fetcher} = useFetch();
  const user = useSelector((state) => state.user);

  const autoLogin = useCallback(async () => {
    var tokenVerification
    var storedToken = localStorage.getItem("token")

    if (storedToken !== null) {
      tokenVerification = await fetcher("POST", "/validate-token", {token: storedToken})
      if (tokenVerification.message === "verified") {
        dispatch(userActions.updateLoggedIn(true))
        dispatch(userActions.updateUserMetadata(tokenVerification.user))
        localStorage.setItem("firstName", tokenVerification.user.firstName)
        return true
      }
      else{
        localStorage.setItem("message", "Login Session expired!")
        dispatch(userActions.updateLoggedIn(false))
        navigate("/")
        return false
      }
    }
  }, [user])

//<Route path='/sasp-eval-for-trainee' element={() => { window.location.href = 'https://google.com'; return null;} }/>
  return (
    <div className="App">
        {user.isLoggedIn && <Nav autoLogin={autoLogin}/>}
        <Routes>
          {/* general routes */}
          <Route path="/" element={user.isLoggedIn ? <Dashboard autoLogin={() => autoLogin()} /> :  <Login autoLogin={() => autoLogin()}/> } />
          <Route path="/change-passwords" element={<ChangePassword autoLogin={() => autoLogin()}/>}/>
          <Route path="/employee-accounts" element={<EmployeeAccounts autoLogin={() => autoLogin()}/>}/>
          <Route path="/time-cards" element={<TimeCards autoLogin={() => autoLogin()}/>}/>
          <Route path="/UserPersonalProfile" element={<UserPersonalProfile autoLogin={() => autoLogin()}/>}/>
          <Route path="/positions" element={<Positions autoLogin={() => autoLogin()}/>}/>
          <Route path="/shifts" element={<Shifts autoLogin={() => autoLogin()}/>}/>
          <Route path="/links" element={<Links autoLogin={() => autoLogin()}/>}/>

          {/* sasp routes */}
          <Route path="/SASPpages/daily" element={<Daily autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/locations" element={<Location autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/incidents" element={<Incidents autoLogin={() => autoLogin()}/>}/>
          <Route path="/SASPpages/Records" element={<Records autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>
          <Route path="/SASPpages/referrals" element={<Referals autoLogin={() => autoLogin()} fullVersion={true} reportID={""}/>}/>
        </Routes>                 
    </div>
  );
}

export default App;