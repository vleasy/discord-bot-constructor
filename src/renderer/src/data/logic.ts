import type { BlockDefinition } from '../types'

export const logicBlocks: BlockDefinition[] = [
  {
    id: 'repeat_loop',
    type: 'logic',
    label: 'Повторить N раз',
    icon: 'repeat',
    color: '#A78BFA',
    description: 'Повторяет действия указанное количество раз',
    tags: ['цикл', 'повтор', 'for', 'loop'],
    fields: [
      { key: 'times', label: 'Сколько раз', type: 'number', defaultValue: 5 }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'for_each',
    type: 'logic',
    label: 'Для каждого',
    icon: 'list',
    color: '#A78BFA',
    description: 'Выполняет действия для каждого элемента из списка',
    tags: ['цикл', 'каждый', 'foreach', 'each'],
    fields: [
      { key: 'var_name', label: 'Элемент (переменная)', type: 'string', placeholder: 'item', defaultValue: '' },
      { key: 'list', label: 'Список (через запятую)', type: 'string', placeholder: 'a, b, c', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'while_loop',
    type: 'logic',
    label: 'Цикл (пока)',
    icon: 'rotate-ccw',
    color: '#A78BFA',
    description: 'Повторяет действия пока условие истинно (осторожно, бесконечный цикл!)',
    tags: ['цикл', 'пока', 'while', 'loop'],
    fields: [
      { key: 'max_iterations', label: 'Макс. итераций (защита)', type: 'number', defaultValue: 100 },
      { key: 'condition_desc', label: 'Описание условия', type: 'string', placeholder: 'пока переменная > 0', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'break_loop',
    type: 'logic',
    label: 'Прервать цикл',
    icon: 'stop-circle',
    color: '#A78BFA',
    description: 'Немедленно прерывает текущий цикл',
    tags: ['цикл', 'прервать', 'break'],
    fields: [],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'continue_loop',
    type: 'logic',
    label: 'Продолжить цикл',
    icon: 'skip-forward',
    color: '#A78BFA',
    description: 'Переходит к следующей итерации цикла',
    tags: ['цикл', 'продолжить', 'continue'],
    fields: [],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'switch_case',
    type: 'logic',
    label: 'Переключатель',
    icon: 'git-branch',
    color: '#A78BFA',
    description: 'Проверяет значение и выполняет соответствующую ветку (как switch)',
    tags: ['переключатель', 'switch', 'case', 'выбор'],
    fields: [
      { key: 'value', label: 'Переменная или значение', type: 'string', placeholder: 'myVar', defaultValue: '' },
      { key: 'case_a', label: 'Вариант A', type: 'string', placeholder: 'значение 1', defaultValue: '' },
      { key: 'case_b', label: 'Вариант B', type: 'string', placeholder: 'значение 2', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true,
    branches: ['case-a', 'case-b', 'default']
  },
  {
    id: 'try_catch',
    type: 'logic',
    label: 'Попробовать / Поймать ошибку',
    icon: 'alert-triangle',
    color: '#A78BFA',
    description: 'Пытается выполнить действие, а в случае ошибки выполняет другой блок',
    tags: ['ошибка', 'error', 'try', 'catch', 'исключение'],
    fields: [],
    hasInput: true,
    hasOutput: false,
    branches: ['try', 'catch']
  },
  {
    id: 'comment',
    type: 'logic',
    label: 'Комментарий',
    icon: 'message-circle',
    color: '#A78BFA',
    description: 'Добавляет заметку или пояснение (не влияет на код)',
    tags: ['комментарий', 'заметка', 'note'],
    fields: [
      { key: 'text', label: 'Текст комментария', type: 'string', placeholder: 'Пояснение...', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  },
  {
    id: 'return_block',
    type: 'logic',
    label: 'Вернуться / Остановить',
    icon: 'corner-up-left',
    color: '#A78BFA',
    description: 'Немедленно останавливает выполнение текущей цепочки',
    tags: ['стоп', 'остановить', 'return', 'выход'],
    fields: [],
    hasInput: true,
    hasOutput: false
  },
  {
    id: 'custom_code',
    type: 'logic',
    label: 'Свой код',
    icon: 'code',
    color: '#A78BFA',
    description: 'Напишите любой JavaScript код для максимальной гибкости',
    tags: ['код', 'js', 'свой', 'custom'],
    fields: [
      { key: 'code', label: 'JavaScript код', type: 'string', placeholder: '// Твой код здесь', defaultValue: '' }
    ],
    hasInput: true,
    hasOutput: true
  }
]
