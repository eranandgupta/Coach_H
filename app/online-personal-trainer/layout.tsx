// Passthrough layout for the /online-personal-trainer segment. Metadata and
// JSON-LD live in each page (the hub page and the [city] pages) so that nested
// city routes don't inherit the hub's FAQ/Breadcrumb schema.
export default function OnlinePersonalTrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
