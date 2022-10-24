const User = require('../models/user');

module.exports.showRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req,res) => {
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

}

module.exports.showLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('successCamp', 'Welcome back!');
    let redUser = req.cookies.returnTo || '/campgrounds';
    res.clearCookie("returnTo");
    const isUnwantedDeleteRoute = new RegExp('/[^/]+/[^/]+/reviews/[^/]+\?_method=DELETE');
    if (isUnwantedDeleteRoute.test(redUser)) {
        redUser = redUser.substring(0,redUser.indexOf("/reviews"));
    }
    res.redirect(redUser);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('update', 'Bye!!');
        res.redirect('/campgrounds');
    });
}