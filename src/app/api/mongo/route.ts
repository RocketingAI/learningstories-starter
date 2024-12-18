// app/api/mongo/route.ts
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET() {
    try {
      const uri = 'mongodb://localhost:27017/development'
      const client = new MongoClient(uri)
      
      await client.connect()
      const db = client.db('development')
      
      // Fetch all documents from the samples collection
      const documents = await db.collection('samples')
        .find({})
        .sort({ timestamp: -1 }) // Most recent first
        .toArray()
      
      await client.close()
      
      return NextResponse.json({ 
        status: 'success',
        documents
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }
  }
export async function POST() {
    let client: MongoClient | null = null

    try {
        const uri = 'mongodb://localhost:27017/development'
        client = new MongoClient(uri)

        await client.connect()
        console.log('Connected for POST operation')

        const db = client.db('development')
        const collection = db.collection('samples')

        // Add logging to debug
        const document = {
            message: "Hello MongoDB",
            timestamp: new Date()
        }
        console.log('Attempting to insert:', document)

        const result = await collection.insertOne(document)
        console.log('Insert result:', result)

        return NextResponse.json({
            status: 'success',
            insertedId: result.insertedId.toString() // Convert ObjectId to string
        })
    } catch (error) {
        console.error('Error in POST:', error)
        return NextResponse.json(
            { error: 'Failed to insert document' },
            { status: 500 }
        )
    } finally {
        // Make sure we always close the connection
        if (client) {
            await client.close()
            console.log('Connection closed')
        }
    }
}



