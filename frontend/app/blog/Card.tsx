interface CardProps {
  title: string;
  body: string;
}

export default function Card({title, body} : CardProps){
  return(
    <div className="flex flex-col rounded-xl min-h-40 max-h-100 md:min-h-60 bg-white">
      <div className="w-full flex h-[3rem] justify-center items-center">
        <h1 className="text-black">{title}</h1>
      </div>
      <hr />
      <div className="w-full px-5">
        <p className="text-black">{body}</p>
      </div>
    </div>
  );
}