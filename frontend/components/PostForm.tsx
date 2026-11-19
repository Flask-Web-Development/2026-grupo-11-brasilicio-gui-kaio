"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Post } from "@/app/mockdata";

export type PostFormValues = Pick<
  Post,
  "Title" | "Subtitle" | "Content" | "IsFixed" | "Status"
>;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

const fieldClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-emerald-900/40 px-3 text-stone-100 placeholder:text-emerald-300/50 focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
      : "border-emerald-800 focus:border-amber-400 focus:ring-amber-400"
  }`;

type Props = {
  heading: string;
  submitLabel: string;
  initialPost?: Post;
  onSave: (input: PostFormValues) => void
};

export default function PostForm({ heading, submitLabel, initialPost, onSave }: Props) {
  const [title, setTitle] = useState(initialPost?.Title ?? "");
  const [subtitle, setSubtitle] = useState(initialPost?.Subtitle ?? "");
  const [content, setContent] = useState(initialPost?.Content ?? "");
  const [isFixed, setIsFixed] = useState(initialPost?.IsFixed ?? false);
  const [status, setStatus] = useState<Post["Status"]>(initialPost?.Status ?? "RASCUNHO");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="min-h-full w-full bg-emerald-950 text-stone-100">
      <form
        noValidate
        className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10"
        onSubmit={(e) => {
          e.preventDefault();

          const next: typeof errors = {};
          if (!title.trim()) next.title = "Informe um título para o post.";
          if (!content.trim()) next.content = "Escreva o conteúdo do post.";
          setErrors(next);
          if (next.title) return titleRef.current?.focus();
          if (next.content) return contentRef.current?.focus();

          setSaving(true);
          onSave({
            Title: title.trim(),
            Subtitle: subtitle.trim() || null,
            Content: content.trim(),
            IsFixed: isFixed,
            Status: status,
          });
        }}
      >
        <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="post-title" className="mb-1 block text-sm font-medium">Título</label>
            <input
              ref={titleRef}
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "post-title-error" : undefined}
              className={`min-h-11 ${fieldClass(Boolean(errors.title))}`}
            />
            {errors.title && (
              <p id="post-title-error" role="alert" className="mt-1 text-sm text-red-300">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="post-subtitle" className="mb-1 block text-sm font-medium">
              Subtítulo <span className="font-normal text-emerald-300/70">(opcional)</span>
            </label>
            <input
              id="post-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={`min-h-11 ${fieldClass(false)}`}
            />
          </div>

          <div>
            <label htmlFor="post-content" className="mb-1 block text-sm font-medium">Conteúdo</label>
            <textarea
              ref={contentRef}
              id="post-content"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? "post-content-error" : undefined}
              className={`min-h-64 resize-y py-2 leading-relaxed ${fieldClass(Boolean(errors.content))}`}
            />
            {errors.content && (
              <p id="post-content-error" role="alert" className="mt-1 text-sm text-red-300">
                {errors.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="post-status" className="mb-1 block text-sm font-medium">Situação</label>
              <select
                id="post-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Post["Status"])}
                className={`min-h-11 ${fieldClass(false)}`}
              >
                <option value="RASCUNHO">Rascunho (não aparece no blog)</option>
                <option value="PUBLICADO">Publicado</option>
              </select>
            </div>

            <label className="flex min-h-11 items-center gap-3 self-end text-sm font-medium">
              <input
                type="checkbox"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="size-5 accent-amber-400"
              />
              Fixar no topo do blog
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/admin/dashboard"
            className={`flex min-h-11 items-center justify-center rounded-lg border border-emerald-700 px-5 text-sm font-medium transition-colors hover:bg-emerald-800 ${focusRing}`}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`min-h-11 rounded-lg bg-amber-400 px-5 font-semibold text-emerald-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {saving ? "Salvando..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}