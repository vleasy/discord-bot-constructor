# Discord Bot Constructor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33-blue)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org/)

Визуальный конструктор Discord ботов. Создавайте ботов без кода — соединяйте блоки на канвасе и генерируйте готовый код на Discord.js.

## Возможности

- **🎨 Визуальный редактор** — Drag-and-drop блоки, соединение линиями
- **📦 100+ блоков** — Триггеры, действия, условия, логические блоки
- **🔄 Генерация кода** — Экспорт в готовый Discord.js бот (JavaScript)
- **📂 Сохранение проектов** — Локальное сохранение и загрузка `.dubot.json`
- **🧩 3 готовых шаблона** — Ping-Pong, Welcome Message, Basic Moderation
- **🖥️ Electron приложение** — Работает на Windows

## Установка

### Готовый билд (Windows)
Скачайте последний релиз: [Releases](https://github.com/vleasy/discord-bot-constructor/releases)

### Из исходников
```bash
git clone https://github.com/vleasy/discord-bot-constructor.git
cd discord-bot-constructor
npm install
npm run dev
```

## Как пользоваться

1. **Выберите шаблон** или начните с чистого листа
2. **Перетащите блоки** из левой панели на канвас
3. **Соедините блоки** через выходные/входные порты
4. **Настройте параметры** в правой панели
5. **Нажмите Export** для генерации и скачивания бота

### Типы блоков

| Тип | Цвет | Описание |
|-----|------|----------|
| ⚡ Триггеры | Жёлтый | События (ready, сообщение, команда, join и др.) |
| ▶️ Действия | Голубой | Отправка сообщений, модерация, роли, каналы |
| 🔀 Условия | Красный | Проверки (permission, роль, шанс и др.) |
| 🪄 Логика | Фиолетовый | Циклы, switch, try/catch, переменные |

## Технологии

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Flow Editor:** [@xyflow/react](https://reactflow.dev/) v12
- **State:** Zustand v5
- **Desktop:** Electron 33 + electron-vite
- **Icons:** Lucide React
- **Генерация:** Discord.js v14 (CommonJS)

## Структура проекта

```
discord-bot-constructor/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Window creation, menu
│   │   ├── ipc.ts         # IPC handlers
│   │   ├── project-manager.ts  # CRUD projects
│   │   └── bot-manager.ts      # Bot lifecycle
│   ├── preload/           # Context bridge
│   └── renderer/          # React UI
│       └── src/
│           ├── types/     # TypeScript types
│           ├── data/      # Block definitions + templates
│           ├── store/     # Zustand stores
│           ├── components/ # UI components
│           ├── nodes/     # Custom flow nodes
│           ├── edges/     # Custom flow edges
│           └── generators/ # Code generation
├── projects/              # Saved projects
├── templates/             # Generator templates
└── resources/             # App resources
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка renderer + main |
| `npm run build:win` | Сборка + NSIS установщик |
| `npm run preview` | Превью production сборки |

## Лицензия

MIT
