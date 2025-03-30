import { getArticlesByCategoryName } from "@/lib/db/articles/actions";

import { PaginationGrid } from "@/components/sections/pagination-grid/PaginationGrid";
import { LoadingScreen } from "@/components/ui/loading";
import { Footer } from "@/components/footer/Footer";

export default async function NewsPage() {
  const articles = await getArticlesByCategoryName("news", 20);

  if (!articles) return <LoadingScreen />;

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 p-4">
        <PaginationGrid
          articleCategory="news"
          pageTitle="News"
          pageSubtitle="Read our honest, detailed, and informative reviews of the best games in the market. This section is your guide to gaming."
        />
      </main>
      <Footer />
    </>
  );
}
