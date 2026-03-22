const stats = document.getElementById("stats");
const content = document.getElementById("content");

let notes = [];

async function loadNotes() {
  try {
    const res = await fetch("/api/notes");
    notes = await res.json();
    await loadStats(); // обновляем статистику после загрузки заметок
    stats.innerText = `Заметок ${notes.length}`;
  } catch (error) {
    console.log("Ощибка", error);
    stats.innerText = `Информации о заметках нет`;
  }
}

// ДОБАВЛЕННАЯ ФУНКЦИЯ: ЗАГРУЗКА СТАТИСТИКИ
async function loadStats() {
  try {
    const res = await fetch("/api/stats");
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

async function addNote() {
  const title = prompt("Введите название ");
  const contentText = prompt("Введите содержание ");
  try {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: contentText }),
    });
    await loadNotes(); // перезагружаем заметки после добавления
    await showAllNotes(); // показываем обновленный список
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

// ДОБАВЛЕННАЯ ФУНКЦИЯ: ПОКАЗ ВСЕХ ЗАМЕТОК
async function showAllNotes() {
  try {
    const res = await fetch("/api/notes");
    const allNotes = await res.json();
    
    if (allNotes.length === 0) {
      content.innerHTML = "<p>📭 У вас пока нет заметок. Нажмите 'Добавить заметку'</p>";
      return;
    }
    
    let html = "<div class='notes-list'>";
    allNotes.forEach(note => {
      html += `
        <div class='note-card' data-id='${note.id}'>
          <div class='note-header'>
            <strong>#${note.id}</strong>
            <span class='note-date'>${note.date}</span>
          </div>
          <h3 class='note-title'>${escapeHtml(note.title)}</h3>
          <p class='note-content'>${escapeHtml(note.content)}</p>
          <button class='delete-btn' onclick='deleteNote(${note.id})'>🗑 Удалить</button>
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

// ДОБАВЛЕННАЯ ФУНКЦИЯ: УДАЛЕНИЕ ЗАМЕТКИ
async function deleteNote(id) {
  if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
    try {
      await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      await loadNotes();
      await showAllNotes();
    } catch (error) {
      console.log("Ошибка удаления", error);
      alert("Не удалось удалить заметку");
    }
  }
}

// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ЗАЩИТА ОТ XSS
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

loadNotes();
