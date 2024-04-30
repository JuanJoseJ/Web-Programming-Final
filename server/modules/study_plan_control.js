class studyPlanControl {
    sqlite = require('sqlite3');
    
    constructor(dbName){
        this.db = new this.sqlite.Database('./database/'+dbName, (err)=>{
            if (err) throw {error:err, code:500}
        })
    }

    async createStudyPlanTable(){
        return new Promise((resolve, reject) => {
            const query = `CREATE TABLE IF NOT EXISTS STUDY_PLAN(
                USERID  INTEGER PRIMARY KEY
                                UNIQUE
                                NOT NULL
                                REFERENCES USERS (ID) ON DELETE CASCADE
                                                      ON UPDATE CASCADE,
                CREDITS INTEGER NOT NULL
            );`
            this.db.run(query, (err) => {
                if (err) { 
                    console.log(err)
                    reject({error:err, code:500}); 
                }else{
                    resolve(true);
                }
            });
        });
    }

    async newStudyPlan(newStudyPlan){
        return new Promise((resolve, reject) => {
            const query0 = `SELECT * FROM STUDY_PLAN WHERE USERID = ?;`;
            this.db.all(query0, [newStudyPlan.userId], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                }else if(rows.length>0){
                    resolve(true);
                    return;
                }else{
                    const query = `INSERT INTO STUDY_PLAN(USERID, CREDITS) VALUES(?,?);`
                    this.db.run(query, [newStudyPlan.userId, newStudyPlan.credits], (err) => {
                        if (err) { 
                            reject({error:err, code:500}); 
                        }else{
                            resolve(true);
                        }
                    });    
                }
            });
        });
    }

    async deleteStudyPlan(userId){
        return new Promise((resolve, reject) => {
            const query0 = `SELECT * FROM STUDY_PLAN WHERE USERID = ?;`;
            this.db.all(query0, [userId], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                }else if(rows.length<=0){
                    reject({error:'No study plan has been created yet', code:400});
                }else{
                    let query = `DELETE FROM STUDY_PLAN WHERE USERID = ?;`;
                    this.db.all(query, [userId], (err) => {
                        if (err) {
                            console.log(err)
                            reject({error:err, code:500});
                        }else{
                            query = `DELETE FROM COURSE_PLAN WHERE IDPLAN = ?;`;
                            this.db.all(query, [userId], (err) => {
                                if (err) {
                                    console.log(err)
                                    reject({error:err, code:500});
                                }else{
                                    resolve(true);
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    async editStudyPlanCredits(userId, credits){
        return new Promise((resolve, reject) => {
            const query0 = `SELECT * FROM STUDY_PLAN WHERE USERID = ?;`;
            this.db.all(query0, [userId], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({error:err, code:500});
                }else if(rows.length<=0){
                    reject({error:'No study plan has been created yet', code:400});
                }else{
                    const query = `UPDATE STUDY_PLAN SET CREDITS = ? WHERE USERID = ?; `
                    this.db.all(query, [credits, userId], (err, rows) => {
                        if (err) {
                            console.log(err)
                            reject({error:err, code:500});
                        }else{
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    async newCourseToStudyPlan(courseCode, userId){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM COURSE_PLAN WHERE IDPLAN = ? ;`;
            this.db.all(query, [userId], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({error:err, code:500});
                    return;
                }
                const query0 = `INSERT INTO COURSE_PLAN(COURSECODE, IDPLAN) VALUES(?, ?)`;
                this.db.all(query0, [courseCode, userId], (err) => {
                    if (err) {
                        console.log(err)
                        reject({error:err, code:500});
                    }else{
                        resolve(true);
                        return;
                    }
                });
            });
        });
    }

    async getIncompatible(courseCode){ // List of courses that are incompatible w/ the given course
        return new Promise((resolve, reject) => {
            const query = `SELECT CODETWO FROM INCOMPATIBLE WHERE CODEONE = ?;`;
            this.db.all(query, [courseCode], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                }else{
                    resolve(rows);
                }
            });
        });
    }

    async getDependant(courseCode){ // List of courses that are incompatible w/ the given course
        return new Promise((resolve, reject) => {
            const query = `SELECT CODETWO FROM DEPENDANT WHERE CODEONE = ?;`;
            this.db.all(query, [courseCode], (err, row) => {
                if (err) {
                    reject({error:err, code:500});
                }else{
                    resolve(row);
                }
            });
        });
    }

    async getCourses(){
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *, COUNT(COURSECODE) AS STUDENTS
                FROM COURSE 
                LEFT JOIN COURSE_PLAN 
                ON COURSE.CODE = COURSE_PLAN.COURSECODE
                GROUP BY CODE
                ORDER BY NAME ASC
                ;
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                }else{
                    const list = rows.map((course) => (
                        {
                            code:course.CODE,
                            name:course.NAME,
                            credits:course.CREDITS,
                            maxstudents:course.MAXSTUDENTS,
                            students:course.STUDENTS
                        }
                    ));
                    resolve(list);
                }
            });
        });
    }

    async getStudyPlancCoursesById(userId){
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * 
                FROM COURSE 
                JOIN COURSE_PLAN 
                ON COURSE.CODE = COURSE_PLAN.COURSECODE
                WHERE COURSE_PLAN.IDPLAN = ?;`;
            this.db.all(query, [userId], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                }else{
                    const list = rows.map((course) => (
                        {
                            code:course.CODE,
                            name:course.NAME,
                            credits:course.CREDITS
                        }
                    ));
                    resolve(list);
                }
            });
        });
    }

    
}

module.exports = studyPlanControl;