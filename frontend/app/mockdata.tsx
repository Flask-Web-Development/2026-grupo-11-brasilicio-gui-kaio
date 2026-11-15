export type Post = {
  id: number;
  author: string;
  date: Date;
  title: string;
  subtitle: string;
  body: string;
};

export const posts: Post[] = [
  {
    id: 1,
    author: "Equipe de Comunicação",
    date: new Date("2026-11-03T09:00:00"),
    title: "Semana de Ciência e Tecnologia reúne estudantes no campus",
    subtitle: "Palestras, oficinas e exposições marcaram uma semana de troca de conhecimento.",
    body: `A Semana de Ciência e Tecnologia movimentou o campus Parnamirim com atividades para todos os cursos. Estudantes participaram de palestras, minicursos e oficinas práticas conduzidas por professores e convidados externos.

Entre os destaques, a mostra de projetos permitiu que as turmas apresentassem trabalhos desenvolvidos ao longo do ano, aproximando a teoria vista em sala de aula de problemas reais da comunidade.

A organização avaliou o evento de forma positiva e já planeja novas edições, com mais espaço para a participação dos estudantes na construção da programação.`,
  },
  {
    id: 2,
    author: "Maria Souza",
    date: new Date("2026-10-21T14:30:00"),
    title: "Feira de Projetos Integradores destaca soluções criadas pelos alunos",
    subtitle: "Trabalhos de diferentes turmas mostram como a tecnologia pode resolver problemas do dia a dia.",
    body: `A Feira de Projetos Integradores reuniu equipes de várias turmas para apresentar suas ideias a professores, colegas e visitantes. Os trabalhos incluíram aplicativos, sites e protótipos pensados para necessidades da própria comunidade escolar.

Para os estudantes, o evento foi uma oportunidade de treinar a comunicação, receber feedback e perceber o impacto prático do que estudam.`,
  },
  {
    id: 3,
    author: "João Pereira",
    date: new Date("2026-06-26T18:00:00"),
    title: "Festival Junino do campus celebra a cultura nordestina",
    subtitle: "Quadrilhas, comidas típicas e muita música animaram a comunidade escolar.",
    body: `O tradicional Festival Junino voltou ao campus com apresentações de quadrilha, barracas de comidas típicas e música ao vivo. Alunos, servidores e familiares participaram da festa.

Além da diversão, o evento reforçou a importância de valorizar as tradições da região e promoveu a integração entre turmas e cursos.`,
  },
];

export const getPosts = () => posts;