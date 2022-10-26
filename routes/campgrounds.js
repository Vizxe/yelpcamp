const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.showCampgrounds))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.showNewForm);

router.route('/:id')
    .get(catchAsync (campgrounds.showOneCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgrounds.nukeCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.showEditForm));

module.exports = router;