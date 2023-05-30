import {
  Client, ClientUser, Events, GatewayIntentBits,
} from 'discord.js';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import config from '../config';
import { getChatPrompt } from '../utils/helpers';

const chatModel = new ChatOpenAI({
  openAIApiKey: config.keys.OPENAI_API_KEY,
  temperature: 0.2,
  modelName: 'gpt-3.5-turbo',
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let clientUser: ClientUser;

client.once(Events.ClientReady, () => {
  clientUser = client.user!;
  clientUser.setActivity({
    name: 'with haikus...',
  });
  console.log(`Logged in as ${clientUser.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    const doNotRespond = message.author.bot || message.content.startsWith('!') || !message.guild || !message.mentions.users.has(clientUser.id);

    if (doNotRespond) return;

    await message.channel.sendTyping();

    const cleanedMessage = message.content.replace(new RegExp(`<@${clientUser.id}>`, 'g'), '').trim();

    const chain = new LLMChain({
      prompt: getChatPrompt(),
      llm: chatModel,
    });

    const response = await chain.call({ messageContent: cleanedMessage });

    if (response) message.reply(`_${response.text}_`);
  } catch (err) {
    console.error('Error: ', err);
  }
});

client.login(config.keys.DISCORD_TOKEN);
