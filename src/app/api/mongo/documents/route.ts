// app/api/mongo/documents/route.ts
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  try {
    const { userId, organization } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const uri = 'mongodb://localhost:27017/development'
    const client = new MongoClient(uri)
    
    await client.connect()
    const db = client.db('development')
    
    // Build query to get:
    // 1. User's personal documents
    // 2. Organization documents if user is in an organization
    const query = {
      $or: [
        { userId: userId }, // Personal documents
      ]
    }

    // Add organization documents if user is in an organization
    if (organization?.id) {
      query.$or.push({ 
        isOrgDocument: true,
        organizationId: organization.id
      })
    }

    console.log('Fetching documents with query:', JSON.stringify(query, null, 2))
    
    const documents = await db.collection('context_documents')
      .find(query)
      .toArray()
    
    console.log(`Found ${documents.length} documents for user`)
    
    await client.close()
    
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}