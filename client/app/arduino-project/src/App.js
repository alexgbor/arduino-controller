import React, { Component } from 'react';
import './App.css';
import Main from "./components/main/Main"
import Header from "./components/header/Header"

class App extends Component {

  isLogged = () => {
    return localStorage.getItem("token-app") ? true : false
  }


  render() {
    return (
      <div className="App">

        {

          this.isLogged() ?
            <Header isLogged={true} />
            :
            <Header isLogged={false} />

        }

        <Main />

      </div>
    );
  }
}

export default App;