"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/utils/apiClient";

import { LoadingScreen } from "@/components/ui/loading";
import { FeaturedSection } from "@/components/sections/featured/FeaturedSection";
import { Welcome } from "@/components/sections/Welcome";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/footer/Footer";
import { FrontpageRow } from "@/components/sections/frontpage/FrontpageRow";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      return await apiClient.fetch("/articles/frontpage");
    },
  });

  if (!data?.articles) return <LoadingScreen />;

  return (
    <>
      <main className="mx-auto flex w-full max-w-siteWidth flex-col gap-4 p-4">
        <Welcome />
        <FeaturedSection
          featured={data.articles?.[0]}
          articles={data.articles.slice(1, 4)}
        />
        <FrontpageRow
          sectionTitle="News"
          articles={data.articles.slice(4, 8)}
        />
        <FrontpageRow
          sectionTitle="Reviews"
          articles={data.articles.slice(8, 12)}
        />
        <FrontpageRow
          sectionTitle="Tech"
          articles={data.articles.slice(12, 16)}
        />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
