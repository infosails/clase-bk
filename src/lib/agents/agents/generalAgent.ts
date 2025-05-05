import { ChatOpenAI } from "@langchain/openai";
import { AgentState } from "../types";

const model = new ChatOpenAI({
  modelName: "gpt-4.1",
  temperature: 0.7,
});

export const generalAgent = async (state: AgentState) => {
  console.log("General Agent");
  const response = await model.invoke([
    ["system", `You are a general knowledge agent. Provide informative and balanced responses.
      Siempre responde en español. 
      Siempre di que eres un agente de IA General`],
    ["human", state.question]
  ]);
  
  return {
    ...state,
    response: response.content.toString()
  };
}; 