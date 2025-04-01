import ChatOpenAI from "./ChatOpenAI";
import { Tool } from "./type";
import zodToJsonSchema from "zod-to-json-schema";

export default class Agent {
    private tools: Tool[];
    private llm: ChatOpenAI;

    constructor(tools: Tool[]) {
        this.tools = tools;
        this.llm = new ChatOpenAI(this.getToolsDefinition(tools))
    }

    async query(query: string) {
        while (true) {
            const result = await this.llm.chat(query)
            console.log(result.message.content)
            // 对话结束
            if (result.finish_reason === 'stop') {
                return
            }
            // 需要调用工具
            let observation = ''
            if (result.finish_reason === 'tool_calls') {
                const toolCall = result.message.tool_calls
                if (!toolCall) return
                // 依次调用工具
                for (const tool of toolCall) {
                    const toolName = tool.function.name
                    const toolArgs = JSON.parse(tool.function.arguments)
                    console.log(`${toolName} -> ${toolArgs}`)
                    const toolResult = await this.tools.find(t => t.name === toolName)?.execute(toolArgs) // 工具调用
                    console.log('Observation: ', toolResult) // 工具执行结果
                    observation += `Observation: ${toolResult}`
                }
            }
            query = observation // 构建observation
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