import React, { Component } from 'react'
import Error from './Error';
// import axios from 'axios';
import './form.css';
// import {Link} from "react-router-dom";

export class Register extends Component {

    constructor(props){
        super(props);
        // console.log(this.props.view);
        this.state = {
            username: '',
            password: '',
            errormsg: 'Please ensure username, password, and email are valid',
            email: ''
        };
    }

    handleEmail(e){
    this.setState({email: e.target.value});
    }
    handleUsername(e){
    this.setState({username: e.target.value});
    }

    handlePassword(e){
    this.setState({password: e.target.value});
    }

    register(e){
        e.preventDefault();
        var url = "/ftd/api/users"
        var data = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.password,
            games: 0
        }
        console.log(JSON.stringify(data))
        fetch(url, {
           headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log('Got a Registration response!');
          if (data.success == true){
            this.setState({
              errormsg: ''
            });
            console.log("Registering!");
            this.props.view();
          } else {
            this.setState({
              errormsg: "Username, password, or email not valid!"
            });
            console.log(data);
          }
        })
    }

    login(){
        //Check ajax request first, then switch
        this.props.view()
    }

    render() {
        return (
            <div className='form'>
                <h1>Welcome to FTD</h1>
                <br></br>
                REGISTER
                <br></br>
                <br></br>
                Username: <input type='text' id='Username' value={this.state.username} onChange={this.handleUsername.bind(this)}/>
                <br></br>
                <br></br>
                Password: <input type='password' id='Password' value={this.state.password} onChange={this.handlePassword.bind(this)}/>
                <br></br>
                <br></br>
                Email: <input type='email' id='email' value={this.state.email} onChange={this.handleEmail.bind(this)}/>
                <br></br>
                <br></br>
                <button type='submit' id='registerSubmit' onClick={this.register.bind(this)}>Register!</button>
                <br></br>
                <br></br  >
                <button type='submit' id='registerSubmit' onClick={this.login.bind(this)}>Back to Login!</button>
                {/* // <button type='submit' id='registerSubmit'><Link to='/login'> Register! </Link></button> */}
                <Error msg={this.state.errormsg} />
            </div>
        )
    }
}

export default Register
