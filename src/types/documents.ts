// types/documents.ts
type ContextDocument = {
    _id?: string
    userId: string                    // Creator's Clerk ID
    organizationId: string | null     // Clerk org ID if org document, null if personal
    title: string
    content: string
    documentType: string
    isOrgDocument: boolean           // True if shared with org
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    permissions: {
      canEdit: string[]              // Array of userIds who can edit
      canView: string[]              // Array of userIds who can view
    }
  }
  
  // app/api/mongo/documents/route.ts
  import { NextResponse } from 'next/server'
  import { MongoClient } from 'mongodb'
  import { auth, clerkClient } from '@clerk/nextjs'
  
  export async function GET() {
    try {
      const { userId, orgId } = auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      const uri = 'mongodb://localhost:27017/development'
      const client = new MongoClient(uri)
      
      await client.connect()
      const db = client.db('development')
      
      // Get organization membership and role if in an org
      let isAdmin = false
      if (orgId) {
        const membership = await clerkClient.organizations.getOrganizationMembership({
          organizationId: orgId,
          userId: userId
        })
        isAdmin = membership.role === 'admin'
      }
  
      // Build query to get:
      // 1. User's personal documents
      // 2. Org documents if user is in an org
      const query = {
        $or: [
          { userId: userId, isOrgDocument: false },  // Personal docs
          { organizationId: orgId, isOrgDocument: true }  // Org docs
        ],
        isActive: true
      }
  
      const documents = await db.collection('context_documents')
        .find(query)
        .toArray()
  
      // Add editPermission flag to each document
      const documentsWithPermissions = documents.map(doc => ({
        ...doc,
        canEdit: doc.userId === userId || 
                 (isAdmin && doc.isOrgDocument) ||
                 doc.permissions.canEdit.includes(userId)
      }))
      
      await client.close()
      
      return NextResponse.json({ documents: documentsWithPermissions })
    } catch (error) {
      console.error('Fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }
  }
  
  export async function POST() {
    try {
      const { userId, orgId } = auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      // Check if user is org admin if creating org document
      const { isOrgDocument } = await request.json()
      
      if (isOrgDocument && orgId) {
        const membership = await clerkClient.organizations.getOrganizationMembership({
          organizationId: orgId,
          userId: userId
        })
        
        if (membership.role !== 'admin') {
          return NextResponse.json(
            { error: 'Only admins can create organization documents' },
            { status: 403 }
          )
        }
      }
  
      const uri = 'mongodb://localhost:27017/development'
      const client = new MongoClient(uri)
      
      await client.connect()
      const db = client.db('development')
  
      const document: ContextDocument = {
        userId,
        organizationId: isOrgDocument ? orgId : null,
        title: "Sample Document",
        content: "Document content...",
        documentType: "company_info",
        isOrgDocument,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        permissions: {
          canEdit: isOrgDocument ? [] : [userId],
          canView: isOrgDocument ? [] : [userId]
        }
      }
  
      const result = await db.collection('context_documents').insertOne(document)
      
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