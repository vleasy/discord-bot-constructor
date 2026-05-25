import type { Node, Edge } from '@xyflow/react'
import { getBlockById } from '../data'

function buildGraph(nodes: Node[], edges: Edge[]) {
  const edgeMap = new Map<string, Edge[]>()
  for (const edge of edges) {
    const list = edgeMap.get(edge.source) || []
    list.push(edge)
    edgeMap.set(edge.source, list)
  }
  const nodeMap = new Map<string, Node>()
  for (const node of nodes) nodeMap.set(node.id, node)
  return { edgeMap, nodeMap }
}

function getNextAction(nodeId: string, sourceHandle: string | undefined, edgeMap: Map<string, Edge[]>): string | null {
  const outgoing = edgeMap.get(nodeId) || []
  const match = outgoing.find(
    (e) => (e.sourceHandle || 'output') === (sourceHandle || 'output')
  )
  return match?.target || null
}

function indent(level: number): string {
  return '  '.repeat(level)
}

let varCounter = 0
function uid(): string {
  return `${++varCounter}`
}

function escapeJS(str: string): string {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '')
}

function generateTriggerHandler(node: Node, nodeMap: Map<string, Node>, edgeMap: Map<string, Edge[]>, visited: Set<string>, depth: number): string {
  if (visited.has(node.id)) return ''
  visited.add(node.id)

  const def = getBlockById(node.data.definitionId)
  if (!def) return ''
  const props = node.data.properties || {}
  const code: string[] = []

  switch (def.id) {
    case 'on_ready':
      code.push(`${indent(depth)}client.on('ready', async () => {`)
      break
    case 'on_message':
      code.push(`${indent(depth)}client.on('messageCreate', async (message) => {`)
      code.push(`${indent(depth + 1)}if (message.author.bot) return;`)
      if (props.contains) {
        const c = props.case_sensitive ? String(props.contains) : String(props.contains).toLowerCase()
        const method = props.case_sensitive ? 'includes' : 'toLowerCase().includes'
        code.push(`${indent(depth + 1)}if (!message.content.${method}('${escapeJS(c)}')) return;`)
      }
      if (props.in_channel) {
        code.push(`${indent(depth + 1)}if (message.channel.id !== '${props.in_channel}') return;`)
      }
      break
    case 'on_command':
      code.push(`${indent(depth)}client.on('messageCreate', async (message) => {`)
      code.push(`${indent(depth + 1)}if (message.author.bot) return;`)
      code.push(`${indent(depth + 1)}if (!message.content.startsWith(prefix)) return;`)
      code.push(`${indent(depth + 1)}const args = message.content.slice(prefix.length).trim().split(/ +/);`)
      code.push(`${indent(depth + 1)}const cmd = args.shift().toLowerCase();`)
      const cmdNames = [props.command_name, ...(props.aliases ? String(props.aliases).split(',').map((a: string) => a.trim()) : [])].filter(Boolean)
      if (cmdNames.length > 0) {
        code.push(`${indent(depth + 1)}if (!['${cmdNames.join("', '")}'].includes(cmd)) return;`)
      }
      break
    case 'on_join':
      code.push(`${indent(depth)}client.on('guildMemberAdd', async (member) => {`)
      break
    case 'on_leave':
      code.push(`${indent(depth)}client.on('guildMemberRemove', async (member) => {`)
      break
    case 'on_reaction_add':
      code.push(`${indent(depth)}client.on('messageReactionAdd', async (reaction, user) => {`)
      if (props.emoji) code.push(`${indent(depth + 1)}if (reaction.emoji.name !== '${props.emoji}') return;`)
      break
    case 'on_reaction_remove':
      code.push(`${indent(depth)}client.on('messageReactionRemove', async (reaction, user) => {`)
      if (props.emoji) code.push(`${indent(depth + 1)}if (reaction.emoji.name !== '${props.emoji}') return;`)
      break
    case 'on_voice_join':
      code.push(`${indent(depth)}client.on('voiceStateUpdate', (oldState, newState) => {`)
      code.push(`${indent(depth + 1)}if (oldState.channelId === null && newState.channelId) {`)
      code.push(`${indent(depth + 2)}const member = newState.member;`)
      break
    case 'on_voice_leave':
      code.push(`${indent(depth)}client.on('voiceStateUpdate', (oldState, newState) => {`)
      code.push(`${indent(depth + 1)}if (oldState.channelId && newState.channelId === null) {`)
      code.push(`${indent(depth + 2)}const member = oldState.member;`)
      break
    case 'on_voice_move':
      code.push(`${indent(depth)}client.on('voiceStateUpdate', (oldState, newState) => {`)
      code.push(`${indent(depth + 1)}if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {`)
      code.push(`${indent(depth + 2)}const member = newState.member;`)
      break
    case 'on_message_delete':
      code.push(`${indent(depth)}client.on('messageDelete', async (message) => {`)
      break
    case 'on_message_update':
      code.push(`${indent(depth)}client.on('messageUpdate', async (oldMessage, newMessage) => {`)
      code.push(`${indent(depth + 1)}if (oldMessage.content === newMessage.content) return;`)
      break
    case 'on_channel_create':
      code.push(`${indent(depth)}client.on('channelCreate', async (channel) => {`)
      break
    case 'on_channel_delete':
      code.push(`${indent(depth)}client.on('channelDelete', async (channel) => {`)
      break
    case 'on_role_create':
      code.push(`${indent(depth)}client.on('roleCreate', async (role) => {`)
      break
    case 'on_role_delete':
      code.push(`${indent(depth)}client.on('roleDelete', async (role) => {`)
      break
    case 'on_ban':
      code.push(`${indent(depth)}client.on('guildBanAdd', async (ban) => {`)
      break
    case 'on_unban':
      code.push(`${indent(depth)}client.on('guildBanRemove', async (ban) => {`)
      break
    case 'on_slash_command':
      code.push(`${indent(depth)}client.on('interactionCreate', async (interaction) => {`)
      code.push(`${indent(depth + 1)}if (!interaction.isChatInputCommand()) return;`)
      if (props.name) code.push(`${indent(depth + 1)}if (interaction.commandName !== '${escapeJS(String(props.name))}') return;`)
      break
    case 'on_interaction':
      code.push(`${indent(depth)}client.on('interactionCreate', async (interaction) => {`)
      if (props.interaction_type && props.interaction_type !== 'any') {
        const typeCheck = props.interaction_type === 'button' ? 'interaction.isButton()' :
          props.interaction_type === 'select' ? 'interaction.isStringSelectMenu()' :
          props.interaction_type === 'modal' ? 'interaction.isModalSubmit()' : ''
        if (typeCheck) code.push(`${indent(depth + 1)}if (!${typeCheck}) return;`)
      }
      if (props.custom_id) code.push(`${indent(depth + 1)}if (interaction.customId !== '${props.custom_id}') return;`)
      break
    case 'on_typing':
      code.push(`${indent(depth)}client.on('typingStart', async (typing) => {`)
      break
    case 'on_thread_create':
      code.push(`${indent(depth)}client.on('threadCreate', async (thread) => {`)
      break
    default:
      return ''
  }

  const nextId = getNextAction(node.id, 'output', edgeMap)
  if (nextId) {
    const vars = new Set<string>()
    const nextCode = generateActionChain(nextId, nodeMap, edgeMap, visited, depth + 1, vars)
    code.push(nextCode)
  }

  // Close extra braces for nested trigger scopes
  if (['on_voice_join', 'on_voice_leave', 'on_voice_move'].includes(def.id)) {
    code.push(`${indent(depth + 1)}})`)
  }

  code.push(`${indent(depth)}});`)
  return code.join('\n')
}

