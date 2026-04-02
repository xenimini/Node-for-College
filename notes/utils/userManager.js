const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

if (!fs.existsSync(path.dirname(usersFile))) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
}
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

function loadUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Ошибка сохранения пользователей:', err);
    }
}

function registerUser(username, password) {
    const users = loadUsers();
    if (users.find(u => u.username === username)) {
        return { success: false, error: 'Пользователь уже существует' };
    }
    const newUser = {
        id: users.length + 1,
        username,
        password
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, user: { id: newUser.id, username: newUser.username } };
}

function loginUser(username, password) {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return { success: false, error: 'Неверное имя или пароль' };
    }
    return { success: true, user: { id: user.id, username: user.username } };
}

module.exports = { registerUser, loginUser };