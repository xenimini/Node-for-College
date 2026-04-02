const stats = document.getElementById("stats");
const content = document.getElementById("content");

let notes = [];
let editingNoteId = null;
let pendingDeleteId = null;
let isDeletingAll = false;

if (!localStorage.getItem('userId')) {
    window.location.href = '/login.html';
}
const userId = localStorage.getItem('userId');
const username = localStorage.getItem('username');
if (username) {
    const userSpan = document.getElementById('usernameDisplay');
    if (userSpan) userSpan.innerText = `👤 ${username}`;
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

async function loadNotes() {
    try {
        const res = await fetch("/api/notes", {
            headers: { 'userid': userId }
        });
        notes = await res.json();
        await loadStats();
        stats.innerText = `Заметок ${notes.length}`;
    } catch (error) {
        console.log("Ошибка", error);
        stats.innerText = `Информации о заметках нет`;
    }
}

async function loadStats() {
    try {
        const res = await fetch("/api/stats", {
            headers: { 'userid': userId }
        });
        const statsData = await res.json();
        const statsElement = document.getElementById("stats");
        if (statsData.lastNote) {
            statsElement.innerHTML = `📊 Всего заметок: ${statsData.total}<br>📝 Последняя: ${statsData.lastNote.title} (${statsData.lastNote.date})`;
        } else {
            statsElement.innerHTML = `📊 Всего заметок: 0<br>📝 Нет заметок`;
        }
    } catch (error) {
        console.log("Ошибка загрузки статистики", error);
    }
}

function openAddModal() {
    editingNoteId = null;
    document.getElementById("modalTitle").innerHTML = "➕ Добавить заметку";
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteModal").style.display = "block";
}

function openEditModal(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        editingNoteId = id;
        document.getElementById("modalTitle").innerHTML = "✏️ Редактировать заметку";
        document.getElementById("noteTitle").value = note.title;
        document.getElementById("noteContent").value = note.content;
        document.getElementById("noteModal").style.display = "block";
    }
}

function closeModal() {
    document.getElementById("noteModal").style.display = "none";
    editingNoteId = null;
}

function openDeleteConfirm(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        pendingDeleteId = id;
        isDeletingAll = false;
        document.getElementById("confirmHeader").innerHTML = "⚠️ Подтверждение удаления";
        document.getElementById("confirmMessage").innerHTML = "Вы уверены, что хотите удалить эту заметку?";
        document.getElementById("noteTitleDisplay").innerHTML = `"${escapeHtml(note.title)}"`;
        document.getElementById("noteTitleDisplay").style.display = "block";
        document.getElementById("confirmModal").style.display = "block";
    }
}

function openDeleteAllConfirm() {
    if (notes.length === 0) {
        alert("Нет заметок для удаления");
        return;
    }
    pendingDeleteId = null;
    isDeletingAll = true;
    document.getElementById("confirmHeader").innerHTML = "⚠️ Подтверждение удаления";
    document.getElementById("confirmMessage").innerHTML = `Вы уверены, что хотите удалить ВСЕ заметки (${notes.length} шт.)?`;
    document.getElementById("noteTitleDisplay").innerHTML = "Это действие нельзя отменить!";
    document.getElementById("noteTitleDisplay").style.display = "block";
    document.getElementById("confirmModal").style.display = "block";
}

function closeConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
    pendingDeleteId = null;
    isDeletingAll = false;
}

async function executeDelete() {
    try {
        if (isDeletingAll) {
            for (const note of notes) {
                await fetch(`/api/notes/${note.id}`, {
                    method: "DELETE",
                    headers: { 'userid': userId }
                });
            }
            alert("✅ Все заметки удалены");
        } else if (pendingDeleteId) {
            await fetch(`/api/notes/${pendingDeleteId}`, {
                method: "DELETE",
                headers: { 'userid': userId }
            });
            alert("✅ Заметка удалена");
        }
        closeConfirmModal();
        await loadNotes();
        await showAllNotes();
    } catch (error) {
        console.log("Ошибка удаления", error);
        alert("❌ Не удалось удалить заметку(и)");
    }
}

async function saveNote() {
    const title = document.getElementById("noteTitle").value.trim();
    const contentText = document.getElementById("noteContent").value.trim();
    if (!title) {
        alert("Введите название заметки");
        return;
    }
    try {
        if (editingNoteId) {
            await fetch(`/api/notes/${editingNoteId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'userid': userId
                },
                body: JSON.stringify({ title, content: contentText }),
            });
        } else {
            await fetch("/api/notes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'userid': userId
                },
                body: JSON.stringify({ title, content: contentText }),
            });
        }
        closeModal();
        await loadNotes();
        await showAllNotes();
    } catch (error) {
        console.log("ERROR", error.message);
        alert("Ошибка при сохранении заметки");
    }
}

function toggleNoteContent(noteId) {
    const contentElement = document.getElementById(`note-content-${noteId}`);
    const button = document.getElementById(`toggle-btn-${noteId}`);
    if (contentElement.classList.contains('collapsed')) {
        contentElement.classList.remove('collapsed');
        contentElement.classList.add('expanded');
        if (button) button.querySelector('span').textContent = 'Свернуть';
    } else {
        contentElement.classList.remove('expanded');
        contentElement.classList.add('collapsed');
        if (button) button.querySelector('span').textContent = 'Ещё...';
    }
}

async function showAllNotes() {
    try {
        const res = await fetch("/api/notes", {
            headers: { 'userid': userId }
        });
        const allNotes = await res.json();
        if (allNotes.length === 0) {
            content.innerHTML = "<p>📭 У вас пока нет заметок. Нажмите 'Добавить заметку'</p>";
            return;
        }
        let html = "<div class='notes-list'>";
        allNotes.forEach(note => {
            const needsToggle = note.content && note.content.length > 150;
            html += `
                <div class='note-card' data-id='${note.id}'>
                    <button class='edit-btn' onclick='openEditModal(${note.id})' title='Редактировать'>✏️</button>
                    <div class='note-header'>
                        <strong>#${note.id}</strong>
                        <span class='note-date'>${escapeHtml(note.date)}</span>
                    </div>
                    <h3 class='note-title'>${escapeHtml(note.title)}</h3>
                    <div class='note-content-wrapper'>
                        <div id='note-content-${note.id}' class='note-content ${needsToggle ? 'collapsed' : 'expanded'}'>
                            ${escapeHtml(note.content)}
                        </div>
                    </div>
                    <div class='note-footer'>
                        <button class='delete-btn' onclick='openDeleteConfirm(${note.id})'>🗑 Удалить</button>
                        ${needsToggle ? `<button id='toggle-btn-${note.id}' class='btn-82' onclick='toggleNoteContent(${note.id})'><span>Ещё...</span></button>` : ''}
                    </div>
                </div>
            `;
        });
        html += "</div>";
        content.innerHTML = html;
    } catch (error) {
        console.log("Ошибка загрузки заметок", error);
        content.innerHTML = "<p>❌ Ошибка загрузки заметок</p>";
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

window.onclick = function(event) {
    const noteModal = document.getElementById("noteModal");
    const confirmModal = document.getElementById("confirmModal");
    if (event.target == noteModal) closeModal();
    if (event.target == confirmModal) closeConfirmModal();
};

loadNotes();