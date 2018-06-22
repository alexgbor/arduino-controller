import React, { Component } from "react"
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import swal from 'sweetalert2'
import { Col, ButtonGroup, Row, Container, Jumbotron, Button, Collapse, Card, CardTitle, CardText, CardHeader, CardBody, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Home extends Component {

    state = {
        dropdownOpen: false,
        ip: '',
        port: '',
        selectedArduino: '',
        selectedPin: '',
        chartData: {},
        timer: null,
        counter: 0,
        collapseAdd: true,
        collapseList: false,
        collapseData: false,
        collapseOutput: false,
        collapseRemove: false,
        errorMessage: ''
    }

    componentDidMount() {

        let timer = setInterval(this._handleData, 3000)
        this.setState({ timer })

    }

    componentWillUnmount() {
        clearInterval(this.state.timer)
    }

    arduHandler = ({ target: { value: selectedArduino } }) => {
        this.setState({ selectedArduino })
    }

    outputHandler = ({ target: { value: selectedPin } }) => {
        this.setState({ selectedPin })
    }

    handleIds = () => {
        const userId = localStorage.getItem('id-app')
        const targetArduino = this.state.selectedArduino
        if (this.state.data && this.state.selectedArduino && this.state.selectedArduino !== "Select an arduino:") {
            const arduId = this.state.data.find(ele => ele.ip === targetArduino)
            Promise.resolve()
                .then(
                    swal({
                        type: 'success',
                        title: 'Your data, write it down!',
                        text: `UserId: ${userId} . ArduinoId: ${arduId.id} .`
                    })
                )
        }
    }

    listArduinos = () => {
        let userId = localStorage.getItem('id-app')
        let token = localStorage.getItem('token-app')

        logic.listArduinos(userId, token).then(data => {
            const options = data.map(function (ele, i) {
                return <option key={i} value={ele.ip}>{ele.ip}</option>
            })
            this.setState({
                data,
                options
            })
        })
    }

    sendOutput = (state) => {
        const userId = localStorage.getItem('id-app')
        const targetArduino = this.state.selectedArduino
        const arduId = this.state.data.find(function (ele) {
            return ele.ip === targetArduino
        })
        const pin = this.state.selectedPin
        logic.sendOutput(userId, arduId.id, state, targetArduino, pin)
    }

    _handleKeepIp = ({ target: { value: ip } }) => {
        this.setState({ ip })
    }

    _handleKeepPort = ({ target: { value: port } }) => {
        this.setState({ port })
    }

    _handleRemoveArdu = () => {
        const userId = localStorage.getItem('id-app')
        const token = localStorage.getItem('token-app')
        const targetArduino = this.state.selectedArduino
        const arduId = this.state.data.find(function (ele) {
            return ele.ip === targetArduino
        })
        logic.removeArduino(userId, arduId.id, token).then(this.setState({ selectedArduino: '' }))
    }

    _handleAddArduino = (e) => {
        e.preventDefault()
        const userId = localStorage.getItem('id-app')
        logic.addArduino(userId, this.state.ip, this.state.port)
            .then(() => {
                this.setState({ ip: '', port: '' })
            })
    }

    exportData = () => {
        let dataToExport = [];
        let Yaxis
        let Xaxis
        const userId = localStorage.getItem('id-app')
        const token = localStorage.getItem('token-app')
        const targetArduino = this.state.selectedArduino
        if (this.state.data && this.state.selectedArduino && this.state.selectedArduino !== "Select an arduino:") {
            const arduId = this.state.data.find(function (ele) {
                return ele.ip === targetArduino
            })

            logic.retrieveArduinoData(userId, arduId.id, token)
                .then(data => {
                    Yaxis = data.map(({ timestamp }) => {
                        let parsedTime = new Date(timestamp).toLocaleTimeString()
                        return parsedTime
                    })
                    Xaxis = data.map(ele => ele.value)
                    return
                })
                .then(() => {
                    for (let i = 0; i < Yaxis.length; i++) {
                        dataToExport.push({ Yvalue: Yaxis[i], Xvalue: Xaxis[i] })
                    }
                    return
                })
                .then(() => {
                    logic.downloadCSV({ filename: `data-${targetArduino}.csv` }, dataToExport)
                })

        }
    }

    _handleData = () => {
        const userId = localStorage.getItem('id-app')
        const token = localStorage.getItem('token-app')
        const targetArduino = this.state.selectedArduino
        if (this.state.data && this.state.selectedArduino && this.state.selectedArduino !== "Select an arduino:") {
            const arduId = this.state.data.find(function (ele) {
                return ele.ip === targetArduino
            })

            logic.retrieveArduinoData(userId, arduId.id, token)
                .then(data => {
                    let Yaxis = data.map(({ timestamp }) => {
                        let parsedTime = new Date(timestamp).toLocaleTimeString()
                        return parsedTime
                    })
                    let Xaxis = data.map(ele => ele.value)
                    let chartData = {
                        labels: Yaxis,
                        datasets: [{
                            label: `Data from arduino ${this.state.selectedArduino}`,
                            data: Xaxis,
                            borderColor: "#8e5ea2",
                            fill: false
                        }]
                    }
                    this.setState({ chartData, counter: this.state.counter + 1 })
                })
        }
    }
    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    toggleAdd = () => {
        this.setState({
            collapseAdd: !this.state.collapseAdd,
            collapseList: false,
            collapseData: false,
            collapseOutput: false,
            collapseRemove: false
        });
    }
    toggleList = () => {
        this.setState({
            collapseAdd: false,
            collapseList: !this.state.collapseList,
            collapseData: false,
            collapseOutput: false,
            collapseRemove: false
        });
    }
    toggleData = () => {
        this.setState({
            collapseAdd: false,
            collapseList: false,
            collapseData: !this.state.collapseData,
            collapseOutput: false,
            collapseRemove: false
        });
    }
    toggleOutput = () => {
        this.setState({
            collapseAdd: false,
            collapseList: false,
            collapseData: false,
            collapseOutput: !this.state.collapseOutput,
            collapseRemove: false
        });
    }
    toggleRemove = () => {
        this.setState({
            collapseAdd: false,
            collapseList: false,
            collapseData: false,
            collapseOutput: false,
            collapseRemove: !this.state.collapseRemove
        });
    }

    controlArduino = (state) => {
        const userId = localStorage.getItem('id-app')
        const targetArduino = this.state.selectedArduino
        const arduId = this.state.data.find(function (ele) {
            return ele.ip === targetArduino
        })
        logic.controlArduino(userId, arduId.id, state, targetArduino)
    }

    removeArduinoData = () => {
        const userId = localStorage.getItem('id-app')
        const targetArduino = this.state.selectedArduino
        const arduId = this.state.data.find(function (ele) {
            return ele.ip === targetArduino
        })
        logic.removeArduinoData(userId, arduId.id)
    }

    render() {

        if (this.props.isLogged()) {
            return <Container className='mt-5'>
                <Row>
                    <Col xs="12" md="6">
                        <ButtonGroup>
                            <Button color="primary" onClick={this.toggleAdd} style={{ marginBottom: '1rem' }}>Add New Arduino</Button>
                            <Button color="primary" onClick={this.toggleList} style={{ marginBottom: '1rem' }}>Arduino List</Button>
                            <Button color="primary" onClick={this.toggleData} style={{ marginBottom: '1rem' }}>Data</Button>
                            <Button color="primary" onClick={this.toggleOutput} style={{ marginBottom: '1rem' }}>Output</Button>
                            <Button color="primary" onClick={this.toggleRemove} style={{ marginBottom: '1rem' }}>Remove</Button>
                        </ButtonGroup>
                        <div>
                            <Collapse isOpen={this.state.collapseAdd}>
                                <Card>
                                    <CardHeader>Add An Arduino</CardHeader>
                                    <CardBody>
                                        <CardTitle>Fill the form and hit the button</CardTitle>
                                        <form onSubmit={this._handleAddArduino}>
                                            <div className="row justify-content-center ">
                                                <input className="form-group col-xs-4 mt-4 border pl-3" autoFocus value={this.state.ip} onChange={this._handleKeepIp} type="text" placeholder="Ip" />
                                            </div>
                                            <div className="row justify-content-center ">
                                                <input className="form-group col-xs-4 mt-4 border pl-3" value={this.state.port} onChange={this._handleKeepPort} type="text" placeholder="Port" />
                                            </div>

                                            <div className="row justify-content-center ">

                                                <div className="form-group justify-content-center ">
                                                    <Button type="submit" className="btn bg-info mt-4">Add Arduino</Button>
                                                </div>
                                            </div>

                                        </form>
                                    </CardBody>
                                </Card>

                            </Collapse>
                        </div>
                        <div>
                            <Collapse isOpen={this.state.collapseList}>
                                <Card>
                                    <CardHeader>List Management</CardHeader>
                                    <CardBody>
                                        <CardTitle>Choose an arduino</CardTitle>
                                        <FormGroup onChange={this.arduHandler}>
                                            <Input type="select" name="select" id="exampleSelect">
                                                <option>Select an arduino:</option>
                                                {this.state.options}
                                            </Input>
                                        </FormGroup>
                                        <Button className="btn bg-info mt-4" onClick={this.listArduinos}>Retrieve Arduinos</Button>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </div>
                        <div>
                            <Collapse isOpen={this.state.collapseData}>
                                {this.state.selectedArduino !== "Select an arduino:" && this.state.selectedArduino ? <Card>
                                    <CardHeader>Data Management</CardHeader>
                                    <CardBody>
                                        <CardTitle>Control how your arduino sends data to our database</CardTitle>
                                        <ButtonGroup>
                                            <Button onClick={() => this.controlArduino('on')}>Send data</Button>
                                            <Button onClick={() => this.controlArduino('off')}>Stop sending data</Button>
                                            <Button onClick={this.exportData}>Export data</Button>
                                            <Button onClick={this.handleIds}>Show Ids</Button>
                                        </ButtonGroup>
                                    </CardBody>
                                </Card> : <Card>
                                        <CardHeader>Data Management</CardHeader>
                                        <CardBody>
                                            <CardTitle>You haven't selected an arduino yet!</CardTitle>
                                        </CardBody>
                                    </Card>}

                            </Collapse>
                        </div>
                        <div>
                            <Collapse isOpen={this.state.collapseOutput}>
                                {this.state.selectedArduino !== "Select an arduino:" && this.state.selectedArduino ? <Card>
                                    <CardHeader>Output Management</CardHeader>
                                    <CardBody>
                                        <CardTitle>Control the outputs of your arduino</CardTitle>
                                        <FormGroup onChange={this.outputHandler}>
                                            <Input type="select" name="select" id="exampleSelect2">
                                                <option>Select a pin:</option>
                                                {[0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16].map(i => <option key={i} value={i}>Pin {i}</option>)}
                                            </Input>
                                        </FormGroup>
                                        <ButtonGroup>
                                            <Button onClick={() => this.sendOutput('on')}>ON</Button>
                                            <Button onClick={() => this.sendOutput('off')}>OFF</Button>
                                        </ButtonGroup>
                                    </CardBody>
                                </Card> : <Card>
                                        <CardHeader>Output Management</CardHeader>
                                        <CardBody>
                                            <CardTitle>You haven't selected an arduino yet!</CardTitle>
                                        </CardBody>
                                    </Card>}
                            </Collapse>
                        </div>
                        <div>
                            <Collapse isOpen={this.state.collapseRemove}>
                                {this.state.selectedArduino !== "Select an arduino:" && this.state.selectedArduino ? <Card>
                                    <CardHeader>Remove Management</CardHeader>
                                    <CardBody>
                                        <CardTitle>Remove your arduino or just clean the data</CardTitle>
                                        <ButtonGroup className="mt-3">
                                            <Button color="danger" onClick={this._handleRemoveArdu}>Remove Arduino</Button>
                                            <Button color="danger" onClick={this.removeArduinoData}>Remove Arduino Data</Button>
                                        </ButtonGroup>
                                    </CardBody>
                                </Card> : <Card>
                                        <CardHeader>Remove Management</CardHeader>
                                        <CardBody>
                                            <CardTitle>You haven't selected an arduino yet!</CardTitle>
                                        </CardBody>
                                    </Card>}
                            </Collapse>
                        </div>
                    </Col>

                    <Col xs="12" md="6">
                        <Line
                            data={this.state.chartData}
                            height={400}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    labels: {
                                        fontColor: 'black'
                                    }
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            fontColor: 'black'
                                        },
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            fontColor: 'black'
                                        },
                                    }]
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Container>


        } else {
            return <div className="mt-5 shadow-sm">
                <Jumbotron fluid>
                    <Container fluid>
                        <h1 className="display-3">YOU'RE NOT ALLOWED</h1>
                    </Container>
                </Jumbotron>
            </div>
        }
    }
}

export default withRouter(Home);