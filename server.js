import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import view from '@fastify/view';
import { fileURLToPath } from 'url';
import path from 'path';
import pug from 'pug';
import formBody from '@fastify/formbody';
import { queries } from './db.js';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
const port = 3000;

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});

app.register(view, {
  engine: {
    pug: pug,
  },
  root: path.join(__dirname, 'views')
});

app.register(formBody);

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(queries.createTable);
        
        const result = await client.query(queries.countUsers);
        
        if (parseInt(result.rows[0].count) === 0) {
            await client.query(queries.insertInitialData);
            console.log('Начальные данные добавлены');
        }
        
        console.log('PostgreSQL готов');
    } finally {
        client.release();
    }
}

app.get('/', async (req, reply) => {
    reply.redirect('/users');
});

app.get('/test', async (req, reply) => {
    const result = await pool.query('SELECT * FROM users');
    reply.send(result.rows);
});

app.get('/users', async (req, reply) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        console.log('Рендерим шаблон с данными:', result.rows.length);
        
        await reply.view('users', { users: result.rows });
    } catch (error) {
        console.error('Ошибка рендеринга:', error);
        reply.send('Ошибка: ' + error.message);
    }
});

app.get('/users/create', async (req, reply) => {
    try {
        await reply.view('createUsers');
    } catch (error) {
        console.error('Ошибка:', error);
        reply.send(`Ошибка при загрузке формы: ${error.message}`);
    }
});

app.post('/users', async (req, reply) => {
    const { name, email } = req.body;
    
    try {
        await pool.query(queries.createUser, [name, email]);
        reply.redirect('/users');
    } catch (error) {
        if (error.code === '23505') {
            reply.status(400).send('Email уже существует');
        } else {
            reply.status(500).send('Ошибка при создании');
        }
    }
});

app.get('/users/edit/:id', async (req, reply) => {
    const { id } = req.params;
    const result = await pool.query(queries.getUserById, [id]);
    
    if (result.rows.length === 0) {
        reply.status(404).send('Пользователь не найден');
        return;
    }
    
    await reply.view('editUser', { user: result.rows[0] });
});

app.post('/users/edit/:id', async (req, reply) => {
    const { id } = req.params;
    const { name, email } = req.body;
    
    try {
        await pool.query(queries.updateUser, [name, email, id]);
        reply.redirect('/users');
    } catch (error) {
        if (error.code === '23505') {
            reply.status(400).send('Email уже существует');
        } else {
            reply.status(500).send('Ошибка при обновлении');
        }
    }
});

app.post('/users/delete/:id', async (req, reply) => {
    const { id } = req.params;
    
    try {
        await pool.query(queries.deleteUser, [id]);
        reply.redirect('/users');
    } catch (error) {
        reply.status(500).send('Ошибка при удалении');
    }
});

async function start() {
    await initDB();
    await app.listen({ port });
    console.log(`Сервер запущен на http://localhost:${port}`);
}

start();