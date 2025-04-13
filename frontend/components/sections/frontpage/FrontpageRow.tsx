import { SectionTitle } from "../SectionTitle";

import { IArticle } from "@/types/article.types";

import { FrontpageRowItem } from "./FrontpageRowItem";

type Props = {
  sectionTitle: string;
  articles: IArticle[];
};

export const FrontpageRow = ({ sectionTitle, articles }: Props) => {
  if (articles.length < 1) return null;

  const latest = articles.splice(0, 4);

  return (
    <>
      <SectionTitle title={sectionTitle} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {latest.map((article) => (
          <FrontpageRowItem key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};
