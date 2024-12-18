// app/api/mongo/test-org/route.ts
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId, organization } = getAuth(request)
    console.log('Auth details:', { userId, organization })

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isOrgDocument, organizationId } = await request.json()
    
    // Always use the organization ID, regardless of document type
    const effectiveOrgId = organizationId || organization?.id
    
    if (!effectiveOrgId) {
      return NextResponse.json(
        { error: 'Organization ID is required for all documents' }, 
        { status: 400 }
      )
    }

    console.log('Creating document with params:', { 
      userId, 
      organizationId: effectiveOrgId,
      isOrgDocument 
    })

    const uri = 'mongodb://localhost:27017/development'
    const client = new MongoClient(uri)
    
    await client.connect()
    const db = client.db('development')
    const collection = db.collection('context_documents')

    const document = {
      userId,
      organizationId: effectiveOrgId,
      title: isOrgDocument ? "Organization Document" : "Personal Document",
      content: isOrgDocument ? 
        "This is a shared organization document visible to all members." : 
        "This is a personal document only visible to me.",
      documentType: "policy",
      isOrgDocument,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        canEdit: isOrgDocument ? [] : [userId],
        canView: isOrgDocument ? [] : [userId]
      }
    }

    console.log('Attempting to insert document:', document)

    const result = await collection.insertOne(document)
    console.log('Insert result:', result)
    
    await client.close()
    
    return NextResponse.json({ 
      status: 'success',
      documentId: result.insertedId.toString(),
      document
    })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json(
      { error: 'Failed to store document', details: error.message },
      { status: 500 }
    )
  }
}