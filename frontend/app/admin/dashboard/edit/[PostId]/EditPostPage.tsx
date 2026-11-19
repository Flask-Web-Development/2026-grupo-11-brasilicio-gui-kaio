
import { notFound } from "next/navigation";

import { getPosts, type Post } from "@/app/mockdata";

export default async function EditPostPage({id} : {id:string} ) {
  const post = getPosts().find((p) => p.PostId === Number(id)); //substitute to fetch

  if (!post) {
    notFound();
  }

  return (
    <div className="h-full flex bg-[#071C16] px-5 py-8 md:px-10 md:py-16">
      <article className="w-full flex-col justify-items-center gap-5">
        
        <header className="flex w-full flex-col gap-4">
          <h1 className="font-sans text-4xl text-center font-bold text-white">
            {post.Title}
          </h1>
          <h4 className="font-mono text-xl text-center font-semibold text-gray-100/80">
            {post.Subtitle}
          </h4>

          <p className="text-gray-200/70 md:ms-10">Autor: {post.PublishedBy}</p>
          <p className="text-gray-200/70 md:ms-10">
            Data de publicação: {post.PublishedAt? post.PublishedAt.toLocaleString("pt-BR"): "Data não informada"}
          </p>
        </header>

        <p className="mt-6 text-xl md:text-lg text-justify leading-relaxed w-[95%] text-gray-200/90">
          {post.Content}
        </p>

      </article>
    </div>
  );
}