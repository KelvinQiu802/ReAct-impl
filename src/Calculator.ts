import z from 'zod'
import { Tool } from './type'

export default class Calculator implements Tool {
    name = 'calculator';
    description = '可以执行加减乘除的计算器';
    parameters = z.object({
        operation: z.enum(['+', '-', '*', '/']),
        num1: z.number(),
        num2: z.number(),
    });

    async execute(params: z.infer<typeof this.parameters>): Promise<string> {
        const { operation, num1, num2 } = params;
        switch (operation) {
            case '+':
                return String(num1 + num2);
            case '-':
                return String(num1 - num2);
            case '*':
                return String(num1 * num2);
            case '/':
                return String(num1 / num2);
            default:
                return '操作符错误';
        }
    }
}