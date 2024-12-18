import OpenAI from 'openai';
import { functionLoader } from './function-loader';

export class AssistantManager {
  private openai: OpenAI;
  private assistantId: string | null = null;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async createOrUpdateAssistant(name: string = "Function Calling Assistant") {
    const functions = functionLoader.getFunctionDefinitions();
    
    if (!this.assistantId) {
      const assistant = await this.openai.beta.assistants.create({
        name,
        instructions: "You are a helpful assistant with access to various functions. Use them when appropriate to help users.",
        model: "gpt-4-1106-preview",
        tools: functions,
      });
      this.assistantId = assistant.id;
      return assistant;
    } else {
      return await this.openai.beta.assistants.update(this.assistantId, {
        tools: functions,
      });
    }
  }

  async createThread() {
    return await this.openai.beta.threads.create();
  }

  async addMessage(threadId: string, content: string) {
    return await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  }

  async runAssistant(threadId: string) {
    if (!this.assistantId) {
      throw new Error("Assistant not created. Call createOrUpdateAssistant first.");
    }

    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    });

    return run;
  }

  async checkRunStatus(threadId: string, runId: string) {
    return await this.openai.beta.threads.runs.retrieve(threadId, runId);
  }

  async getMessages(threadId: string) {
    return await this.openai.beta.threads.messages.list(threadId);
  }

  async handleToolCalls(threadId: string, runId: string, toolCalls: any[]) {
    const toolOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        try {
          const result = await functionLoader.executeFunction(functionName, functionArgs);
          return {
            tool_call_id: toolCall.id,
            output: JSON.stringify(result),
          };
        } catch (error) {
          console.error(`Error executing function ${functionName}:`, error);
          return {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: error.message }),
          };
        }
      })
    );

    return await this.openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputs,
    });
  }
}
