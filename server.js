import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import view from '@fastify/view';
import { fileURLToPath } from 'url';
import path from 'path';
import pug from 'pug';
import formBody from '@fastify/formbody';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
const port = 3000

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

const users = [
  { id: 1, name: 'Алексей Смирнов', email: 'alexey@example.com' },
  { id: 2, name: 'Мария Иванова', email: 'maria@example.com' },
  { id: 3, name: 'Дмитрий Петров', email: 'dmitry@example.com' },
  { id: 4, name: 'Елена Сидорова', email: 'elena@example.com' },
  { id: 5, name: 'Константин Воробьев', email: 'kostya@example.com' }
];
app.get('/', (req, res) => {
	res.redirect('/users')
})

app.get('/users', (req, res) => {
	res.view('users', { users })
})

app.get('/users/create', (req, res) => {
	res.view('createUsers')
})

app.post('/users', (req, res) => {
	const { name, email } = req.body
	const id = users.length + 1
	const user = { id, name, email}
	users.push(user)

	res.redirect('/users')

})
app.listen({ port }, (err) => {
    console.log('Сервер запущен на http://localhost:3000');
});

