import { OpenAI } from "openai";
import { SYSTEM_PROMPT } from "./prompts";
import 'dotenv/config';

export default class ChatOpenAI {
    private llm: OpenAI;
    private tools: OpenAI.Chat.Completions.ChatCompletionTool[];
    private messages: OpenAI.Chat.ChatCompletionMessageParam[];

    constructor(tools: OpenAI.Chat.Completions.ChatCompletionTool[]) {
        this.llm = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL,
        });
        this.tools = tools;
        this.messages = [{
            role: 'system',
            content: SYSTEM_PROMPT
        }];
    }

    async chat(dialogues: OpenAI.Chat.ChatCompletionMessageParam[]) {
        this.messages.push(...dialogues)
        const response = await this.llm.chat.completions.create({
            model: process.env.OPENAI_MODEL as string,
            messages: this.messages,
            tools: this.tools,
            tool_choice: 'auto',
        });
        this.messages.push(response.choices[0].message)
        return response.choices[0];
    }
}
