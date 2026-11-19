import Header from "@/components/Header";
import CreatePostPage from "./CreatePostPage";


export default async function Page() {

  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header/>
      </div>

      <div>
        <CreatePostPage/>
      </div>
    </div>
  );
}