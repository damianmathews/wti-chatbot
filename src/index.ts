import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type WorkflowInput = { input_as_text: string };

export const runWorkflow = async (workflow: WorkflowInput) => {
  const thread = await openai.beta.threads.create();
  
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: workflow.input_as_text
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "wf_6903a59036588190a3fcecfaab1c0e900c0fb5e0055eee54"
  });

  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    
    if (lastMessage.content[0].type === 'text') {
      return lastMessage.content[0].text.value;
    }
  }
  
  throw new Error(`Run failed with status: ${run.status}`);
};
