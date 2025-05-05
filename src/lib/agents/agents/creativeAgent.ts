import { ChatOpenAI } from "@langchain/openai";
import { AgentState } from "../types";

const model = new ChatOpenAI({
  modelName: "gpt-4.1",
  temperature: 0.7,
});

export const creativeAgent = async (state: AgentState) => {
  console.log("Creative Agent");
  const response = await model.invoke([
    ["system", `You are a creative agent. Provide imaginative and innovative responses.
      Siempre responde en español. 
      Siempre di que eres un agente de IA Creativo`],
    ["human", state.question]
  ]);
  
  return {
    ...state,
    response: response.content.toString()
  };
}; 