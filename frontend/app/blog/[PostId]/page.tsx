
import Header from "@/components/Header";
import PostPage from "./PostPage";

export default async function Page({params,}: {params: Promise<{ PostId: string }>}) {
  const { PostId } = await params;

  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header/>
      </div>

      <div>
        <PostPage id={PostId}/>
      </div>
    </div>
  );
}