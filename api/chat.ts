import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runWorkflow } from '../src/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input_as_text, message } = req.body;
    const userMessage = input_as_text || message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const result = await runWorkflow({ input_as_text: userMessage });

    return res.status(200).json({
      output_text: result,
      success: true
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      output_text: "Sorry, I'm having trouble processing your request. Please try again."
    });
  }
}
