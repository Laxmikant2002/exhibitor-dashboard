import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/meeting-requests/[id] - Fetch a single meeting request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('meeting_requests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('GET /api/meeting-requests/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/meeting-requests/[id] - Update a meeting request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({
        visitor_name,
        meeting_date,
        expired_date,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Meeting request updated successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('PUT /api/meeting-requests/[id] error:', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// DELETE /api/meeting-requests/[id] - Delete a meeting request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('meeting_requests')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Meeting request deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('DELETE /api/meeting-requests/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
