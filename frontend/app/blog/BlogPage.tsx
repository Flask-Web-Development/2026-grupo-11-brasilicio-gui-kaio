"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import Card from "@/components/Card";
import { getPosts} from "../mockdata"

//test block, substitute with real fetch when backend ready
const data_test = getPosts()
//test block, substitute with real fetch when backend ready

export default function BlogView() {

  const didInit = useRef(false); 
  // delete this fucker later, just here to avoid THAT BITCH FROM STRICT MODE

  const POSTS_PER_PAGE = 9;
  const [posts, setPosts] = useState<typeof data_test>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.ceil(data_test.length / POSTS_PER_PAGE);

  const loadMore = useCallback( async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const nextPage = page + 1;
    const start = (nextPage - 1) * POSTS_PER_PAGE;
    const nextSlice = data_test.slice(start, start + POSTS_PER_PAGE);

    setPosts((prev) => [...prev, ...nextSlice]);
    setPage(nextPage);
    setHasMore(nextPage < totalPages);
    setIsLoading(false);
  }, [page, isLoading, hasMore, totalPages])

  useEffect(() => {
    if (didInit.current) return; // delete this fucker later
    didInit.current = true; // delete this fucker later
    loadMore();
  }, []);

  useEffect(() => {
    const self = loaderRef.current;
    if(!self) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting){
          loadMore();
        }
      },
      {
        root:null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(self);
    return () => observer.disconnect();
  }, [loadMore])

  return (
    <div className="h-full flex flex-col bg-linear-to-r from-green-950 to-emerald-950/50">

      <div className="border-b border-yellow-400/20 px-8 py-6">
        <div className="mx-auto flex max-w-5xl items-baseline justify-between">
          <h2 className="font-sans text-2xl font-semibold text-white">
            Publicações
          </h2>
          <span className="text-sm text-[#9FB3A8]">
            {posts.length} de {data_test.length}
          </span>
        </div>
      </div>

      {/* Grid de posts */}
      <div className="mx-auto grid w-[90%] grid-cols-1 gap-x-10 gap-y-8 px-8 py-10 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="block rounded-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A017] focus-visible:outline-offset-2"
          >
            <Card title={post.title} subtitle={post.subtitle} body={post.body} author={post.author} date={post.date.toLocaleDateString("pt-BR")}/>
          </Link>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 w-full" />

      {isLoading && (
        <div
          className="flex items-center justify-center gap-2 py-8 text-sm text-white"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/90" />
          Carregando mais publicações
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-10">
          <span className="h-px w-120 bg-yellow-500/40" />
          <p className="text-sm italic text-lime-100/50">
            Isso é tudo por enquanto.
          </p>
        </div>
      )}
    </div>
  );
}