import { NextRequest, NextResponse } from 'next/server';
import { agentGraph } from '@/lib/agents/agentConfig';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { message: 'Question is required' },
        { status: 400 }
      );
    }

    // Initialize the state
    const initialState = {
      question,
      response: '',
      agentType: ''
    };

    // Run the agent graph
    const result = await agentGraph.invoke(initialState);

    return NextResponse.json({
      response: result.response,
      agentType: result.agentType
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 