import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { spawn, ChildProcess } from 'child_process'
import type { Project } from '../renderer/src/types/index'

const activeProcesses = new Map<string, ChildProcess>()

function getGeneratedDir(projectId: string): string {
  const dir = path.join(app.getPath('userData'), 'generated', projectId)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

function escapeTemplate(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

export function generateBotCode(project: Project): void {
  const generatedDir = getGeneratedDir(project.id)

  const prefix = project.config.prefix || '!'
  const token = project.config.token
  const statusType = project.config.status.type || 'playing'
  const statusText = project.config.status.text || '!help'
  const hasEconomy = project.modules.includes('economy')
  const hasLeveling = project.modules.includes('leveling')
  const hasLogging = project.modules.includes('logging')
  const hasModeration = project.modules.includes('moderation')
  const hasMusic = project.modules.includes('music')

  const intentLines = project.config.intents?.map((i) => `    GatewayIntentBits.${i}`).join(',\n') || '    GatewayIntentBits.Guilds'

  const activityType = statusType === 'competing' ? 'Competing' :
    statusType === 'listening' ? 'Listening' :
    statusType === 'watching' ? 'Watching' : 'Playing'

  const moduleRequires: string[] = []
  if (hasModeration) moduleRequires.push("    require('./commands/moderation')(client, prefix)")
  if (hasEconomy) moduleRequires.push("    require('./commands/economy')(client, prefix)")
  if (hasLeveling) moduleRequires.push("    require('./commands/leveling')(client, prefix)")
  if (hasLogging) moduleRequires.push("    require('./commands/logging')(client)")
  if (hasMusic) moduleRequires.push("    require('./commands/music')(client, prefix)")

  const moduleHelp: string[] = []
  if (hasModeration) moduleHelp.push("helpText += '\\n**Moderation:**\\n' + require('./commands/moderation').help(prefix) + '\\n'")
  if (hasEconomy) moduleHelp.push("helpText += '\\n**Economy:**\\n' + require('./commands/economy').help(prefix) + '\\n'")
  if (hasLeveling) moduleHelp.push("helpText += '\\n**Leveling:**\\n' + require('./commands/leveling').help(prefix) + '\\n'")
  if (hasMusic) moduleHelp.push("helpText += '\\n**Music:**\\n' + require('./commands/music').help(prefix) + '\\n'")

  const mainJs = `const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const token = process.env.DISCORD_TOKEN;
const prefix = '${escapeTemplate(prefix)}';

if (!token) {
  console.error('[ERROR] No Discord token found. Set DISCORD_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
${intentLines}
  ]
});

client.on('ready', () => {
  console.log('[OK] Logged in as ' + client.user.tag);
  client.user.setActivity('${escapeTemplate(statusText)}', { type: ActivityType.${activityType} });
  console.log('[INFO] Bot initialized successfully');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    const msg = await message.reply('Pinging...');
    await msg.edit('Pong! \`' + (msg.createdTimestamp - message.createdTimestamp) + 'ms\`');
  }

  if (command === 'help') {
    const { createEmbed } = require('./helpers/embed');
    let helpText = 'Prefix: \\\`' + prefix + '\\\`\\n\\n**Commands:**\\n';
    helpText += '\\\`' + prefix + 'ping\\\` - Check bot latency\\n';
    helpText += '\\\`' + prefix + 'help\\\` - Show this message\\n';
${moduleHelp.join('\n')}
    await message.channel.send({ embeds: [createEmbed('Help', helpText, 0x6366f1)] });
  }
});

${moduleRequires.join('\n')}

client.login(token);
`

  const envContent = `DISCORD_TOKEN=${token}
PREFIX=${prefix}
`

  const pkgDeps: string[] = ['"discord.js": "^14.18.0"']
  if (hasEconomy || hasLeveling) pkgDeps.push('"better-sqlite3": "^11.7.0"')
  if (hasMusic) pkgDeps.push('"@distube/ytdl-core": "^4.16.0"', '"play-dl": "^1.9.0"')

  const pkgJson = `{
  "name": "discord-bot-${project.id}",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
${pkgDeps.join(',\n')}
  }
}
`

  fs.writeFileSync(path.join(generatedDir, 'index.js'), mainJs, 'utf-8')
  fs.writeFileSync(path.join(generatedDir, '.env'), envContent, 'utf-8')
  fs.writeFileSync(path.join(generatedDir, 'package.json'), pkgJson, 'utf-8')

  const commandsDir = path.join(generatedDir, 'commands')
  const helpersDir = path.join(generatedDir, 'helpers')
  fs.mkdirSync(commandsDir, { recursive: true })
  fs.mkdirSync(helpersDir, { recursive: true })

  // Write helpers
  fs.writeFileSync(path.join(helpersDir, 'embed.js'), `const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

module.exports = { createEmbed };
`, 'utf-8')

  fs.writeFileSync(path.join(helpersDir, 'logger.js'), `function initLogger() {}

function log(type, text) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '[ERROR]' : type === 'warn' ? '[WARN]' : type === 'success' ? '[OK]' : '[INFO]';
  console.log(prefix + ' ' + text);
}

module.exports = { initLogger, log };
`, 'utf-8')

  // Write command modules
  if (hasModeration) fs.writeFileSync(path.join(commandsDir, 'moderation.js'), MODERATION_CMD, 'utf-8')
  if (hasEconomy) fs.writeFileSync(path.join(commandsDir, 'economy.js'), ECONOMY_CMD, 'utf-8')
  if (hasLeveling) fs.writeFileSync(path.join(commandsDir, 'leveling.js'), LEVELING_CMD, 'utf-8')
  if (hasLogging) fs.writeFileSync(path.join(commandsDir, 'logging.js'), LOGGING_CMD, 'utf-8')
  if (hasMusic) fs.writeFileSync(path.join(commandsDir, 'music.js'), MUSIC_CMD, 'utf-8')
}

export function startBot(project: Project, onLog: (text: string, type: 'info' | 'warn' | 'error' | 'success') => void): boolean {
  const generatedDir = getGeneratedDir(project.id)

  if (!fs.existsSync(path.join(generatedDir, 'index.js'))) {
    generateBotCode(project)
  }

  if (activeProcesses.has(project.id)) {
    stopBot(project.id)
  }

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const installProcess = spawn(npmCmd, ['install', '--no-audit', '--no-fund', '--loglevel=error'], {
    cwd: generatedDir,
    stdio: 'pipe',
    shell: true
  })

  installProcess.stdout?.on('data', (data: Buffer) => {
    const text = data.toString().trim()
    if (text) onLog(text, 'info')
  })

  installProcess.stderr?.on('data', (data: Buffer) => {
    const text = data.toString().trim()
    if (text) onLog(text, 'warn')
  })

  installProcess.on('close', (code) => {
    if (code !== 0) {
      onLog(`npm install exited with code ${code}`, 'error')
      return
    }

    onLog('Dependencies installed. Starting bot...', 'info')

    const child = spawn('node', ['index.js'], {
      cwd: generatedDir,
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, DISCORD_TOKEN: project.config.token, PREFIX: project.config.prefix }
    })

    activeProcesses.set(project.id, child)

    child.stdout?.on('data', (data: Buffer) => {
      const text = data.toString().trim()
      if (text) onLog(text, 'info')
    })

    child.stderr?.on('data', (data: Buffer) => {
      const text = data.toString().trim()
      if (text) onLog(text, 'error')
    })

    child.on('close', (exitCode) => {
      activeProcesses.delete(project.id)
      onLog(`Bot process exited with code ${exitCode}`, exitCode === 0 ? 'success' : 'error')
    })

    child.on('error', (err) => {
      activeProcesses.delete(project.id)
      onLog(`Failed to start bot: ${err.message}`, 'error')
    })

    onLog('Bot is starting...', 'info')
  })

  installProcess.on('error', (err) => {
    onLog(`npm install failed: ${err.message}`, 'error')
  })

  return true
}

export function stopBot(projectId: string): boolean {
  const child = activeProcesses.get(projectId)
  if (!child) return false

  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'])
    } else {
      child.kill('SIGTERM')
    }
  } catch {
    child.kill()
  }

  activeProcesses.delete(projectId)
  return true
}

