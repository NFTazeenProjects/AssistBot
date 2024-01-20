const figlet = require('figlet');
const chalk = require('chalk');
const qrcode = require('qrcode'); 

const banner = figlet.textSync('AssistBot', {
  font: 'Standard', // Ghost, Standard, Slant, Doom, Big, Mini, Small, Standard, Sub-Zero, ANSI Shadow, Bloody, Calvin S, Doh, Epic, Isometric1, Isometric2, Isometric3, Isometric4, Larry 3D, Ogre, Puffy, Rectangles, Slant Relief, Small Slant, Soft, Standard, Star Wars, Straight, Thick, Thin, Univers
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true,
});
console.log(chalk.cyan.bold(banner));

const {
  default: Baileys,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const mongoose = require("mongoose");
const Auth = require("./Helper/AuthStore");
const { QuickDB } = require('quick.db');
const { getConfig } = require('./getConfig');
const { MongoDriver } = require('quickmongo');
const { Collection } = require('discord.js');
const MessageHandler = require('./Handlers/Message');
const EventsHandler = require('./Handlers/Events');
const contact = require('./Helper/contacts');
const utils = require('./Helper/function');
const openai = require('./Library/AI_lib');
const express = require('express');
const app = express()
const P = require('pino');
const { Boom } = require('@hapi/boom');
const { join } = require('path');
const { readdirSync, remove } = require('fs-extra');
const port = process.env.PORT || 3000;
sessionID = global.session
const driver = new MongoDriver(process.env.URL);
QR = "err"

const start = async () => {
  await mongoose.connect(process.env.URL);
  mongoose.set("strictQuery", true);

  const { getAuthFromDatabase } = new Auth(sessionID);
  const { saveState, state, clearState } = await getAuthFromDatabase();

  const client = Baileys({
    version: (await fetchLatestBaileysVersion()).version,
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['AssistBot', 'silent', '5.0.0'],
    printQRInTerminal: true,
  });

  // Config
  client.config = getConfig();

    // Database
    client.DB = new QuickDB({
      driver,
    });
    // Tables
    client.contactDB = client.DB.table('contacts');

  // Contacts
  client.contact = contact;

  // Open AI
  client.AI = openai;

  // Experience
  client.exp = client.DB.table('experience');

  // Commands
  client.cmd = new Collection();

  // Utils
  client.utils = utils;

  client.messagesMap = new Map();

  /**
   * @returns {Promise<string[]>}
   */
  client.getAllGroups = async () => Object.keys(await client.groupFetchAllParticipating());

  /**
   * @returns {Promise<string[]>}
   */
  client.getAllUsers = async () => {
    const data = (await client.contactDB.all()).map((x) => x.id);
    const users = data
      .filter((element) => /^\d+@s$/.test(element))
      .map((element) => `${element}.whatsapp.net`);
    return users;
  };

  // Stylish log function
  client.log = (text, color = 'cyan') =>
    color ? console.log(chalk.keyword(color)(text)) : console.log(chalk.cyan.bold(text));

  // Command Loader
  const loadCommands = async () => {
    const readCommand = (rootDir) => {
      readdirSync(rootDir).forEach(($dir) => {
        const commandFiles = readdirSync(join(rootDir, $dir)).filter((file) => file.endsWith('.js'));
        for (let file of commandFiles) {
          const cmd = require(join(rootDir, $dir, file));
          client.cmd.set(cmd.command.name, cmd);
          // Style and color the log message for loaded commands
          client.log(`🚀 Loaded command: ${chalk.green.bold(cmd.command.name.toUpperCase())} from ${chalk.yellow(file)}`);
        }
      });
      client.log('Successfully Loaded Commands');
    };
    readCommand(join(__dirname, '.', 'Commands'));
  };

  // Connection updates
  client.ev.on("creds.update", saveState)
  client.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (update.qr) {
      client.log(`[${chalk.yellow('!')}]`, 'yellow');
      client.log(`Scan the QR code above | You can also authenticate in ${chalk.blue(`http://localhost:${port}`)}`, 'blue')
      //---- Generate a colorized QR code and save it as an image
      // const qrData = update.qr;
      // await qr.toFile('colorized-qr.png', qrData, { color: { dark: '#000', light: '#fff' } }, (err) => {
      //   if (err) {
      //     console.error(err);
      //   } else {
      //     console.log('Colorized QR code saved as colorized-qr.png');
      //   }
      // });
    }
    if (connection === 'close') {
      const { statusCode } = new Boom(lastDisconnect?.error).output;
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log(chalk.blue('Connecting...'))
        setTimeout(() => start(), 3000);
      } else {
        client.log('Disconnected.', 'red');
        clearState()
        console.log('Starting...');
        setTimeout(() => start(), 3000);
      }
    }
    if (connection === 'connecting') {
      client.state = 'connecting';
      console.log(chalk.green('Connecting to WhatsApp...'));
    }
    if (connection === 'open') {
      client.state = 'open';
      loadCommands();
      client.log('Connected to WhatsApp');
      client.log('Total Mods: ' + client.config.mods.length);
    }
    if (qr) {
      QR = qr;
    }
  });

  app.use("/", express.static(join(__dirname, "public")));
  app.get("/wa/qr", async (req, res) => {
    const { session } = req.query;
    if (!session)
      return void res
        .status(404)
        .setHeader("Content-Type", "text/plain")
        .send("Provide the session id for authentication")
        .end();
    if (sessionID !== session)
      return void res
        .status(404)
        .setHeader("Content-Type", "text/plain")
        .send("Invalid session")
        .end();
    if (client.state == "open")
      return void res
        .status(404)
        .setHeader("Content-Type", "text/plain")
        .send("Session already exist")
        .end();
    res.setHeader("content-type", "image/png");
    res.send(await qrcode.toBuffer(QR));
  });

  client.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, client));

  client.ev.on('group-participants.update', async (event) => await EventsHandler(event, client));

 // client.ev.on('contacts.update', async (update) => await contact.save(update, client));

  client.ev.on('creds.update', saveState);
  return client;
};

// Check if MongoDB URL is provided
if (!process.env.URL) return console.error('You have not provided any MongoDB URL!!');
driver
  .connect()
  .then(() => {
    console.log(`Connected to the database!`);
    // Starts the script if it gets a success in connecting with Database
    start();
  })
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

// Copyright notice
console.log(chalk.red.bold('Assist-Bot is made with ❤️'));
