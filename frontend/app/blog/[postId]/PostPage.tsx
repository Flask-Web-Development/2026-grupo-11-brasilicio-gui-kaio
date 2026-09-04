
import { notFound } from "next/navigation";

const post_data_test = [
  { id: 1, title: "Professor Gay Tem Relações com Padre Gay", body: "wira1111" },
  { id: 2, title: "Não Ao Cream Cracker!!!", body: "wira1111" },
  { id: 3, title: "Campus Do Amor, Alunos Correm Pelados No São João", body: "wira1111" },
];

export default async function PostPage({id} : {id:string} ) {
  const post = post_data_test.find((p) => p.id === Number(id)); //substitute to fetch

  if (!post) {
    notFound();
  }

  return (
    <div className="h-full bg-[#071C16] px-8 py-16">
      <article className="w-full flex flex-col">
        <h1 className="font-serif text-4xl text-center font-bold text-white">
          {post.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#F3EFE4]/90">
          {post.body}
        </p>
      </article>
    </div>
  );
}