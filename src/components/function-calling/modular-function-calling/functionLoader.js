let functions = [];
let availableFunctions = {};

function addFunction(functionModule) {
    functions.push(functionModule.functionJSON);
    availableFunctions[functionModule.functionJSON.function.name] = functionModule.functionImplementation;
}

export { functions, availableFunctions, addFunction };