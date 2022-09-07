import logo from './logo.svg';
import {useState} from 'react';
import './App.css';
import Login from './Pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="App">
    {loggedIn ? <Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn}/> :  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
     
      
    </div>
  );
}

export default App;
