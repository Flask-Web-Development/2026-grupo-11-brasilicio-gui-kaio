"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

import Card from "@/components/Card";

//test block, substitute with real fetch when backend ready
const data_test1 = [
  { id: 1, title: "wablua", body: "wira" },
  { id: 2, title: "wablua2", body: "wira2" },
  { id: 3, title: "wablua2", body: "wira2" },
  { id: 4, title: "wablua2", body: "wira2" },
  { id: 5, title: "wablua2", body: "wira2" },
  { id: 6, title: "wablua2", body: "wira2" },
  { id: 7, title: "wablua2", body: "wira2" },
  { id: 8, title: "wablua2", body: "wira2" },
];

const data_test = [
  { id: 1, author: "Voices Of My Head", date: new Date(Date.now()).toISOString().slice(0, 10), title: "Professor Gay Tem Relações com Padre Gay", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira" },
  { id: 2, author: "Voices Of My Head", date: new Date(Date.now()).toISOString().slice(0, 10), title: "Não Ao Cream Cracker!!!", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 3, author: "Voices Of My Head", date: new Date(Date.now()).toISOString().slice(0, 10), title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
];

const data_test2 = [
  { id: 1, title: "wablua1", body: "wira1" },
  { id: 2, title: "wablua2", body: "wira2" },
  { id: 3, title: "wablua3", body: "wira3" },
  { id: 4, title: "wablua4", body: "wira4" },
  { id: 5, title: "wablua5", body: "wira5" },
  { id: 6, title: "wablua6", body: "wira6" },
  { id: 7, title: "wablua7", body: "wira7" },
  { id: 8, title: "wablua8", body: "wira8" },
  { id: 9, title: "wablua9", body: "wira9" },
  { id: 10, title: "wablua10", body: "wira10" },
  { id: 11, title: "wablua11", body: "wira11" },
  { id: 12, title: "wablua12", body: "wira12" },
  { id: 13, title: "wablua13", body: "wira13" },
  { id: 14, title: "wablua14", body: "wira14" },
  { id: 15, title: "wablua15", body: "wira15" },
  { id: 16, title: "wablua16", body: "wira16" },
  { id: 17, title: "wablua17", body: "wira17" },
  { id: 18, title: "wablua18", body: "wira18" },
  { id: 19, title: "wablua19", body: "wira19" },
  { id: 20, title: "wablua20", body: "wira20" },
  { id: 21, title: "wablua21", body: "wira21" },
  { id: 22, title: "wablua22", body: "wira22" },
  { id: 23, title: "wablua23", body: "wira23" },
  { id: 24, title: "wablua24", body: "wira24" },
  { id: 25, title: "wablua25", body: "wira25" },
  { id: 26, title: "wablua26", body: "wira26" },
  { id: 27, title: "wablua27", body: "wira27" },
  { id: 28, title: "wablua28", body: "wira28" },
  { id: 29, title: "wablua29", body: "wira29" },
  { id: 30, title: "wablua30", body: "wira30" },
  { id: 31, title: "wablua31", body: "wira31" },
  { id: 32, title: "wablua32", body: "wira32" },
  { id: 33, title: "wablua33", body: "wira33" },
  { id: 34, title: "wablua34", body: "wira34" },
  { id: 35, title: "wablua35", body: "wira35" },
  { id: 36, title: "wablua36", body: "wira36" },
  { id: 37, title: "wablua37", body: "wira37" },
  { id: 38, title: "wablua38", body: "wira38" },
  { id: 39, title: "wablua39", body: "wira39" },
  { id: 40, title: "wablua40", body: "wira40" },
  { id: 41, title: "wablua41", body: "wira41" },
  { id: 42, title: "wablua42", body: "wira42" },
  { id: 43, title: "wablua43", body: "wira43" },
  { id: 44, title: "wablua44", body: "wira44" },
  { id: 45, title: "wablua45", body: "wira45" },
  { id: 46, title: "wablua46", body: "wira46" },
  { id: 47, title: "wablua47", body: "wira47" },
  { id: 48, title: "wablua48", body: "wira48" },
  { id: 49, title: "wablua49", body: "wira49" },
  { id: 50, title: "wablua50", body: "wira50" },
  { id: 51, title: "wablua51", body: "wira51" },
  { id: 52, title: "wablua52", body: "wira52" },
  { id: 53, title: "wablua53", body: "wira53" },
  { id: 54, title: "wablua54", body: "wira54" },
  { id: 55, title: "wablua55", body: "wira55" },
  { id: 56, title: "wablua56", body: "wira56" },
  { id: 57, title: "wablua57", body: "wira57" },
  { id: 58, title: "wablua58", body: "wira58" },
  { id: 59, title: "wablua59", body: "wira59" },
  { id: 60, title: "wablua60", body: "wira60" },
  { id: 61, title: "wablua61", body: "wira61" },
  { id: 62, title: "wablua62", body: "wira62" },
  { id: 63, title: "wablua63", body: "wira63" },
  { id: 64, title: "wablua64", body: "wira64" },
  { id: 65, title: "wablua65", body: "wira65" },
  { id: 66, title: "wablua66", body: "wira66" },
  { id: 67, title: "wablua67", body: "wira67" },
  { id: 68, title: "wablua68", body: "wira68" },
  { id: 69, title: "wablua69", body: "wira69" },
  { id: 70, title: "wablua70", body: "wira70" },
  { id: 71, title: "wablua71", body: "wira71" },
  { id: 72, title: "wablua72", body: "wira72" },
];
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
            <Card title={post.title} subtitle={post.subtitle} body={post.body} author={post.author} date={post.date}/>
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