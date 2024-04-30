import {useState} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();
        if(!email.toLowerCase().match(/\S+@\S+\.\S+/)){
            alert("Please insert a valid email");
        }else if(password === undefined || password === null){
            alert("The password is required");
        }else if(password.length<1){
            alert("The password is not valid");
        }else{
            const credentials = {"username":email, "password":password };
            props.login(credentials);
            navigate('/start')
        }
    }

    return(
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='text' value={email} onChange={ev => setEmail(ev.target.value)} required={true} placeholder='some@email.co'/>
                </Form.Group>
                
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} placeholder='password'/>
                </Form.Group>
                
                <Button type="submit">Login</Button>
            </Form>  
        </>
    );
}

function LogoutButton(props){
    return(
        <Button onClick={props.logout}>Logout</Button>
    );
}

export {LoginForm, LogoutButton};