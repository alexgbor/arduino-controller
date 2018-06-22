import React from "react";
import { Jumbotron, Container } from 'reactstrap'


function Error404() {

    return <div className="mt-5 shadow-sm">
        <Jumbotron fluid>
            <Container fluid>
                <h1 className="display-3">ERROR 404: PAGE NOT FOUND</h1>
            </Container>
        </Jumbotron>
    </div>
}

export default Error404;