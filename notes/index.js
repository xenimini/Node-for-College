<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мои заметки</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #EF4765 0%, #FF9A5A 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(239, 71, 101, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #EF4765 0%, #FF9A5A 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .stats {
            background: rgba(255,255,255,0.25);
            padding: 15px;
            border-radius: 12px;
            margin-top: 15px;
            font-size: 1.1em;
            backdrop-filter: blur(5px);
        }
        
        .controls {
            padding: 20px 30px;
            background: #fff5f0;
            border-bottom: 2px solid #FF9A5A;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        /* Стиль всех кнопок - button-62 */
        button, .button-62 {
            background: linear-gradient(to bottom right, #EF4765, #FF9A5A);
            border: 0;
            border-radius: 12px;
            color: #FFFFFF;
            cursor: pointer;
            display: inline-block;
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 500;
            line-height: 2.5;
            outline: transparent;
            padding: 0 1rem;
            text-align: center;
            text-decoration: none;
            transition: box-shadow .2s ease-in-out;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            white-space: nowrap;
        }
        
        button:not([disabled]):focus, .button-62:not([disabled]):focus {
            box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
        }
        
        button:not([disabled]):hover, .button-62:not([disabled]):hover {
            box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
        }
        
        button:active, .button-62:active {
            transform: scale(0.98);
        }
        
        .delete-btn {
            background: linear-gradient(to bottom right, #EF4765, #FF9A5A);
            line-height: 2;
            font-size: 14px;
            padding: 0 1rem;
            margin-top: 10px;
            width: auto;
        }
        
        /* Стиль кнопки редактирования в правом верхнем углу */
        .edit-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(to bottom right, #EF4765, #FF9A5A);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            font-size: 18px;
            cursor: pointer;
            color: white;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(239, 71, 101, 0.3);
        }
        
        .edit-btn:hover {
            transform: scale(1.1) rotate(15deg);
            box-shadow: 0 4px 15px rgba(239, 71, 101, 0.5);
        }
        
        .edit-btn:active {
            transform: scale(0.95);
        }
        
        .content {
            padding: 30px;
            min-height: 400px;
            background: #fffaf8;
        }
        
        .notes-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .note-card {
            background: white;
            border: 1px solid #FFD1B0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(239, 71, 101, 0.1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .note-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #EF4765, #FF9A5A);
        }
        
        .note-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(239, 71, 101, 0.2);
            border-color: #FF9A5A;
        }
        
        .note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #FF9A5A;
            font-size: 0.9em;
            color: #EF4765;
            padding-right: 35px;
        }
        
        .note-header strong {
            color: #EF4765;
            font-size: 1.1em;
        }
        
        .note-date {
            color: #FF9A5A;
        }
        
        .note-title {
            font-size: 1.3em;
            color: #EF4765;
            margin-bottom: 15px;
            font-weight: 600;
            word-wrap: break-word;
            overflow-wrap: break-word;
            padding-right: 35px;
            text-align: center;
        }
        
        .note-content-wrapper {
            flex: 1;
            margin-bottom: 15px;
        }
        
        .note-content {
            color: #9B5E3A;
            line-height: 1.6;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            margin: 0;
            padding: 0;
        }
        
        .note-content.collapsed {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .note-content.expanded {
            display: block;
        }
        
        .note-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            gap: 10px;
        }
        
        /* Стиль кнопки btn-82 */
        .btn-82 *,
        .btn-82 :after,
        .btn-82 :before,
        .btn-82:after,
        .btn-82:before {
            border: 0 solid;
            box-sizing: border-box;
        }
        
        .btn-82 {
            -webkit-tap-highlight-color: transparent;
            -webkit-appearance: button;
            background: linear-gradient(to bottom right, #EF4765, #FF9A5A);
            color: #fff;
            cursor: pointer;
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: none;
            border-radius: 999px;
            box-sizing: border-box;
            display: inline-block;
            overflow: hidden;
            padding: 0.6rem 1.5rem;
            position: relative;
            text-transform: uppercase;
            border: 2px solid #EF4765;
        }
        
        .btn-82:disabled {
            cursor: default;
        }
        
        .btn-82:-moz-focusring {
            outline: auto;
        }
        
        .btn-82 svg {
            display: block;
            vertical-align: middle;
        }
        
        .btn-82 [hidden] {
            display: none;
        }
        
        .btn-82 span {
            font-weight: 500;
            mix-blend-mode: normal;
            transition: opacity 0.2s;
            position: relative;
            z-index: 1;
            color: #EF4765;
        }
        
        .btn-82:hover span {
            -webkit-animation: text-reset 0.2s 0.8s forwards;
            animation: text-reset 0.2s 0.8s forwards;
            opacity: 0;
        }
        
        .btn-82:after,
        .btn-82:before {
            border: 2px solid #EF4765;
            border-radius: 999px;
            content: "";
            height: 100%;
            left: 0;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            transition: height 0.2s;
            width: 100%;
        }
        
        .btn-82:after {
            background: linear-gradient(to bottom right, #EF4765, #FF9A5A);
            border: none;
            height: 2rem;
            width: 0;
            z-index: -1;
        }
        
        .btn-82:hover:before {
            -webkit-animation: border-reset 0.2s linear 0.78s forwards;
            animation: border-reset 0.2s linear 0.78s forwards;
            height: 2rem;
        }
        
        .btn-82:hover:after {
            -webkit-animation: progress-bar 1s;
            animation: progress-bar 1s;
        }
        
        @-webkit-keyframes progress-bar {
            0% {
                opacity: 1;
                width: 0;
            }
            10% {
                opacity: 1;
                width: 15%;
            }
            25% {
                opacity: 1;
                width: 25%;
            }
            40% {
                opacity: 1;
                width: 35%;
            }
            55% {
                opacity: 1;
                width: 75%;
            }
            60% {
                opacity: 1;
                width: 100%;
            }
            to {
                opacity: 0;
                width: 100%;
            }
        }
        
        @keyframes progress-bar {
            0% {
                opacity: 1;
                width: 0;
            }
            10% {
                opacity: 1;
                width: 15%;
            }
            25% {
                opacity: 1;
                width: 25%;
            }
            40% {
                opacity: 1;
                width: 35%;
            }
            55% {
                opacity: 1;
                width: 75%;
            }
            60% {
                opacity: 1;
                width: 100%;
            }
            to {
                opacity: 0;
                width: 100%;
            }
        }
        
        @-webkit-keyframes border-reset {
            0% {
                height: 2rem !important;
            }
            to {
                height: 100% !important;
            }
        }
        
        @keyframes border-reset {
            0% {
                height: 2rem !important;
            }
            to {
                height: 100% !important;
            }
        }
        
        @-webkit-keyframes text-reset {
            0% {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes text-reset {
            0% {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        /* Модальное окно для заметок */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        
        /* Модальное окно подтверждения */
        .confirm-modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: white;
            margin: 10% auto;
            padding: 0;
            width: 90%;
            max-width: 500px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: slideIn 0.3s;
        }
        
        .confirm-content {
            background: white;
            margin: 15% auto;
            padding: 0;
            width: 90%;
            max-width: 450px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: slideIn 0.3s;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-header {
            background: linear-gradient(135deg, #EF4765 0%, #FF9A5A 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            font-size: 1.2em;
            font-weight: bold;
        }
        
        .confirm-header {
            background: linear-gradient(135deg, #EF4765 0%, #FF9A5A 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            font-size: 1.2em;
            font-weight: bold;
            text-align: center;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .confirm-body {
            padding: 30px 20px;
            text-align: center;
            font-size: 1.1em;
            color: #666;
        }
        
        .confirm-body p {
            margin: 10px 0;
        }
        
        .confirm-body .warning-icon {
            font-size: 3em;
            margin-bottom: 15px;
        }
        
        .confirm-body .note-title {
            color: #EF4765;
            font-weight: bold;
            margin-top: 10px;
            font-size: 1.2em;
        }
        
        .modal-body input,
        .modal-body textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #FFD1B0;
            border-radius: 12px;
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        
        .modal-body input:focus,
        .modal-body textarea:focus {
            outline: none;
            border-color: #EF4765;
        }
        
        .modal-body textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .modal-footer {
            padding: 15px 20px 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .confirm-footer {
            padding: 15px 20px 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        .btn-cancel {
            background: #f0f0f0;
            color: #666;
        }
        
        .btn-cancel:hover {
            background: #e0e0e0;
            box-shadow: none;
        }
        
        .btn-danger {
            background: linear-gradient(to bottom right, #dc3545, #ff6b6b);
        }
        
        .btn-danger:hover {
            background: linear-gradient(to bottom right, #c82333, #ff5252);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px;
            color: #FF9A5A;
            font-size: 1.2em;
        }
        
        @media (max-width: 768px) {
            .controls {
                flex-direction: column;
            }
            
            button, .button-62 {
                width: 100%;
            }
            
            .notes-list {
                grid-template-columns: 1fr;
            }
            
            .btn-82 {
                padding: 0.5rem 1.2rem;
                font-size: 12px;
            }
            
            .modal-content,
            .confirm-content {
                margin: 20% auto;
                width: 95%;
            }
        }
        
        /* Стиль для скроллбара */
        ::-webkit-scrollbar {
            width: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: #fff5f0;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #EF4765, #FF9A5A);
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #E03E5A, #FF8A4A);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Мои заметки</h1>
            <div id="stats" class="stats">Загрузка...</div>
        </div>
        
        <div class="controls">
            <button class="button-62" onclick="showAllNotes()">📋 Показать заметки</button>
            <button class="button-62" onclick="openAddModal()">➕ Добавить заметку</button>
            <button class="button-62" onclick="openDeleteAllConfirm()">🗑 Удалить все</button>
        </div>
        
        <div id="content" class="content">
            <div class="empty-state">
                📭 Нажмите "Показать заметки" чтобы увидеть список
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для добавления/редактирования заметки -->
    <div id="noteModal" class="modal">
        <div class="modal-content">
            <div class="modal-header" id="modalTitle">
                Добавить заметку
            </div>
            <div class="modal-body">
                <input type="text" id="noteTitle" placeholder="Название заметки" maxlength="200">
                <textarea id="noteContent" placeholder="Содержание заметки"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeModal()">Отмена</button>
                <button class="button-62" id="saveNoteBtn" onclick="saveNote()">Сохранить</button>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно подтверждения удаления -->
    <div id="confirmModal" class="confirm-modal">
        <div class="confirm-content">
            <div class="confirm-header" id="confirmHeader">
                ⚠️ Подтверждение удаления
            </div>
            <div class="confirm-body" id="confirmBody">
                <div class="warning-icon">🗑️</div>
                <p id="confirmMessage">Вы уверены, что хотите удалить эту заметку?</p>
                <div id="noteTitleDisplay" class="note-title"></div>
            </div>
            <div class="confirm-footer">
                <button class="btn-cancel" onclick="closeConfirmModal()">Отмена</button>
                <button class="button-62 btn-danger" id="confirmActionBtn" onclick="executeDelete()">Удалить</button>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