export function isBotRunning(projectId: string): boolean {
  return activeProcesses.has(projectId)
}

// Template strings for generated commands (no nested template literals)
const MODERATION_CMD = [
  'module.exports = (client, prefix) => {',
  '  const warns = new Map();',
  '',
  '  client.on(\'messageCreate\', async (message) => {',
  '    if (message.author.bot) return;',
  '    if (!message.content.startsWith(prefix)) return;',
  '',
  '    const args = message.content.slice(prefix.length).trim().split(/ +/);',
  '    const command = args.shift().toLowerCase();',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '',
  '    if (command === \'kick\') {',
  '      if (!message.member?.permissions.has(\'KickMembers\')) return;',
  '      const target = message.mentions.members?.first();',
  '      if (!target) return message.reply(\'Please mention a user to kick.\');',
  '      const reason = args.join(\' \') || \'No reason provided\';',
  '      await target.kick(reason);',
  '      await message.reply({ embeds: [createEmbed(\'Kicked\', target.user.tag + \' has been kicked. Reason: \' + reason, 0xff6b6b)] });',
  '    }',
  '',
  '    if (command === \'ban\') {',
  '      if (!message.member?.permissions.has(\'BanMembers\')) return;',
  '      const target = message.mentions.members?.first();',
  '      if (!target) return message.reply(\'Please mention a user to ban.\');',
  '      const reason = args.join(\' \') || \'No reason provided\';',
  '      await target.ban({ reason });',
  '      await message.reply({ embeds: [createEmbed(\'Banned\', target.user.tag + \' has been banned. Reason: \' + reason, 0xff6b6b)] });',
  '    }',
  '',
  '    if (command === \'clear\') {',
  '      if (!message.member?.permissions.has(\'ManageMessages\')) return;',
  '      const amount = parseInt(args[0]) || 10;',
  '      const messages = await message.channel.bulkDelete(Math.min(amount, 100), true);',
  '      const reply = await message.channel.send(\'Cleared \' + messages.size + \' messages.\');',
  '      setTimeout(() => reply.delete(), 3000);',
  '    }',
  '',
  '    if (command === \'timeout\') {',
  '      if (!message.member?.permissions.has(\'ModerateMembers\')) return;',
  '      const target = message.mentions.members?.first();',
  '      if (!target) return message.reply(\'Please mention a user.\');',
  '      const duration = parseInt(args[0]) || 60;',
  '      const reason = args.slice(1).join(\' \') || \'No reason\';',
  '      await target.timeout(duration * 1000, reason);',
  '      await message.reply({ embeds: [createEmbed(\'Timed Out\', target.user.tag + \' timed out for \' + duration + \'s.\', 0xff6b6b)] });',
  '    }',
  '',
  '    if (command === \'warn\') {',
  '      if (!message.member?.permissions.has(\'ModerateMembers\')) return;',
  '      const target = message.mentions.members?.first();',
  '      if (!target) return message.reply(\'Please mention a user.\');',
  '      const reason = args.slice(1).join(\' \') || \'No reason\';',
  '      if (!warns.has(target.id)) warns.set(target.id, []);',
  '      warns.get(target.id).push({ reason, by: message.author.tag, date: new Date() });',
  '      await message.reply({ embeds: [createEmbed(\'Warning\', target.user.tag + \' warned. Reason: \' + reason, 0xfbbf24)] });',
  '      if (warns.get(target.id).length >= 3) {',
  '        await target.timeout(300000, \'3 warnings reached\');',
  '        warns.set(target.id, []);',
  '      }',
  '    }',
  '  });',
  '};',
  '',
  'module.exports.help = (prefix) => {',
  '  return \'`\' + prefix + \'kick @user [reason]` - Kick a user\\n\' +',
  '    \'`\' + prefix + \'ban @user [reason]` - Ban a user\\n\' +',
  '    \'`\' + prefix + \'clear [amount]` - Clear messages\\n\' +',
  '    \'`\' + prefix + \'timeout @user [seconds] [reason]` - Timeout user\\n\' +',
  '    \'`\' + prefix + \'warn @user [reason]` - Warn a user\';',
  '};'
].join('\n')

