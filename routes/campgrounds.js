const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');



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
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews', populate: {path: 'author'}
        }).populate('author');
        res.render('campgrounds/shows', {campground});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async (req,res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', {campground});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
   
}));

router.put('/:id/', isLoggedIn, isAuthor, validateCampground, catchAsync (async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('update', 'Updated Campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}));

module.exports = router;