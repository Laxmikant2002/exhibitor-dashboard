// Authentication disabled for demo - direct access allowed
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
