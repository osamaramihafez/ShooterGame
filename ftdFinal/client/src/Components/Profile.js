import React, { Component } from 'react'
import Error from './Error';
import './form.css';

export class Profile extends Component {

    constructor(props){
        super(props);
        console.log(this.props.user)
        this.state = {
            error: false,
            username: this.props.user,
            password: '',
            email: '',
            errormsg: ''
        };
    }

    handleEmail(e){
    this.setState({email: e.target.value});
    }
    handleUser(e){
    this.setState({username: e.target.value});
    }

    handlePass(e){
    this.setState({password: e.target.value});
    }

    updateUser(e){
        e.preventDefault();
        var url = "/ftd/api/users/" + this.props.user
        var data = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }
        console.log(JSON.stringify(data))
        fetch(url, {
           headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
            method: 'PUT',
            body: JSON.stringify(data)
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log('Got an Update response!');
          if (data.success == true){
            this.setState({
              errormsg: 'Account Updated!'
            });
            console.log("Updating User!");
          } else {
            this.setState({
              errormsg: "Username, password, or email not valid!"
            });
            console.log(data);
          }
        })
    }

    play(){
      this.props.play();
    }

    login(){
      this.props.view()
    }

    // delete(e){
    //   e.preventDefault();
    //   var url = "/ftd/api/users/" + this.props.
    //   // var data = {
    //   //     username: this.props.user
    //   // }
    //   console.log(JSON.stringify(data))
    //   fetch(url, {
    //      headers : {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     },
    //       method: 'DELETE',
    //       // body: JSON.stringify(data)
    //   }).then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     console.log('Got an Update response!');
    //     if (data.success == true){
    //       this.setState({
    //         errormsg: 'Account Deleted!'
    //       });
    //       console.log("Updating User!");
    //     } else {
    //       this.setState({
    //         errormsg: "That account doesn't exist...?"
    //       });
    //       console.log(data);
    //     }
    //   })
    // }

    render() {
        return (
            <div>
              <div className='form'>
                  <br></br>
                  <div id="logindiv">
                  <h1>Update your profile</h1>
                  <br></br>
                  <br></br>
                  Change Username: <input type='text' value={this.props.username} onChange={this.handleUser.bind(this)} />
                  <br></br>
                  <br></br>
                  Change Password: <input type='password' onChange={this.handlePass.bind(this)} />
                  <br></br>
                  <br></br>
                  Change Email: <input type='email' onChange={this.handleEmail.bind(this)} />
              </div>
              <Error msg={this.state.errormsg} />
              <hr />
              <button type='submit' onClick={this.login.bind(this)}>Go back to login</button>
              <br></br>
              <br></br>
              <button type='submit' onClick={this.updateUser.bind(this)}>Update User</button>
              <br></br>
              <br></br>
              {/*}<button type='submit' onClick={this.play.bind(this)}>Play</button>*/}
              <a href="http://142.1.200.148:10038/game">Start Game</a>
              {/* <br></br>
              <br></br>
              <button type='submit' onClick={this.delete.bind(this)}>Delete Profile</button>
              */}
            </div>
            </div>
        )
    }
}

export default Profile
