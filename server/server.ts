import connectDB from "./utilities/db";

require("dotenv").config();
const { app } = require('./app');

// Create server
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB()
});
