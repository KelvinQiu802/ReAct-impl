import Calculator from "./Calculator";
import { Tool } from "./type";
import Agent from "./Agent";

async function main() {
    const tools: Tool[] = [new Calculator()]
    const agent = new Agent(tools)

    const query = '1+2+3+4+(5*6)+9 等于多少?' // 49
    agent.query(query)
}

main();
