import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the Exhibitor Dashboard
  redirect("/protected/meeting-requests");
}
