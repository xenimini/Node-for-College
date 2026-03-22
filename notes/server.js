const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadFile();

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // ROOT ROUTERS

  if (url === "/" && method === "GET") {
    const html = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (url === "/app.js" && method === "GET") {
    const js = await fs.readFile(path.join(__dirname, "app.js"), "utf-8");
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js);
    return;
  }

  // API ROUTERS

  if (url === "/api/notes" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  if (url === "/api/notes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      console.log("create start");
      const { title, content } = JSON.parse(body);
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString(),
      };
      console.log("create end");
      notes.push(newNote);
      fileManager.saveFile(notes);
      console.log(`Заметка ${newNote.title} сохранена!`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // ДОБАВЛЕННЫЙ МАРШРУТ: ПОЛУЧЕНИЕ СТАТИСТИКИ
  if (url === "/api/stats" && method === "GET") {
    const stats = {
      total: notes.length,
      lastNote: notes.length > 0 ? notes[notes.length - 1] : null
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(stats));
    return;
  }

  // МАРШРУТ: УДАЛЕНИЕ ЗАМЕТКИ
  if (url === "/api/notes" && method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { id } = JSON.parse(body);
        const noteIndex = notes.findIndex(note => note.id === id);
        
        if (noteIndex !== -1) {
          notes.splice(noteIndex, 1);
          // переиндексация ID заметок
          notes = helper.reindexId(notes);
          fileManager.saveFile(notes);
          
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Заметка удалена" }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "Заметка не найдена" }));
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Ошибка при удалении" }));
      }
    });
    return;
  }
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту http://localhost:3000");
});
