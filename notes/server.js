const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const fileManAager = require('./utils/fileManager');
const userManager = require('./utils/userManager');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, userid');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API маршруты
    if (pathname === '/api/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const result = userManager.registerUser(username, password);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    else if (pathname === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const result = userManager.loginUser(username, password);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    else if (pathname === '/api/notes' && req.method === 'GET') {
        const userId = req.headers.userid;
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Не авторизован' }));
            return;
        }
        const notes = fileManager.getUserNotes(parseInt(userId));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(notes));
    }
    else if (pathname === '/api/notes' && req.method === 'POST') {
        const userId = req.headers.userid;
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Не авторизован' }));
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { title, content } = JSON.parse(body);
            const newNote = fileManager.createNote(parseInt(userId), title, content);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newNote));
        });
    }
    else if (pathname.startsWith('/api/notes/') && req.method === 'PUT') {
        const userId = req.headers.userid;
        const noteId = parseInt(pathname.split('/')[3]);
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Не авторизован' }));
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { title, content } = JSON.parse(body);
            const updated = fileManager.updateNote(parseInt(userId), noteId, title, content);
            if (!updated) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Заметка не найдена' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updated));
        });
    }
    else if (pathname.startsWith('/api/notes/') && req.method === 'DELETE') {
        const userId = req.headers.userid;
        const noteId = parseInt(pathname.split('/')[3]);
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Не авторизован' }));
            return;
        }
        const deleted = fileManager.deleteNote(parseInt(userId), noteId);
        if (!deleted) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Заметка не найдена' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
    }
    else if (pathname === '/api/stats' && req.method === 'GET') {
        const userId = req.headers.userid;
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Не авторизован' }));
            return;
        }
        const notes = fileManager.getUserNotes(parseInt(userId));
        const total = notes.length;
        const lastNote = notes.length ? notes[notes.length - 1] : null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ total, lastNote }));
    }
    else {
        // Статические файлы
        let filePath = pathname === '/' ? '/public/index.html' : '/public' + pathname;
        filePath = path.join(__dirname, filePath);
        
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
        }[ext] || 'text/plain';
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content || '404 - Страница не найдена');
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Ошибка сервера: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`📝 Перейдите по адресу для начала работы`);
});
