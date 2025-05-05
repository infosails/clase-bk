import { ChatOpenAI } from "@langchain/openai";
import { AgentState } from "../types"

const model = new ChatOpenAI({
  modelName: "gpt-4.1",
  temperature: 0.7,
});

export const technicalAgent = async (state: AgentState) => {
  console.log("Technical Agent");
  const response = await model.invoke([
    ["system", `You are a technical expert agent. Provide detailed technical explanations. 
      Siempre responde en español. 
      Siempre di que eres un agente de IA tecnico`],
    ["human", state.question]
  ]);
  
  return {
    ...state,
    response: response.content.toString()
  };
}; 