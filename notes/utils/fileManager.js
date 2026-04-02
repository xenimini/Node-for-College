const fs = require('fs');
const path = require('path');

const notesFile = path.join(__dirname, '../data/notes.json');

if (!fs.existsSync(path.dirname(notesFile))) {
    fs.mkdirSync(path.dirname(notesFile), { recursive: true });
}
if (!fs.existsSync(notesFile)) {
    fs.writeFileSync(notesFile, JSON.stringify([]));
}

function loadFile() {
    try {
        const data = fs.readFileSync(notesFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveFile(notes) {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

function getUserNotes(userId) {
    const allNotes = loadFile();
    return allNotes.filter(note => note.owner_id == userId);
}

function createNote(userId, title, content) {
    const allNotes = loadFile();
    const userNotes = allNotes.filter(n => n.owner_id == userId);
    const newId = userNotes.length > 0 ? Math.max(...userNotes.map(n => n.id)) + 1 : 1;
    const newNote = {
        id: newId,
        owner_id: userId,
        title,
        content,
        date: new Date().toLocaleString()
    };
    allNotes.push(newNote);
    saveFile(allNotes);
    return newNote;
}

function updateNote(userId, noteId, title, content) {
    const allNotes = loadFile();
    const index = allNotes.findIndex(n => n.id == noteId && n.owner_id == userId);
    if (index === -1) return null;
    allNotes[index] = {
        ...allNotes[index],
        title,
        content,
        date: new Date().toLocaleString()
    };
    saveFile(allNotes);
    return allNotes[index];
}

function deleteNote(userId, noteId) {
    let allNotes = loadFile();
    const userNotes = allNotes.filter(n => n.owner_id == userId);
    const exists = userNotes.some(n => n.id == noteId);
    if (!exists) return false;

    allNotes = allNotes.filter(n => !(n.owner_id == userId && n.id == noteId));
    let newId = 1;
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].owner_id == userId) {
            allNotes[i].id = newId++;
        }
    }
    saveFile(allNotes);
    return true;
}

module.exports = { loadFile, saveFile, getUserNotes, createNote, updateNote, deleteNote };