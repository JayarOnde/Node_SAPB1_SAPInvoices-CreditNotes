import { config } from 'dotenv';
config();

export default{
    port: process.env.PORT || 3000,
    user: process.env.DBUSER || '',
    password: process.env.DBPASS || '',
    server: process.env.DBSERVER || '',
    database: process.env.DATABASE || '',
    user2: process.env.DBUSER2 || '',
    password2: process.env.DBPASS2 || '',
    server2: process.env.DBSERVER2 || '',
    database2: process.env.DATABASE2 || ''
}