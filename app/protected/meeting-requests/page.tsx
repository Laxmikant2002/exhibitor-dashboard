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
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-16">
                <div className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Meeting Requests</h3>
                  <p className="text-sm text-gray-500">Please wait while we fetch your data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-md border border-red-100 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
                    <p className="text-sm text-red-700 mb-4">{error}</p>
                    <button
                      onClick={loadRequests}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </button>
                  </div>
                </div>
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
