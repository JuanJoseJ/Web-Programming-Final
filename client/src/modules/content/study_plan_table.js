import { useContext } from "react";
import {Table} from "react-bootstrap";
import { UserContext } from "../../contexts/user_context";
import {StudyPlanRow} from './study_plan_row'

function StudyPlanTable(props){

    const user = useContext(UserContext);

    const courses = props.courses;

    return(
        <>
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => {return(<StudyPlanRow key={course.code} course={course} removeCourse={props.removeCourse}/>)})}
                </tbody>
            </Table>     
        </>
    );

}

export {StudyPlanTable};