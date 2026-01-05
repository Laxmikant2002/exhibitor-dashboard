import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // Redirect to the Exhibitor Dashboard
  redirect("/protected/meeting-requests");
}
