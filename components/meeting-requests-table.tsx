"use client"

import { useState } from "react"
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
      <div className="bg-white rounded-lg shadow p-8">
        <p className="text-center text-gray-600">
          No meeting requests found. Create your first meeting request above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Meeting Requests</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Visitor Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Meeting Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Expired Date
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {request.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.visitor_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(request.meeting_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{formatDate(request.expired_date)}</span>
                    {isExpired(request.expired_date) ? (
                      <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(request)}
                      disabled={deletingId === request.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      disabled={deletingId === request.id}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {deletingId === request.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
