import Header from "@/components/Header";
import EditPostPage from "./EditPostPage";

export default async function Page({params,}: {params: Promise<{ PostId: string }>}) {
  const { PostId } = await params;

  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header/>
      </div>

      <div>
        <EditPostPage id={PostId}/>
      </div>
    </div>
  );
}