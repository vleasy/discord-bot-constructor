import type { BlockDefinition } from '../types'

export const actions: BlockDefinition[] = [
  // ─── Сообщения ─────────────────────────────────
  {
    id: 'send_message',
    type: 'action',
    label: 'Отправить сообщение',
    icon: 'message-square',
    color: '#22D3EE',
    description: 'Отправляет сообщение в канал',
    tags: ['сообщение', 'чат', 'отправить', 'send'],
    fields: [
      { key: 'channel_id', label: 'ID канала или "current"', type: 'string', placeholder: 'current', defaultValue: 'current' },
      { key: 'text', label: 'Текст сообщения', type: 'string', placeholder: 'Привет мир!', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'reply',
    type: 'action',
    label: 'Ответить на сообщение',
    icon: 'corner-up-left',
    color: '#22D3EE',
    description: 'Отвечает на сообщение пользователя',
    tags: ['ответ', 'реплай', 'reply'],
    fields: [
      { key: 'text', label: 'Текст ответа', type: 'string', placeholder: 'Привет!', defaultValue: '' },
      { key: 'mention', label: 'Упомянуть пользователя', type: 'boolean', defaultValue: true }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'send_dm',
    type: 'action',
    label: 'Отправить в ЛС',
    icon: 'mail',
    color: '#22D3EE',
    description: 'Отправляет личное сообщение пользователю',
    tags: ['лс', 'личка', 'dm', 'private'],
    fields: [
      { key: 'target', label: 'Кому', type: 'select', defaultValue: 'author',
        options: [
          { label: 'Автору сообщения', value: 'author' },
          { label: 'Упомянутому пользователю', value: 'mentioned' }
        ]
      },
      { key: 'text', label: 'Текст сообщения', type: 'string', placeholder: 'Привет в ЛС!', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'edit_message',
    type: 'action',
    label: 'Изменить сообщение',
    icon: 'edit',
    color: '#22D3EE',
    description: 'Редактирует ранее отправленное сообщение',
    tags: ['редактировать', 'изменить', 'edit'],
    fields: [
      { key: 'message_id', label: 'ID сообщения', type: 'string', placeholder: '123456789', defaultValue: '' },
      { key: 'new_text', label: 'Новый текст', type: 'string', placeholder: 'Новый текст...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'delete_message',
    type: 'action',
    label: 'Удалить сообщение',
    icon: 'trash-2',
    color: '#22D3EE',
    description: 'Удаляет сообщение из канала',
    tags: ['удалить', 'delete'],
    fields: [
      { key: 'target', label: 'Какое сообщение', type: 'select', defaultValue: 'current',
        options: [
          { label: 'Текущее (вызвавшее)', value: 'current' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'message_id', label: 'ID сообщения (если по ID)', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'pin_message',
    type: 'action',
    label: 'Закрепить сообщение',
    icon: 'pin',
    color: '#22D3EE',
    description: 'Закрепляет сообщение в канале',
    tags: ['закрепить', 'pin'],
    fields: [
      { key: 'message_id', label: 'ID сообщения', type: 'string', placeholder: '123456789', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'react_message',
    type: 'action',
    label: 'Добавить реакцию',
    icon: 'smile-plus',
    color: '#22D3EE',
    description: 'Добавляет реакцию (эмодзи) к сообщению',
    tags: ['реакция', 'эмодзи', 'react'],
    fields: [
      { key: 'emoji', label: 'Эмодзи', type: 'string', placeholder: '✅', defaultValue: '✅' },
      { key: 'target', label: 'Куда', type: 'select', defaultValue: 'current',
        options: [
          { label: 'На текущее сообщение', value: 'current' },
          { label: 'По ID сообщения', value: 'by_id' }
        ]
      },
      { key: 'message_id', label: 'ID сообщения', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'create_embed',
    type: 'action',
    label: 'Создать Embed',
    icon: 'file-text',
    color: '#22D3EE',
    description: 'Создаёт и отправляет красивое встроенное сообщение',
    tags: ['embed', 'встраивание', 'карточка'],
    fields: [
      { key: 'title', label: 'Заголовок', type: 'string', placeholder: 'Заголовок', defaultValue: '' },
      { key: 'description', label: 'Описание', type: 'string', placeholder: 'Подробное описание', defaultValue: '' },
      { key: 'color', label: 'Цвет (hex)', type: 'string', placeholder: '#6366f1', defaultValue: '#6366f1' },
      { key: 'footer', label: 'Нижний текст', type: 'string', placeholder: '', defaultValue: '' },
      { key: 'image_url', label: 'URL изображения', type: 'string', placeholder: 'https://...', defaultValue: '' },
      { key: 'thumbnail_url', label: 'URL миниатюры', type: 'string', placeholder: 'https://...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'send_file',
    type: 'action',
    label: 'Отправить файл',
    icon: 'paperclip',
    color: '#22D3EE',
    description: 'Отправляет файл в канал',
    tags: ['файл', 'file', 'attachment'],
    fields: [
      { key: 'url', label: 'URL файла', type: 'string', placeholder: 'https://example.com/file.png', defaultValue: '' },
      { key: 'filename', label: 'Имя файла', type: 'string', placeholder: 'file.png', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  // ─── Модерация ─────────────────────────────────
  {
    id: 'kick',
    type: 'action',
    label: 'Кикнуть',
    icon: 'user-x',
    color: '#22D3EE',
    description: 'Выгоняет пользователя с сервера',
    tags: ['кик', 'kick', 'модерация'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' },
      { key: 'reason', label: 'Причина', type: 'string', placeholder: 'Нарушение правил', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'ban',
    type: 'action',
    label: 'Забанить',
    icon: 'ban',
    color: '#22D3EE',
    description: 'Банит пользователя на сервере',
    tags: ['бан', 'ban', 'модерация'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' },
      { key: 'reason', label: 'Причина', type: 'string', placeholder: 'Нарушение правил', defaultValue: '' },
      { key: 'delete_days', label: 'Удалить сообщений за (дней)', type: 'number', defaultValue: 0 }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'unban',
    type: 'action',
    label: 'Разбанить',
    icon: 'user-check',
    color: '#22D3EE',
    description: 'Снимает бан с пользователя',
    tags: ['разбан', 'unban'],
    fields: [
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '123456789', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'timeout',
    type: 'action',
    label: 'Тайм-аут',
    icon: 'clock',
    color: '#22D3EE',
    description: 'Выдаёт тайм-аут пользователю (не может писать)',
    tags: ['таймаут', 'mute', 'timeout', 'модерация'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' }
        ]
      },
      { key: 'duration', label: 'Длительность (секунд)', type: 'number', defaultValue: 60 },
      { key: 'reason', label: 'Причина', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'remove_timeout',
    type: 'action',
    label: 'Снять тайм-аут',
    icon: 'clock-off',
    color: '#22D3EE',
    description: 'Снимает тайм-аут с пользователя',
    tags: ['снять', 'таймаут', 'unmute'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'clear_messages',
    type: 'action',
    label: 'Очистить сообщения',
    icon: 'trash-2',
    color: '#22D3EE',
    description: 'Удаляет несколько сообщений из канала',
    tags: ['очистить', 'clear', 'purge', 'удалить'],
    fields: [
      { key: 'amount', label: 'Количество', type: 'number', defaultValue: 10 }
    ],
    hasInput: true,
    hasOutput: false
  },
  // ─── Роли ─────────────────────────────────
  {
    id: 'add_role',
    type: 'action',
    label: 'Выдать роль',
    icon: 'shield-plus',
    color: '#22D3EE',
    description: 'Выдаёт роль пользователю',
    tags: ['роль', 'выдать', 'role', 'add'],
    fields: [
      { key: 'target', label: 'Кому', type: 'select', defaultValue: 'author',
        options: [
          { label: 'Автору сообщения', value: 'author' },
          { label: 'Упомянутому пользователю', value: 'mentioned' }
        ]
      },
      { key: 'role_id', label: 'ID роли', type: 'string', placeholder: 'ID роли', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'remove_role',
    type: 'action',
    label: 'Снять роль',
    icon: 'shield-off',
    color: '#22D3EE',
    description: 'Забирает роль у пользователя',
    tags: ['роль', 'снять', 'role', 'remove'],
    fields: [
      { key: 'target', label: 'У кого', type: 'select', defaultValue: 'author',
        options: [
          { label: 'У автора сообщения', value: 'author' },
          { label: 'У упомянутого пользователя', value: 'mentioned' }
        ]
      },
      { key: 'role_id', label: 'ID роли', type: 'string', placeholder: 'ID роли', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'create_role',
    type: 'action',
    label: 'Создать роль',
    icon: 'shield-plus',
    color: '#22D3EE',
    description: 'Создаёт новую роль на сервере',
    tags: ['роль', 'создать', 'role', 'create'],
    fields: [
      { key: 'name', label: 'Название роли', type: 'string', placeholder: 'Новая роль', defaultValue: '' },
      { key: 'color', label: 'Цвет (hex)', type: 'string', placeholder: '#6366f1', defaultValue: '#6366f1' },
      { key: 'hoist', label: 'Отображать отдельно', type: 'boolean', defaultValue: false },
      { key: 'mentionable', label: 'Упоминаемая', type: 'boolean', defaultValue: false }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'delete_role',
    type: 'action',
    label: 'Удалить роль',
    icon: 'trash-2',
    color: '#22D3EE',
    description: 'Удаляет роль с сервера',
    tags: ['роль', 'удалить', 'role', 'delete'],
    fields: [
      { key: 'role_id', label: 'ID роли', type: 'string', placeholder: 'ID роли', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  // ─── Каналы ─────────────────────────────────
  {
    id: 'create_channel',
    type: 'action',
    label: 'Создать канал',
    icon: 'plus-square',
    color: '#22D3EE',
    description: 'Создаёт новый текстовый или голосовой канал',
    tags: ['канал', 'создать', 'channel'],
    fields: [
      { key: 'name', label: 'Название канала', type: 'string', placeholder: 'новый-канал', defaultValue: '' },
      { key: 'type', label: 'Тип', type: 'select', defaultValue: 'text',
        options: [
          { label: 'Текстовый', value: 'text' },
          { label: 'Голосовой', value: 'voice' },
          { label: 'Тред', value: 'thread' }
        ]
      },
      { key: 'category_id', label: 'ID категории (опционально)', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'delete_channel',
    type: 'action',
    label: 'Удалить канал',
    icon: 'minus-square',
    color: '#22D3EE',
    description: 'Удаляет канал с сервера',
    tags: ['канал', 'удалить', 'delete'],
    fields: [
      { key: 'channel_id', label: 'ID канала', type: 'string', placeholder: 'ID канала', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'edit_channel',
    type: 'action',
    label: 'Изменить канал',
    icon: 'edit',
    color: '#22D3EE',
    description: 'Изменяет название или тему канала',
    tags: ['канал', 'изменить', 'edit'],
    fields: [
      { key: 'channel_id', label: 'ID канала', type: 'string', placeholder: 'ID канала', defaultValue: '' },
      { key: 'name', label: 'Новое название', type: 'string', placeholder: '', defaultValue: '' },
      { key: 'topic', label: 'Новая тема (для текстовых)', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'create_thread',
    type: 'action',
    label: 'Создать тред',
    icon: 'git-branch',
    color: '#22D3EE',
    description: 'Создаёт ветку (тред) из сообщения',
    tags: ['тред', 'thread', 'ветка'],
    fields: [
      { key: 'name', label: 'Название треда', type: 'string', placeholder: 'Обсуждение', defaultValue: '' },
      { key: 'auto_archive', label: 'Автоархивация (минут)', type: 'number', defaultValue: 1440 }
    ],
    hasInput: true,
    hasOutput: true
  },
  // ─── Голосовой канал ────────────────────────
  {
    id: 'move_member',
    type: 'action',
    label: 'Переместить в голосовой канал',
    icon: 'move',
    color: '#22D3EE',
    description: 'Перемещает пользователя в другой голосовой канал',
    tags: ['голос', 'переместить', 'move', 'voice'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' },
      { key: 'channel_id', label: 'ID голосового канала', type: 'string', placeholder: 'ID канала', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'disconnect_member',
    type: 'action',
    label: 'Отключить от голосового канала',
    icon: 'volume-x',
    color: '#22D3EE',
    description: 'Отключает пользователя от голосового канала',
    tags: ['голос', 'отключить', 'disconnect'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'mute_member',
    type: 'action',
    label: 'Заглушить в голосовом канале',
    icon: 'mic-off',
    color: '#22D3EE',
    description: 'Отключает микрофон пользователя в голосовом канале',
    tags: ['голос', 'заглушить', 'mute', 'microphone'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'deafen_member',
    type: 'action',
    label: 'Заглушить звук (деафен)',
    icon: 'headphones-off',
    color: '#22D3EE',
    description: 'Отключает звук пользователя в голосовом канале',
    tags: ['голос', 'деафен', 'deafen', 'sound'],
    fields: [
      { key: 'target', label: 'Кого', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Упомянутого пользователя', value: 'mentioned' },
          { label: 'По ID', value: 'by_id' }
        ]
      },
      { key: 'user_id', label: 'ID пользователя', type: 'string', placeholder: '', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  // ─── Данные и переменные ─────────────────────
  {
    id: 'set_variable',
    type: 'action',
    label: 'Установить переменную',
    icon: 'save',
    color: '#22D3EE',
    description: 'Сохраняет значение в переменную для дальнейшего использования',
    tags: ['переменная', 'сохранить', 'variable'],
    fields: [
      { key: 'var_name', label: 'Имя переменной', type: 'string', placeholder: 'myVar', defaultValue: '' },
      { key: 'value', label: 'Значение', type: 'string', placeholder: 'Значение или {{arg}}', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'math_operation',
    type: 'action',
    label: 'Математическая операция',
    icon: 'calculator',
    color: '#22D3EE',
    description: 'Выполняет математическую операцию (+, -, *, /)',
    tags: ['математика', 'числа', 'math', 'операция'],
    fields: [
      { key: 'var_name', label: 'Сохранить в переменную', type: 'string', placeholder: 'result', defaultValue: '' },
      { key: 'a', label: 'Число A', type: 'string', placeholder: '5', defaultValue: '' },
      { key: 'operator', label: 'Операция', type: 'select', defaultValue: '+',
        options: [
          { label: 'Сложение (+)', value: '+' },
          { label: 'Вычитание (-)', value: '-' },
          { label: 'Умножение (*)', value: '*' },
          { label: 'Деление (/)', value: '/' },
          { label: 'Остаток (%)', value: '%' },
          { label: 'Степень (**)', value: '**' }
        ]
      },
      { key: 'b', label: 'Число B', type: 'string', placeholder: '3', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'string_operation',
    type: 'action',
    label: 'Операция со строкой',
    icon: 'type',
    color: '#22D3EE',
    description: 'Объединяет, обрезает или изменяет строки',
    tags: ['строка', 'текст', 'string', 'concat'],
    fields: [
      { key: 'var_name', label: 'Сохранить в переменную', type: 'string', placeholder: 'result', defaultValue: '' },
      { key: 'operation', label: 'Операция', type: 'select', defaultValue: 'concat',
        options: [
          { label: 'Соединить (concat)', value: 'concat' },
          { label: 'Верхний регистр', value: 'upper' },
          { label: 'Нижний регистр', value: 'lower' },
          { label: 'Обрезать (slice)', value: 'slice' },
          { label: 'Длина строки', value: 'length' },
          { label: 'Заменить (replace)', value: 'replace' }
        ]
      },
      { key: 'str_a', label: 'Строка A', type: 'string', placeholder: 'Привет', defaultValue: '' },
      { key: 'str_b', label: 'Строка B / аргумент', type: 'string', placeholder: 'Мир', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'fetch_request',
    type: 'action',
    label: 'HTTP запрос',
    icon: 'globe',
    color: '#22D3EE',
    description: 'Отправляет HTTP запрос и сохраняет результат',
    tags: ['http', 'запрос', 'api', 'fetch', 'web'],
    fields: [
      { key: 'url', label: 'URL', type: 'string', placeholder: 'https://api.example.com/data', defaultValue: '' },
      { key: 'method', label: 'Метод', type: 'select', defaultValue: 'GET',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' }
        ]
      },
      { key: 'body', label: 'Тело запроса (JSON)', type: 'string', placeholder: '{"key": "value"}', defaultValue: '' },
      { key: 'var_name', label: 'Сохранить ответ в переменную', type: 'string', placeholder: 'response', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'random_number',
    type: 'action',
    label: 'Случайное число',
    icon: 'dice-6',
    color: '#22D3EE',
    description: 'Генерирует случайное число в диапазоне',
    tags: ['случайно', 'рандом', 'random', 'число'],
    fields: [
      { key: 'var_name', label: 'Сохранить в переменную', type: 'string', placeholder: 'rand', defaultValue: '' },
      { key: 'min', label: 'Минимум', type: 'number', defaultValue: 1 },
      { key: 'max', label: 'Максимум', type: 'number', defaultValue: 100 }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'random_choice',
    type: 'action',
    label: 'Случайный выбор',
    icon: 'list',
    color: '#22D3EE',
    description: 'Выбирает случайный элемент из списка',
    tags: ['случайно', 'выбор', 'choice', 'random'],
    fields: [
      { key: 'var_name', label: 'Сохранить в переменную', type: 'string', placeholder: 'chosen', defaultValue: '' },
      { key: 'items', label: 'Варианты (через запятую)', type: 'string', placeholder: 'камень, ножницы, бумага', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  // ─── Музыка ─────────────────────────────────
  {
    id: 'play_music',
    type: 'action',
    label: 'Воспроизвести музыку',
    icon: 'music',
    color: '#22D3EE',
    description: 'Воспроизводит аудио с YouTube в голосовом канале',
    tags: ['музыка', 'play', 'audio', 'youtube'],
    fields: [
      { key: 'query', label: 'Название или URL', type: 'string', placeholder: 'Never Gonna Give You Up', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'stop_music',
    type: 'action',
    label: 'Остановить музыку',
    icon: 'square',
    color: '#22D3EE',
    description: 'Останавливает воспроизведение и очищает очередь',
    tags: ['музыка', 'стоп', 'stop'],
    fields: [],
    hasInput: true,
    hasOutput: false
  },
  // ─── Утилиты ─────────────────────────────────
  {
    id: 'set_bot_activity',
    type: 'action',
    label: 'Установить статус бота',
    icon: 'activity',
    color: '#22D3EE',
    description: 'Меняет статус (активность) бота',
    tags: ['статус', 'activity', 'статус'],
    fields: [
      { key: 'type', label: 'Тип', type: 'select', defaultValue: 'playing',
        options: [
          { label: 'Играет', value: 'playing' },
          { label: 'Смотрит', value: 'watching' },
          { label: 'Слушает', value: 'listening' },
          { label: 'Соревнуется', value: 'competing' }
        ]
      },
      { key: 'text', label: 'Текст', type: 'string', placeholder: '!help', defaultValue: '!help' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'set_nickname',
    type: 'action',
    label: 'Изменить никнейм',
    icon: 'user-plus',
    color: '#22D3EE',
    description: 'Меняет псевдоним (никнейм) пользователя на сервере',
    tags: ['ник', 'nickname', 'псевдоним'],
    fields: [
      { key: 'target', label: 'Кому', type: 'select', defaultValue: 'mentioned',
        options: [
          { label: 'Автору сообщения', value: 'author' },
          { label: 'Упомянутому пользователю', value: 'mentioned' }
        ]
      },
      { key: 'nickname', label: 'Новый никнейм', type: 'string', placeholder: 'Новый ник', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'wait',
    type: 'action',
    label: 'Ожидание',
    icon: 'hourglass',
    color: '#22D3EE',
    description: 'Приостанавливает выполнение на заданное время',
    tags: ['ждать', 'пауза', 'wait', 'delay', 'sleep'],
    fields: [
      { key: 'duration', label: 'Длительность (мс)', type: 'number', defaultValue: 1000 }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'log',
    type: 'action',
    label: 'Лог в консоль',
    icon: 'terminal',
    color: '#22D3EE',
    description: 'Выводит сообщение в консоль бота',
    tags: ['лог', 'консоль', 'log', 'debug'],
    fields: [
      { key: 'text', label: 'Текст лога', type: 'string', placeholder: 'Отладочная информация', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'command',
    type: 'action',
    label: 'Выполнить команду',
    icon: 'terminal-square',
    color: '#22D3EE',
    description: 'Выполняет Discord команду программно',
    tags: ['команда', 'выполнить', 'execute'],
    fields: [
      { key: 'command', label: 'Команда', type: 'string', placeholder: '!привет', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'run_code',
    type: 'action',
    label: 'Свой JavaScript код',
    icon: 'code',
    color: '#22D3EE',
    description: 'Позволяет написать произвольный JavaScript код',
    tags: ['код', 'js', 'javascript', 'свой'],
    fields: [
      { key: 'code', label: 'JavaScript код', type: 'string', placeholder: '// Ваш код...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  }
]
