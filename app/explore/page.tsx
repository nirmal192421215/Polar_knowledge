import PortalPage from "../PortalPage";

interface ExplorePageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function Page({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  return <PortalPage section="explore" regionFilter={params.region} />;
}