import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { changeType, getUserInfo, getUserType } from "../../api/user_controller";
import { UserContext } from "../../contexts/user_context";

function InitialForm(props){

    const [type, setType] = useState('FULL_TIME')
    const navigate = useNavigate();
    const usuario = useContext(UserContext);

    async function handleSubmit(event){
        event.preventDefault();

        try {
            if(usuario.type!=type){
                usuario.type = type;
                props.setUser(usuario);
                props.setStudyPlan([]);
            }
            navigate('/studyPlan');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Student type</Form.Label>
                    <Form.Control as="select" value={type} onChange={(event)=>{setType(event.target.value)}}>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                    </Form.Control>
                </Form.Group>
                <Button type="submit">Save</Button>
            </Form>
        </>
    )
}

export {InitialForm}