const ECONOMY_CMD = [
  'const Database = require(\'better-sqlite3\');',
  'const path = require(\'path\');',
  '',
  'const db = new Database(path.join(__dirname, \'..\', \'economy.db\'));',
  'db.exec(\'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, balance INTEGER DEFAULT 100, lastDaily INTEGER DEFAULT 0)\');',
  'db.exec(\'CREATE TABLE IF NOT EXISTS shop (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER, roleId TEXT)\');',
  'db.exec(\'CREATE TABLE IF NOT EXISTS inventory (userId TEXT, itemId INTEGER, FOREIGN KEY(itemId) REFERENCES shop(id))\');',
  '',
  'module.exports = (client, prefix) => {',
  '  client.on(\'messageCreate\', async (message) => {',
  '    if (message.author.bot) return;',
  '    if (!message.content.startsWith(prefix)) return;',
  '',
  '    const args = message.content.slice(prefix.length).trim().split(/ +/);',
  '    const command = args.shift().toLowerCase();',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '',
  '    if (command === \'balance\' || command === \'bal\') {',
  '      const user = message.mentions.users?.first() || message.author;',
  '      const row = db.prepare(\'SELECT balance FROM users WHERE id = ?\').get(user.id);',
  '      const balance = row ? row.balance : 100;',
  '      await message.reply({ embeds: [createEmbed(\'Balance\', user.tag + \' has \\`\\`\' + balance + \'\\`\\` coins.\', 0xfbbf24)] });',
  '    }',
  '',
  '    if (command === \'daily\') {',
  '      const row = db.prepare(\'SELECT * FROM users WHERE id = ?\').get(message.author.id);',
  '      const now = Date.now();',
  '      const cooldown = 86400000;',
  '      if (row && (now - row.lastDaily) < cooldown) {',
  '        const remaining = Math.ceil((cooldown - (now - row.lastDaily)) / 3600000);',
  '        return message.reply(\'Come back in \' + remaining + \'h for your daily reward!\');',
  '      }',
  '      const amount = 50;',
  '      if (row) {',
  '        db.prepare(\'UPDATE users SET balance = balance + ?, lastDaily = ? WHERE id = ?\').run(amount, now, message.author.id);',
  '      } else {',
  '        db.prepare(\'INSERT INTO users (id, balance, lastDaily) VALUES (?, ?, ?)\').run(message.author.id, 100 + amount, now);',
  '      }',
  '      await message.reply({ embeds: [createEmbed(\'Daily Reward\', \'You received \\`\\`\' + amount + \'\\`\\` coins!\', 0x34d399)] });',
  '    }',
  '',
  '    if (command === \'shop\') {',
  '      const items = db.prepare(\'SELECT * FROM shop\').all();',
  '      if (items.length === 0) return message.reply(\'Shop is empty.\');',
  '      const desc = items.map((i) => \'`\' + i.id + \'`. \' + i.name + \' - \\`\\`\' + i.price + \'\\`\\` coins\').join(\'\\n\');',
  '      await message.reply({ embeds: [createEmbed(\'Shop\', desc, 0xfbbf24)] });',
  '    }',
  '',
  '    if (command === \'buy\') {',
  '      const itemId = parseInt(args[0]);',
  '      if (!itemId) return message.reply(\'Specify an item ID.\');',
  '      const item = db.prepare(\'SELECT * FROM shop WHERE id = ?\').get(itemId);',
  '      if (!item) return message.reply(\'Item not found.\');',
  '      const user = db.prepare(\'SELECT * FROM users WHERE id = ?\').get(message.author.id);',
  '      if (!user || user.balance < item.price) return message.reply(\'Not enough coins!\');',
  '      db.prepare(\'UPDATE users SET balance = balance - ? WHERE id = ?\').run(item.price, message.author.id);',
  '      db.prepare(\'INSERT INTO inventory (userId, itemId) VALUES (?, ?)\').run(message.author.id, itemId);',
  '      await message.reply({ embeds: [createEmbed(\'Purchased\', \'You bought \\`\\`\' + item.name + \'\\`\\`!\', 0x34d399)] });',
  '    }',
  '',
  '    if (command === \'inventory\' || command === \'inv\') {',
  '      const items = db.prepare(\'SELECT shop.* FROM inventory JOIN shop ON inventory.itemId = shop.id WHERE inventory.userId = ?\').all(message.author.id);',
  '      if (items.length === 0) return message.reply(\'Your inventory is empty.\');',
  '      const desc = items.map((i) => \'\\`\\`\' + i.name + \'\\`\\`\').join(\'\\n\');',
  '      await message.reply({ embeds: [createEmbed(\'Inventory\', desc, 0x6366f1)] });',
  '    }',
  '',
  '    if (command === \'transfer\' || command === \'pay\') {',
  '      const target = message.mentions.users?.first();',
  '      const amount = parseInt(args[1]);',
  '      if (!target || !amount || amount <= 0) return message.reply(\'Usage: `transfer @user amount`\');',
  '      const sender = db.prepare(\'SELECT * FROM users WHERE id = ?\').get(message.author.id);',
  '      if (!sender || sender.balance < amount) return message.reply(\'Not enough coins!\');',
  '      db.prepare(\'UPDATE users SET balance = balance - ? WHERE id = ?\').run(amount, message.author.id);',
  '      db.prepare(\'UPDATE users SET balance = balance + ? WHERE id = ?\').run(amount, target.id);',
  '      await message.reply({ embeds: [createEmbed(\'Transfer\', \'Transferred \\`\\`\' + amount + \'\\`\\` coins to \' + target.tag + \'.\', 0x34d399)] });',
  '    }',
  '  });',
  '};',
  '',
  'module.exports.help = (prefix) => {',
  '  return \'`\' + prefix + \'balance [@user]` - Check balance\\n\' +',
  '    \'`\' + prefix + \'daily` - Daily reward\\n\' +',
  '    \'`\' + prefix + \'shop` - View shop\\n\' +',
  '    \'`\' + prefix + \'buy <id>` - Buy item\\n\' +',
  '    \'`\' + prefix + \'inventory` - Your items\\n\' +',
  '    \'`\' + prefix + \'transfer @user <amount>` - Send coins\';',
  '};'
].join('\n')

