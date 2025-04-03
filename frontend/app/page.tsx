import { getFrontpageArticles } from "@/lib/db/articles/actions";

import { LoadingScreen } from "@/components/ui/loading";
import { FeaturedSection } from "@/components/sections/featured/FeaturedSection";
import { CategoryPreviewSection } from "@/components/sections/category-preview/CategoryPreviewSection";
import { Welcome } from "@/components/sections/Welcome";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/footer/Footer";

export default async function Home() {
  const articles = null;

  if (!articles?.articles) return <LoadingScreen />;

  const latest = articles?.articles.slice(0, 4);
  const newsArticles = articles?.articles
    .slice(4)
    .filter((article) => article.category?.name === "news");
  const reviewArticles = articles?.articles
    .slice(4)
    .filter((article) => article.category?.name === "review");
  const techArticles = articles?.articles
    .slice(4)
    .filter((article) => article.category?.name === "tech");

  console.log(reviewArticles);

  return (
    <>
      <main className="mx-auto flex w-full max-w-siteWidth flex-col gap-4 p-4">
        <Welcome />
        <FeaturedSection featured={articles.featured} articles={latest} />
        <CategoryPreviewSection
          sectionTitle="News"
          route="/news"
          articles={newsArticles}
        />
        <CategoryPreviewSection
          sectionTitle="Reviews"
          route="/reviews"
          articles={reviewArticles}
        />
        <CategoryPreviewSection
          sectionTitle="Tech"
          route="/tech"
          articles={techArticles}
        />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
