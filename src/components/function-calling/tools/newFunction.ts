interface NewFunctionArgs {
  arg1: string;
  arg2: string;
}

interface NewFunctionResult {
  arg1: string;
  arg2: string;
}

async function new_function({ arg1, arg2 }: NewFunctionArgs): Promise<NewFunctionResult> {
  console.group('Function Called: new_function({ arg1, arg2 })');
  console.log('arg1:', arg1);
  console.log('arg2:', arg2);
  console.groupEnd();
  return { arg1, arg2 };
}

const function_new_function = {
  type: "function" as const,
  function: {
    name: 'new_function',
    description: "New function template - Use this as a starting point for creating new functions",
    parameters: {
      type: "object",
      properties: {
        arg1: {
          type: "string",
          description: "arg1 to be described here",
        },
        arg2: {
          type: "string",
          description: "arg2 to be described here",
        },
      },
      required: ["arg1", "arg2"],
    },
  },
};

export { new_function, function_new_function };
