import { AiFillCaretLeft } from "react-icons/ai";

function StudyPlanRow(props) {
    return (
        <tr>
            <td><AiFillCaretLeft  onClick={() => props.removeCourse(props.course)} style={{cursor:'pointer'}}></AiFillCaretLeft></td>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}

export {StudyPlanRow};