export default function LandingPage() {
  return (
    <section className="flex h-full items-center bg-black px-4 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Texto */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A017]">
            IFRN · Campus Parnamirim
          </span>

          <h1 className="mt-5 max-w-lg font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            O blog do IF-PAR: pesquisa, extensão e histórias de quem
            faz parte do campus.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            Um espaço para acompanhar projetos, conquistas de alunos e
            professores, e tudo que acontece dentro e fora da sala de aula no
            campus Parnamirim.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4A017] px-6 py-3 text-sm font-semibold text-[#0B3D2E] transition-transform hover:scale-[1.03]"
            >
              Ler o blog
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="size-4"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Elemento visual — fio + numeração, ecoando o header */}
        <div className="hidden md:block">
          <div className="border-l-2 border-[#D4A017]/40 pl-8">
            <span className="font-serif text-6xl font-bold text-white/50">
              01
            </span>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              Primeira versão do blog, reunindo os projetos mais recentes do clube de programação.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}