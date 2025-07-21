import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;  

export async function initializedRedisClient() {
    if (!client) {
        client = createClient(); // by default it connects to localhost:6379
        client.on('error', (error) => {
            console.error(error);
        })

        client.on('connect',() => {
            console.log('Redis client connected');  
        })

        await client.connect();

    }
    return client;
}