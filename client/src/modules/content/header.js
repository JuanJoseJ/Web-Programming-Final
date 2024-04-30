import { Col, Container, Navbar, Row } from "react-bootstrap";

function Header(props){

    return(
    //   <>
    //     <Col className='d-none d-sm-block col-md-7'>
    //       <h3>Web Applications I - Final</h3>
    //     </Col>
    //     <Col className="col-md-5">
        //   {props.user && props.studyPlan.length>0 ? 
        //     <Row>
        //         <Col><h3>Credits: {props.credits} </h3></Col>
        //         <Col><h3>Max: {props.calcExtremes(props.user).max} </h3></Col>
        //         <Col><h3>Min: {props.calcExtremes(props.user).min} </h3></Col>
        //     </Row>
        //   :''}
    //     </Col>
    //   </>
    <>
        <Navbar bg="light"  fixed="top" expand='sm'>
            <Container fluid className="p-0 d-md-block ">
                <Row>
                    <Col className="m-0 pr-0 md lg='7'">
                        <Navbar.Brand className='col-md-7'>Web Applications I - Final</Navbar.Brand>
                    </Col>
                    <Col className="m-0 pr-0" md lg='5'>
                        {props.user && props.studyPlan.length>0 ? 
                            <Row className="text-nowrap">
                                <Col><h5>Credits: {props.credits} </h5></Col>
                                <Col><h5>Max: {props.calcExtremes(props.user).max} </h5></Col>
                                <Col><h5>Min: {props.calcExtremes(props.user).min} </h5></Col>
                            </Row>
                        :''}
                    </Col>
                </Row>
                
            </Container>
        </Navbar>
        <Navbar bg="light"  expand='sm'>
            <Container fluid className="p-0 d-md-block ">
                <Row>
                    <Col className="m-0 p-0" md lg='7'>
                        <Navbar.Brand className='col-md-7'>React Bootstrap</Navbar.Brand>
                    </Col>
                    <Col className="m-0 p-0" md lg='5'>
                        {props.user && props.studyPlan.length>0 ? 
                            <Row className="text-nowrap">
                                <Col><h5>Credits: </h5></Col>
                                <Col><h5>Max: </h5></Col>
                                <Col><h5>Min:  </h5></Col>
                            </Row>
                        :''}
                    </Col>
                </Row>
                
            </Container>
        </Navbar>
    </>

        
    );
}

export {Header}