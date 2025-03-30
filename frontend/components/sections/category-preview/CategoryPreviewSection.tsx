import { SectionTitle } from "../SectionTitle";
import { CategoryPreviewSectionItem } from "./CategoryPreviewSectionItem";

import { TArticle } from "@/types/article.types";

type Props = {
  sectionTitle: string;
  route: string;
  articles: TArticle[];
};

export const CategoryPreviewSection = ({
  sectionTitle,
  route,
  articles,
}: Props) => {
  if (articles.length < 1) return null;

  const latest = articles.splice(0, 4);

  return (
    <>
      <SectionTitle title={sectionTitle} route={route} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {latest.map((article) => (
          <CategoryPreviewSectionItem key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};
