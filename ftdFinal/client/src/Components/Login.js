import React, { Component } from 'react'
import Error from './Error';
import './form.css';
// import * as controller from "../controller.js";
// import $ from 'jquery';

export class Login extends Component {

    constructor(props){
        super(props);
        this.logins = this.props.login;
        this.state = {
            username: '',
            password: '',
            errormsg: 'Please ensure username and password are valid'
        };
    }

    handleUsername(e){
    this.setState({username: e.target.value});
    }

    handlePassword(e){
    this.setState({password: e.target.value});
    }

    login(e){
        e.preventDefault();
        var url = "/ftd/api/user/" + this.state.username + '/password/' + this.state.password
        fetch(url, {method: 'GET'}).then((response) => {
              return response.json();
              // console.log('Got a login response!');
              // console.log(response.json());
              // console.log("Login not working")
        }).then((data) => {
          if (data.success == true){
            this.setState({
              errormsg: ''
            });
            console.log("Logging in!");
            this.props.login(this.state.username);
          } else {
            this.setState({
              errormsg: "Invalid User Credentials!"
            });
          // console.log(data);
        }
      })
    }

    register(e){
        e.preventDefault()
        // console.log(this);
        this.props.view();
    }

    render() {
        return (
            <div className='form'>
                <h1>Welcome to FTD</h1>
                <br></br>
                <div id="logindiv">
                LOGIN
                <br></br>
                <br></br>
                Username: <input type='text' id='loginUsername' value={this.state.username} onChange={this.handleUsername.bind(this)}/>
                <br></br>
                <br></br>
                Password: <input type='password' id='loginPassword' value={this.state.password} onChange={this.handlePassword.bind(this)}/>
                <br></br>
                <br></br>
                <button type='submit' id='loginSubmit' onClick={this.login.bind(this)}>Login</button>
                <br></br>
                <br></br>
                <button type='submit' id='create' onClick={this.register.bind(this)}> Don't have an account? Click here! </button>
                </div>
                <Error msg={this.state.errormsg} />
                <br></br>
                <div id='highscores'></div>
            </div>
        )
    }
}

export default Login
