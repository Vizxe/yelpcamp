const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');


module.exports.showCampgrounds = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground); 
    campground.geometry = geoData.body.features[0].geometry;
    campground.images =  req.files.map(e => ({url: e.path, filename: e.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('successCamp', 'Nice! You just made a new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showOneCampground = async (req,res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews', populate: {path: 'author'}
        }).populate('author');
        res.render('campgrounds/shows', {campground});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
}

module.exports.showEditForm = async (req,res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', {campground});
    } catch {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
   
}

module.exports.editCampground = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(e => ({url: e.path, filename: e.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages)  {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('update', 'Updated Campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.nukeCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}