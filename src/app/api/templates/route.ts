import { type NextRequest } from "next/server";

// TODO: Replace with actual database operations
const templates: any[] = [];

export async function GET() {
  return Response.json(templates);
}

export async function POST(req: NextRequest) {
  const template = await req.json();
  
  // Add creation timestamp and metadata
  const newTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      author: "User", // TODO: Get from auth
      version: "1.0",
      tags: [],
      isPublic: false,
    },
  };

  templates.push(newTemplate);
  
  return Response.json(newTemplate);
}
