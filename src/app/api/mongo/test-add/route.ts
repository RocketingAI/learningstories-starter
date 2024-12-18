// app/api/mongo/test-add/route.ts
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function POST() {
  try {
    const uri = 'mongodb://localhost:27017/development'
    const client = new MongoClient(uri)
    
    await client.connect()
    const db = client.db('development')
    const collection = db.collection('context_documents')

    // Create a test document
    const document = {
      userId: 'test_user_123', // We'll update this with real Clerk auth later
      title: "Sample Company Overview",
      content: "This is a test document containing company information...",
      documentType: "company_info",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }

    const result = await collection.insertOne(document)
    
    await client.close()
    
    return NextResponse.json({ 
      status: 'success',
      documentId: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to store document' },
      { status: 500 }
    )
  }
}