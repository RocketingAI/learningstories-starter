import { NextResponse } from "next/server";
import { availableFunctions, getFunctionNames } from "~/components/function-calling/function-loader";
import "~/components/function-calling/function-registry"; // Import to ensure functions are registered

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { functionName, arguments: args } = body;

    console.log("Available functions:", getFunctionNames());
    console.log("Executing function:", functionName, "with args:", args);

    if (!availableFunctions[functionName]) {
      console.error(`Function ${functionName} not found. Available functions:`, getFunctionNames());
      return NextResponse.json(
        { error: `Function ${functionName} not found. Available functions: ${getFunctionNames().join(", ")}` },
        { status: 404 }
      );
    }

    const result = await availableFunctions[functionName](args);
    console.log("Function result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in function execution:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      if ((error as any).response?.data) {
        console.error("API Error details:", (error as any).response.data);
      }
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