const LEVELING_CMD = [
  'const Database = require(\'better-sqlite3\');',
  'const path = require(\'path\');',
  '',
  'const db = new Database(path.join(__dirname, \'..\', \'leveling.db\'));',
  'db.exec(\'CREATE TABLE IF NOT EXISTS levels (id TEXT PRIMARY KEY, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1)\');',
  'db.exec(\'CREATE TABLE IF NOT EXISTS level_roles (level INTEGER PRIMARY KEY, roleId TEXT)\');',
  '',
  'function calcLevel(xp) {',
  '  return Math.floor(Math.sqrt(xp / 100)) + 1;',
  '}',
  '',
  'module.exports = (client, prefix) => {',
  '  const cooldowns = new Map();',
  '',
  '  client.on(\'messageCreate\', async (message) => {',
  '    if (message.author.bot) return;',
  '',
  '    const now = Date.now();',
  '    const last = cooldowns.get(message.author.id) || 0;',
  '    if (now - last < 60000) return;',
  '    cooldowns.set(message.author.id, now);',
  '',
  '    const row = db.prepare(\'SELECT * FROM levels WHERE id = ?\').get(message.author.id);',
  '    const oldLevel = row ? row.level : 1;',
  '    const newXp = row ? row.xp + 15 : 15;',
  '    const newLevel = calcLevel(newXp);',
  '',
  '    if (row) {',
  '      db.prepare(\'UPDATE levels SET xp = ?, level = ? WHERE id = ?\').run(newXp, newLevel, message.author.id);',
  '    } else {',
  '      db.prepare(\'INSERT INTO levels (id, xp, level) VALUES (?, ?, ?)\').run(message.author.id, newXp, newLevel);',
  '    }',
  '',
  '    if (newLevel > oldLevel) {',
  '      await message.channel.send(\'🎉 Congratulations \' + message.author + \'! You reached level \' + newLevel + \'!\');',
  '      const roleRow = db.prepare(\'SELECT * FROM level_roles WHERE level = ?\').get(newLevel);',
  '      if (roleRow && message.member) {',
  '        const role = message.guild?.roles.cache.get(roleRow.roleId);',
  '        if (role) await message.member.roles.add(role);',
  '      }',
  '    }',
  '',
  '    if (!message.content.startsWith(prefix)) return;',
  '',
  '    const args = message.content.slice(prefix.length).trim().split(/ +/);',
  '    const command = args.shift().toLowerCase();',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '',
  '    if (command === \'rank\') {',
  '      const target = message.mentions.users?.first() || message.author;',
  '      const data = db.prepare(\'SELECT * FROM levels WHERE id = ?\').get(target.id);',
  '      if (!data) return message.reply(target.tag + \' has no XP yet.\');',
  '      const nextLevelXp = Math.pow(data.level, 2) * 100;',
  '      const text = \'**\' + target.tag + \'**\\\\nLevel: \\`\\`\' + data.level + \'\\`\\`\\\\nXP: \\`\\`\' + data.xp + \'/\' + nextLevelXp + \'\\`\\`\';',
  '      await message.reply({ embeds: [createEmbed(\'Rank\', text, 0x6366f1)] });',
  '    }',
  '',
  '    if (command === \'leaderboard\' || command === \'lb\') {',
  '      const top = db.prepare(\'SELECT * FROM levels ORDER BY level DESC, xp DESC LIMIT 10\').all();',
  '      if (top.length === 0) return message.reply(\'No data yet.\');',
  '      const desc = top.map((u, i) => (i + 1) + \'. <@\' + u.id + \'> - Level \\`\\`\' + u.level + \'\\`\\` (\' + u.xp + \' XP)\').join(\'\\n\');',
  '      await message.reply({ embeds: [createEmbed(\'Leaderboard\', desc, 0xfbbf24)] });',
  '    }',
  '',
  '    if (command === \'setlevelrole\') {',
  '      if (!message.member?.permissions.has(\'Administrator\')) return;',
  '      const level = parseInt(args[0]);',
  '      const role = message.mentions.roles?.first();',
  '      if (!level || !role) return message.reply(\'Usage: `setlevelrole <level> @role`\');',
  '      db.prepare(\'INSERT OR REPLACE INTO level_roles (level, roleId) VALUES (?, ?)\').run(level, role.id);',
  '      await message.reply({ embeds: [createEmbed(\'Level Role\', \'Level \' + level + \' → \' + role.name, 0x34d399)] });',
  '    }',
  '  });',
  '};',
  '',
  'module.exports.help = (prefix) => {',
  '  return \'`\' + prefix + \'rank [@user]` - Check rank\\n\' +',
  '    \'`\' + prefix + \'leaderboard` - Server leaderboard\\n\' +',
  '    \'`\' + prefix + \'setlevelrole <level> @role` - Set auto-role (admin)\';',
  '};'
].join('\n')

