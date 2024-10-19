//connect to db
const mongoose = require('mongoose');
let url=process.env.MONGOOSE_URL;
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
