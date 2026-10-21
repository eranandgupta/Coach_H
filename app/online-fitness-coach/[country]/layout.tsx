// Passthrough: the country page owns its metadata and JSON-LD (see page.tsx) so
// that nested city pages (/online-fitness-coach/[country]/[city]) don't inherit
// the country's Service and Breadcrumb schema.
export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
