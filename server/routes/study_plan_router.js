const express = require('express');
const passport = require('passport');
const router = express.Router();
const studyPlanService = require('../logic/study_plan_service');
const service = new studyPlanService();

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { //Attribute in req included by passport
        return next();
    }
    return res.status(400).json({error: 'User not authenticated'});
}

router.get('/courses', async (req, res) => {
    try {
        const courses = await service.getCourses();
        res.status(200).json(courses).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error).end();
    }
});

router.get('/studyPlan', isLoggedIn, async (req, res) => {
    const id = req.user.id
    try {
        const plan = await service.getStudyPlancCoursesById(id);
        res.status(200).json(plan).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error).end();
    }
});

router.post('/newStudyPlan', isLoggedIn, async (req, res) => {
    try {
        const id = req.user.id
        const body = req.body;
        await service.newStudyPlan(id, body);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error).end();
    }
});

router.delete('/deleteStudyPlan', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        await service.deleteStudyPlan(userId);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error).end();
    }
});

router.put('/editStudyPlan', isLoggedIn, async (req, res) => {
    try {
        const courseList = req.body.courseList
        const user = req.body.user;
        await service.editStudyPlan(user, courseList);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error).end();
    }
});

module.exports = router;