import {Table} from "react-bootstrap";
import {CourseRow} from './course_row'


function CoursesTable(props){

    const courses = props.courses;

    return(
        <>
            <Table responsive='md'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th >Max</th>
                        <th>Students</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => {return(<CourseRow key={course.code} course={course} addCourse={props.addCourse}/>)})}
                </tbody>
            </Table>        
        </>
    );

}

export {CoursesTable};