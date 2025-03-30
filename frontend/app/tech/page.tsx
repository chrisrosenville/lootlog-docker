import { getArticlesByCategoryName } from "@/lib/db/articles/actions";

import { PaginationGrid } from "@/components/sections/pagination-grid/PaginationGrid";
import { LoadingScreen } from "@/components/ui/loading";
import { Footer } from "@/components/footer/Footer";

export default async function TechPage() {
  const articles = await getArticlesByCategoryName("tech", 20);

  if (!articles) return <LoadingScreen />;

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 p-4">
        <PaginationGrid
          articleCategory="tech"
          pageTitle="Tech"
          pageSubtitle="All the latest in the world of technology"
        />
      </main>
      <Footer />
    </>
  );
}
