class studyPlanService {
    studyPlanControl = require('../modules/study_plan_control')

    constructor() {
        this.dao = new this.studyPlanControl('WA_final.db');
    }

    async getCourses(){
        try {
            let courses = await this.dao.getCourses();
            const list = await Promise.all(
                courses.map(async (course) => {
                    try {
                        
                        let incompatibles = await this.getIncompatible(course.code);
                        let dependants = await this.getDependant(course.code);
                        course["incompatibles"] = incompatibles;
                        course["dependants"] = dependants;
                        return course;
                    } catch (error) {
                        console.log(error)
                        throw error;
                    }
                })
            )
            return list;
        } catch (error) {
            throw error;
        }
    }

    async getStudyPlancCoursesById(userId){
        try {
            if (userId === undefined || userId == null || Number.isNaN(parseInt(userId))) {
                throw({error:"A valid id must be passed",code})
            } else {
                const courses = await this.dao.getStudyPlancCoursesById(parseInt(userId));
                const list = await Promise.all(courses.map(async (course) => {
                    let incompatibles = await this.getIncompatible(course.code);
                    let dependants = await this.getDependant(course.code);
                    course["incompatibles"] = incompatibles;
                    course["dependants"] = dependants;
                    return course;
                }))
                return list;
            }
        } catch (error) {
            throw error;
        }
    }

    async newStudyPlan(id, body){
        try {
            if(body===undefined){
                throw {error:'Missing or wrong body', code:422};
            }else{
                const newStudyPlan = {
                    userId:id,
                    credits:0
                };
                await this.dao.createStudyPlanTable();
                await this.dao.newStudyPlan(newStudyPlan);
                return true;
            }
        }
        catch (error) {
            throw error;
        }
    }
    
    async editStudyPlan(user, courseList){ 
        //The course List must be clear of course codependencies & max students when it arrives here
        console.log(courseList)
        try {
            let credits = 0;
            if(courseList===undefined || user===undefined || courseList == null){
                throw {error:'Missing body content', code:422};
            }
            courseList.map((course)=>{
                if(course.maxstudents!=null){
                    if(course.maxstudents<=course.students){
                        throw {error:`${course.name} has reached the maximum ammount of students`, code:400};
                    }
                }
                credits += parseInt(course.credits);
            });
            // This logic is managed in the client. Id like to add it the type in the session A
            // and the type in the user state are not always the same. I tryed at least...
            if(user.type == 'FULL_TIME' && (credits<60 || credits>80)){
                throw {error:'The total amount of credits must be between 60 and 80', code:400};
            }else if(user.type == 'PART_TIME' && (credits<20 || credits>40)){
                throw {error:'The total amount of credits must be between 20 and 40', code:400};
            }
            await this.dao.newStudyPlan({userId:user.id, credits:0});
            courseList.map(async (course)=>{
                try {
                    await this.dao.newCourseToStudyPlan(course.code, user.id);
                } catch (error) {
                    console.log(error)
                    throw error;
                }
            });
            await this.dao.editStudyPlanCredits(user.id, credits);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async deleteStudyPlan(userId){
        try {
            if (userId === undefined || userId == null || Number.isNaN(parseInt(userId))) {
                throw({error:"A valid id must be passed",code})
            } else {
                await this.dao.deleteStudyPlan(userId);
                return true;
            }
        } catch (error) {
            throw error;
        }
    }

    async getIncompatible(courseCode){
        try {
            if(courseCode===undefined){
                throw {error:'The course code was not defined', code:422}
            }
            let incompatibles = await this.dao.getIncompatible(courseCode);
            incompatibles = incompatibles.map((o) => o.CODETWO);
            return incompatibles;
        } catch (error) {
            throw error;
        }
    }

    async getDependant(courseCode){
        try {
            if(courseCode===undefined){
                throw {error:'The course code was not defined', code:422}
            }
            let dependant = await this.dao.getDependant(courseCode);
            dependant = dependant.map((o) => o.CODETWO);
            return dependant;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = studyPlanService;