// app/api/mongo/documents/[id]/route.ts
import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { getAuth } from '@clerk/nextjs/server'

const MONGODB_URI = 'mongodb://localhost:27017/development'

async function getMongoClient() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client
}

async function verifyDocument(collection: any, docId: string, userId: string) {
  const document = await collection.findOne({
    _id: new ObjectId(docId)
  })

  if (!document) {
    throw new Error('Document not found')
  }

  return document
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client = null
  
  try {
    const auth = getAuth(request)
    const { userId, organization } = auth
    
    console.log('Full auth context:', {
      userId,
      organization: {
        id: organization?.id,
        name: organization?.name,
        role: organization?.membership?.role,
        publicMetadata: organization?.publicMetadata,
      },
      membership: {
        role: organization?.membership?.role,
        permissions: organization?.membership?.permissions,
      },
      headers: {
        authorization: request.headers.get('authorization'),
        'clerk-organization': request.headers.get('clerk-organization'),
      }
    })

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { field, value } = await request.json()
    
    client = await getMongoClient()
    const collection = client.db('development').collection('context_documents')

    const document = await verifyDocument(collection, params.id, userId)

    // Check edit permissions:
    // 1. For org documents: only admins can edit
    // 2. For personal documents: owner can edit
    console.log('Permission check (detailed):', {
      document: {
        id: document._id.toString(),
        isOrgDocument: document.isOrgDocument,
        userId: document.userId,
        organizationId: document.organizationId,
      },
      user: {
        id: userId,
        organizationId: organization?.id,
        role: organization?.membership?.role,
        isAdmin: organization?.membership?.role === 'org:admin',
      },
      headers: {
        authorization: request.headers.get('authorization'),
        'clerk-organization': request.headers.get('clerk-organization'),
      }
    })

    if (document.isOrgDocument) {
      const isAdmin = organization?.membership?.role === 'org:admin'
      if (!isAdmin) {
        return NextResponse.json({ error: 'Only organization admins can edit organization documents' }, { status: 403 })
      }
    } else if (document.userId !== userId) {
      // For personal documents, only the owner can edit
      return NextResponse.json({ error: 'You can only edit your own documents' }, { status: 403 })
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          [field]: value,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      status: 'success',
      updated: updateResult.modifiedCount === 1
    })
  } catch (error) {
    console.error('Error in PATCH:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update document' },
      { status: error instanceof Error && error.message === 'Document not found' ? 404 : 500 }
    )
  } finally {
    if (client) await client.close()
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client = null

  try {
    const { userId, organization } = getAuth(request)
    const orgId = organization?.id || request.headers.get('clerk-organization-id')
    const orgRole = organization?.membership?.role || request.headers.get('clerk-organization-role')
    
    console.log('Auth context:', {
      userId,
      organization: {
        id: organization?.id,
        membership: organization?.membership
      },
      headers: {
        orgId: request.headers.get('clerk-organization-id'),
        role: request.headers.get('clerk-organization-role')
      }
    })

    if (!userId || !orgId) {
      return NextResponse.json({ 
        error: 'Unauthorized - Must be in an organization',
        details: {
          userId,
          orgId,
          headerOrgId: request.headers.get('clerk-organization-id')
        }
      }, { status: 401 })
    }

    if (!params.id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    client = await getMongoClient()
    const collection = client.db('development').collection('context_documents')

    // First verify the document exists
    const document = await collection.findOne({ _id: new ObjectId(params.id) })
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Verify user is in the same organization as the document
    if (document.organizationId !== orgId) {
      return NextResponse.json({ 
        error: 'You can only delete documents from your organization',
        details: { 
          documentOrgId: document.organizationId,
          userOrgId: orgId
        }
      }, { status: 403 })
    }

    // Check delete permissions:
    // For organization documents: user must be an admin of the current organization
    // For personal documents: must be the document owner
    const isUserOrgAdmin = orgRole === 'org:admin'
    
    console.log('Permission check:', {
      document: {
        id: document._id.toString(),
        isOrgDocument: document.isOrgDocument,
        userId: document.userId,
        organizationId: document.organizationId,
      },
      user: {
        id: userId,
        organizationId: orgId,
        role: orgRole,
        isOrgAdmin: isUserOrgAdmin
      }
    })
    
    if (document.isOrgDocument) {
      if (!isUserOrgAdmin) {
        return NextResponse.json({ 
          error: 'Only organization admins can delete organization documents',
          details: { 
            isOrgDocument: true, 
            userRole: orgRole,
            organizationId: orgId,
            roleFromHeader: request.headers.get('clerk-organization-role'),
            roleFromAuth: organization?.membership?.role
          }
        }, { status: 403 })
      }
    } else if (document.userId !== userId) {
      // For personal documents, only the owner can delete
      return NextResponse.json({ 
        error: 'You can only delete your own documents',
        details: { documentUserId: document.userId, requestUserId: userId }
      }, { status: 403 })
    }

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', documentId: params.id })
  } catch (error) {
    console.error('Error in DELETE:', error)
    // Check if error is due to invalid ObjectId
    if (error instanceof Error && error.message.includes('ObjectId')) {
      return NextResponse.json({ error: 'Invalid document ID format' }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete document' },
      { status: 500 }
    )
  } finally {
    if (client) await client.close()
  }
}