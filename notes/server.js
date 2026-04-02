const express = require('express');
const path = require('path');
const fileManager = require('./utils/fileManager');
const userManager = require('./utils/userManager');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для регистрации
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const result = userManager.registerUser(username, password);
    res.json(result);
});

// Маршрут для входа
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const result = userManager.loginUser(username, password);
    res.json(result);
});

// Получить все заметки текущего пользователя
app.get('/api/notes', (req, res) => {
    const userId = req.headers.userid;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    const notes = fileManager.getUserNotes(parseInt(userId));
    res.json(notes);
});

// Создать заметку
app.post('/api/notes', (req, res) => {
    const userId = req.headers.userid;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    const { title, content } = req.body;
    const newNote = fileManager.createNote(parseInt(userId), title, content);
    res.json(newNote);
});

// Обновить заметку
app.put('/api/notes/:id', (req, res) => {
    const userId = req.headers.userid;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    const noteId = parseInt(req.params.id);
    const { title, content } = req.body;
    const updated = fileManager.updateNote(parseInt(userId), noteId, title, content);
    if (!updated) return res.status(404).json({ error: 'Заметка не найдена' });
    res.json(updated);
});

// Удалить заметку
app.delete('/api/notes/:id', (req, res) => {
    const userId = req.headers.userid;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    const noteId = parseInt(req.params.id);
    const deleted = fileManager.deleteNote(parseInt(userId), noteId);
    if (!deleted) return res.status(404).json({ error: 'Заметка не найдена' });
    res.json({ success: true });
});

// Статистика пользователя
app.get('/api/stats', (req, res) => {
    const userId = req.headers.userid;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    const notes = fileManager.getUserNotes(parseInt(userId));
    const total = notes.length;
    const lastNote = notes.length ? notes[notes.length - 1] : null;
    res.json({ total, lastNote });
});

// Отдаём страницы
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
