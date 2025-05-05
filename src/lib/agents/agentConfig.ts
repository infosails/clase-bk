import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, END } from "@langchain/langgraph";
import { technicalAgent } from "./agents/technicalAgent";
import { generalAgent } from "./agents/generalAgent";
import { creativeAgent } from "./agents/creativeAgent";
import { AgentState } from "./types";

// Initialize the OpenAI model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
});

// Supervisor Agent
const supervisorAgent = async (state: AgentState) => {
  const response = await model.invoke([
    ["system", "You are a supervisor agent. Your job is to determine which specialized agent should handle the question. Respond with only one of these options: 'technical', 'general', or 'creative'."],
    ["human", state.question]
  ]);
  
  const agentType = response.content.toString().toLowerCase();
  
  // Determinar el siguiente nodo basado en el tipo de agente
  const nextNode = agentType === 'technical' ? 'technical' : 
                  agentType === 'general' ? 'general' : 
                  'creative';
  
  return {
    ...state,
    agentType,
    nextNode
  };
};

// Create the workflow graph
const workflow = new StateGraph<AgentState>({
  channels: {
    question: { value: null },
    response: { value: null },
    agentType: { value: null },
    nextNode: { value: null }
  }
});

// Add nodes to the graph
workflow.addNode("supervisor", supervisorAgent);
workflow.addNode("technical", technicalAgent);
workflow.addNode("general", generalAgent);
workflow.addNode("creative", creativeAgent);

// Add edges
workflow.addConditionalEdges(
  "supervisor",
  (state: AgentState) => state.nextNode,
  {
    technical: "technical",
    general: "general",
    creative: "creative"
  }
);

workflow.addEdge("technical", END);
workflow.addEdge("general", END);
workflow.addEdge("creative", END);

// Set the entry point
workflow.setEntryPoint("supervisor");

// Compile the graph
export const agentGraph = workflow.compile(); 