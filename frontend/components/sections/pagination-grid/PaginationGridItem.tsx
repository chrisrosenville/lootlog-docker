import Link from "next/link";
import Image from "next/image";

import { convertDate } from "@/utils/date";

import { TArticle } from "@/types/article.types";

import PlaceholderImage from "@/public/images/placeholder.webp";

type Props = {
  article: TArticle;
};

export const PaginationGridItem: React.FC<Props> = ({ article }) => {
  const articleDate = convertDate(article.createdAt);

  const isVideo = article.YTVideoId ? true : false;

  return (
    <article className="relative overflow-hidden rounded-md bg-dark600 hover:bg-dark500">
      <Link prefetch={false} href={`/article/${article.id}`}>
        {!isVideo && (
          <div className="relative aspect-video">
            <Image
              alt={article.title}
              src={article.image?.url ?? PlaceholderImage}
              fill
              sizes="600px"
              className="object-cover object-center"
            />
            <div className="absolute left-4 top-4">
              <span className="rounded-md bg-neutral-950/70 px-2 py-1 text-sm text-neutral-100">
                {articleDate}
              </span>
            </div>
          </div>
        )}

        {isVideo && (
          <div className="relative aspect-video">
            <iframe
              className="aspect-video h-full w-full"
              title={article.title}
              src={`https://youtube.com/embed/${article.YTVideoId}`}
            />
          </div>
        )}

        <div className="p-2 text-base font-medium">
          <h3>{article.title}</h3>
        </div>
      </Link>
    </article>
  );
};
