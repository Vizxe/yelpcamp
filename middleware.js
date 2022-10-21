module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.cookie('returnTo', req.originalUrl, { maxAge: 900000, httpOnly: true });
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}