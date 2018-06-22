import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import { Landing, Home, Profile, Register, Login, Error404, Unregister } from "../index";
import './style.css'

class Main extends Component {

    isLogged = () => {
        return localStorage.getItem("token-app") ? true : false
    }

    render() {
        return <div className ="container main-background">
            <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/home" render={props => <Home isLogged={this.isLogged} />} />
                <Route path="/profile" render={props => <Profile isLogged={this.isLogged} />} />
                <Route path="/register" render={props => <Register />} />
                <Route path="/login" render={props => <Login />} />
                <Route path='/unregister' render={props => <Unregister isLogged={this.isLogged} />} />
                <Route path='/' render={props => <Error404 />} />
            </Switch>
        </div>
    }

}

export default Main;