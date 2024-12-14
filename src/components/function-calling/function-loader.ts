export interface FunctionModule {
  functionImplementation: (args: any) => Promise<any>;
  functionJSON: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
      };
    };
  };
}

let functions: FunctionModule["functionJSON"][] = [];
let availableFunctions: Record<string, FunctionModule["functionImplementation"]> = {};

export function addFunction(functionModule: FunctionModule) {
  functions.push(functionModule.functionJSON);
  availableFunctions[functionModule.functionJSON.function.name] = functionModule.functionImplementation;
}

// For debugging
export function getFunctionNames() {
  return Object.keys(availableFunctions);
}

export { functions, availableFunctions };
