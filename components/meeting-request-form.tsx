"use client"

import { useState, useEffect } from "react"
import { createMeetingRequest, updateMeetingRequest, type MeetingRequest } from "@/lib/supabase/meeting-requests"
import { useToast } from "@/components/ui/toast"

interface MeetingRequestFormProps {
  editingRequest?: MeetingRequest | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function MeetingRequestForm({ editingRequest, onSuccess, onCancel }: MeetingRequestFormProps) {
  const [visitorName, setVisitorName] = useState(editingRequest?.visitor_name || "")
  const [meetingDate, setMeetingDate] = useState(editingRequest?.meeting_date || "")
  const [expiredDate, setExpiredDate] = useState(editingRequest?.expired_date || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Update form when editingRequest changes
  useEffect(() => {
    if (editingRequest) {
      setVisitorName(editingRequest.visitor_name)
      setMeetingDate(editingRequest.meeting_date)
      setExpiredDate(editingRequest.expired_date)
    } else {
      setVisitorName("")
      setMeetingDate("")
      setExpiredDate("")
    }
  }, [editingRequest])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!visitorName.trim() || !meetingDate || !expiredDate) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    // Check if expired date is after meeting date
    if (new Date(expiredDate) <= new Date(meetingDate)) {
      toast({
        title: "Validation Error",
        description: "Expired date must be after meeting date",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const input = {
        visitor_name: visitorName.trim(),
        meeting_date: meetingDate,
        expired_date: expiredDate,
      }

      if (editingRequest) {
        await updateMeetingRequest(editingRequest.id, input)
        toast({
          title: "Success",
          description: "Meeting request updated successfully",
        })
      } else {
        await createMeetingRequest(input)
        toast({
          title: "Success",
          description: "Meeting request created successfully",
        })
        // Reset form for new entries
        setVisitorName("")
        setMeetingDate("")
        setExpiredDate("")
      }

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {editingRequest ? "Edit Meeting Request" : "Create Meeting Request"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 mb-2">
            Visitor Name
          </label>
          <input
            id="visitorName"
            type="text"
            placeholder="Enter visitor name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="meetingDate" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Date
          </label>
          <input
            id="meetingDate"
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="expiredDate" className="block text-sm font-medium text-gray-700 mb-2">
            Expired Date
          </label>
          <input
            id="expiredDate"
            type="date"
            value={expiredDate}
            onChange={(e) => setExpiredDate(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Saving..." : editingRequest ? "Update" : "Create"}
          </button>
          {editingRequest && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