const LOGGING_CMD = [
  'module.exports = (client) => {',
  '  client.on(\'messageDelete\', async (message) => {',
  '    if (message.author?.bot) return;',
  '    const logChannel = message.guild?.channels.cache.find(c => c.name === \'logs\');',
  '    if (!logChannel || !logChannel.isTextBased()) return;',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '    const embed = createEmbed(\'Message Deleted\',',
  '      \'**Author:** \' + (message.author?.tag || \'Unknown\') + \'\\\\n**Channel:** \' + message.channel + \'\\\\n**Content:** \' + (message.content || \'Embed/Attachment\'), 0xff6b6b);',
  '    await logChannel.send({ embeds: [embed] });',
  '  });',
  '',
  '  client.on(\'messageUpdate\', async (oldMessage, newMessage) => {',
  '    if (oldMessage.author?.bot) return;',
  '    if (oldMessage.content === newMessage.content) return;',
  '    const logChannel = oldMessage.guild?.channels.cache.find(c => c.name === \'logs\');',
  '    if (!logChannel || !logChannel.isTextBased()) return;',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '    const embed = createEmbed(\'Message Edited\',',
  '      \'**Author:** \' + oldMessage.author?.tag + \'\\\\n**Channel:** \' + oldMessage.channel + \'\\\\n**Before:** \' + oldMessage.content + \'\\\\n**After:** \' + newMessage.content, 0xfbbf24);',
  '    await logChannel.send({ embeds: [embed] });',
  '  });',
  '',
  '  client.on(\'guildMemberAdd\', async (member) => {',
  '    const logChannel = member.guild.channels.cache.find(c => c.name === \'logs\');',
  '    if (!logChannel || !logChannel.isTextBased()) return;',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '    const embed = createEmbed(\'Member Joined\',',
  '      \'**User:** \' + member.user.tag + \'\\\\n**ID:** \' + member.id + \'\\\\n**Created:** <t:\' + Math.floor(member.user.createdTimestamp / 1000) + \':R>\', 0x34d399);',
  '    await logChannel.send({ embeds: [embed] });',
  '  });',
  '',
  '  client.on(\'guildMemberRemove\', async (member) => {',
  '    const logChannel = member.guild.channels.cache.find(c => c.name === \'logs\');',
  '    if (!logChannel || !logChannel.isTextBased()) return;',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '    const embed = createEmbed(\'Member Left\',',
  '      \'**User:** \' + member.user.tag + \'\\\\n**ID:** \' + member.id, 0xff6b6b);',
  '    await logChannel.send({ embeds: [embed] });',
  '  });',
  '};'
].join('\n')

