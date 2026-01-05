'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'

export interface MeetingRequest {
  id: string
  visitor_name: string
  meeting_date: string
  expired_date: string
  created_at: string
}

export interface CreateMeetingRequestInput {
  visitor_name: string
  meeting_date: string
  expired_date: string
}

export async function getMeetingRequests() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('meeting_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching meeting requests:', error)
    throw new Error('Failed to fetch meeting requests')
  }

  return data as MeetingRequest[]
}

export async function createMeetingRequest(input: CreateMeetingRequestInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meeting_requests')
    .insert({
      visitor_name: input.visitor_name,
      meeting_date: input.meeting_date,
      expired_date: input.expired_date,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating meeting request:', error)
    throw new Error('Failed to create meeting request')
  }

  revalidatePath('/protected/meeting-requests')
  return data as MeetingRequest
}

export async function updateMeetingRequest(id: string, input: CreateMeetingRequestInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('meeting_requests')
    .update({
      visitor_name: input.visitor_name,
      meeting_date: input.meeting_date,
      expired_date: input.expired_date,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating meeting request:', error)
    throw new Error('Failed to update meeting request')
  }

  revalidatePath('/protected/meeting-requests')
  return data as MeetingRequest
}

export async function deleteMeetingRequest(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('meeting_requests')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting meeting request:', error)
    throw new Error('Failed to delete meeting request')
  }

  revalidatePath('/protected/meeting-requests')
  return { success: true }
}
