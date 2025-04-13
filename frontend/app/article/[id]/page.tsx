"use client";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";

import { LoadingScreen } from "@/components/ui/loading";
import { useParams } from "next/navigation";
import { Footer } from "@/components/footer/Footer";
import { apiClient } from "@/utils/apiClient";

export default function ArticlePage() {
  const params: { id: string } = useParams();

  const { data } = useQuery({
    queryKey: [`article`, params.id],
    queryFn: async () => await apiClient.fetch(`/articles/${params.id}`),
  });

  console.log(data);

  if (!data?.article) return <LoadingScreen />;

  const createdAt = new Date(data.article?.createdAt).toUTCString();

  return (
    <>
      <main className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-4">
        <article>
          {/* Title */}
          <h1 className="my-4 text-4xl font-black">{data.article?.title}</h1>

          {/* Author */}
          <div className="flex flex-col justify-between gap-1 py-1 sm:flex-row sm:gap-0">
            {data.article?.author?.firstName &&
              data.article?.author?.lastName && (
                <p>
                  <span>By</span>{" "}
                  {`${data.article?.author?.firstName} ${data.article?.author?.lastName}`}
                </p>
              )}
            <p>
              <span>Published</span> {createdAt}
            </p>
          </div>

          {/* Video */}
          {data.article?.video && !data.article?.image?.url && (
            <div className="relative mx-auto aspect-video w-full">
              <iframe
                title={data.article?.title}
                className="h-full w-full"
                src={`https://youtube.com/embed/${data.article?.video}`}
              />
            </div>
          )}

          {/* Image */}
          {data.article?.image?.url && !data.article?.video && (
            <div className="relative mx-auto aspect-video w-full">
              <Image
                alt=""
                priority
                className="object-cover object-center"
                src={data.article?.image?.url ?? ""}
                fill
                sizes="1000px"
              />
            </div>
          )}

          {/* Content */}
          <div className="article-body">{parse(data.article?.body ?? "")}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
