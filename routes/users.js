const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync (async (req,res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, err => {
            if(err) return next(err);
            req.flash('successCamp', 'Welcome!');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('successCamp', 'Welcome back!');
    let redUser = req.cookies.returnTo || '/campgrounds';
    res.clearCookie("returnTo");
    const isUnwantedDeleteRoute = new RegExp('/[^/]+/[^/]+/reviews/[^/]+\?_method=DELETE');
    if (isUnwantedDeleteRoute.test(redUser)) {
        redUser = redUser.substring(0,redUser.indexOf("/reviews"));
    }
    res.redirect(redUser);
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('update', 'Bye!!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;