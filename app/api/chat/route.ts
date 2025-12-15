import { NextRequest, NextResponse } from 'next/server';
import { runWorkflow } from '../../../src/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage = body.input_as_text || body.message;

    if (!userMessage) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const result = await runWorkflow({ input_as_text: userMessage });

    return NextResponse.json({
      output_text: result,
      success: true
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      error: 'Failed to process message',
      output_text: "Sorry, I'm having trouble processing your request. Please try again."
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
