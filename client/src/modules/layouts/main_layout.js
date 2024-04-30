import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "../../contexts/user_context";
import { ButtonSet } from "../content/control_buttons";


function MainLayout(props) {

    const user = useContext(UserContext);

    return(
        <Col className="m-0" md lg='5'>
            <Outlet/>
            {user && <ButtonSet studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} setUser={props.setUser} saveStudyPlan={props.saveStudyPlan} logOut={props.logOut}></ButtonSet>}
        </Col>
    );
}

export {MainLayout};