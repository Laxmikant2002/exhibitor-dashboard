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
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Meeting Requests</h1>
          <p className="text-muted-foreground">
            Manage visitor meeting requests and track their status
          </p>
        </div>

        <div className="grid gap-6">
          <MeetingRequestForm
            editingRequest={editingRequest}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading meeting requests...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error Loading Data</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={loadRequests}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
    </ToastProvider>
  )
}
