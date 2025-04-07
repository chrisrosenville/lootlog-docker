import Link from "next/link";
import Image from "next/image";

// Types
import { IArticle } from "@/types/article.types";
import { convertDate } from "@/utils/date";

type Props = {
  article: IArticle;
};

export const FrontpageRowItem = ({ article }: Props) => {
  const date = convertDate(article.createdAt);

  return (
    <article className="flex flex-col overflow-hidden rounded-md bg-dark600 shadow-md hover:bg-dark500">
      <Link href={`/article/${article.id}`} className="flex h-full flex-col">
        <div className="relative aspect-video w-full">
          <Image
            fill
            sizes="600px"
            className="object-cover object-center"
            loading="lazy"
            src={article.image?.url ?? "/public/images/placeholder.webp"}
            alt={article.title}
          />
          <div className="absolute bottom-2 right-2 flex items-center rounded-md bg-neutral-950/70 p-2">
            <span className="text-xs capitalize text-neutral-100">{date}</span>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between border-t border-orange700 p-4">
          <p className="font-openSans text-base">{article.title}</p>
        </div>
      </Link>
    </article>
  );
};
