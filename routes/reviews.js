const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews');


router.post('/', validateReview, isLoggedIn, catchAsync (reviews.makeReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.nukeReview)); 

module.exports = router;