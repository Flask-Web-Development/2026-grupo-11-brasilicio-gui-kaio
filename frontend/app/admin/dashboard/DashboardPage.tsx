"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GrUser, GrUserAdmin } from "react-icons/gr";
import { BiSearch, BiSolidEdit, BiSolidFilePlus, BiSolidTrash } from "react-icons/bi";

type Post = {
  id: number;
  author: string;
  date: string;
  title: string;
  subtitle: string;
  body: string;
};

const today = new Date(Date.now()).toISOString().slice(0, 10);

const data_test: Post[] = [
  { id: 1, author: "Voices Of My Head", date: today, title: "Professor Gay Tem Relações com Padre Gay", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira" },
  { id: 2, author: "Voices Of My Head", date: today, title: "Não Ao Cream Cracker!!!", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 3, author: "Voices Of My Head", date: today, title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 4, author: "Voices Of My Head", date: today, title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 5, author: "Voices Of My Head", date: today, title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 6, author: "Voices Of My Head", date: today, title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
  { id: 7, author: "Voices Of My Head", date: today, title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle: "MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira2" },
];

// "2026-10-08" -> "08/10/2026" (sem new Date, para não sofrer com fuso horário)
const formatDate = (iso: string) => iso.split("-").reverse().join("/");

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>(data_test);
  const [query, setQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.author.toLowerCase().includes(normalized)
      )
    : posts;

  const confirmDelete = () => {
    if (!postToDelete) return;
    // TODO: chamar a API de exclusão aqui antes de atualizar o estado
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    setPostToDelete(null);
  };

  return (
    <div className="min-h-full w-full bg-emerald-950 text-stone-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Painel administrativo</h1>
          <p className="mt-1 text-sm text-emerald-200/70">
            Gerencie as contas e os posts do blog.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Link href="/admin/dashboard/users" className={`flex items-center gap-4 rounded-xl border border-emerald-800 bg-emerald-900/40 p-4 transition-colors hover:bg-emerald-900 ${focusRing}`}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-800 text-emerald-100">
              <GrUser size={22}/>
            </span>
            <span>
              <span className="block font-semibold">Usuários</span>
              <span className="block text-sm text-emerald-200/70">Ver contas cadastradas</span>
            </span>
          </Link>

          <Link href="/admin/dashboard/admins" className={`flex items-center gap-4 rounded-xl border border-emerald-800 bg-emerald-900/40 p-4 transition-colors hover:bg-emerald-900 ${focusRing}`}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-800 text-emerald-100">
              <GrUserAdmin size={22}/>
            </span>
            <span>
              <span className="block font-semibold">Administradores</span>
              <span className="block text-sm text-emerald-200/70">Ver quem gerencia o blog</span>
            </span>
          </Link>
        </div>

        {/* Posts */}
        <section aria-labelledby="posts-heading" className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="posts-heading" className="text-xl font-semibold">
                Posts
              </h2>
              <p className="text-sm text-emerald-200/70">
                {filtered.length} de {posts.length}
              </p>
            </div>

            <Link
              href="/admin/dashboard/newpost"
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 font-semibold text-emerald-950 transition-colors hover:bg-amber-300 ${focusRing}`}
            >
              <BiSolidFilePlus size={22} />
              Novo post
            </Link>
          </div>

          <div className="relative mt-4">
            <BiSearch
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou autor"
              aria-label="Buscar posts"
              className="min-h-11 w-full rounded-lg border border-emerald-800 bg-emerald-900/40 pl-10 pr-3 text-stone-100 placeholder:text-emerald-300/50 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {posts.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-emerald-700 p-8 text-center">
              <p className="font-semibold">Nenhum post publicado</p>
              <p className="mt-1 text-sm text-emerald-200/70">
                Crie o primeiro post para ele aparecer no blog.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-emerald-700 p-8 text-center">
              <p className="font-semibold">Nenhum post encontrado</p>
              <p className="mt-1 text-sm text-emerald-200/70">
                Nada corresponde a “{query}”. Tente outro título ou autor.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-emerald-800 overflow-hidden rounded-xl border border-emerald-800 bg-emerald-900/30">
              {filtered.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/blog/${post.id}`}
                      className={`line-clamp-2 font-semibold hover:text-amber-300 ${focusRing}`}
                    >
                      {post.title}
                    </Link>
                    <p className="truncate text-sm text-emerald-100/70">{post.subtitle}</p>
                    <p className="mt-1 text-xs text-emerald-300/70">
                      {post.author} · {formatDate(post.date)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/dashboard/edit`}
                      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-700 px-4 text-sm font-medium transition-colors hover:bg-emerald-800 sm:flex-none ${focusRing}`}
                    >
                      <BiSolidEdit size={18} />
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/50 px-4 text-sm font-medium text-red-300 transition-colors hover:bg-red-950 sm:flex-none ${focusRing}`}
                    >
                      <BiSolidTrash size={18} />
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Confirmação de exclusão */}
      {postToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setPostToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-emerald-800 bg-emerald-950 p-6 shadow-xl"
          >
            <h3 id="delete-title" className="text-lg font-semibold">
              Excluir este post?
            </h3>
            <p id="delete-desc" className="mt-2 text-sm text-emerald-100/80">
              “{postToDelete.title}” será removido do blog. Essa ação não pode ser desfeita.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setPostToDelete(null)}
                className={`min-h-11 rounded-lg border border-emerald-700 px-5 text-sm font-medium transition-colors hover:bg-emerald-800 ${focusRing}`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={`min-h-11 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-500 ${focusRing}`}
              >
                Excluir post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}