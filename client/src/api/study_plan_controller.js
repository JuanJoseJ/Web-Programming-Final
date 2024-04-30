const APIURL = 'http://localhost:3001';

async function getAllCourses(){
    const res = await fetch(APIURL+'/api/courses', {
        method:'GET',
        credentials: 'include',
    });
    
    if(res.ok){
        const courses = await res.json();
        return courses;
    }else{
        const err = await res.text();
        console.log(err)
        throw err;
    }
}

async function getStudyPlan(){
    const res = await fetch(APIURL+'/api/studyPlan', {
        method:'GET',
        credentials: 'include',
    });
    
    if(res.ok){
        const studyPlan = await res.json();
        return studyPlan;
    }else{
        const err = await res.text();
        // console.log(err)
        return [];
    }
}

async function storeStudyPlan(user, studyPlan){
    const res = await fetch(APIURL+'/api/editStudyPlan', {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({'courseList':studyPlan, 'user':user}),
    });
    if(res.ok){
        return true;
    }else{
        const errDetails = await res.text();
        throw errDetails;
    }
}

async function deleteStudyPlan(){
    const res = await fetch(APIURL+'/api/deleteStudyPlan', {
        method:'DELETE',
        credentials: 'include',
    });
    if(res.ok){
        return true;
    }else{
        const errDetails = await res.text();
        throw errDetails;
    }
}

export {getAllCourses, getStudyPlan, storeStudyPlan, deleteStudyPlan};