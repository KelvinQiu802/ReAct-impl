import OpenAI from "openai";
import ChatOpenAI from "./ChatOpenAI";
import { Tool } from "./type";
import zodToJsonSchema from "zod-to-json-schema";

export default class Agent {
    private tools: Tool[];

    constructor(tools: Tool[]) {
        this.tools = tools;
    }

    async query(query: string) {
        const llm = new ChatOpenAI(this.getToolsDefinition(this.tools))
        let dialogues: OpenAI.Chat.ChatCompletionMessageParam[] = [{role: 'user', content: query}]
        while (true) {
            const result = await llm.chat(dialogues)
            console.log(result.message.content)
            // 对话结束
            if (result.finish_reason === 'stop') {
                return
            }
            // 需要调用工具
            if (result.finish_reason === 'tool_calls') {
                const toolCall = result.message.tool_calls
                if (!toolCall) return
                // 并发调用工具
                const asyncToolCalls = toolCall.map(async tool => {
                    const toolName = tool.function.name
                    const toolArgs = JSON.parse(tool.function.arguments)
                    console.log(`${toolName} -> ${tool.function.arguments}`)
                    const toolResult = await this.tools.find(t => t.name === toolName)?.execute(toolArgs) // 工具调用
                    console.log('Observation: ', toolResult) // 工具执行结果
                    // URL_ADDRESS.openai.com/docs/guides/function-calling?api-mode=responses
                    return {
                        role: 'tool',
                        tool_call_id: tool.id,
                        content: toolResult || ''
                    } as OpenAI.Chat.ChatCompletionMessageParam
                })
                dialogues = await Promise.all(asyncToolCalls)
            }
            console.log('--------------------------------')
        }
    }

    private getToolsDefinition(tools: Tool[]) {
        return tools.map(tool => ({
            type: 'function' as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: zodToJsonSchema(tool.parameters)
            }
        }))
    }
}