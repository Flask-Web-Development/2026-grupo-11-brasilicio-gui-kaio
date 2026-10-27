"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

import { loginTraditional } from "@/lib/api/endpoints/auth";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 bg-black h-full">
      <div className="hidden bg-linear-115 from-[#0A2B20] via-[#0A2B20] to-[#061A13] lg:flex lg:flex-col lg:justify-center px-10">
        <div className="flex flex-col">
          <hr className="mb-5 w-[80%] place-self-center" />
          <p className="mb-4 inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-[#cfe3da]">
            Acesso restrito à equipe do campus
          </p>
          <h1 className="font-serif text-4xl font-bold text-white">
            Painel administrativo do blog
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#cfe3da]">
            Publique posts, gerencie o mural de projetos e mantenha a comunidade
            do campus Parnamirim atualizada.
          </p>
          <hr className="mt-5 w-[80%] place-self-center" />
        </div>
      </div>

      {/* Painel de login */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm rounded-2xl bg-[#F5F1E6] p-8 shadow-2xl">
          <p className="mb-1 text-xs font-medium text-[#0F3D2E]">
            Acesso restrito para administradores
          </p>
          <h2 className="text-2xl font-bold text-black">Entrar no painel</h2>
          <p className="mt-2 text-sm text-[#5b5347]">
            Use as credenciais fornecidas pela coordenação do campus.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setErro(null);
              setCarregando(true);

              try {
                await loginTraditional({ username, password });
                router.push("/");
              } catch {
                setErro(
                  "Não foi possível entrar. Verifique seu e-mail e senha.",
                );
              } finally {
                setCarregando(false);
              }
            }}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-black"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-[#ddd3bd] bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-[#a89f8d] focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-black"
                >
                  Senha
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-[#0F3D2E] hover:underline"
                >
                  Esqueci a senha
                </Link>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#ddd3bd] bg-white px-3 py-2.5 focus-within:border-[#0F3D2E] focus-within:ring-2 focus-within:ring-[#0F3D2E]/20">
                <input
                  id="password"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="•••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-[#a89f8d]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="shrink-0 text-xs font-medium text-[#8a8171] hover:text-black"
                >
                  {mostrarSenha ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-1 rounded-lg bg-[#E0A53C] min-h-10 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d1962f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carregando ? (
                <ImSpinner8
                  size={21}
                  className="animate-spin place-self-center"
                />
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
