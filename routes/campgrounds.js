const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.showCampgrounds))
    .post(isLoggedIn, validateCampground, catchAsync (campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.showNewForm);

router.route('/:id')
    .get(catchAsync (campgrounds.showOneCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync (campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgrounds.nukeCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.showEditForm));

module.exports = router;