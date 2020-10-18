import React, { Component } from 'react'
import Login from "./Login"
import Register from "./Register"

export class Form extends Component {

    constructor(props){
        super(props);
        this.state = {
          view: 'login'
        }
    }

    goRegister(){
      this.setState({
        view: 'register'
      }, () => console.log(this.state.view))
    }

    goLogin(username){
      this.setState({
        view: 'login'
      })
    }

    render() {
      return(
        <div>
            {this.state.view === 'login'
            ? <Login view={this.goRegister.bind(this)} login={this.props.login}/>
            : <Register view={this.goLogin.bind(this)} />
            }
        </div>
      );
    }
}

export default Form
