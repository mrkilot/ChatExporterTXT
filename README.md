# ChatExporterTXT

A lightweight **BetterDiscord** plugin that exports the entire message history of any server channel or Direct Message (DM) into a clean `.txt` file with a native folder selection dialog.

### ✨ Features
* **One-Click Export:** Adds an export option directly to the channel and user context menus.
* **Native Save Dialog:** Prompts you to choose the destination folder and filename before saving.
* **Complete History:** Automatically fetches all messages from the very beginning of the chat, respecting Discord rate limits.
* **Media & Attachments:** Includes direct links to attached images and files.
* **Zero Dependencies:** Works out of the box without requiring external plugin libraries (`ZeresPluginLibrary`, etc.).

### 📥 Installation
1. Download [`ChatExporterTXT.plugin.js`](https://githubusercontent.com).
2. Open Discord **User Settings** → **BetterDiscord** → **Plugins**.
3. Click **Open Plugins Folder** and move the downloaded `.plugin.js` file inside.
4. Enable **ChatExporterTXT** in the plugins list.

### 🚀 Usage
1. Right-click on any text channel or DM conversation.
2. Select **«Экспортировать чат в TXT»** (or **«Экспортировать ЛС в TXT»**).
3. Wait for the messages to load, then choose where to save your `.txt` file.

> ⚠️ **Disclaimer:** Automated message fetching using a user account may violate Discord's Terms of Service. Use responsibly and avoid exporting multiple large channels simultaneously.

---

# ChatExporterTXT (Русская версия)

Лёгкий плагин для **BetterDiscord**, который позволяет выгрузить всю историю переписки любого текстового канала или личных сообщений (ЛС) в удобный `.txt` файл с выбором папки сохранения.

### ✨ Возможности
* **Экспорт в один клик:** добавляет кнопку выгрузки прямо в контекстное меню при нажатии правой кнопкой мыши по каналу или пользователю.
* **Выбор папки сохранения:** после сбора переписки открывает стандартное окно проводника Windows для выбора места и имени файла.
* **Полная история чата:** автоматически прогружает все сообщения с самого начала диалога с защитой от лимитов запросов Discord (Rate Limit).
* **Ссылки на вложения:** сохраняет прямые ссылки на все прикреплённые картинки и файлы.
* **Без сторонних библиотек:** работает самостоятельно, не требует установки `ZeresPluginLibrary` и других зависимостей.

### 📥 Установка
1. Скачайте файл [`ChatExporterTXT.plugin.js`](https://githubusercontent.com) (нажмите правой кнопкой мыши → *Сохранить ссылку как...*).
2. В Discord откройте **Настройки пользователя** → **BetterDiscord** → **Плагины**.
3. Нажмите **Открыть папку плагинов** и перенесите туда скачанный файл.
4. Включите тумблер напротив **ChatExporterTXT** в списке плагинов.

### 🚀 Как пользоваться
1. Нажмите правой кнопкой мыши на нужный канал сервера или диалог в ЛС.
2. Выберите пункт **«Экспортировать чат в TXT»** (или **«Экспортировать ЛС в TXT»**).
3. Дождитесь завершения загрузки сообщений и выберите папку для сохранения `.txt` файла.

> ⚠️ **Важно:** автоматический сбор сообщений через пользовательский аккаунт формально нарушает правила использования Discord (Terms of Service). Не запускайте выгрузку сразу для большого количества каналов подряд.
