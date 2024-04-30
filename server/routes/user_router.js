const express = require('express');
const passport = require('passport');
const router = express.Router();
const userService = require('../logic/user_service');
const service = new userService();

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { //Attribute in req included by passport
        return next();
    }
    return res.status(400).json({error: 'User not authenticated'});
}

router.post('/login', passport.authenticate('local'), (req, res) => {
    req.login(req.user, (err) => {
        if (err) return next(err);
        return res.status(201).json(req.user);
    });
});

router.get('/session', (req, res) => {
    if(req.isAuthenticated()) {
        res.json(req.user);
    }
    else
        res.status(401);
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).end();
    });
});

router.put('/type', isLoggedIn, async (req, res)=>{
    const userId = req.user.id;
    const newType = req.body.newType
    try {
        await service.updateType(userId, newType)

        return res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(error.code).end();
    }
})

module.exports = router;