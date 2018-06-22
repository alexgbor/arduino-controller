import React from "react";
import { Jumbotron, Container } from 'reactstrap'

function Landing() {

    return <div className="mt-5 shadow-sm">
        <Jumbotron fluid>
            <Container fluid>
                <h1 className="display-3">Arduino Controller</h1>
                <p className="lead">Complete control over your arduino. Please register and start exploring.</p>
                <hr className="my-2" />
                <p>Arduino Controller is a web app that allows you to retrieve and graph data from the sensors in your arduinos.</p>
            </Container>
        </Jumbotron>
    </div>

}
export default Landing;