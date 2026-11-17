interface CardProps {
  Title: string;
  Subtitle?: string;
  Content: string;
  Fixed: boolean;
  PublishedBy?: string;
  PublishedAt?: Date | null;
}

export default function Card({Title, Subtitle, Content, Fixed, PublishedBy, PublishedAt} : CardProps){
  return(
    <div className="flex flex-col rounded-xl min-h-40 max-h-100 md:min-h-60 bg-white">
      <div className="w-full flex h-[3rem] justify-center items-center">
        <h1 className="text-black">{Title}</h1>
      </div>
      <hr />
      <div className="w-full px-5">
        <h2 className="text-black">{Subtitle}</h2>
        <p className="text-black">{Content}</p>
        <p className="text-black">{PublishedBy ?? "Autor não informado"}</p>
        <p className="text-black">{PublishedAt ? PublishedAt.toLocaleDateString("pt-BR") : "Data não informada"}</p>
      </div>
    </div>
  );
}