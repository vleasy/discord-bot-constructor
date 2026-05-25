import type { BlockDefinition } from '../types'

export const triggers: BlockDefinition[] = [
  {
    id: 'on_ready',
    type: 'trigger',
    label: 'Бот готов',
    icon: 'power',
    color: '#FBBF24',
    description: 'Срабатывает когда бот запустился и готов к работе',
    tags: ['запуск', 'старт', 'ready'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_message',
    type: 'trigger',
    label: 'Получено сообщение',
    icon: 'message-circle',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то пишет сообщение',
    tags: ['сообщение', 'чат', 'message'],
    fields: [
      { key: 'contains', label: 'Содержит текст', type: 'string', placeholder: 'Оставить пустым для всех сообщений', defaultValue: '' },
      { key: 'in_channel', label: 'ID канала (опционально)', type: 'string', placeholder: 'ID канала', defaultValue: '' }
    ],
    hasInput: false,
    hasOutput: true,
    outputType: 'message'
  },
  {
    id: 'on_command',
    type: 'trigger',
    label: 'Команда',
    icon: 'terminal',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то использует команду с префиксом',
    tags: ['команда', 'префикс', 'command'],
    fields: [
      { key: 'command_name', label: 'Название команды', type: 'string', placeholder: 'например: привет', defaultValue: '' },
      { key: 'aliases', label: 'Псевдонимы (через запятую)', type: 'string', placeholder: 'хелп, help', defaultValue: '' }
    ],
    hasInput: false,
    hasOutput: true,
    outputType: 'message'
  },
  {
    id: 'on_join',
    type: 'trigger',
    label: 'Участник зашёл',
    icon: 'log-in',
    color: '#FBBF24',
    description: 'Срабатывает когда новый пользователь заходит на сервер',
    tags: ['вход', 'приветствие', 'join', 'member'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_leave',
    type: 'trigger',
    label: 'Участник вышел',
    icon: 'log-out',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователь покидает сервер',
    tags: ['выход', 'прощание', 'leave', 'member'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_reaction_add',
    type: 'trigger',
    label: 'Добавлена реакция',
    icon: 'smile-plus',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то добавляет реакцию к сообщению',
    tags: ['реакция', 'эмодзи', 'reaction'],
    fields: [
      { key: 'emoji', label: 'Эмодзи (опционально)', type: 'string', placeholder: '⭐', defaultValue: '' }
    ],
    hasInput: false,
    hasOutput: true,
    outputType: 'reaction'
  },
  {
    id: 'on_reaction_remove',
    type: 'trigger',
    label: 'Удалена реакция',
    icon: 'smile-minus',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то убирает реакцию с сообщения',
    tags: ['реакция', 'эмодзи', 'удаление'],
    fields: [
      { key: 'emoji', label: 'Эмодзи (опционально)', type: 'string', placeholder: '⭐', defaultValue: '' }
    ],
    hasInput: false,
    hasOutput: true,
    outputType: 'reaction'
  },
  {
    id: 'on_voice_join',
    type: 'trigger',
    label: 'Зашёл в голосовой канал',
    icon: 'volume-2',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователь заходит в голосовой канал',
    tags: ['голос', 'войс', 'voice', 'vc'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_voice_leave',
    type: 'trigger',
    label: 'Вышел из голосового канала',
    icon: 'volume-x',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователь выходит из голосового канала',
    tags: ['голос', 'войс', 'выход'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_voice_move',
    type: 'trigger',
    label: 'Перемещён в голосовом канале',
    icon: 'move',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователя перемещают между голосовыми каналами',
    tags: ['голос', 'перемещение'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_message_delete',
    type: 'trigger',
    label: 'Сообщение удалено',
    icon: 'trash-2',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то удаляет сообщение',
    tags: ['удаление', 'сообщение', 'delete'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'message'
  },
  {
    id: 'on_message_update',
    type: 'trigger',
    label: 'Сообщение изменено',
    icon: 'edit',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то редактирует сообщение',
    tags: ['изменение', 'редактирование', 'update'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'message'
  },
  {
    id: 'on_channel_create',
    type: 'trigger',
    label: 'Создан канал',
    icon: 'plus-square',
    color: '#FBBF24',
    description: 'Срабатывает когда создаётся новый канал',
    tags: ['канал', 'создание', 'channel'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_channel_delete',
    type: 'trigger',
    label: 'Удалён канал',
    icon: 'minus-square',
    color: '#FBBF24',
    description: 'Срабатывает когда удаляется канал',
    tags: ['канал', 'удаление', 'channel'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_role_create',
    type: 'trigger',
    label: 'Создана роль',
    icon: 'shield-plus',
    color: '#FBBF24',
    description: 'Срабатывает когда создаётся новая роль',
    tags: ['роль', 'создание', 'role'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_role_delete',
    type: 'trigger',
    label: 'Удалена роль',
    icon: 'shield-off',
    color: '#FBBF24',
    description: 'Срабатывает когда удаляется роль',
    tags: ['роль', 'удаление', 'role'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_ban',
    type: 'trigger',
    label: 'Участник забанен',
    icon: 'ban',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователя банит',
    tags: ['бан', 'наказание', 'ban'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'member'
  },
  {
    id: 'on_unban',
    type: 'trigger',
    label: 'Участник разбанен',
    icon: 'user-check',
    color: '#FBBF24',
    description: 'Срабатывает когда пользователя разбанивают',
    tags: ['разбан', 'unban'],
    fields: [],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_interaction',
    type: 'trigger',
    label: 'Взаимодействие',
    icon: 'mouse-pointer',
    color: '#FBBF24',
    description: 'Срабатывает при нажатии кнопки, выборе меню или отправке модального окна',
    tags: ['кнопка', 'меню', 'модалка', 'interaction', 'button', 'select'],
    fields: [
      { key: 'custom_id', label: 'Custom ID (опционально)', type: 'string', placeholder: 'my_button_1', defaultValue: '' },
      { key: 'interaction_type', label: 'Тип', type: 'select', defaultValue: 'any',
        options: [
          { label: 'Любой', value: 'any' },
          { label: 'Кнопка', value: 'button' },
          { label: 'Select Menu', value: 'select' },
          { label: 'Модальное окно', value: 'modal' }
        ]
      }
    ],
    hasInput: false,
    hasOutput: true
  },
  {
    id: 'on_typing',
    type: 'trigger',
    label: 'Начал печатать',
    icon: 'type',
    color: '#FBBF24',
    description: 'Срабатывает когда кто-то начинает печатать в канале',
    tags: ['печатает', 'typing'],
    fields: [],
    hasInput: false,
    hasOutput: true,
    outputType: 'message'
  },
  {
    id: 'on_thread_create',
    type: 'trigger',
    label: 'Создан тред',
    icon: 'git-branch',
    color: '#FBBF24',
    description: 'Срабатывает когда создаётся новый тред',
    tags: ['тред', 'thread', 'ветка'],
    fields: [],
    hasInput: false,
    hasOutput: true
  }
]
