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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
        <div className="max-w-sm mx-auto">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meeting Requests</h3>
          <p className="text-sm text-gray-500">
            Get started by creating your first meeting request above.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="px-8 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meeting Requests</h2>
            <p className="text-sm text-gray-500 mt-1">{requests.length} {requests.length === 1 ? 'request' : 'requests'} found</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Visitor Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Meeting Date
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {request.id.substring(0, 8)}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {request.visitor_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-900">{request.visitor_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700 font-medium">{formatDate(request.meeting_date)}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700 font-medium">{formatDate(request.expired_date)}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {isExpired(request.expired_date) ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Expired
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(request)}
                      disabled={deletingId === request.id}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      disabled={deletingId === request.id}
                      className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {deletingId === request.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
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
