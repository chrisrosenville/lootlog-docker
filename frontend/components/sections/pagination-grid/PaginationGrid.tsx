"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TArticle } from "@/types/article.types";

import { PaginationGridItem } from "./PaginationGridItem";
import { PageTitle } from "@/components/page-title/PageTitle";
import { Message } from "@/components/ui/message";
import { LoadingSpinner } from "@/components/ui/loading";

type Props = {
  articleCategory: string;
  pageTitle: string;
  pageSubtitle: string;
};
export const PaginationGrid = ({
  articleCategory,
  pageTitle,
  pageSubtitle,
}: Props) => {
  const [articles, setArticles] = useState<TArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const ITEMS_PER_PAGE = 20;

  console.log("Articles:", articles);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(
        `/api/articles/category/${articleCategory}/${page * ITEMS_PER_PAGE}`,
      );

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const newArticles = await res.json();

      // If we get fewer articles than requested, we've reached the end
      if (newArticles.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setArticles((prev) => {
        // Filter out duplicates based on id
        const combined = [...prev, ...newArticles];
        return Array.from(
          new Map(combined.map((item) => [item.id, item])).values(),
        );
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [articleCategory, page]);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading],
  );

  // Set up the intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Fetch articles when page changes
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="space-y-6">
      <PageTitle title={pageTitle} subtitle={pageSubtitle} />

      {error && <Message type="error" message={error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <PaginationGridItem article={article} key={article.id} />
        ))}
      </div>

      <div ref={loaderRef} className="flex w-full justify-center py-8">
        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 place-self-center">
              <LoadingSpinner theme="light" />
            </div>
            <span>Loading more articles...</span>
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <span className="text-gray-500">{"<(^^,)>"}</span>
        )}
      </div>
    </div>
  );
};
