import { Redis } from 'ioredis';
require('dotenv').config();

type RedisUrl = string | undefined; // Define a type for Redis URL (can be string or undefined)

const redisUrl: RedisUrl = process.env.REDIS_URL; // Use type annotation

const connectRedis = async (): Promise<Redis> => {
    if (!redisUrl) {
        throw new Error('Missing REDIS_URL environment variable');
    }

    const client = new Redis(redisUrl);

    try {
        await client.connect();
        console.log('Redis connected successfully');
        return client;
    } catch (error) {
        console.error('Redis connection error:', error);
        throw error; // Re-throw the error to indicate connection failure
    }
};

// Export the connection function to be used elsewhere
export { connectRedis };
