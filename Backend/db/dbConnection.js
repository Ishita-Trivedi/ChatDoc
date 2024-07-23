//connect to db
const mongoose = require('mongoose');
let url='mongodb+srv://ishitatrivedidocs:Ishitat%4012345@cluster0.hekmgb7.mongodb.net/';
const connectDB = async () => {
    try {
        await mongoose.connect('${url}', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
