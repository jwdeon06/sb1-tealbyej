import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID;

if (!OPENAI_API_KEY) {
  console.error('Missing OpenAI API key');
}

if (!ASSISTANT_ID) {
  console.error('Missing OpenAI Assistant ID');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function createThread(): Promise<string> {
  try {
    console.log('Creating new thread...');
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);
    return thread.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
}

export async function sendMessage(threadId: string, content: string): Promise<string> {
  try {
    if (!ASSISTANT_ID) {
      throw new Error('Missing OpenAI Assistant ID');
    }

    console.log('Sending message to thread:', threadId);
    
    // Add the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });

    // Run the assistant
    console.log('Starting assistant run...');
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID
    });

    // Wait for the run to complete
    console.log('Waiting for assistant response...');
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
      
      // Wait a second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      console.log('Run status:', runStatus.status);
    }

    // Get the assistant's response
    console.log('Getting assistant response...');
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }

    const response = lastMessage.content[0].text.value;
    console.log('Assistant response received');
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}