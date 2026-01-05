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
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-shadow">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editingRequest ? "Edit Meeting Request" : "Create New Meeting Request"}
        </h2>
        <p className="text-sm text-gray-500">
          {editingRequest ? "Update the meeting request details below" : "Fill in the details to create a new meeting request"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="visitorName" className="block text-sm font-semibold text-gray-700 mb-2">
            Visitor Name *
          </label>
          <input
            id="visitorName"
            type="text"
            placeholder="e.g., John Smith"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="meetingDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Date *
            </label>
            <input
              id="meetingDate"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="expiredDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              id="expiredDate"
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : editingRequest ? "Update Request" : "Create Request"}
          </button>
          {editingRequest && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
