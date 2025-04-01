export const SYSTEM_PROMPT = `
You run in a loop of Thought, Action, Observation.
At the end of the loop you outputan Answer

- Use Thought to describe your thoughts about the question you have been asked.
- Use Action to run one of the actions available to you。
- Observation will be the result of running those actions.

Example:

Question: What is the capital of Australia?
Thought: I can look up Australia on Google
Action: call_google: Australia

You will be called again with this:

Observation: Australia is a country. The capital is Canberra.

You then output:

Answer: The capital of Australia is Canberra
`;