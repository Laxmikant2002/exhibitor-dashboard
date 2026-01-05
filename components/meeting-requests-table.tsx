"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { deleteMeetingRequest, type MeetingRequest } from "@/lib/supabase/meeting-requests"
import { useToast } from "@/components/ui/toast"

interface MeetingRequestsTableProps {
  requests: MeetingRequest[]
  onEdit: (request: MeetingRequest) => void
  onRefresh: () => void
}

export function MeetingRequestsTable({ requests, onEdit, onRefresh }: MeetingRequestsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting request?")) {
      return
    }

    setDeletingId(id)
    
    try {
      await deleteMeetingRequest(id)
      toast({
        title: "Success",
        description: "Meeting request deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiredDate: string) => {
    return new Date(expiredDate) < new Date()
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No meeting requests found. Create your first meeting request above.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Requests</CardTitle>
        <CardDescription>Manage all meeting requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Visitor Name</th>
                <th className="text-left p-3 font-semibold">Meeting Date</th>
                <th className="text-left p-3 font-semibold">Expired Date</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Created</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">{request.visitor_name}</td>
                  <td className="p-3">{formatDate(request.meeting_date)}</td>
                  <td className="p-3">{formatDate(request.expired_date)}</td>
                  <td className="p-3">
                    {isExpired(request.expired_date) ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge>Active</Badge>
                    )}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(request)}
                        disabled={deletingId === request.id}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(request.id)}
                        disabled={deletingId === request.id}
                      >
                        {deletingId === request.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
