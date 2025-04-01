import Calculator from "./Calculator";
import { Tool } from "./type";
import Agent from "./Agent";

async function main() {
    const tools: Tool[] = [new Calculator()]
    const agent = new Agent(tools)

    const query = `(48÷6+7)×(15−9)−5×(3+2)` // 65
    agent.query(query)
}

main();
