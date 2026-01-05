"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle>{editingRequest ? "Edit Meeting Request" : "Create Meeting Request"}</CardTitle>
        <CardDescription>
          {editingRequest ? "Update the meeting request details" : "Fill in the details to create a new meeting request"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              type="text"
              placeholder="Enter visitor name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingDate">Meeting Date</Label>
            <Input
              id="meetingDate"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiredDate">Expired Date</Label>
            <Input
              id="expiredDate"
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingRequest ? "Update" : "Create"}
            </Button>
            {editingRequest && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
