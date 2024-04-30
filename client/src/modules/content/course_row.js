import { AiFillCaretRight, AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { useContext } from 'react';
import { UserContext } from "../../contexts/user_context";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { code } from "tar/lib/types";

function CourseRow(props) {
    const user = useContext(UserContext);
    const [collaps, setCollaps] = useState(true)
    
    function handleColaps(){
        let temp = collaps;
        setCollaps(!temp)
    }

    return (
        <>
            <tr className={props.course.code}>
                <td onClick={() => handleColaps()} style={{cursor:'pointer'}}>
                    {collaps?<AiOutlineRight/>:<AiOutlineDown/>}
                    
                </td>
                <td>{props.course.code}</td>
                <td>{props.course.name}</td>
                <td>{props.course.credits}</td>
                <td>{props.course.maxstudents?props.course.maxstudents:''}</td>
                <td>{props.course.students}</td>
                {/* <td>{props.course.incompatibles}</td>
                <td>{props.course.dependants}</td> */}
                {user ? <td className="">
                    <AiFillCaretRight onClick={() => {
                        props.addCourse(props.course);
                    }} style={{cursor:'pointer'}} className={props.course.code+'_arrow'}></AiFillCaretRight>
                </td>:<td></td>}
            </tr>
            <tr hidden={collaps}>
                <td></td>
                <td>Incompatible</td>
                {props.course.incompatibles.map((code)=>{return <td key={code}>{code}</td>})}
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr hidden={collaps}>
                <td></td>
                <td>Dependants</td>
                {props.course.dependants.map((code)=>{return <td key={code}>{code}</td>})}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </>

    );
}


export {CourseRow};