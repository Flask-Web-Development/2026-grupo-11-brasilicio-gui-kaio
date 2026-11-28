"use client";

// ÍNDICE DAS TELAS DE INTEGRAÇÃO (não é cópia de nada; page.tsx é obrigatório para ser rota).
// Cada rota em app/dev/** só reexporta uma tela "-copia.tsx". Veja o MAPA.md na raiz do projeto.
// Mostra quem está logado e tem o botão de logout (POST /api/auth/logout).

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser,
  logout,
  type CurrentUser,
} from "@/lib/api/endpoints/auth";

export default function DevIndex() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecked(true));
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <div>
      <h1>Telas de integração (dev)</h1>

      <h2>Sessão</h2>
      {!checked && <p>Verificando...</p>}
      {checked && !user && <p>Ninguém logado.</p>}
      {user && (
        <p>
          Logado como: {user.username ?? "?"} | admin: {String(user.isAdmin)} |
          admin master:
          {String(user.isAdminMaster)}
          <button onClick={handleLogout}>Sair (logout)</button>
        </p>
      )}
      <p>
        <Link href="/auth">Login SUAP (aluno/admin)</Link> |
        <Link href="/admin">Login Admin Master</Link>
      </p>
      <p>
        Depois de promover/rebaixar alguém, a pessoa precisa sair e entrar de
        novo.
      </p>

      <h2>Público (sem login)</h2>
      <p>
        <Link href="/dev/blog">Lista de posts</Link> (o detalhe abre pela lista)
      </p>

      <h2>Admin SUAP</h2>
      <p>
        <Link href="/dev/admin/posts">Posts (listar, excluir)</Link>
      </p>
      <p>
        <Link href="/dev/admin/posts/new">Criar post</Link> (editar abre pela
        lista)
      </p>
      <p>
        <Link href="/dev/admin/trash">Lixeira</Link>
      </p>
      <p>
        <Link href="/dev/admin/tags">Tags</Link>
      </p>
      <p>
        <Link href="/dev/admin/ouvidoria">
          Ouvidoria: todas as solicitações
        </Link>
      </p>

      <h2>Admin ou Admin Master</h2>
      <p>
        <Link href="/dev/admin/users">Usuários (promover/rebaixar)</Link>
      </p>

      <h2>Usuário logado com conta SUAP</h2>
      <p>
        <Link href="/dev/ouvidoria">Ouvidoria: minhas solicitações</Link>
      </p>
    </div>
  );
}
