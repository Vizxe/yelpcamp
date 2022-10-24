const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');


router.post('/', validateReview, isLoggedIn, catchAsync (async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('successCamp', 'Successfully made new review.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id,  {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('successCamp', 'Successfully deleted a review.');
    res.redirect(`/campgrounds/${id}`);
})) 

module.exports = router;