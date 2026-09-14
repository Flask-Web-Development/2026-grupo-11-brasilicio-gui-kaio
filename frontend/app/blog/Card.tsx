interface CardProps {
  title: string;
  subtitle?: string;
  body: string;
  author?: string;
  date?: string;
}

export default function Card({title, subtitle, body, author, date} : CardProps){
  return(
    <div className="flex flex-col rounded-xl min-h-40 max-h-100 md:min-h-60 bg-white">
      <div className="w-full flex h-[3rem] justify-center items-center">
        <h1 className="text-black">{title}</h1>
      </div>
      <hr />
      <div className="w-full px-5">
        <h2 className="text-black">{subtitle}</h2>
        <p className="text-black">{body}</p>
        <p className="text-black">{author}</p>
        <p className="text-black">{date}</p>
      </div>
    </div>
  );
}