const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            author: '6355933e90c1aad59683f4d5',
            location: `${sample(cities).city}, ${sample(cities).state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dcm1co1r4/image/upload/v1666818858/YelpCamp/we68xj7u8fswfk9qxhr8.png',
                  filename: 'YelpCamp/we68xj7u8fswfk9qxhr8',
                },
                {
                  url: 'https://res.cloudinary.com/dcm1co1r4/image/upload/v1666818860/YelpCamp/wlp3es25ba4yihdelfaj.png',
                  filename: 'YelpCamp/wlp3es25ba4yihdelfaj',
                }
              ],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe nostrum accusantium sequi molestias rerum amet aliquam voluptatibus id, tempore magni veritatis!",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})