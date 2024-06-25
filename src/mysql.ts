import mysql from 'mysql';
import { config } from 'dotenv'
config();

//criando a conexao
const pool = mysql.createPool({
    "user": process.env.USER_DATABASE,
    "password": process.env.USER_PASSWORD, 
    "database": process.env.DATABASE,
    "host": process.env.HOST_DATABASE,
    "port": Number(process.env.PORT_DATABASE)
})

export { pool };