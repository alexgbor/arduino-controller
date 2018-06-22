import React, { Component } from "react";
import logic from "../../logic";
import { withRouter } from 'react-router-dom'
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Login extends Component {

    state = {
        email: "",
        password: "",
        loginFailedMessage: "",
        modal: false
    }

    _handleKeepEmail = ({ target: { value: email } }) => {
        this.setState({ email })
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    _handleKeepPassword = ({ target: { value: password } }) => {
        this.setState({ password })
    }


    _handleLogin = (e) => {
        e.preventDefault()
        logic.login(this.state.email, this.state.password)
            .then(res => {
                if (res.status === 'OK') {
                    localStorage.setItem('token-app', res.data.token)

                    localStorage.setItem('id-app', res.data.id)
                    this.props.history.push('/home')

                } else {
                    this.toggle()
                    this.setState({
                        loginFailedMessage: res
                    })
                }
            })
    }

    render() {

        return (

            <div className="forms mb-3 mt-3">
                <Row>
                    <Col xs='12' md={{ size: '6', offset: '3' }}>
                        <h2 className="text-center mt-5">LOGIN</h2>
                        <form onSubmit={this._handleLogin}>
                            <div className="field mb-4">
                                <input type="text" name="email" id="email" placeholder="johndoe@gmail.com" value={this.state.email} autoFocus onChange={this._handleKeepEmail} />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="field mb-4">
                                <input type="password" name="password" id="password" placeholder="123123ab" value={this.state.password} onChange={this._handleKeepPassword} />
                                <label htmlFor="password">Password</label>
                            </div>
                            <Button type="submit">Log me In</Button>
                        </form>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Oops! Something went wrong...</ModalHeader>
                    <ModalBody>
                        Error: {this.state.loginFailedMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Close</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Login);