const express = require('express');
const user_router = require('./routes/user_router');
const study_plan_router = require('./routes/study_plan_router');
const user_service = require('./logic/user_service'); 
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const morgan = require('morgan');

const userService = new user_service()
const app = express();

app.use(express.json());
app.use(session({ //Enable session use
    secret: "WA Final!",
    resave: false, //Stop sessin from being modified if not changed
    saveUninitialized: false, //Don't save anything in session if not initialized
}));
app.use(passport.authenticate('session')); //Set use of sessions w/ passport
app.use(morgan('dev')); //Log-in middleware

const port = 3001;
const corsOptions = {
    origin: `http://localhost:3000`,
    credentials: true, //This tells the app that credentials are used
};
app.use(cors(corsOptions));

//Now we define how to auth users. Local uses email and pass
//This is run each time passport.authenticate('local') is called
passport.use(new LocalStrategy(async function verify(email, password, callback) {
    try {
        const user = await userService.getUser(email, password);
        if(!user){
            return callback(null, false, 'Incorrect email or password.');
        }else{
            return callback(null, user);
        }
    } catch (error) {
        console.log(error)
        return callback(null, false, error.error)
    }

    
}));

//Here we define the content to keep on the session cookie
passport.serializeUser(function (user, callback) {
    callback(null, {id:user.id, name:user.name, email:user.email, type:user.type});
});

//The data is restored back when auth happens
passport.deserializeUser(function (user, callback) { 
    return callback(null, user);
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

//<----------------------- PUT ROUTERS HERE --------------------------------------------------->

app.use('/api', user_router);
app.use('/api', study_plan_router);
