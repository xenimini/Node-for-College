const readline = require("readline");

// обращаемся к библиотеке readline
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const NAME_PROJ = "NOTE-BOOK"

let notes = [];

let ste = 'Приветствую в ${NAME_PROJ}';

const addNote = () => {
	rl.question("Введите заголовок", (title) => {
		rl.question("Напишите текст", (content) => {
			const newNote = {
				id: notes.length + 1,
				title: title,
				content: content,
				date: new Date().toLocaleString()
			};
		});
	});
};
