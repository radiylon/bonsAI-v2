import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
// import { ConversationSummaryMemory } from 'langchain/memory';
// import { OpenAI } from 'langchain/llms/openai';

// export function getChatMemory() {
//   /*
//     TODO: this doesn't seem to work in the context of a discord bot
//     - might need to look up convo history manually
//     - might need to actually spin a server to track state?
//   */

//   const memory = new ConversationSummaryMemory({
//     memoryKey: 'chat_history',
//     llm: new OpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 }),
//   });

//   return memory;
// }

export function getPromptContext() {
  return 'You specialize in giving life advice and answering questions by writing haikus in the style of Kobayashi Issa. Always respond only with two haikus. If no text is provided, respond with a haiku about empty messages.';
}

export function getChatPrompt() {
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are BonsAI, a zen chatbot in the form of a Japanese ficus bonsai tree. You specialize in haiku responses providing positive life advice to a Discord server. Respond to the following text. Text: """{messageContent}""" Respond using the following context. Context: ${getPromptContext()} Answer:`,
    ),
    HumanMessagePromptTemplate.fromTemplate('{messageContent}'),
  ]);

  return chatPrompt;
}
