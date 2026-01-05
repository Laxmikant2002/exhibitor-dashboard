"use client"

import { useEffect, useState } from "react"
import { MeetingRequestForm } from "@/components/meeting-request-form"
import { MeetingRequestsTable } from "@/components/meeting-requests-table"
import { getMeetingRequests, type MeetingRequest } from "@/lib/supabase/meeting-requests"
import { ToastProvider } from "@/components/ui/toast"

export default function MeetingRequestsPage() {
  const [requests, setRequests] = useState<MeetingRequest[]>([])
  const [editingRequest, setEditingRequest] = useState<MeetingRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMeetingRequests()
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meeting requests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleEdit = (request: MeetingRequest) => {
    setEditingRequest(request)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSuccess = () => {
    setEditingRequest(null)
    loadRequests()
  }

  const handleCancel = () => {
    setEditingRequest(null)
  }

  return (
    <ToastProvider>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Exhibitor Dashboard</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
          <MeetingRequestForm
            editingRequest={editingRequest}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />

            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading meeting requests...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadRequests}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <MeetingRequestsTable
                requests={requests}
                onEdit={handleEdit}
                onRefresh={loadRequests}
              />
            )}
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}
