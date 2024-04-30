import { Col, Row } from "react-bootstrap";
import { AiFillSave, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { BiLogOut, BiListUl } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { deleteStudyPlan, getAllCourses, getStudyPlan } from "../../api/study_plan_controller";
import { getUserInfo } from "../../api/user_controller";


function ButtonSet(props){

    return(
        <Row className="position-fixed bottom-0 end-0">
            <Col>
                <p className="mb-0 text-center">Logout</p>
                <LogOutButton logOut={props.logOut}></LogOutButton>
            </Col>
            <Col>
                <p className="mb-0 text-center">Empty</p>
                <EmptyButton setStudyPlan={props.setStudyPlan}></EmptyButton>
            </Col>
            <Col>
                <p className="mb-0 text-center">List</p>
                <ListButton setUser={props.setUser}></ListButton>
            </Col>
            <Col>
                <p className="mb-0 text-center">Delte</p>
                <DeleteButton setStudyPlan={props.setStudyPlan}></DeleteButton>
            </Col>
            {props.studyPlan.length>0?<Col>
                <p className="mb-0 text-center">Save</p>
                <SaveButton saveStudyPlan={props.saveStudyPlan}></SaveButton>
            </Col>:''}
        </Row>
    );
}

function SaveButton(props){
    return(
        <>
            <AiFillSave onClick={()=>{props.saveStudyPlan()}} style={{cursor:'pointer'}} size={50}></AiFillSave>
        </>
    );
}

function EmptyButton(props){
    const navigate = useNavigate();
    return(
        <>
            <AiOutlineDelete onClick={()=>{
                props.setStudyPlan([]);
                navigate('/start');
            }} style={{cursor:'pointer'}} size={50}></AiOutlineDelete>
        </>
    );
}

function LogOutButton(props){
    const navigate = useNavigate();
    return(
        <>
            <BiLogOut onClick={()=>{
                    props.logOut();
                    navigate('/');
                }
            } style={{cursor:'pointer'}} size={50}></BiLogOut>
        </>
    );
}

function ListButton(props){
    const navigate = useNavigate();
    async function fetchStudyPlan() {
        const user = await getUserInfo();
        props.setUser(user);
    }
    return(
        <>
            <BiListUl onClick={()=>{
                    fetchStudyPlan();
                    navigate('/studyPlan');
                }
            } style={{cursor:'pointer'}} size={50}></BiListUl>
        </>
    );
}

function DeleteButton(props){
    const navigate = useNavigate();
    async function deleteSP() {
        await deleteStudyPlan();
        props.setStudyPlan([]);
    }
    return(
        <>
            <AiOutlineClose onClick={()=>{
                    deleteSP();
                    navigate('/start');
                }
            } style={{cursor:'pointer'}} size={50}></AiOutlineClose>
        </>
    );
}

export {ButtonSet};