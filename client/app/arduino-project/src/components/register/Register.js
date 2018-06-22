import React, { Component } from "react"
import logic from "../../logic"
import { withRouter } from 'react-router-dom'
import { Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Register extends Component {
    state = {
        name: "",
        surname: "",
        password: "",
        email: "",
        repeatPassword: "",
        notMatchingMessage: "",
        registerFailedMessage: "",
        modalFail: false,
        modalPass: false
    }
    toggleFail = () => {
        this.setState({
            modalFail: !this.state.modalFail
        })
    }
    modalPass = () => {
        this.setState({
            modalPass: !this.state.modalPass
        })
    }
    _comparePassword() {
        if ((this.state.password !== this.state.repeatPassword) && this.state.repeatPassword.length) {
            this.setState({
                notMatchingMessage: "Passwords don't match"
            })
        } else {
            this.setState({
                notMatchingMessage: ""
            })
        }
    }

    _handleKeepName = ({ target: { value: name } }) => {
        this.setState({ name })
    }

    _handleKeepSurname = ({ target: { value: surname } }) => {
        this.setState({ surname })
    }

    _handleKeepEmail = ({ target: { value: email } }) => {
        this.setState({ email })
    }

    _handleKeepPassword = ({ target: { value: password } }) => {
        Promise.resolve().then(() => {
            this.setState({ password })
        }).then(() => {
            this._comparePassword()
        })
    }

    _handleKeepRepeatPassword = ({ target: { value: repeatPassword } }) => {
        Promise.resolve().then(() => {
            this.setState({ repeatPassword })
        }).then(() => {
            this._comparePassword()
        })
    }

    _handleRegister = e => {
        e.preventDefault();
        if (this.state.notMatchingMessage === '') {

            logic.registerUser(this.state.name, this.state.surname, this.state.email, this.state.password)
                .then(res => {
                    if (res.status === 'OK') {
                        this.props.history.push('/login')
                    }
                    else {
                        this.toggleFail()
                        this.setState({ registerFailedMessage: res })
                    }
                })
        } else {
            this.modalPass()
        }
    }


    render() {
        return <div className="forms mb-3 mt-3">
            <Row>
                <Col xs='12' md={{ size: '6', offset: '3' }}>
                    <h2 className="text-center mt-3">REGISTER</h2>
                    <form onSubmit={this._handleRegister}>
                        <div className="field mb-4">
                            <input type="text" name="name" id="name" placeholder="John" autoFocus value={this.state.name} onChange={this._handleKeepName} />
                            <label htmlFor="name">Name</label>
                        </div><div className="field mb-4">
                            <input type="text" name="surname" id="surname" placeholder="Doe" value={this.state.surname} onChange={this._handleKeepSurname} />
                            <label htmlFor="surname">Surname</label>
                        </div><div className="field mb-4">
                            <input type="text" name="email" id="email" placeholder="johndoe@gmail.com" value={this.state.email} onChange={this._handleKeepEmail} />
                            <label htmlFor="email">Email</label>
                        </div><div className="field mb-4">
                            <input type="password" name="Password" id="Password" placeholder="123123ab" value={this.state.password} onChange={this._handleKeepPassword} />
                            <label htmlFor="password">Password</label>
                        </div><div className="field mb-4">
                            <input type="password" name="repeatpassword" id="repeatpassword" placeholder="123123ab" value={this.state.repeatPassword} onChange={this._handleKeepRepeatPassword} type="password" />
                            <label htmlFor="repeatpassword">Repeat Password</label>
                        </div>
                        <Button type="submit">Register</Button>
                    </form>
                </Col>
            </Row>
            <div className="row justify-content-center ">

                <p className="text-danger text-capitalize">{this.state.notMatchingMessage}</p>
            </div>

            <div className="row justify-content-center ">

            </div>
            <Modal isOpen={this.state.modalFail} toggle={this.toggleFail}>
                <ModalHeader toggle={this.toggleFail}>Oops! Something went wrong...</ModalHeader>
                <ModalBody>
                    Error: {this.state.registerFailedMessage}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleFail}>Close</Button>{' '}
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.modalPass} toggle={this.modalPass}>
                <ModalHeader toggle={this.modalPass}>Oops! Something went wrong...</ModalHeader>
                <ModalBody>
                    Error: Passwords don't match.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.modalPass}>Close</Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    }

}

export default withRouter(Register);