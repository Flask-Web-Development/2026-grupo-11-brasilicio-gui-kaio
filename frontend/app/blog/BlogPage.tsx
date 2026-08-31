import { title } from "process";
import Card from "./Card"

const tab_test = [
  {id: 1, title: "wablua", body:"wira"},
  {id: 2, title: "wablua2", body:"wira2"},
  {id: 3, title: "wablua2", body:"wira2"},
  {id: 4, title: "wablua2", body:"wira2"},
  {id: 5, title: "wablua2", body:"wira2"},
  {id: 6, title: "wablua2", body:"wira2"},
  {id: 7, title: "wablua2", body:"wira2"},
  {id: 8, title: "wablua2", body:"wira2"},
]

export default function BlogView(){
  return(
    <div className="flex flex-col gap-5">
      <div className="flex col-span-3 h-[5rem] bg-white">
        wada
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-8">
        {tab_test.map( (posts) => (
          //<p>{posts.title} - {posts.body}</p>
          <Card key={posts.id} title={posts.title} body={posts.body}/>
        ))}
      </div>
    </div>
  );
}