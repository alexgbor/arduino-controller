import React, { Component } from "react";
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import { Button, Col, Row, Jumbotron, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


class Unregister extends Component {

    state = {
        password: '',
        failedUnregisterMessage: '',
        modal: false
    }

    _handleKeepPassword = ({ target: { value: password } }) => {
        this.setState({ password })
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    _handleUnregister = e => {

        e.preventDefault()

        let id = localStorage.getItem('id-app')
        let token = localStorage.getItem('token-app')
        let pass = this.state.password

        logic.retrieveUser(id, token).then(resp => resp.email)
            .then(email => logic.unregisterUser(email, pass, token, id))
            .then((r) => {
                if (r === true) {
                    localStorage.removeItem("id-app")
                    localStorage.removeItem("token-app")
                    this.history.push('/')
                }
                else {
                    this.toggle()
                    this.setState({
                        failedUnregisterMessage: r
                    })
                }
            }

            )
    }
    render() {
        return <div>
            {
                this.props.isLogged() ?
                    <div className="forms mb-3 mt-3">

                        <Row>
                            <Col xs='12' md={{ size: '6', offset: '3' }}>
                                <h1 className="text-center mt-5">Unregister</h1>
                                <form onSubmit={this._handleUnregister}  >
                                    <div className="field mb-4">
                                        <input type="password" name="password" id="password" placeholder="123123ab" value={this.state.password} onChange={this._handleKeepPassword} />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <div className="row justify-content-center ">
                                        <Button type="submit">Send</Button>
                                    </div>

                                </form>
                            </Col>
                        </Row>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}>
                            <ModalHeader toggle={this.toggle}>Oops! Something went wrong...</ModalHeader>
                            <ModalBody>
                                Error: {this.state.failedUnregisterMessage}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle}>Close</Button>{' '}
                            </ModalFooter>
                        </Modal>
                    </div>
                    :
                    <div className="mt-5 shadow-sm">
                        <Jumbotron fluid>
                            <Container fluid>
                                <h1 className="display-3">YOU'RE NOT ALLOWED</h1>
                            </Container>
                        </Jumbotron>
                    </div>
            }
        </div>
    }
}

export default withRouter(Unregister)