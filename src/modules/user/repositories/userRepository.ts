import { pool } from '../../../mysql'
import { v4 as uuidv4 } from 'uuid'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'

class UserRepository {
    create(request: Request, response: Response) {
        const { name, email, password } = request.body;
            pool.getConnection((err: any, connection: any) => {
            if (err) {
                return response.status(500).json(err);
            }

                hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        connection.release();
                        return response.status(500).json(err);
                    }

                    connection.query(
                        'INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)',
                        [uuidv4(), name, email, hashedPassword],
                        (error: any, result: any, fields: any) => {
                            connection.release();
                            if (error) {
                                return response.status(400).json(error);
                            }
                            response.status(200).json({ success: true });
                        }
                    );
                });
        });
    }

    login(request: Request, response: Response) {
        const { email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
    
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any[], fields: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({error: 'Erro na autenticação'});
                    }
    
                    compare(password, results[0].password, (err, result) => {
                        if (err) {
                            return response.status(400).json({ error: "Erro na sua autenticação" });
                        }
    
                        if (result) {
                            const token = sign({
                                id: results[0].user_id,
                                email: results[0].email
                            }, process.env.SECRET as string, { expiresIn: "1d" });
    
                            console.log(token)
                            response.status(200).json({ token: token, message: 'Autenticado' })
                        }
                        
                    });
                }
            );
        });
    }
}

export { UserRepository };