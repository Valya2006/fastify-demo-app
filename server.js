import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
const port = 3000

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});

app.get('/api', (req, res) => {
	res.send('Запрос прошел успешно')
})

app.listen({ port }, (err) => {
    console.log('Сервер запущен на http://localhost:3000');
});

