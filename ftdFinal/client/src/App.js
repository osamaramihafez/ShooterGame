import React from 'react';
import './App.css';
import Game from "./Components/Game";
import Over from "./Components/Over";
import Form from "./Components/Forms";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      loggedIn: false,
      gameOver: false,
      profile: true,
      username: ''
    }
  }

  goLogin(username){
    this.setState({
      loggedIn: false,
      username: ''
    })
  }

  login(user){
    this.setState({
      loggedIn: true,
      username: user
    })
  }

  gameOver(){
    this.setState({
      gameOver: true
    })
  }

  play(){
    this.setState({
      profile: false
    })
  }

  render(){
    return (
      <div>
        {!this.state.loggedIn
          ? <Form login={this.login.bind(this)}/>
          : (this.state.gameOver
              ? <Over />
              : (this.state.profile
                  ? <Profile play={this.play.bind(this)} user={this.state.username} view={this.goLogin.bind(this)}/>
                  : <Game />
                  )
            )
        }
      </div>
    );
  }
}

export default App;
