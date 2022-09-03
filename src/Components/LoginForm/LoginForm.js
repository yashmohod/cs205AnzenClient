import React, { Component } from 'react'
import SimpleLoginForm from 'simple-login-form'
import 'simple-login-form/dist/index.css'
import './LoginForm.css'

//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm() {
      return (
            <div className="form p-5">
                <form className='m-5'>
                    <h1>Login</h1>
                     <div class="mb-3">
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start">Email address</label>
                       <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start">Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1"/>
                     </div>
           
                     <button type="submit" class="btn btn-primary">Login</button>
                    
                </form>
                <a href="">Forgot password?</a>
                <p>No account? <a href="">Sign Up</a></p> 
            </div>
      )
}
  