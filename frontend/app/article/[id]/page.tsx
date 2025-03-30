"use client";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";

import { getArticleById } from "@/lib/db/articles";

import { LoadingScreen } from "@/components/ui/loading";
import { useParams } from "next/navigation";
import { Footer } from "@/components/footer/Footer";

export default function ArticlePage() {
  const params: { id: string } = useParams();

  const { data: article } = useQuery({
    queryKey: [`article/${params.id}`],
    queryFn: async () => await getArticleById(params.id),
  });

  if (!article) return <LoadingScreen />;

  const createdAt = new Date(article.createdAt).toUTCString();

  return (
    <>
      <main className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-4">
        <article>
          {/* Title */}
          <h1 className="my-4 text-4xl font-black">{article?.title}</h1>

          {/* Author */}
          <div className="flex flex-col justify-between gap-1 py-1 sm:flex-row sm:gap-0">
            {article.author?.firstName && article.author.lastName && (
              <p>
                <span>By</span>{" "}
                {`${article.author.firstName} ${article?.author?.lastName}`}
              </p>
            )}
            <p>
              <span>Published</span> {createdAt}
            </p>
          </div>

          {/* Video */}
          {article?.YTVideoId && !article?.image?.url && (
            <div className="relative mx-auto aspect-video w-full">
              <iframe
                title={article?.title}
                className="h-full w-full"
                src={`https://youtube.com/embed/${article?.YTVideoId}`}
              />
            </div>
          )}

          {/* Image */}
          {article?.image?.url && !article?.YTVideoId && (
            <div className="relative mx-auto aspect-video w-full">
              <Image
                alt=""
                priority
                className="object-cover object-center"
                src={article?.image?.url ?? ""}
                fill
                sizes="1000px"
              />
            </div>
          )}

          {/* Content */}
          <div className="article-body">
            {parse(article ? article.body : "")}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
