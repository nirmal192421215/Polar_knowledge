export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Explore", href: "/explore" },
  { label: "Expeditions", href: "/expeditions" },
  { label: "Publications", href: "/publications" },
  { label: "Reports", href: "/reports" },
  { label: "Media", href: "/media" },
  { label: "Telemetry", href: "/data" },
  { label: "Analytics", href: "/analytics" },
  { label: "Polar Map", href: "/map" },
  { label: "Research", href: "/research" },
];
