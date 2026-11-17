export type Post = {
  PostId: number;
  Slug: string;
  Title: string;
  Subtitle: string | null;
  Content: string;
  IsFixed: boolean;
  Status: "RASCUNHO" | "PUBLICADO";
  PublishedAt: Date | null;
  PublishedBy: string | null;
  UpdatedAt: Date | null;
  UpdatedBy: string | null;
  DeletedAt: Date | null;
  DeletedBy: string | null;
};

export const posts: Post[] = [
  {
    PostId: 1,
    Slug: "semana-de-ciencia-e-tecnologia",
    Title: "Semana de Ciência e Tecnologia reúne estudantes no campus",
    Subtitle:
      "Palestras, oficinas e exposições marcaram uma semana de troca de conhecimento.",
    Content: `A Semana de Ciência e Tecnologia movimentou o campus Parnamirim com atividades para todos os cursos. Estudantes participaram de palestras, minicursos e oficinas práticas conduzidas por professores e convidados externos.

Entre os destaques, a mostra de projetos permitiu que as turmas apresentassem trabalhos desenvolvidos ao longo do ano, aproximando a teoria vista em sala de aula de problemas reais da comunidade.

A organização avaliou o evento de forma positiva e já planeja novas edições, com mais espaço para a participação dos estudantes na construção da programação.`,
    IsFixed: false,
    Status: "PUBLICADO",
    PublishedAt: new Date("2026-11-03T09:00:00"),
    PublishedBy: "Equipe de Comunicação",
    UpdatedAt: null,
    UpdatedBy: null,
    DeletedAt: null,
    DeletedBy: null,
  },
  {
    PostId: 2,
    Slug: "feira-de-projetos-integradores",
    Title: "Feira de Projetos Integradores destaca soluções criadas pelos alunos",
    Subtitle:
      "Trabalhos de diferentes turmas mostram como a tecnologia pode resolver problemas do dia a dia.",
    Content: `A Feira de Projetos Integradores reuniu equipes de várias turmas para apresentar suas ideias a professores, colegas e visitantes. Os trabalhos incluíram aplicativos, sites e protótipos pensados para necessidades da própria comunidade escolar.

Para os estudantes, o evento foi uma oportunidade de treinar a comunicação, receber feedback e perceber o impacto prático do que estudam.`,
    IsFixed: false,
    Status: "PUBLICADO",
    PublishedAt: new Date("2026-10-21T14:30:00"),
    PublishedBy: "Maria Souza",
    UpdatedAt: null,
    UpdatedBy: null,
    DeletedAt: null,
    DeletedBy: null,
  },
  {
    PostId: 3,
    Slug: "festival-junino-do-campus",
    Title: "Festival Junino do campus celebra a cultura nordestina",
    Subtitle:
      "Quadrilhas, comidas típicas e muita música animaram a comunidade escolar.",
    Content: `O tradicional Festival Junino voltou ao campus com apresentações de quadrilha, barracas de comidas típicas e música ao vivo. Alunos, servidores e familiares participaram da festa.

Além da diversão, o evento reforçou a importância de valorizar as tradições da região e promoveu a integração entre turmas e cursos.`,
    IsFixed: false,
    Status: "PUBLICADO",
    PublishedAt: new Date("2026-06-26T18:00:00"),
    PublishedBy: "João Pereira",
    UpdatedAt: null,
    UpdatedBy: null,
    DeletedAt: null,
    DeletedBy: null,
  },
];

export const getPosts = (): Post[] => posts;