import React, { Component, useEffect, useState } from 'react'
import { API_URL, get, post } from '../../Utils/API'
import { Button } from 'rsuite';
import IthacaLogo from '../../Images/logo.png'
import TextField from '@mui/material/TextField';
import { Input } from '@chakra-ui/react'
import './LoginForm.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Text } from '@chakra-ui/react'


//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({autoLogin, setLoading}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [isAuthenticated, setIsAuthenticated]= useState(false);
    

  //   const { instance, accounts } = useMsal();

  //   function login (){
  //     instance.loginPopup(loginRequest).catch(e => {
  //         console.log(e);
  //         // setIsAuthenticated(false);
  //       });
  //       setIsAuthenticated(true);
  //   }

  // function logout (){
  //         instance.logoutPopup({
  //             postLogoutRedirectUri: "/",
  //             mainWindowRedirectUri: "/" // redirects the top level app after logout
  //         });
  //         setIsAuthenticated(false);
  // }



  //   const [graphData, setGraphData] = useState(null);

  //   const name = accounts[0] && accounts[0].name;

  //   function RequestProfileData() {
  //       const request = {
  //           ...loginRequest,
  //           account: accounts[0]
  //       };

  //       // Silently acquires an access token which is then attached to a request for Microsoft Graph data
  //       instance.acquireTokenSilent(request).then((response) => {
  //           callMsGraph(response.accessToken).then(response => setGraphData(response));
  //       }).catch((e) => {
  //           instance.acquireTokenPopup(request).then((response) => {
  //               callMsGraph(response.accessToken).then(response => setGraphData(response));
  //           });
  //       });

  //       console.log(graphData);
  //       console.log(accounts);
  //   }








    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    function emailChangeHandler(e) {
      setEmail(e.target.value)
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value)
    }

    async function loginHandler(e) {
      setLoading(true)

      if (!e) {
        autoLogin()
        setLoading(false)
        return
      }
      
      let response = await post(API_URL + "/login",  {email: email, password: password})
      var tokenVerification = await post(API_URL + "/validate-token", {token: response.token})
    
      if (tokenVerification.message === "verified") {
        toast.success(<h5>Verified. Logging you in!</h5>, {style: {fontWeight: "bold"}})
        setLoading(false)
        setTimeout(() => {
          localStorage.setItem("token", response.token)
          dispatch(userActions.updateLoggedIn(true))
          dispatch(userActions.updateUserMetadata(tokenVerification.user))
          localStorage.setItem("firstName", tokenVerification.user.firstName)
        }, 1500)
      } else {
        dispatch(userActions.updateLoggedIn(false))
        dispatch(userActions.updateUserMetadata(null))
        setLoading(false)
        toast.error(<h5>Wrong Credentials!</h5>, {style: {fontWeight: "bold"}})
      }
   }
   function checkMessage(){
    if(!(localStorage.getItem("message") === null)){
        toast.success(String(localStorage.getItem("message")));
        localStorage.removeItem("message");
    }
}

    useEffect((e) => {
      // checkMessage()
      loginHandler(e)
      
    }, [])
 
      return (
            <div className="form m-2 p-2">
                <ToastContainer/>
                <div className="ithaca-logo-login-container" style={{color: "black"}}>
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                      <Text fontSize='4xl' color="black" mb={10}>Access Page</Text>
                     <div class="mb-3">
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start" style={{color: "black"}}>Email</label>
                       <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => emailChangeHandler(e)} style={{color: "black"}}/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start" style={{color: "black"}}>Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => passwordChangeHandler(e)} style={{color: "black"}}/>
                     </div>

                     <Button appearance="primary" class="btn btn-primary" onClick={(e) => loginHandler(e)} color="blue" active>Login</Button>
                     {/* {useIsAuthenticated()?
                     <>
                     <Button variant="secondary" onClick={RequestProfileData}>Request Access Token</Button>
                     <Button appearance="primary" className="btn btn-primary" onClick={() => logout()} color="blue" active>Log out</Button>
                     </>
                     :
                     <Button appearance="primary" className="btn btn-primary" onClick={()=>login()} color="blue" active>Login</Button>
                     } */}
                </form>
            </div>
      )
}
  