const MUSIC_CMD = [
  'const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require(\'@discordjs/voice\');',
  'const play = require(\'play-dl\');',
  '',
  'const queues = new Map();',
  'const players = new Map();',
  '',
  'function getQueue(guildId) {',
  '  if (!queues.has(guildId)) queues.set(guildId, []);',
  '  return queues.get(guildId);',
  '}',
  '',
  'async function playSong(guildId, textChannel) {',
  '  const queue = getQueue(guildId);',
  '  if (queue.length === 0) return;',
  '  const song = queue[0];',
  '  try {',
  '    const stream = await play.stream(song.url);',
  '    const resource = createAudioResource(stream.stream, { inputType: stream.type });',
  '    const player = createAudioPlayer();',
  '    players.set(guildId, player);',
  '    player.play(resource);',
  '    const connection = joinVoiceChannel({',
  '      channelId: song.voiceChannelId,',
  '      guildId: guildId,',
  '      adapterCreator: textChannel.guild.voiceAdapterCreator',
  '    });',
  '    connection.subscribe(player);',
  '    player.on(AudioPlayerStatus.Idle, () => {',
  '      queue.shift();',
  '      playSong(guildId, textChannel);',
  '    });',
  '    player.on(\'error\', () => {',
  '      queue.shift();',
  '      playSong(guildId, textChannel);',
  '    });',
  '  } catch (err) {',
  '    textChannel.send(\'Error playing: \' + err.message);',
  '    queue.shift();',
  '    playSong(guildId, textChannel);',
  '  }',
  '}',
  '',
  'module.exports = (client, prefix) => {',
  '  client.on(\'messageCreate\', async (message) => {',
  '    if (message.author.bot) return;',
  '    if (!message.content.startsWith(prefix)) return;',
  '    if (!message.member?.voice.channel) return message.reply(\'Join a voice channel first!\');',
  '',
  '    const args = message.content.slice(prefix.length).trim().split(/ +/);',
  '    const command = args.shift().toLowerCase();',
  '    const { createEmbed } = require(\'../helpers/embed\');',
  '',
  '    if (command === \'play\') {',
  '      const query = args.join(\' \');',
  '      if (!query) return message.reply(\'Provide a song name or URL.\');',
  '      try {',
  '        const searchResults = await play.search(query, { limit: 1 });',
  '        if (searchResults.length === 0) return message.reply(\'No results.\');',
  '        const song = searchResults[0];',
  '        const queue = getQueue(message.guild.id);',
  '        queue.push({',
  '          title: song.title,',
  '          url: song.url,',
  '          duration: song.durationInSec,',
  '          voiceChannelId: message.member.voice.channel.id,',
  '          requestedBy: message.author.tag',
  '        });',
  '        if (queue.length === 1) {',
  '          await playSong(message.guild.id, message.channel);',
  '        }',
  '        await message.reply({ embeds: [createEmbed(\'Added to Queue\', \'**\' + song.title + \'** added to queue.\', 0x6366f1)] });',
  '      } catch (err) {',
  '        await message.reply(\'Search failed: \' + err.message);',
  '      }',
  '    }',
  '',
  '    if (command === \'skip\') {',
  '      const queue = getQueue(message.guild.id);',
  '      if (queue.length === 0) return message.reply(\'Nothing playing.\');',
  '      const player = players.get(message.guild.id);',
  '      if (player) player.stop();',
  '      await message.reply(\'⏭️ Skipped.\');',
  '    }',
  '',
  '    if (command === \'stop\') {',
  '      const queue = getQueue(message.guild.id);',
  '      queue.length = 0;',
  '      const player = players.get(message.guild.id);',
  '      if (player) player.stop();',
  '      players.delete(message.guild.id);',
  '      queues.delete(message.guild.id);',
  '      await message.reply(\'⏹️ Stopped and cleared queue.\');',
  '    }',
  '',
  '    if (command === \'queue\') {',
  '      const queue = getQueue(message.guild.id);',
  '      if (queue.length === 0) return message.reply(\'Queue is empty.\');',
  '      const desc = queue.map((s, i) => (i + 1) + \'. \' + s.title + \' - \' + s.requestedBy).join(\'\\n\');',
  '      await message.reply({ embeds: [createEmbed(\'Music Queue\', desc, 0x6366f1)] });',
  '    }',
  '',
  '    if (command === \'nowplaying\' || command === \'np\') {',
  '      const queue = getQueue(message.guild.id);',
  '      if (queue.length === 0) return message.reply(\'Nothing playing.\');',
  '      await message.reply({ embeds: [createEmbed(\'Now Playing\', \'**\' + queue[0].title + \'**\', 0x34d399)] });',
  '    }',
  '  });',
  '};',
  '',
  'module.exports.help = (prefix) => {',
  '  return \'`\' + prefix + \'play <name/url>` - Play music\\n\' +',
  '    \'`\' + prefix + \'skip` - Skip current song\\n\' +',
  '    \'`\' + prefix + \'stop` - Stop and clear\\n\' +',
  '    \'`\' + prefix + \'queue` - View queue\\n\' +',
  '    \'`\' + prefix + \'nowplaying` - Current song\';',
  '};'
].join('\n')
