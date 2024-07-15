import mongoose from 'mongoose';
require('dotenv').config();

const dbUrl: string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl, {
           
        });
        console.log(`MongoDB connected to ${dbUrl}`);
    } catch (error:any) {
        console.error('MongoDB connection error:', error.message);
        // Retry connection after a delay (optional)
        setTimeout(() => connectDB(), 5000);
    }
};

// Call the connectDB function to establish the connection
export default  connectDB;
