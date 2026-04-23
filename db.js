import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); 


const { Pool } = pg;


const pool = new Pool({
	// eslint-disable-next-line no-undef
    user: process.env.DB_USER || 'postgres',
		// eslint-disable-next-line no-undef
    host: process.env.DB_HOST || 'localhost',
		// eslint-disable-next-line no-undef
    database: process.env.DB_NAME || 'postgres',
		// eslint-disable-next-line no-undef
    password: process.env.DB_PASSWORD || '',
		// eslint-disable-next-line no-undef
    port: process.env.DB_PORT || 5432,
});

export const queries = {
    // Создание таблицы
    createTable: `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL
        )
    `,
    
    // Вставка начальных данных
    insertInitialData: `
        INSERT INTO users (name, email) VALUES 
        ('Алексей Смирнов', 'alexey@example.com'),
        ('Мария Иванова', 'maria@example.com'),
        ('Дмитрий Петров', 'dmitry@example.com'),
        ('Елена Сидорова', 'elena@example.com'),
        ('Константин Воробьев', 'kostya@example.com')
    `,
    
    // Проверка количества записей
    countUsers: 'SELECT COUNT(*) FROM users',
    
    // Получить всех пользователей
    getAllUsers: 'SELECT * FROM users ORDER BY id',
    
    // Получить пользователя по ID
    getUserById: 'SELECT * FROM users WHERE id = $1',
    
    // Создать пользователя
    createUser: 'INSERT INTO users (name, email) VALUES ($1, $2)',
    
    // Обновить пользователя
    updateUser: 'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    
    // Удалить пользователя
    deleteUser: 'DELETE FROM users WHERE id = $1',
    
    // Проверка email на уникальность
    checkEmailExists: 'SELECT COUNT(*) FROM users WHERE email = $1'
};

export default pool;