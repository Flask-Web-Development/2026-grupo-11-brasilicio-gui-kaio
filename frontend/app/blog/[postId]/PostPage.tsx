
import { notFound } from "next/navigation";

const post_data_test = [
  { id: 1, author:"Voices Of My Head", date: new Date(Date.now()), title: "Professor Gay Tem Relações com Padre Gay", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "Tem dias em que o mundo parece pesado demais, como se cada escolha do passado cobrasse juros altíssimos de uma vez só. A gente se pega olhando para trás, tentando decifrar em qual curva o caminho se perdeu ou em qual momento o controle escorregou pelas mãos. É uma sensação sufocante, que paralisa e faz parecer que o futuro é apenas a repetição dos mesmos erros. Mas a verdade nua e crua é que a vida não tem a obrigação de ser linear, e o caos, por mais doloroso que seja, costuma ser o terreno mais fértil para as grandes transformações.Viver de verdade exige uma coragem absurda. Exige aceitar que nem tudo vai sair como o planejado e que, muitas vezes, o tombo é inevitável. O que realmente define quem somos não é a quantidade de vezes que fomos ao chão, mas a forma como limpamos a poeira e decidimos levantar. Cada cicatriz carrega uma história de sobrevivência, um aprendizado que nenhum livro seria capaz de ensinar. Elas não são marcas de vergonha, são troféus de quem teve a audácia de arriscar, de sentir e de se expor ao mundo.Chega um momento em que é preciso fazer as pazes com o ontem. O passado é um mestre implacável, mas um péssimo lugar para morar. Olhar para trás com rancor ou culpa só serve para acorrentar os passos no presente. É preciso ter a generosidade de perdoar a si mesmo pelas versões antigas, aquelas que tomaram decisões erradas simplesmente porque ainda não sabiam como fazer melhor. A maturidade não nasce da ausência de falhas, mas da capacidade de olhar para elas e dizer: Eu mudei.O agora é a única moeda real que temos em mãos. É neste exato segundo que reside o poder de mudar de rota, de quebrar ciclos viciosos e de escolher novos rumos. Não dá para esperar o cenário perfeito, o apoio ideal ou a ausência de medo para começar a agir. O medo nunca vai sumir por completo; a diferença está em caminhar apesar dele. Cada pequena escolha diária, por mais insignificante que pareça, é um tijolo na construção do que você deseja se tornar." },
  { id: 2, author:"Voices Of My Head", date: new Date(Date.now()), title: "Não Ao Cream Cracker!!!", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira1111" },
  { id: 3, author:"Voices Of My Head", date: new Date(Date.now()), title: "Campus Do Amor, Alunos Correm Pelados No São João", subtitle:"MY GREAT FUCKING SUBTITLEEEEEEEEEEEEE", body: "wira1111" },
];

export default async function PostPage({id} : {id:string} ) {
  const post = post_data_test.find((p) => p.id === Number(id)); //substitute to fetch

  if (!post) {
    notFound();
  }

  return (
    <div className="h-full flex bg-[#071C16] px-5 py-8 md:px-10 md:py-16">
      <article className="w-full flex-col justify-items-center gap-5">
        
        <header className="flex w-full flex-col gap-4">
          <h1 className="font-sans text-4xl text-center font-bold text-white">
            {post.title}
          </h1>
          <h4 className="font-mono text-xl text-center font-semibold text-gray-100/80">
            {post.subtitle}
          </h4>

          <p className="text-gray-200/70 md:ms-10">Autor: {post.author}</p>
          <p className="text-gray-200/70 md:ms-10">Data de Publicação: {post.date.toLocaleString()}</p>
        </header>

        <p className="mt-6 text-xl md:text-lg text-justify leading-relaxed w-[95%] text-gray-200/90">
          {post.body}
        </p>

      </article>
    </div>
  );
}