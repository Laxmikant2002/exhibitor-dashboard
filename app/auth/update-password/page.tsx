import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Exhibitor Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
