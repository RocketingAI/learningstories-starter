import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export type AssistantFunction = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  implementation: (...args: any[]) => Promise<any>;
};

class FunctionLoader {
  private availableFunctions: Map<string, AssistantFunction> = new Map();

  registerFunction(func: AssistantFunction) {
    this.availableFunctions.set(func.name, func);
  }

  getFunctionDefinitions(): ChatCompletionTool[] {
    return Array.from(this.availableFunctions.values()).map(({ name, description, parameters }) => ({
      type: 'function',
      function: {
        name,
        description,
        parameters: parameters as Record<string, unknown>,
      },
    }));
  }

  async executeFunction(name: string, args: any) {
    const func = this.availableFunctions.get(name);
    if (!func) throw new Error(`Function ${name} not found`);
    return await func.implementation(args);
  }

  getFunctionNames(): string[] {
    return Array.from(this.availableFunctions.keys());
  }
}

// Export a singleton instance
export const functionLoader = new FunctionLoader();