function getTargetCode(target: string, uid: string, props: Record<string, any>): string[] {
  const lines: string[] = []
  if (target === 'mentioned') {
    lines.push(`const target${uid} = message.mentions.members?.first() || message.mentions.users?.first();`)
  } else if (target === 'author') {
    lines.push(`const target${uid} = message.member || message.author;`)
  } else if (target === 'by_id' && props.user_id) {
    lines.push(`const target${uid} = await message.guild?.members.fetch('${props.user_id}').catch(() => null);`)
  }
  lines.push(`if (!target${uid}) return;`)
  return lines
}

function generateActionChain(
  nodeId: string,
  nodeMap: Map<string, Node>,
  edgeMap: Map<string, Edge[]>,
  visited: Set<string>,
  depth: number,
  vars: Set<string>
): string {
  if (!nodeId || visited.has(nodeId)) return ''
  const node = nodeMap.get(nodeId)
  if (!node) return ''

  const def = getBlockById(node.data.definitionId)
  if (!def) return ''

  visited.add(nodeId)
  const props = node.data.properties || {}
  const code: string[] = []
  const __uid = uid()

  switch (def.id) {
    case 'reply':
      code.push(`${indent(depth)}await message.reply({ content: '${escapeJS(String(props.text))}'${props.mention === false ? ', allowedMentions: { repliedUser: false }' : ''} });`)
      break
    case 'send_message':
      if (props.channel_id === 'current' || !props.channel_id) {
        code.push(`${indent(depth)}await message.channel.send('${escapeJS(String(props.text))}');`)
      } else {
        code.push(`${indent(depth)}const ch${__uid} = await client.channels.fetch('${props.channel_id}');`)
        code.push(`${indent(depth)}if (ch${__uid}) await ch${__uid}.send('${escapeJS(String(props.text))}');`)
      }
      break
    case 'send_dm':
      code.push(...getTargetCode(String(props.target), __uid, props))
      code.push(`${indent(depth)}await target${__uid}.send('${escapeJS(String(props.text))}');`)
      break
    case 'edit_message':
      code.push(`${indent(depth)}const msg${__uid} = await message.channel.messages.fetch('${props.message_id || '000'}').catch(() => null);`)
      code.push(`${indent(depth)}if (msg${__uid}) await msg${__uid}.edit('${escapeJS(String(props.new_text))}');`)
      break
    case 'delete_message':
      if (props.target === 'by_id' && props.message_id) {
        code.push(`${indent(depth)}const dmsg${__uid} = await message.channel.messages.fetch('${props.message_id}').catch(() => null);`)
        code.push(`${indent(depth)}if (dmsg${__uid}) await dmsg${__uid}.delete();`)
      } else {
        code.push(`${indent(depth)}await message.delete().catch(() => {});`)
      }
      break
    case 'pin_message':
      code.push(`${indent(depth)}const pmsg${__uid} = await message.channel.messages.fetch('${props.message_id || '000'}').catch(() => null);`)
      code.push(`${indent(depth)}if (pmsg${__uid}) await pmsg${__uid}.pin();`)
      break
    case 'react_message':
      if (props.target === 'by_id' && props.message_id) {
        code.push(`${indent(depth)}const rmsg${__uid} = await message.channel.messages.fetch('${props.message_id}').catch(() => null);`)
        code.push(`${indent(depth)}if (rmsg${__uid}) await rmsg${__uid}.react('${escapeJS(String(props.emoji || '✅'))}');`)
      } else {
        code.push(`${indent(depth)}await message.react('${escapeJS(String(props.emoji || '✅'))}');`)
      }
      break
    case 'create_embed': {
      code.push(`${indent(depth)}const embed${__uid} = {`)
      if (props.title) code.push(`${indent(depth + 1)}title: '${escapeJS(String(props.title))}',`)
      if (props.description) code.push(`${indent(depth + 1)}description: '${escapeJS(String(props.description))}',`)
      if (props.color) code.push(`${indent(depth + 1)}color: parseInt('${String(props.color).replace('#', '')}', 16),`)
      if (props.footer) code.push(`${indent(depth + 1)}footer: { text: '${escapeJS(String(props.footer))}' },`)
      if (props.image_url) code.push(`${indent(depth + 1)}image: { url: '${props.image_url}' },`)
      if (props.thumbnail_url) code.push(`${indent(depth + 1)}thumbnail: { url: '${props.thumbnail_url}' },`)
      code.push(`${indent(depth)}};`)
      code.push(`${indent(depth)}await message.channel.send({ embeds: [embed${__uid}] });`)
      break
    }
    case 'send_file':
      code.push(`${indent(depth)}await message.channel.send({ files: ['${props.url || ''}'] });`)
      break
    case 'kick':
      code.push(...getTargetCode(String(props.target), __uid, props))
      code.push(`${indent(depth)}await target${__uid}.kick('${escapeJS(String(props.reason || ''))}');`)
      break
    case 'ban':
      code.push(...getTargetCode(String(props.target), __uid, props))
      code.push(`${indent(depth)}await target${__uid}.ban({ days: ${props.delete_days || 0}, reason: '${escapeJS(String(props.reason || ''))}' });`)
      break
    case 'unban':
      code.push(`${indent(depth)}await message.guild?.bans.remove('${props.user_id || '000'}');`)
      break
    case 'timeout':
      code.push(...getTargetCode(String(props.target), __uid, props))
      code.push(`${indent(depth)}await target${__uid}.timeout(${(props.duration || 60) * 1000}, '${escapeJS(String(props.reason || ''))}');`)
      break
    case 'remove_timeout':
      if (String(props.target) === 'by_id' && props.user_id) {
        code.push(`${indent(depth)}const rm${__uid} = await message.guild?.members.fetch('${props.user_id}').catch(() => null);`)
        code.push(`${indent(depth)}if (rm${__uid}) await rm${__uid}.timeout(null);`)
      } else {
        code.push(`${indent(depth)}const rm${__uid} = message.mentions.members?.first();`)
        code.push(`${indent(depth)}if (rm${__uid}) await rm${__uid}.timeout(null);`)
      }
      break
    case 'clear_messages':
      code.push(`${indent(depth)}await message.channel.bulkDelete(${props.amount || 10}, true);`)
      break
    case 'add_role': {
      const rcode: string[] = []
      if (String(props.target) === 'mentioned') {
        rcode.push(`${indent(depth)}const mem${__uid} = message.mentions.members?.first() || message.member;`)
      } else {
        rcode.push(`${indent(depth)}const mem${__uid} = message.member;`)
      }
      rcode.push(`${indent(depth)}if (mem${__uid}) {`)
      rcode.push(`${indent(depth + 1)}const r${__uid} = message.guild?.roles.cache.get('${props.role_id}');`)
      rcode.push(`${indent(depth + 1)}if (r${__uid}) await mem${__uid}.roles.add(r${__uid});`)
      rcode.push(`${indent(depth)}}`)
      code.push(...rcode)
      break
    }
    case 'remove_role': {
      const rcode: string[] = []
      if (String(props.target) === 'mentioned') {
        rcode.push(`${indent(depth)}const mem${__uid} = message.mentions.members?.first() || message.member;`)
      } else {
        rcode.push(`${indent(depth)}const mem${__uid} = message.member;`)
      }
      rcode.push(`${indent(depth)}if (mem${__uid}) {`)
      rcode.push(`${indent(depth + 1)}const r${__uid} = message.guild?.roles.cache.get('${props.role_id}');`)
      rcode.push(`${indent(depth + 1)}if (r${__uid}) await mem${__uid}.roles.remove(r${__uid});`)
      rcode.push(`${indent(depth)}}`)
      code.push(...rcode)
      break
    }
    case 'create_role':
      code.push(`${indent(depth)}const nr${__uid} = await message.guild?.roles.create({`)
      if (props.name) code.push(`${indent(depth + 1)}name: '${escapeJS(String(props.name))}',`)
      if (props.color) code.push(`${indent(depth + 1)}color: parseInt('${String(props.color).replace('#', '')}', 16),`)
      code.push(`${indent(depth + 1)}hoist: ${!!props.hoist},`)
      code.push(`${indent(depth + 1)}mentionable: ${!!props.mentionable}`)
      code.push(`${indent(depth)}});`)
      break
    case 'delete_role':
      code.push(`${indent(depth)}const dr${__uid} = message.guild?.roles.cache.get('${props.role_id || ''}');`)
      code.push(`${indent(depth)}if (dr${__uid}) await dr${__uid}.delete();`)
      break
    case 'create_channel':
      code.push(`${indent(depth)}const nc${__uid} = await message.guild?.channels.create({`)
      if (props.name) code.push(`${indent(depth + 1)}name: '${String(props.name).toLowerCase().replace(/[^a-z0-9-]/g, '-')}',`)
      const chType = props.type === 'voice' ? 'ChannelType.GuildVoice' : props.type === 'thread' ? 'ChannelType.GuildPublicThread' : 'ChannelType.GuildText'
      code.push(`${indent(depth + 1)}type: ${chType},`)
      if (props.category_id) code.push(`${indent(depth + 1)}parent: '${props.category_id}',`)
      code.push(`${indent(depth)}});`)
      break
    case 'delete_channel':
      code.push(`${indent(depth)}const dc${__uid} = await client.channels.fetch('${props.channel_id || '000'}').catch(() => null);`)
      code.push(`${indent(depth)}if (dc${__uid}) await dc${__uid}.delete();`)
      break
    case 'edit_channel':
      code.push(`${indent(depth)}const ec${__uid} = await client.channels.fetch('${props.channel_id || '000'}').catch(() => null);`)
      code.push(`${indent(depth)}if (ec${__uid}) await ec${__uid}.edit({ name: '${String(props.name || '').toLowerCase().replace(/[^a-z0-9-]/g, '-')}', topic: '${escapeJS(String(props.topic || ''))}' });`)
      break
    case 'create_thread':
      code.push(`${indent(depth)}const thr${__uid} = await message.channel.threads.create({`)
      if (props.name) code.push(`${indent(depth + 1)}name: '${escapeJS(String(props.name))}',`)
      code.push(`${indent(depth + 1)}autoArchiveDuration: ${props.auto_archive || 1440}`)
      code.push(`${indent(depth)}});`)
      break
    case 'move_member':
      code.push(`${indent(depth)}const mm${__uid} = message.mentions.members?.first();`)
      code.push(`${indent(depth)}if (mm${__uid}) await mm${__uid}.voice.setChannel('${props.channel_id || ''}');`)
      break
    case 'disconnect_member':
      code.push(`${indent(depth)}const dm${__uid} = message.mentions.members?.first();`)
      code.push(`${indent(depth)}if (dm${__uid}) await dm${__uid}.voice.disconnect();`)
      break
    case 'mute_member':
      code.push(`${indent(depth)}const mt${__uid} = message.mentions.members?.first();`)
      code.push(`${indent(depth)}if (mt${__uid}) await mt${__uid}.voice.setMute(true);`)
      break
    case 'deafen_member':
      code.push(`${indent(depth)}const df${__uid} = message.mentions.members?.first();`)
      code.push(`${indent(depth)}if (df${__uid}) await df${__uid}.voice.setDeaf(true);`)
      break
    case 'set_variable': {
      const varName = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `var${__uid}`
      code.push(`${indent(depth)}const ${varName} = '${escapeJS(String(props.value))}';`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${varName};`)
      vars.add(varName)
      break
    }
    case 'math_operation': {
      const op = String(props.operator) || '+'
      const targetVar = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `math${__uid}`
      code.push(`${indent(depth)}const ${targetVar} = (${String(props.a || 0)}) ${op} (${String(props.b || 0)});`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${targetVar};`)
      break
    }
    case 'string_operation': {
      const targetVar = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `str${__uid}`
      const op = String(props.operation)
      const a = `'${escapeJS(String(props.str_a))}'`
      const b = `'${escapeJS(String(props.str_b))}'`
      let expr = ''
      switch (op) {
        case 'concat': expr = `${a} + ${b}`; break
        case 'upper': expr = `${a}.toUpperCase()`; break
        case 'lower': expr = `${a}.toLowerCase()`; break
        case 'slice': expr = `${a}.slice(0, ${String(props.str_b || 10)})`; break
        case 'length': expr = `${a}.length`; break
        case 'replace': expr = `${a}.replace(/${escapeJS(String(props.str_b || ''))}/g, '')`; break
        default: expr = `${a}`; break
      }
      code.push(`${indent(depth)}const ${targetVar} = ${expr};`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${targetVar};`)
      break
    }
    case 'fetch_request': {
      const respVar = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `resp${__uid}`
      code.push(`${indent(depth)}const ${respVar} = await fetch('${String(props.url)}', { method: '${String(props.method) || 'GET'}'${props.body ? `, body: '${escapeJS(String(props.body))}'` : ''} }).then(r => r.text()).catch(e => String(e));`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${respVar};`)
      break
    }
    case 'random_number': {
      const rv = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `rand${__uid}`
      const min = Math.floor(Number(props.min) || 1)
      const max = Math.floor(Number(props.max) || 100)
      code.push(`${indent(depth)}const ${rv} = Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min};`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${rv};`)
      break
    }
    case 'random_choice': {
      const cv = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `chosen${__uid}`
      code.push(`${indent(depth)}const choices${__uid} = '${escapeJS(String(props.items))}'.split(',').map(s => s.trim());`)
      code.push(`${indent(depth)}const ${cv} = choices${__uid}[Math.floor(Math.random() * choices${__uid}.length)];`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${cv};`)
      break
    }
    case 'db_set':
      code.push(`${indent(depth)}const stmt${__uid} = db.prepare('INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?)');`)
      code.push(`${indent(depth)}stmt${__uid}.run('${escapeJS(String(props.key))}', String(variables['${escapeJS(String(props.value))}'] || '${escapeJS(String(props.value))}'));`)
      break
    case 'db_get': {
      const gv = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `dbval${__uid}`
      code.push(`${indent(depth)}const row${__uid} = db.prepare('SELECT value FROM storage WHERE key = ?').get('${escapeJS(String(props.key))}');`)
      code.push(`${indent(depth)}const ${gv} = row${__uid}?.value || null;`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${gv};`)
      break
    }
    case 'db_delete':
      code.push(`${indent(depth)}db.prepare('DELETE FROM storage WHERE key = ?').run('${escapeJS(String(props.key))}');`)
      break
    case 'db_has': {
      const hv = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `dbexists${__uid}`
      code.push(`${indent(depth)}const row${__uid} = db.prepare('SELECT 1 FROM storage WHERE key = ?').get('${escapeJS(String(props.key))}');`)
      code.push(`${indent(depth)}const ${hv} = !!row${__uid};`)
      code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${hv};`)
      break
    }
    case 'send_components': {
      code.push(`${indent(depth)}const row${__uid} = new ActionRowBuilder()`)
      const comps = props.components || []
      if (comps.length > 0) {
        comps.forEach((comp: any, i: number) => {
          if (comp.type === 'button') {
            const style = String(comp.style || 'primary')
            const styleMap: Record<string, string> = { primary: 'Primary', secondary: 'Secondary', success: 'Success', danger: 'Danger', link: 'Link' }
            code.push(`${indent(depth + 1)}.addComponents(new ButtonBuilder()`)
            code.push(`${indent(depth + 2)}.setCustomId('${escapeJS(String(comp.custom_id || 'btn_' + i))}')`)
            code.push(`${indent(depth + 2)}.setLabel('${escapeJS(String(comp.label || 'Button'))}')`)
            code.push(`${indent(depth + 2)}.setStyle(ButtonStyle.${styleMap[style] || 'Primary'})`)
            if (comp.emoji) code.push(`${indent(depth + 2)}.setEmoji('${escapeJS(String(comp.emoji))}')`)
            if (comp.url) code.push(`${indent(depth + 2)}.setURL('${comp.url}')`)
            code.push(`${indent(depth + 1)})`)
          } else if (comp.type === 'select') {
            code.push(`${indent(depth + 1)}.addComponents(new StringSelectMenuBuilder()`)
            code.push(`${indent(depth + 2)}.setCustomId('${escapeJS(String(comp.custom_id || 'select_' + i))}')`)
            code.push(`${indent(depth + 2)}.setPlaceholder('${escapeJS(String(comp.placeholder || 'Choose...'))}')`)
            const opts = comp.options || []
            opts.forEach((opt: any, j: number) => {
              code.push(`${indent(depth + 2)}.addOptions({ label: '${escapeJS(String(opt.label))}', value: '${escapeJS(String(opt.value))}'${opt.description ? `, description: '${escapeJS(String(opt.description))}'` : ''}${opt.emoji ? `, emoji: '${opt.emoji}'` : ''} })`)
            })
            code.push(`${indent(depth + 1)})`)
          }
        })
      }
      code.push(`${indent(depth)};`)
      code.push(`${indent(depth)}const embed${__uid} = ${props.embed ? `{ title: '${escapeJS(String(props.embed_title))}', description: '${escapeJS(String(props.embed_description))}' }` : 'null'};`)
      code.push(`${indent(depth)}const msgPayload${__uid} = { content: '${escapeJS(String(props.content))}', components: [row${__uid}] };`)
      code.push(`${indent(depth)}if (embed${__uid}) msgPayload${__uid}.embeds = [embed${__uid}];`)
      code.push(`${indent(depth)}await message.channel.send(msgPayload${__uid});`)
      break
    }
    case 'respond_modal':
      code.push(`${indent(depth)}const modal${__uid} = new ModalBuilder()`)
      code.push(`${indent(depth + 1)}.setCustomId('${escapeJS(String(props.custom_id || 'modal_1'))}')`)
      code.push(`${indent(depth + 1)}.setTitle('${escapeJS(String(props.title || 'Modal'))}')`)
      const inputs = props.inputs || []
      inputs.forEach((inp: any, i: number) => {
        code.push(`${indent(depth + 1)}.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()`)
        code.push(`${indent(depth + 2)}.setCustomId('${escapeJS(String(inp.custom_id || 'input_' + i))}')`)
        code.push(`${indent(depth + 2)}.setLabel('${escapeJS(String(inp.label || 'Input'))}')`)
        code.push(`${indent(depth + 2)}.setStyle(TextInputStyle.${inp.style === 'paragraph' ? 'Paragraph' : 'Short'})`)
        code.push(`${indent(depth + 2)}.setPlaceholder('${escapeJS(String(inp.placeholder || ''))}')`)
        if (inp.required !== false) code.push(`${indent(depth + 2)}.setRequired(true)`)
        code.push(`${indent(depth + 1)})))`)
      })
      code.push(`${indent(depth)};`)
      code.push(`${indent(depth)}await interaction.showModal(modal${__uid});`)
      break
    case 'economy_balance':
    case 'economy_add':
    case 'economy_remove':
    case 'economy_set':
    case 'economy_transfer': {
      const uid = __uid
      const uid2 = uid + 1
      if (def.id === 'economy_transfer') {
        code.push(`${indent(depth)}const sender${uid} = message.member || message.author;`)
        code.push(`${indent(depth)}const receiver${uid} = message.mentions.members?.first() || message.mentions.users?.first();`)
        code.push(`${indent(depth)}if (!receiver${uid}) return;`)
        code.push(`${indent(depth)}const senderId${uid} = sender${uid}.id;`)
        code.push(`${indent(depth)}const receiverId${uid} = receiver${uid}.id;`)
        code.push(`${indent(depth)}const transferAmount${uid} = ${Number(props.amount) || 100};`)
        code.push(`${indent(depth)}const senderRow${uid} = db.prepare('SELECT balance FROM economy WHERE id = ?').get(senderId${uid});`)
        code.push(`${indent(depth)}const senderBal${uid} = senderRow${uid}?.balance || 0;`)
        code.push(`${indent(depth)}if (senderBal${uid} < transferAmount${uid}) {`)
        code.push(`${indent(depth + 1)}await message.reply('Недостаточно средств');`)
        code.push(`${indent(depth + 1)}return;`)
        code.push(`${indent(depth)}}`)
        code.push(`${indent(depth)}db.prepare('INSERT INTO economy (id, balance) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET balance = balance + ?').run(receiverId${uid}, transferAmount${uid}, transferAmount${uid});`)
        code.push(`${indent(depth)}db.prepare('UPDATE economy SET balance = balance - ? WHERE id = ?').run(transferAmount${uid}, senderId${uid});`)
        code.push(`${indent(depth)}await message.reply(\`Переведено \${transferAmount${uid}} монет\`);`)
      } else {
        const econTargetVar = String(props.var_name || '').replace(/[^a-zA-Z0-9_]/g, '_') || `econ${uid}`
        const targetVarName = String(props.var_name || '')
        code.push(...getTargetCode(String(props.target), uid, props))
        if (def.id === 'economy_balance') {
          code.push(`${indent(depth)}const econRow${uid} = db.prepare('SELECT balance FROM economy WHERE id = ?').get(target${uid}.id);`)
          code.push(`${indent(depth)}const ${econTargetVar} = econRow${uid}?.balance || 0;`)
          if (targetVarName) code.push(`${indent(depth)}variables['${escapeJS(targetVarName)}'] = ${econTargetVar};`)
        } else if (def.id === 'economy_add') {
          code.push(`${indent(depth)}db.prepare('INSERT INTO economy (id, balance) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET balance = balance + ?').run(target${uid}.id, ${Number(props.amount) || 100}, ${Number(props.amount) || 100});`)
        } else if (def.id === 'economy_remove') {
          code.push(`${indent(depth)}db.prepare('INSERT INTO economy (id, balance) VALUES (?, 0) ON CONFLICT(id) DO UPDATE SET balance = MAX(0, balance - ?)').run(target${uid}.id, ${Number(props.amount) || 100});`)
        } else if (def.id === 'economy_set') {
          code.push(`${indent(depth)}db.prepare('INSERT INTO economy (id, balance) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET balance = ?').run(target${uid}.id, ${Number(props.amount) || 0}, ${Number(props.amount) || 0});`)
        }
      }
      break
    }
    case 'economy_daily': {
      const dUid = __uid
      code.push(`${indent(depth)}const userId${dUid} = message.author.id;`)
      code.push(`${indent(depth)}const today${dUid} = Math.floor(Date.now() / 86400000);`)
      code.push(`${indent(depth)}const dailyRow${dUid} = db.prepare('SELECT lastDaily FROM economy WHERE id = ?').get(userId${dUid});`)
      code.push(`${indent(depth)}const lastDay${dUid} = dailyRow${dUid}?.lastDaily || 0;`)
      code.push(`${indent(depth)}if (lastDay${dUid} >= today${dUid}) {`)
      code.push(`${indent(depth + 1)}await message.reply('Вы уже получили ежедневную награду сегодня');`)
      code.push(`${indent(depth)}} else {`)
      code.push(`${indent(depth + 1)}db.prepare('INSERT INTO economy (id, balance, lastDaily) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET balance = balance + ?, lastDaily = ?').run(userId${dUid}, ${Number(props.amount) || 200}, today${dUid}, ${Number(props.amount) || 200}, today${dUid});`)
      code.push(`${indent(depth + 1)}await message.reply(\`Получено \${${Number(props.amount) || 200}} монет! (ежедневная награда)\`);`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'economy_leaderboard': {
      const lbVar = String(props.var_name || '').replace(/[^a-zA-Z0-9_]/g, '_') || `lb${__uid}`
      code.push(`${indent(depth)}const ${lbVar} = db.prepare('SELECT id, balance FROM economy ORDER BY balance DESC LIMIT 10').all();`)
      if (String(props.var_name)) code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${lbVar};`)
      break
    }
    case 'leveling_add_xp': {
      const lu = __uid
      code.push(...getTargetCode(String(props.target), lu, props))
      code.push(`${indent(depth)}const xp${lu} = ${Number(props.amount) || 15};`)
      code.push(`${indent(depth)}db.prepare('INSERT INTO levels (id, xp, level) VALUES (?, ?, 1) ON CONFLICT(id) DO UPDATE SET xp = xp + ?').run(target${lu}.id, xp${lu});`)
      code.push(`${indent(depth)}const lvlRow${lu} = db.prepare('SELECT xp, level FROM levels WHERE id = ?').get(target${lu}.id);`)
      code.push(`${indent(depth)}const curXp${lu} = lvlRow${lu}?.xp || 0;`)
      code.push(`${indent(depth)}const curLevel${lu} = lvlRow${lu}?.level || 1;`)
      code.push(`${indent(depth)}const newLevel${lu} = Math.floor(Math.sqrt(curXp${lu} / 100)) + 1;`)
      code.push(`${indent(depth)}if (newLevel${lu} > curLevel${lu}) {`)
      code.push(`${indent(depth + 1)}db.prepare('UPDATE levels SET level = ? WHERE id = ?').run(newLevel${lu}, target${lu}.id);`)
      code.push(`${indent(depth + 1)}await message.channel.send(\`\${target${lu}.displayName || target${lu}.username} повысил уровень до \${newLevel${lu}}!\`);`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'leveling_get_level': {
      const lgu = __uid
      const lv = String(props.var_name || '').replace(/[^a-zA-Z0-9_]/g, '_') || `rank${lgu}`
      code.push(...getTargetCode(String(props.target), lgu, props))
      code.push(`${indent(depth)}const levelRow${lgu} = db.prepare('SELECT xp, level FROM levels WHERE id = ?').get(target${lgu}.id);`)
      code.push(`${indent(depth)}const ${lv} = levelRow${lgu} || { xp: 0, level: 1 };`)
      if (String(props.var_name)) code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${lv};`)
      break
    }
    case 'leveling_leaderboard': {
      const llv = String(props.var_name || '').replace(/[^a-zA-Z0-9_]/g, '_') || `lb${__uid}`
      code.push(`${indent(depth)}const ${llv} = db.prepare('SELECT id, xp, level FROM levels ORDER BY level DESC, xp DESC LIMIT 10').all();`)
      if (String(props.var_name)) code.push(`${indent(depth)}variables['${escapeJS(String(props.var_name))}'] = ${llv};`)
      break
    }
    case 'ticket_create_panel': {
      const pu = __uid
      const chId = String(props.channel_id)
      code.push(`${indent(depth)}const panelChannel${pu} = ${chId ? `await client.channels.fetch('${chId}').catch(() => null)` : 'message.channel'};`)
      code.push(`${indent(depth)}if (panelChannel${pu}) {`)
      code.push(`${indent(depth + 1)}const row${pu} = new ActionRowBuilder().addComponents(`)
      code.push(`${indent(depth + 2)}new ButtonBuilder().setCustomId('create_ticket').setLabel('${escapeJS(String(props.button_label || 'Создать тикет'))}').setStyle(ButtonStyle.Primary)`)
      code.push(`${indent(depth + 1)});`)
      code.push(`${indent(depth + 1)}await panelChannel${pu}.send({`)
      code.push(`${indent(depth + 2)}embeds: [{ title: '${escapeJS(String(props.title || 'Support Ticket'))}', description: '${escapeJS(String(props.description || 'Нажмите кнопку для создания тикета'))}', color: 0x6366f1 }],`)
      code.push(`${indent(depth + 2)}components: [row${pu}]`)
      code.push(`${indent(depth + 1)}});`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'ticket_create': {
      const tcu = __uid
      const catId = String(props.category_id)
      const suppRole = String(props.support_role)
      code.push(`${indent(depth)}const ticketUser${tcu} = message.author;`)
      code.push(`${indent(depth)}const ticketChannel${tcu} = await message.guild?.channels.create({`)
      code.push(`${indent(depth + 1)}name: \`ticket-\${ticketUser${tcu}.username.toLowerCase()}\`,`)
      code.push(`${indent(depth + 1)}type: ChannelType.GuildText,`)
      code.push(`${indent(depth + 1)}parent: '${catId}',`)
      code.push(`${indent(depth + 1)}permissionOverwrites: [`)
      code.push(`${indent(depth + 2)}{ id: message.guild.id, deny: ['ViewChannel'] },`)
      code.push(`${indent(depth + 2)}{ id: ticketUser${tcu}.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },`)
      if (suppRole) code.push(`${indent(depth + 2)}{ id: '${suppRole}', allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },`)
      code.push(`${indent(depth + 1)}]`)
      code.push(`${indent(depth)}});`)
      code.push(`${indent(depth)}if (ticketChannel${tcu}) {`)
      code.push(`${indent(depth + 1)}await ticketChannel${tcu}.send({ content: \`Добро пожаловать, \${ticketUser${tcu}}! ${escapeJS(String(props.reason ? 'Причина: ' + props.reason : ''))}\` });`)
      code.push(`${indent(depth + 1)}await message.reply(\`Тикет создан: \${ticketChannel${tcu}}\`);`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'ticket_close':
      code.push(`${indent(depth)}const closeChannel${__uid} = message.channel;`)
      code.push(`${indent(depth)}if (closeChannel${__uid}.name?.startsWith('ticket-')) {`)
      code.push(`${indent(depth + 1)}await closeChannel${__uid}.send('Тикет будет закрыт через 5 секунд...');`)
      code.push(`${indent(depth + 1)}setTimeout(() => closeChannel${__uid}.delete().catch(() => {}), 5000);`)
      code.push(`${indent(depth)}}`)
      break
    case 'ticket_add_user': {
      const au = __uid
      code.push(`${indent(depth)}if (message.channel.name?.startsWith('ticket-')) {`)
      code.push(`${indent(depth + 1)}const addUser${au} = await message.guild?.members.fetch('${String(props.user_id)}').catch(() => null);`)
      code.push(`${indent(depth + 1)}if (addUser${au}) await message.channel.permissionOverwrites.create(addUser${au}.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'ticket_remove_user': {
      const ru = __uid
      code.push(`${indent(depth)}if (message.channel.name?.startsWith('ticket-')) {`)
      code.push(`${indent(depth + 1)}const removeUser${ru} = await message.guild?.members.fetch('${String(props.user_id)}').catch(() => null);`)
      code.push(`${indent(depth + 1)}if (removeUser${ru}) await message.channel.permissionOverwrites.delete(removeUser${ru}.id).catch(() => {});`)
      code.push(`${indent(depth)}}`)
      break
    }
    case 'play_music':
      code.push(`${indent(depth)}if (message.member?.voice.channel) {`)
      code.push(`${indent(depth + 1)}// Воспроизведение: ${escapeJS(String(props.query))}`)
      code.push(`${indent(depth + 1)}const conn${__uid} = await message.member.voice.channel.join();`)
      code.push(`${indent(depth)}}`)
      break
    case 'stop_music':
      code.push(`${indent(depth)}message.guild?.voice?.disconnect();`)
      break
    case 'set_bot_activity':
      code.push(`${indent(depth)}client.user.setActivity('${escapeJS(String(props.text || '!help'))}', { type: ActivityType.${String(props.type || 'playing').toUpperCase().replace('PLAYING', 'Playing').replace('WATCHING', 'Watching').replace('LISTENING', 'Listening').replace('COMPETING', 'Competing')} });`)
      break
    case 'set_nickname': {
      if (String(props.target) === 'mentioned') {
        code.push(`${indent(depth)}const sn${__uid} = message.mentions.members?.first();`)
      } else {
        code.push(`${indent(depth)}const sn${__uid} = message.member;`)
      }
      code.push(`${indent(depth)}if (sn${__uid}) await sn${__uid}.setNickname('${escapeJS(String(props.nickname))}');`)
      break
    }
    case 'wait':
      code.push(`${indent(depth)}await new Promise(r => setTimeout(r, ${props.duration || 1000}));`)
      break
    case 'log':
      code.push(`${indent(depth)}console.log('[Bot] ${escapeJS(String(props.text))}');`)
      break
    case 'command':
      code.push(`${indent(depth)}message.channel.send('${escapeJS(String(props.command))}');`)
      break
    case 'run_code':
    case 'custom_code':
      code.push(`${indent(depth)}// Пользовательский код`)
      code.push(`${indent(depth)}${String(props.code || '').split('\n').join('\n' + indent(depth))}`)
      break
    case 'comment':
      code.push(`${indent(depth)}// ${escapeJS(String(props.text))}`)
      break
    case 'return_block':
      code.push(`${indent(depth)}return;`)
      break
    case 'repeat_loop':
      code.push(`${indent(depth)}for (let i${__uid} = 0; i${__uid} < ${props.times || 5}; i${__uid}++) {`)
      break
    case 'for_each': {
      const itemVar = String(props.var_name).replace(/[^a-zA-Z0-9_]/g, '_') || `item${__uid}`
      code.push(`${indent(depth)}const items${__uid} = '${escapeJS(String(props.list))}'.split(',').map(s => s.trim());`)
      code.push(`${indent(depth)}for (const ${itemVar} of items${__uid}) {`)
      break
    }
    case 'while_loop':
      code.push(`${indent(depth)}let iter${__uid} = 0;`)
      code.push(`${indent(depth)}while (iter${__uid} < ${props.max_iterations || 100}) {`)
      code.push(`${indent(depth + 1)}iter${__uid}++;`)
      break
    case 'break_loop':
      code.push(`${indent(depth)}break;`)
      break
    case 'continue_loop':
      code.push(`${indent(depth)}continue;`)
      break
    case 'switch_case': {
      const swVal = String(props.value) || `var${__uid}`
      code.push(`${indent(depth)}const sw${__uid} = variables['${escapeJS(swVal)}'] || '${escapeJS(swVal)}';`)
      break
    }
    case 'try_catch':
      code.push(`${indent(depth)}try {`)
      break
    case 'has_permission':
    case 'has_role':
    case 'has_any_role':
    case 'is_bot':
    case 'is_dm':
    case 'has_attachment':
    case 'message_contains':
    case 'string_equals':
    case 'number_compare':
    case 'string_length':
    case 'in_voice':
    case 'is_null':
    case 'member_boost':
    case 'random_chance':
    case 'cooldown':
    case 'compare_variable':
    case 'and_condition':
    case 'or_condition':
    case 'not_condition':
    case 'in_channel_type':
      return generateCondition(node, def.id, props, nodeMap, edgeMap, visited, depth, vars)
    default:
      return ''
  }

  if (def.id === 'repeat_loop' || def.id === 'for_each' || def.id === 'while_loop') {
    const loopNext = getNextAction(node.id, 'output', edgeMap)
    if (loopNext) {
      const loopCode = generateActionChain(loopNext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(loopCode)
    }
    code.push(`${indent(depth)}}`)
  } else if (def.id === 'try_catch') {
    const tryNext = getNextAction(node.id, 'try', edgeMap)
    if (tryNext) {
      const tryCode = generateActionChain(tryNext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(tryCode)
    }
    code.push(`${indent(depth)}} catch (e${__uid}) {`)
    code.push(`${indent(depth)}console.error('[Error]', e${__uid});`)
    const catchNext = getNextAction(node.id, 'catch', edgeMap)
    if (catchNext) {
      const catchCode = generateActionChain(catchNext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(catchCode)
    }
    code.push(`${indent(depth)}}`)
  } else if (def.id === 'switch_case') {
    const caseANext = getNextAction(node.id, 'case-a', edgeMap)
    const caseBNext = getNextAction(node.id, 'case-b', edgeMap)
    const defaultNext = getNextAction(node.id, 'default', edgeMap)
    const caseAVal = String(props.case_a || '')
    const caseBVal = String(props.case_b || '')
    code.push(`${indent(depth)}if (sw${__uid} === '${escapeJS(caseAVal)}') {`)
    if (caseANext) {
      const caCode = generateActionChain(caseANext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(caCode)
    }
    code.push(`${indent(depth)}} else if (sw${__uid} === '${escapeJS(caseBVal)}') {`)
    if (caseBNext) {
      const cbCode = generateActionChain(caseBNext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(cbCode)
    }
    code.push(`${indent(depth)}} else {`)
    if (defaultNext) {
      const defCode = generateActionChain(defaultNext, nodeMap, edgeMap, visited, depth + 1, vars)
      code.push(defCode)
    }
    code.push(`${indent(depth)}}`)
  } else {
    const nextId = getNextAction(node.id, 'output', edgeMap)
    if (nextId) {
      const nextCode = generateActionChain(nextId, nodeMap, edgeMap, visited, depth, vars)
      code.push(nextCode)
    }
  }

  return code.join('\n')
}

function generateCondition(
  node: Node,
  defId: string,
  props: Record<string, any>,
  nodeMap: Map<string, Node>,
  edgeMap: Map<string, Edge[]>,
  visited: Set<string>,
  depth: number,
  vars: Set<string>
): string {
  const code: string[] = []
  const __uid = uid()
  let condition = ''

  switch (defId) {
    case 'has_permission':
      condition = `message.member?.permissions.has('${String(props.permission)}')`
      break
    case 'has_role':
      condition = `message.member?.roles.cache.has('${String(props.role_id)}')`
      break
    case 'has_any_role': {
      const ids = String(props.role_ids || '').split(',').map((s: string) => `'${s.trim()}'`).filter(Boolean).join(', ')
      if (ids) {
        code.push(`${indent(depth)}const userRoles${__uid} = message.member?.roles.cache.map(r => r.id) || [];`)
        condition = `[${ids}].some(r => userRoles${__uid}.includes(r))`
      } else {
        condition = 'false'
      }
      break
    }
    case 'is_bot':
      condition = `message.author.bot`
      break
    case 'is_dm':
      condition = `!message.guild`
      break
    case 'has_attachment':
      condition = `message.attachments.size > 0`
      break
    case 'in_channel_type': {
      const ct = String(props.channel_type || 'text')
      if (ct === 'text') condition = `message.channel.type === 0`
      else if (ct === 'voice') condition = `message.channel.type === 2`
      else condition = `message.channel.type === 15`
      break
    }
    case 'message_contains': {
      const text = escapeJS(String(props.text))
      if (props.case_sensitive) {
        condition = `message.content.includes('${text}')`
      } else {
        condition = `message.content.toLowerCase().includes('${text.toLowerCase()}')`
      }
      break
    }
    case 'string_equals': {
      const strVar = String(props.var_name)
      const val = escapeJS(String(props.value))
      if (vars.has(strVar) || /^[a-zA-Z_]\w*$/.test(strVar)) {
        condition = props.case_sensitive ? `${strVar} === '${val}'` : `String(${strVar}).toLowerCase() === '${val.toLowerCase()}'`
      } else {
        condition = props.case_sensitive ? `'${escapeJS(strVar)}' === '${val}'` : `'${escapeJS(strVar)}'.toLowerCase() === '${val.toLowerCase()}'`
      }
      break
    }
    case 'number_compare':
      condition = `(Number(${String(props.a || 0)}) ${String(props.operator || '>')} Number(${String(props.b || 0)}))`
      break
    case 'string_length': {
      const val = String(props.value)
      const op = String(props.operator || '>')
      const len = Number(props.length) || 0
      if (vars.has(val) || /^[a-zA-Z_]\w*$/.test(val)) {
        condition = `String(${val}).length ${op} ${len}`
      } else {
        condition = `'${escapeJS(val)}'.length ${op} ${len}`
      }
      break
    }
    case 'in_voice':
      condition = `message.member?.voice.channel`
      break
    case 'is_null': {
      const vn = String(props.var_name)
      condition = `variables['${escapeJS(vn)}'] === undefined || variables['${escapeJS(vn)}'] === null || variables['${escapeJS(vn)}'] === ''`
      break
    }
    case 'member_boost':
      condition = `message.member?.premiumSince !== null`
      break
    case 'random_chance':
      condition = `Math.random() * 100 < ${props.percent || 50}`
      break
    case 'cooldown': {
      const key = String(props.key || 'default')
      const dur = (props.duration || 10) * 1000
      code.push(`${indent(depth)}const cooldownKey${__uid} = '${key}_' + message.author.id;`)
      code.push(`${indent(depth)}const now${__uid} = Date.now();`)
      condition = `!cooldowns.has(cooldownKey${__uid}) || (now${__uid} - cooldowns.get(cooldownKey${__uid}) > ${dur})`
      break
    }
    case 'compare_variable': {
      const vn = String(props.var_name)
      condition = `variables['${escapeJS(vn)}'] ${String(props.operator || '==')} '${escapeJS(String(props.value))}'`
      break
    }
    case 'and_condition':
      condition = `true` // User connects conditions before this
      break
    case 'or_condition':
      condition = `true`
      break
    case 'not_condition':
      condition = `true` // Inverted below
      break
    default:
      condition = 'true'
  }

  let prefix = ''
  let suffix = ''
  if (defId === 'not_condition') {
    code.push(`${indent(depth)}if (!(${condition})) {`)
  } else if (defId === 'cooldown') {
    code.push(`${indent(depth)}if (${condition}) {`)
    code.push(`${indent(depth + 1)}cooldowns.set(cooldownKey${__uid}, now${__uid});`)
    prefix = indent(depth + 1)
    suffix = ''
  } else {
    code.push(`${indent(depth)}if (${condition}) {`)
  }

  const trueNext = getNextAction(node.id, 'branch-true', edgeMap)
  if (trueNext) {
    const trueCode = generateActionChain(trueNext, nodeMap, edgeMap, visited, depth + 1, vars)
    code.push(trueCode)
  }

  code.push(`${indent(depth)}} else {`)

  const falseNext = getNextAction(node.id, 'branch-false', edgeMap)
  if (falseNext) {
    const falseCode = generateActionChain(falseNext, nodeMap, edgeMap, visited, depth + 1, vars)
    code.push(falseCode)
  }

  code.push(`${indent(depth)}}`)

  return code.join('\n')
}

export function generateBot(nodes: Node[], edges: Edge[], prefix: string, token: string): string {
  const { edgeMap, nodeMap } = buildGraph(nodes, edges)
  const handlers: string[] = []
  const visited = new Set<string>()

  const triggerNodes = nodes.filter((n) => {
    const def = getBlockById(n.data.definitionId)
    return def?.type === 'trigger'
  })

  for (const node of triggerNodes) {
    varCounter = 0
    visited.clear()
    const handler = generateTriggerHandler(node, nodeMap, edgeMap, visited, 0)
    if (handler) handlers.push(handler)
  }

  const safePrefix = escapeJS(prefix)
  const safeToken = escapeJS(token)

  // Build slash commands array for registration
  const slashNodes = nodes.filter((n) => {
    const def = getBlockById(n.data.definitionId)
    return def?.id === 'on_slash_command'
  })
  const slashCommandsJson = slashNodes.map((n) => {
    const p = n.data.properties || {}
    let opts: any[] = []
    try { opts = JSON.parse(p.options || '[]') } catch {}
    const cmd: any = { name: p.name || 'command', description: p.description || 'No description' }
    if (opts.length > 0) cmd.options = opts
    return JSON.stringify(cmd)
  }).join(',\n')

  return `const { Client, GatewayIntentBits, ActivityType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, REST, Routes } = require('discord.js');
const Database = require('better-sqlite3');
const path = require('path');

const token = process.env.DISCORD_TOKEN || '${safeToken}';
const prefix = process.env.PREFIX || '${safePrefix}';
const db = new Database(path.join(__dirname, 'data.db'));

db.exec(\`CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT)\`);
db.exec(\`CREATE TABLE IF NOT EXISTS economy (id TEXT PRIMARY KEY, balance INTEGER DEFAULT 100, lastDaily INTEGER DEFAULT 0)\`);
db.exec(\`CREATE TABLE IF NOT EXISTS levels (id TEXT PRIMARY KEY, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1)\`);

if (!token) {
  console.error('[ОШИБКА] Не указан токен бота');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages
  ]
});

const cooldowns = new Map();
const variables = {};

client.on('ready', async () => {
  console.log('[ГОТОВ] Бот запущен как ' + client.user.tag);
  client.user.setActivity(prefix + 'help', { type: ActivityType.Playing });

  // Register slash commands
  const commands = [
${slashCommandsJson}
  ];
  if (commands.length > 0) {
    try {
      const rest = new REST({ version: '10' }).setToken(token);
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      console.log('[SLASH] Зарегистрировано ' + commands.length + ' команд');
    } catch (e) {
      console.error('[SLASH] Ошибка регистрации:', e);
    }
  }
});

${handlers.join('\n\n')}

client.login(token);
`
}

export function generateJson(nodes: Node[], edges: Edge[], project: { name: string; token: string; prefix: string }): string {
  return JSON.stringify({ project, nodes, edges }, null, 2)
}
