import { TArticle } from "@/types/article.types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  article: TArticle;
};

export const FeaturedSectionListItem = ({ article }: Props) => {
  return (
    <Link
      prefetch={false}
      href={`/article/${article.id}`}
      className={`flex justify-start gap-4 border-b border-neutral-600 p-4 last:border-0 hover:bg-neutral-700`}
    >
      <div className="relative aspect-square h-full min-w-20 flex-shrink-0 overflow-hidden rounded-sm lg:min-w-16">
        <Image
          fill
          className="object-cover object-center"
          src={article.image?.url ?? "/public/images/placeholder.webp"}
          alt={article.title}
        />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="line-clamp-3 overflow-hidden text-ellipsis font-openSans text-base lg:line-clamp-2 lg:text-base lg2:line-clamp-3">
          {article.title}
        </h2>
        <p className="text-sm capitalize text-neutral-300 lg:hidden">
          {article.category?.name}
        </p>
      </div>
    </Link>
  );
};
