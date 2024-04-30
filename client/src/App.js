import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import { StudyPlanTable } from "./modules/content/study_plan_table";
import { deleteStudyPlan, getAllCourses, getStudyPlan, storeStudyPlan } from "./api/study_plan_controller";
import { changeType, getUserInfo, login, logout } from "./api/user_controller";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/user_context";
import { MainLayout } from "./modules/layouts/main_layout";
import 'bootstrap/dist/css/bootstrap.min.css';  
import { Row, Col, Container } from "react-bootstrap";
import { InitialForm } from "./modules/content/initial_form";
import { CoursesTable } from "./modules/content/courses_table";
import { LoginForm } from "./modules/auth/auth_components";
import { ButtonSet } from "./modules/content/control_buttons";
import { Header } from "./modules/content/header";


function App() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [user, setUser] = useState('');
  const [credits, setCredits] = useState(0);


  useEffect(() => {//Get all initial courses
    async function fetchCourses() {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    }

    async function checkAuth(){
      const usuario = await getUserInfo();
      if(usuario){
        setUser(usuario);
      }
    };

    checkAuth();
    fetchCourses();
  }, []);

  useEffect(() => { // Fetch requested Study Plan
    async function fetchStudyPlan() {
      console.log("ENTRA ACÂ")
      const fetchedStudyPlan = await getStudyPlan();
      setStudyPlan(fetchedStudyPlan);
    }
    if (user) {
      fetchStudyPlan();
    }
  }, [user]);

  useEffect(() => { // Update credits
    function updateCredits(sp){
      let count = 0;
      sp.map((course)=>{
        count += parseInt(course.credits);
      });
      setCredits(count);
      colorIncompatibles(count);
    }
    updateCredits(studyPlan);
  }, [studyPlan]);

  async function handleLogout() {
    await logout();
    setUser('');
    setStudyPlan([]);
    setCredits(0);
    colorIncompatibles();
    // navigate('/')
  }

  function colorIncompatibles(credits=0){
    courses.map((course)=>{
      const row = document.getElementsByClassName(course.code)[0]; // Uncolor
      // const arrow = document.getElementsByClassName(course.code+'_arrow')[0];
      row.setAttribute("style", "background-color: white;");
      // arrow.setAttribute("style", "visibility:visible");
      if((course.credits+credits)>calcExtremes(user).max){ //Color the ones that surpass the max credits when added
        const row1 = document.getElementsByClassName(course.code)[0];
        row1.setAttribute("style", "background-color:rgba(240,20,20, 0.7);");
      }
      course.dependants.map((code)=>{ //Color dependant courses
        const find = studyPlan.filter((spCourse)=>{
          return spCourse.code==code;
        });
        if(find.length<=0){
          const row = document.getElementsByClassName(course.code)[0];
          row.setAttribute("style", "background-color:rgba(240,20,20, 0.7);");
        }
      });
    });
    studyPlan.map((course)=>{
      //Color added courses
      const row0 = document.getElementsByClassName(course.code)[0];
      row0.setAttribute("style", "background-color: rgba(240,20,20, 0.7);");
      course.incompatibles.map((code)=>{ // Color incompatible
        const row = document.getElementsByClassName(code)[0];
        // const arrow = document.getElementsByClassName(code+'_arrow')[0];
        row.setAttribute("style", "background-color: rgba(240,20,20, 0.7);");
        // arrow.setAttribute("style", "visibility:hidden");
      });
    });
  }

  function addCourse(newCourse){ //Add a course to the UNSAVED plan (if possible)
    const planCodes = studyPlan.map((course)=>{return course.code});
    let canAdd=true;
    if(planCodes.includes(newCourse.code)){
      canAdd=false;
      alert(`The course ${newCourse.name} has already been selected`);
      return;
    }
    newCourse.incompatibles.map((newCode)=>{
      if(planCodes.includes(newCode)){
        alert(`The selected course is incompatible with the course with code ${newCode} to be added`);
        canAdd=false
      }
    });
    if (newCourse.maxstudents) {
      if (newCourse.maxstudents==newCourse.students) {
        alert(`The course ${newCourse.name} is now closed `);
        canAdd=false
        return;
      }
    }
    const edges = calcExtremes(user);
    if(credits+newCourse.credits>edges.max){
      alert(`You can't surpass the maximun ammount of credits for the student type ${user.type}`);
      canAdd=false
      return;
    }
    newCourse.dependants.map((newCode)=>{
      if(!planCodes.includes(newCode)){
        alert(`The selected course requires the preparatory course with code ${newCode} to be added`);
        canAdd=false
      }
    })
    if(canAdd){
      let newPlan = studyPlan.slice();
      newPlan.push(newCourse);
      setStudyPlan(newPlan);
    }
  }

  function removeCourse(byeCourse){
    let canRemove = true;
    studyPlan.map((course)=>{
      if(course.dependants.includes(byeCourse.code)){
        alert(`The course ${course.name} requires the selected code on the study plan`);
        canRemove = false;
      }
    });
    if(canRemove){
      let newPlan = studyPlan.filter((course)=>{
        return course.code !== byeCourse.code;
      });
      setStudyPlan(newPlan);
    }
  }

  async function saveStudyPlan(){
    try {
      let canSave = true;
      if(credits<calcExtremes(user).min){
        canSave=false;
        alert(`You require at least ${calcExtremes(user).min-credits} more credits to save the plan`);
      }else if(credits>calcExtremes(user).max){
        canSave=false;
        alert(`You are ${credits-calcExtremes(user).max} credits over your max ammount possible`);
      }

      if(canSave){
        await storeStudyPlan(user, studyPlan);
        await changeType(user.type);
        const fetchedStudyPlan = await getStudyPlan();
        setStudyPlan(fetchedStudyPlan);
        const fetchedCourses = await getAllCourses();
        setCourses(fetchedCourses);
        alert("Study plan successfully saved!")
        return;
      }
    } catch (error) {
        console.log(error);
    }
}

  function calcExtremes(user){ //Calculete de extremes of credit
    if(user.type=='FULL_TIME'){
      return {max:80, min:60}
    }else{
      return {max:40, min:20}
    }
  }

  async function handleLogin(credentials) {
    try {
        const usuario = await login(credentials);
        setUser(usuario);
        
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <Container fluid id="main-container">
      <UserContext.Provider value={user}>
        <Row>
          <Header credits={credits} user={user} calcExtremes={calcExtremes} studyPlan={studyPlan}></Header>
        </Row>
        <Row>
            <Col className="m-0 p-0" md lg='7'>
                <CoursesTable courses={courses} addCourse={addCourse}></CoursesTable>
            </Col>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<MainLayout studyPlan={studyPlan} setStudyPlan={setStudyPlan} saveStudyPlan={saveStudyPlan} logOut={handleLogout} setUser={setUser}/>}>
                    <Route index element={<LoginForm login={handleLogin} />}/>
                    <Route path='/start' element={<InitialForm setUser={setUser} studyPlan={studyPlan} setStudyPlan={setStudyPlan}/>}/>
                    <Route path="/studyPlan" element={<StudyPlanTable courses={studyPlan} removeCourse={removeCourse}/>}/>
                  </Route>
                  <Route path="*" element={<Navigate replace to='/'/>}/>
                </Routes>
              </BrowserRouter>
        </Row>
      </UserContext.Provider>
    </Container>
  );
}

export default App;
