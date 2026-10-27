"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { internalFetch } from "@/lib/api/client";

export default function SetupPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await internalFetch("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      router.push("/");
    } catch {
      setError("Não foi possível definir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-[#F5F1E6] p-8"
      >
        <h1 className="text-2xl font-bold text-black">Defina sua senha</h1>
        <p className="mt-2 text-sm text-[#5b5347]">
          Este passo é necessário para permitir futuros logins por matrícula ou
          e-mail.
        </p>
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nova senha"
          className="mt-6 w-full rounded-lg border px-3 py-2 text-black"
        />
        <input
          required
          minLength={8}
          type="password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="Confirme a senha"
          className="mt-3 w-full rounded-lg border px-3 py-2 text-black"
        />
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-[#E0A53C] px-4 py-2 font-semibold text-black disabled:opacity-70"
        >
          {loading ? "Salvando..." : "Continuar"}
        </button>
      </form>
    </main>
  );
}
