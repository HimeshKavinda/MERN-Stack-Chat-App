const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`. cyan.italic.bold.underline);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;