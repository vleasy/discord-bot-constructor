import type { BlockDefinition } from '../types'

export const conditions: BlockDefinition[] = [
  {
    id: 'has_permission',
    type: 'condition',
    label: 'Имеет разрешение',
    icon: 'shield-check',
    color: '#F87171',
    description: 'Проверяет есть ли у пользователя определённое разрешение',
    tags: ['разрешение', 'пермишен', 'permission'],
    fields: [
      { key: 'permission', label: 'Название разрешения', type: 'string', placeholder: 'kick_members', defaultValue: '' },
      { key: 'target', label: 'У кого', type: 'select', defaultValue: 'author',
        options: [
          { label: 'У автора сообщения', value: 'author' },
          { label: 'У упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'has_role',
    type: 'condition',
    label: 'Имеет роль',
    icon: 'shield',
    color: '#F87171',
    description: 'Проверяет есть ли у пользователя определённая роль',
    tags: ['роль', 'проверка', 'role'],
    fields: [
      { key: 'role_id', label: 'ID роли', type: 'string', placeholder: 'ID роли', defaultValue: '' },
      { key: 'target', label: 'У кого', type: 'select', defaultValue: 'author',
        options: [
          { label: 'У автора сообщения', value: 'author' },
          { label: 'У упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'has_any_role',
    type: 'condition',
    label: 'Имеет одну из ролей',
    icon: 'shields',
    color: '#F87171',
    description: 'Проверяет есть ли у пользователя хотя бы одна из указанных ролей',
    tags: ['роль', 'роли', 'любая', 'any role'],
    fields: [
      { key: 'role_ids', label: 'ID ролей (через запятую)', type: 'string', placeholder: '123, 456, 789', defaultValue: '' },
      { key: 'target', label: 'У кого', type: 'select', defaultValue: 'author',
        options: [
          { label: 'У автора сообщения', value: 'author' },
          { label: 'У упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'is_bot',
    type: 'condition',
    label: 'Является ботом',
    icon: 'bot',
    color: '#F87171',
    description: 'Проверяет является ли пользователь ботом',
    tags: ['бот', 'проверка', 'bot'],
    fields: [
      { key: 'target', label: 'Кого проверяем', type: 'select', defaultValue: 'author',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'is_dm',
    type: 'condition',
    label: 'В личных сообщениях',
    icon: 'mail',
    color: '#F87171',
    description: 'Проверяет отправлено ли сообщение в ЛС боту',
    tags: ['лс', 'личка', 'dm', 'direct'],
    fields: [],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'in_channel_type',
    type: 'condition',
    label: 'Тип канала',
    icon: 'layout',
    color: '#F87171',
    description: 'Проверяет тип канала (текст, голос, форум)',
    tags: ['канал', 'тип', 'channel', 'type'],
    fields: [
      { key: 'channel_type', label: 'Тип канала', type: 'select', defaultValue: 'text',
        options: [
          { label: 'Текстовый', value: 'text' },
          { label: 'Голосовой', value: 'voice' },
          { label: 'Форум', value: 'forum' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'has_attachment',
    type: 'condition',
    label: 'Есть вложение',
    icon: 'paperclip',
    color: '#F87171',
    description: 'Проверяет есть ли у сообщения вложенный файл',
    tags: ['вложение', 'файл', 'attachment', 'file'],
    fields: [],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'message_contains',
    type: 'condition',
    label: 'Сообщение содержит',
    icon: 'search',
    color: '#F87171',
    description: 'Проверяет содержит ли сообщение указанный текст',
    tags: ['содержит', 'текст', 'contains', 'message'],
    fields: [
      { key: 'text', label: 'Искомый текст', type: 'string', placeholder: 'ключевое слово', defaultValue: '' },
      { key: 'case_sensitive', label: 'Учитывать регистр', type: 'boolean', defaultValue: false }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'string_equals',
    type: 'condition',
    label: 'Строка равна',
    icon: 'equal',
    color: '#F87171',
    description: 'Проверяет равна ли строка указанному значению',
    tags: ['строка', 'равно', 'equals', 'string'],
    fields: [
      { key: 'var_name', label: 'Переменная или значение', type: 'string', placeholder: 'myVar', defaultValue: '' },
      { key: 'value', label: 'С чем сравнить', type: 'string', placeholder: 'hello', defaultValue: '' },
      { key: 'case_sensitive', label: 'Учитывать регистр', type: 'boolean', defaultValue: true }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'number_compare',
    type: 'condition',
    label: 'Сравнить числа',
    icon: 'bar-chart',
    color: '#F87171',
    description: 'Сравнивает два числа',
    tags: ['числа', 'сравнить', 'compare', 'number'],
    fields: [
      { key: 'a', label: 'Число A', type: 'string', placeholder: '5', defaultValue: '' },
      { key: 'operator', label: 'Оператор', type: 'select', defaultValue: '>',
        options: [
          { label: 'Больше (>)', value: '>' },
          { label: 'Меньше (<)', value: '<' },
          { label: 'Равно (==)', value: '==' },
          { label: 'Больше или равно (>=)', value: '>=' },
          { label: 'Меньше или равно (<=)', value: '<=' }
        ]
      },
      { key: 'b', label: 'Число B', type: 'string', placeholder: '3', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'string_length',
    type: 'condition',
    label: 'Длина строки',
    icon: 'ruler',
    color: '#F87171',
    description: 'Проверяет длину строки',
    tags: ['длина', 'строка', 'length'],
    fields: [
      { key: 'value', label: 'Строка или переменная', type: 'string', placeholder: 'myVar', defaultValue: '' },
      { key: 'operator', label: 'Оператор', type: 'select', defaultValue: '>',
        options: [
          { label: 'Больше (>)', value: '>' },
          { label: 'Меньше (<)', value: '<' },
          { label: 'Равно (==)', value: '==' }
        ]
      },
      { key: 'length', label: 'Длина', type: 'number', defaultValue: 10 }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'in_voice',
    type: 'condition',
    label: 'В голосовом канале',
    icon: 'volume-2',
    color: '#F87171',
    description: 'Проверяет находится ли пользователь в голосовом канале',
    tags: ['голос', 'войс', 'voice', 'check'],
    fields: [
      { key: 'target', label: 'Кого проверить', type: 'select', defaultValue: 'author',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'is_null',
    type: 'condition',
    label: 'Переменная пуста',
    icon: 'box',
    color: '#F87171',
    description: 'Проверяет является ли значение пустым (null/undefined/пустая строка)',
    tags: ['пусто', 'null', 'проверка'],
    fields: [
      { key: 'var_name', label: 'Имя переменной', type: 'string', placeholder: 'myVar', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'member_boost',
    type: 'condition',
    label: 'Бустит сервер',
    icon: 'zap',
    color: '#F87171',
    description: 'Проверяет бустит ли пользователь сервер',
    tags: ['буст', 'boost', 'нитро'],
    fields: [
      { key: 'target', label: 'Кого проверить', type: 'select', defaultValue: 'author',
        options: [
          { label: 'Автора сообщения', value: 'author' },
          { label: 'Упомянутого пользователя', value: 'mentioned' }
        ]
      }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'random_chance',
    type: 'condition',
    label: 'Случайный шанс',
    icon: 'dice-6',
    color: '#F87171',
    description: 'Случайный шанс в процентах',
    tags: ['случайно', 'шанс', 'random', 'chance'],
    fields: [
      { key: 'percent', label: 'Шанс (%)', type: 'number', defaultValue: 50 }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'cooldown',
    type: 'condition',
    label: 'Кулдаун',
    icon: 'clock',
    color: '#F87171',
    description: 'Проверяет прошло ли достаточно времени для повторного использования',
    tags: ['кулдаун', 'задержка', 'cooldown', 'limit'],
    fields: [
      { key: 'key', label: 'Название (ключ)', type: 'string', placeholder: 'команда', defaultValue: '' },
      { key: 'duration', label: 'Длительность (секунд)', type: 'number', defaultValue: 10 }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'compare_variable',
    type: 'condition',
    label: 'Сравнить переменную',
    icon: 'equal',
    color: '#F87171',
    description: 'Сравнивает значение переменной с указанным',
    tags: ['переменная', 'сравнить', 'variable', 'compare'],
    fields: [
      { key: 'var_name', label: 'Имя переменной', type: 'string', placeholder: 'myVar', defaultValue: '' },
      { key: 'operator', label: 'Оператор', type: 'select', defaultValue: '==',
        options: [
          { label: 'Равно (==)', value: '==' },
          { label: 'Не равно (!=)', value: '!=' },
          { label: 'Больше (>)', value: '>' },
          { label: 'Меньше (<)', value: '<' }
        ]
      },
      { key: 'value', label: 'Значение', type: 'string', placeholder: '10', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'and_condition',
    type: 'condition',
    label: 'И (AND)',
    icon: 'git-merge',
    color: '#F87171',
    description: 'Объединяет условия: все должны быть истиной (И)',
    tags: ['и', 'and', 'логика', '&&'],
    fields: [
      { key: 'condition_a', label: 'Условие A (описание)', type: 'string', placeholder: 'имеет роль...', defaultValue: '' },
      { key: 'condition_b', label: 'Условие B (описание)', type: 'string', placeholder: 'имеет пермишен...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'or_condition',
    type: 'condition',
    label: 'ИЛИ (OR)',
    icon: 'git-fork',
    color: '#F87171',
    description: 'Объединяет условия: хотя бы одно должно быть истиной (ИЛИ)',
    tags: ['или', 'or', 'логика', '||'],
    fields: [
      { key: 'condition_a', label: 'Условие A (описание)', type: 'string', placeholder: 'есть роль А...', defaultValue: '' },
      { key: 'condition_b', label: 'Условие B (описание)', type: 'string', placeholder: 'есть роль B...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  },
  {
    id: 'not_condition',
    type: 'condition',
    label: 'НЕ (NOT)',
    icon: 'toggle-left',
    color: '#F87171',
    description: 'Инвертирует условие: true → false, false → true',
    tags: ['не', 'not', 'инверсия', 'логика'],
    fields: [],
    hasInput: true,
    hasOutput: false,
    branches: ['true', 'false']
  }
]
