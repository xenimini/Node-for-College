const readline = require("readline"); // импортируем модуль из node

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const NAME_PROJ = '"NOTE"-"BOOK"';

let notes = [];

let str = `Тебя приветствует приложение ${NAME_PROJ}`;

const addNote = () => {
  rl.question("Введите заголовок", (title) => {
    rl.question("Напишите текст заметки", (content) => {
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString()
      };
      notes.push(newNote);
      console.log(`Заметка ${newNote.title} сохранена!`);
      console.log(`Всего заметок ${notes.length}`);

      showMenu();
    });
  });
}; 

const showNotes = () => {
  consol.log("----Все ваши заметки----");
  notes.forEach((note) => {
    console.log("-".repeat(30));
    console.log(`${note.id} * ${note.date}`);
    console.log(`${note.title}`);
    console.log(`${note.content}`);
    console.log("-".repeat(30));
  });
  showMenu();
};

const showMenu = () => {
  console.log(`${str}`);
  console.log(`Всего заметок ${notes.length}`);
  console.log("Главное меню");
  console.log("1. Доюавить заметку");
  console.log("2. Посмотреть заметки");

  rl.question("Выберите пункт от 1 до 2", (choice) => {
    switch(choice){
      case '1':
        addNote();
        break;
      case '2':
        showNotes();
        break;
      default:
        console.log("Нет такого пункта!");
        showMenu();
    };
  });
};

showMenu();
