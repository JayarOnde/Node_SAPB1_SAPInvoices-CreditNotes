import { config } from 'dotenv';
config();

export default{
    port: process.env.PORT || 3000,
    user: process.env.DBUSER || '',
    password: process.env.DBPASS || '',
    server: process.env.DBSERVER || '',
    database: process.env.DATABASE || ''
}