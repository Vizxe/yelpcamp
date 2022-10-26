const Campground = require('../models/campground');


module.exports.showCampgrounds = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res) => {
    const campground = new Campground(req.body.campground);
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
    req.flash('update', 'Updated Campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.nukeCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}