const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');


const validateCampground = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync (async (req,res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('successCamp', 'Nice! You just made a new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync (async (req,res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
        res.render('campgrounds/shows', {campground});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
}));

router.get('/:id/edit', isLoggedIn, catchAsync (async (req,res) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(req.params.id);
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'Inadequete Permission.')
            return res.redirect(`/campgrounds/${id}`);
        }
        res.render('campgrounds/edit', {camp});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
   
}));

router.put('/:id/', isLoggedIn, validateCampground, catchAsync (async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Inadequete Permission.')
        return res.redirect(`/campgrounds/${id}`);
    }
    req.flash('update', 'Updated Campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Inadequete Permission.')
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}));

module.exports = router;