import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/meeting-requests - Fetch all meeting requests
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('meeting_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('GET /api/meeting-requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/meeting-requests - Create a new meeting request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visitor_name, meeting_date, expired_date } = body

    // Validation
    if (!visitor_name || !meeting_date || !expired_date) {
      return NextResponse.json(
        { error: 'All fields are required: visitor_name, meeting_date, expired_date' },
        { status: 400 }
      )
    }

    // Check if expired date is after meeting date
    if (new Date(expired_date) <= new Date(meeting_date)) {
      return NextResponse.json(
        { error: 'expired_date must be after meeting_date' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('meeting_requests')
      .insert({
        visitor_name,
        meeting_date,
        expired_date,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Meeting request created successfully', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/meeting-requests error:', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
