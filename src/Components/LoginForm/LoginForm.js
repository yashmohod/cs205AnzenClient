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
import { useSelector, useDispatch } from 'react-redux';
import {userActions} from "../../redux/slices/user"
import { useMsal } from "@azure/msal-react";
import Dev_Settings from "../../Utils/Dev_Settings.json"

export default function LoginForm({autoLogin, setLoading}) {

  

  const dispatch = useDispatch()
  const { instance } = useMsal();
  function login(){
    // console.log(Dev_Settings.DEV_MODE);
    if(Dev_Settings.DEV_MODE){
      getToken(Dev_Settings.DEV_EMAIL);
   }
   else{
    if(instance.getActiveAccount() != null){
      getToken(instance.getActiveAccount().username);

    }else{
      const loginRequest = {
        scopes: ["user.read"],
    //     prompt: 'select_account',
      }
      instance.loginPopup(loginRequest)
        .then(response => {
          console.log(response);
          getToken(response.account.username);
        })
        .catch(error => {
            // handle errors
            toast.error(error);
        });
    } 
    
   }
    
  }
  async function getToken(email){
    setLoading(true);
    // const currentAccount = instance.getActiveAccount();
    var response, tokenVerification
      try {
          response = await post(API_URL + "/login", {email: email} )

        tokenVerification = await post(API_URL + "/validate-token", {token: response.token})
      } catch {
        setLoading(false)
        toast.error(<h5>Some went wrong!</h5>, {style: {fontWeight: "bold"}})
      }

      if (tokenVerification.message === "verified") {
        toast.success(<h5>Verified. Logging you in!</h5>, {style: {fontWeight: "bold"}})
        setLoading(false)
        setTimeout(() => {
          localStorage.setItem("token", response.token)
          dispatch(userActions.updateLoggedIn(true))
          dispatch(userActions.updateUserMetadata(tokenVerification.user))
          localStorage.setItem("firstName", tokenVerification.user.firstName)
        }, 1500)
        return true
      } else {
        dispatch(userActions.updateLoggedIn(false))
        dispatch(userActions.updateUserMetadata(null))
        setLoading(false)
        toast.error(<h5>{response.message}</h5>, {style: {fontWeight: "bold"}})
        return false
      }
  }
  


 

    useEffect((e) => {
      autoLogin();
      }, [])

      return (
            <div className="form m-2 p-2">
                <ToastContainer/>
                <div className="ithaca-logo-login-container" style={{color: "black"}}>
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                      <Text fontSize='4xl' color="black" mb={10}>Access Page</Text>
                     <Button appearance="primary" className="btn btn-primary" onClick={()=>login()} color="blue" active>Login</Button>
                </form>
            </div>
      )
}
  
