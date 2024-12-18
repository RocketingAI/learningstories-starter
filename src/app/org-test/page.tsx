
'use client'

import React, { useState, useEffect } from 'react'
import { useUser, useOrganization, OrganizationSwitcher, UserButton } from '@clerk/nextjs'

type Document = {
  _id: string
  title: string
  content: string
  documentType: string
  isOrgDocument: boolean
  canEdit: boolean
  createdAt: string
  userId: string
  organizationId: string | null
}

type EditingState = {
  id: string | null
  field: 'title' | 'content' | 'documentType' | null
}

export default function DocumentManager() {
  const { user } = useUser()
  const { organization, membership, isLoaded } = useOrganization()
  const isAdmin = membership?.role === 'org:admin'

  // Debug logging for admin status
  useEffect(() => {
    console.log('Admin status:', {
      isAdmin,
      membershipRole: membership?.role,
      organizationId: organization?.id,
      userId: user?.id
    })
  }, [isAdmin, membership, organization, user])

  // Debug logging for organization state
  useEffect(() => {
    if (isLoaded) {
      console.log('Organization state (detailed):', {
        isLoaded,
        organization: {
          id: organization?.id,
          name: organization?.name,
          slug: organization?.slug,
        },
        membership: {
          role: membership?.role,
          permissions: membership?.permissions,
        },
        isAdmin,
        user: {
          id: user?.id,
          primaryEmailAddress: user?.primaryEmailAddress,
        }
      })
    }
  }, [isLoaded, organization, membership, user, isAdmin])

  // Log organization state changes
  useEffect(() => {
    if (organization) {
      console.log('Organization state:', {
        id: organization.id,
        name: organization.name,
        role: membership?.role
      })
    }
  }, [organization, membership])

  // Fetch documents when user or organization changes
  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user, organization?.id])

  const [documents, setDocuments] = useState<Document[]>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null })
  const [editValue, setEditValue] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/mongo/documents')
      const data = await response.json()
      if (data.documents) {
        console.log('Fetched documents:', data.documents)
        setDocuments(data.documents)
      }
    } catch (err) {
      setError('Failed to fetch documents')
    }
  }

  const createDocument = async (isOrgDocument: boolean) => {
    try {
      if (!organization?.id) {
        setError('Please join an organization before creating documents')
        return
      }

      setStatus('Creating document...')
      const response = await fetch('/api/mongo/test-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isOrgDocument,
          organizationId: organization.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create document')
      }

      await fetchDocuments()
      setStatus('Document created successfully!')
    } catch (err) {
      console.error('Error creating document:', err)
      setError(err.message || 'Failed to create document')
      setStatus('')
    }
  }

  const handleEdit = (doc: Document, field: EditingState['field']) => {
    if (!field) return
    setEditValue(doc[field])
    setEditing({ id: doc._id, field })
  }

  const saveEdit = async (docId: string) => {
    if (!editing.field) return
    
    try {
      const response = await fetch(`/api/mongo/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: editing.field,
          value: editValue
        })
      })

      if (!response.ok) throw new Error('Failed to update')
      
      setEditing({ id: null, field: null })
      fetchDocuments()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setIsDeleting(docId);
    try {
      // Log deletion attempt
      console.log('Attempting to delete document:', {
        docId,
        isAdmin,
        organizationId: organization?.id,
        membershipRole: membership?.role
      });

      const response = await fetch(`/api/mongo/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'clerk-organization-id': organization?.id || '',
          'clerk-organization-role': membership?.role || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Delete failed:', data);
        throw new Error(data.error || 'Failed to delete document');
      }

      setDocuments(documents.filter(doc => doc._id !== docId));
      setStatus('Document deleted successfully');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsDeleting(null);
    }
  };

  const cancelEdit = () => {
    setEditing({ id: null, field: null })
    setEditValue('')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Document Manager</h1>
          {organization ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{organization.name}</span>
              {membership && (
                <span className={`px-2 py-1 rounded text-sm ${
                  isAdmin ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-amber-600">No organization selected</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <OrganizationSwitcher 
            afterCreateOrganizationUrl="/org-test"
            afterLeaveOrganizationUrl="/org-test"
            afterSelectOrganizationUrl="/org-test"
            appearance={{
              elements: {
                rootBox: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                organizationSwitcherTrigger: {
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f3f4f6',
                  '&:hover': {
                    backgroundColor: '#e5e7eb'
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {status && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className={`bg-white rounded-lg shadow-sm p-4 ${
              doc.isOrgDocument ? 'border-l-4 border-l-green-500' : ''
            }`}
          >
            <div className="flex justify-end gap-2 mb-4">
              {(doc.userId === user?.id || (doc.isOrgDocument && isAdmin)) && (
                <>
                  <button
                    onClick={() => handleEdit(doc, 'title')}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    disabled={isDeleting === doc._id}
                    className={`px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
                      isDeleting === doc._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeleting === doc._id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </div>

            <div className="mb-4">
              {editing.id === doc._id && editing.field === 'title' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => saveEdit(doc._id)}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-700">{doc.content}</p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  doc.isOrgDocument ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {doc.isOrgDocument ? 'Organization' : 'Personal'}
                </span>
                <span className="text-gray-500">By: {doc.userId}</span>
              </div>
              <div className="text-gray-500">
                Org: {doc.organizationId || 'No org ID'}
              </div>
              <div className="text-gray-500">
                Created: {new Date(doc.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4 space-x-4">
        <button
          onClick={() => createDocument(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Personal Document
        </button>
        <button
          onClick={() => createDocument(true)}
          disabled={!organization}
          className={`px-4 py-2 text-white rounded transition-colors ${
            organization 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Add Organization Document
        </button>
      </div>
    </div>
  )
}