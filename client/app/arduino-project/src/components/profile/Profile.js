import React, { Component } from "react";
import logic from "../../logic";
import { withRouter, Link } from 'react-router-dom'
import { Row, Col, Media, Button, Jumbotron, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

let imgStyle = {
    height: '256px',
    width: '256px'
}

class Profile extends Component {

    state = {
        name: '',
        surname: '',
        picture_url: '',
        serverErrorMessage: '',
        modal: false,
        password: ''
    }

    componentDidMount() {
        let userId = localStorage.getItem('id-app')
        let token = localStorage.getItem('token-app')

        if (userId && token) {

            logic.retrieveUser(userId, token).then(resp => {
                Promise.resolve().then(() => {
                    this.setState({
                        name: resp.name,
                        surname: resp.surname,
                        email: resp.email,
                        picture_url: resp.picture_url
                    })
                })
            })
        }
    }

    _handleName = ({ target: { value: name } }) => {
        this.setState({
            name
        })
    }

    _handleSurname = ({ target: { value: surname } }) => {
        this.setState({
            surname
        })
    }

    _handlePicture_url = ({ target: { value: picture_url } }) => {
        this.setState({
            picture_url
        })
    }
    _handlePassword = ({ target: { value: password } }) => {
        this.setState({
            password
        })
    }

    _handleUpdate = (e) => {
        e.preventDefault()
        let picture_url = this.state.picture_url

        let token = localStorage.getItem('token-app')
        let userId = localStorage.getItem('id-app')
        let name = this.state.name
        let pass = this.state.password
        let surname = this.state.surname
        let email = this.state.email
        if (/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(picture_url)) {
            logic.updateUser(userId, token, name, surname, pass, email, picture_url).then(resp => {
                if (resp.status !== 'OK') {
                    this.toggle()
                    this.setState({ serverErrorMessage: resp })
                } else {
                    this.toggle()
                }
            })
        } else {
            this.toggle()
            this.setState({ serverErrorMessage: 'Error: Invalid picture url' })
        }
    }


    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {

        if (!this.props.isLogged()) {
            return <div className="mt-5 shadow-sm">
                <Jumbotron fluid>
                    <Container fluid>
                        <h1 className="display-3">YOU'RE NOT ALLOWED</h1>
                    </Container>
                </Jumbotron>
            </div>

        } else {
            return (

                <div className="container profile-form text-center">



                    <div className="forms mb-3 mt-3">
                        <Row>
                            <Col xs='12' md={{ size: '6', offset: '3' }}>
                                <div className="box-img rounded-circle m-4 justify-content-center ">
                                    <Media id='picture_url' className="box-img rounded m-4 justify-content-center shadow" object style={imgStyle} src={/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(this.state.picture_url) ? this.state.picture_url : 'https://fch.lisboa.ucp.pt/sites/default/files/assets/images/avatar-fch_8.png'}
                                        alt="Profile picture" />
                                </div>
                                <form onSubmit={this._handleUpdate}>
                                    <div className="field mb-4">
                                        <input value={this.state.name} autoFocus onChange={this._handleName} id="name" type="text" placeholder="Your name" />
                                        <label htmlFor="Name">Name</label>
                                    </div>
                                    <div className="field mb-4">

                                        <input value={this.state.surname} onChange={this._handleSurname} id="Surname" type="text" placeholder="Your last name"
                                        />
                                        <label htmlFor="Surname">Surname</label>
                                    </div>
                                    <div className="field mb-4">
                                        <input value={this.state.picture_url} onChange={this._handlePicture_url} id="picture_url" type="text" placeholder="URL for profile picture?"
                                        />
                                        <label htmlFor="pictureurl">Picture Url</label>
                                    </div>
                                    <div className="field mb-4">
                                        <input value={this.state.password} onChange={this._handlePassword} id="password" type="password" placeholder="Confirm password"
                                        />
                                        <label htmlFor="Password">Password</label>
                                    </div>
                                    <div className="field mb-4">

                                        <p className="text-danger">{this.state.serverErrorMessage}</p>
                                    </div>
                                    <Row>
                                        <Col xs='12' md={{ size: '3', offset: '3' }}>
                                            <Button className="mb-3 btn bg-darkcyan btn-lg" type='submit'>Update</Button>
                                        </Col>
                                        <Col xs='12' md='3'>
                                            <Link to="/unregister">
                                                <div className="row justify-content-center ">
                                                    <Button className="mb-5 btn btn-danger btn-lg">Unregister</Button>
                                                </div>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <div className="field mb-4">
                                    </div>
                                </form>

                            </Col>
                        </Row>
                    </div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Oops! Something went wrong...</ModalHeader>
                        <ModalBody>
                            {this.state.serverErrorMessage ? `Error: ${this.state.serverErrorMessage}` : 'Updated correctly!'}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Close</Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>
            )
        }
    }
}

export default withRouter(Profile);