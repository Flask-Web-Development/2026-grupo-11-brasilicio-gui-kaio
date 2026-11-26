"use client";

// SEM ORIGINAL (tela nova; o dashboard tem cards apontando para /users e /admins). Minimalista, sem estilo.
// Endpoints: GET /users (getUsers), PUT /users/{id}/role (updateUserRole)
// Abrir no navegador: /dev/admin/users  (ADMIN ou Admin Master)
// Regras: ninguém altera o próprio papel (o backend devolve erro).
// O papel só vale na sessão de quem foi promovido DEPOIS de ele sair e entrar de novo.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers, updateUserRole } from "@/lib/api/endpoints/users";
import { UserRole, type User } from "@/types/user";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";

export default function UsersPageCopia() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    setError("");

    try {
      setUsers(await getUsers());
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRole(user: User, role: UserRole) {
    setError("");

    try {
      await updateUserRole(user.user_id, { role });
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div>
      <h1>Usuários</h1>

      <p>
        <Link href="/dev">Índice</Link>
      </p>

      {error && <p>ERRO: {error}</p>}

      {loading && <p>Carregando...</p>}

      {users.map((u) => (
        <div key={u.user_id}>
          <p>
            {u.name ?? "(sem nome)"} — matrícula: {u.user_id} — {u.email ?? "-"}
          </p>

          <p>
            curso: {u.course ?? "-"} | campus: {u.campus ?? "-"} | papel:
            {u.role}
          </p>

          <p>
            {u.role === UserRole.STUDENT ? (
              <button onClick={() => handleRole(u, UserRole.ADMIN)}>
                Promover a ADMIN
              </button>
            ) : (
              <button onClick={() => handleRole(u, UserRole.STUDENT)}>
                Rebaixar para STUDENT
              </button>
            )}
          </p>
          <hr />
        </div>
      ))}

      {!loading && users.length === 0 && !error && <p>Nenhum usuário.</p>}
    </div>
  );
}
