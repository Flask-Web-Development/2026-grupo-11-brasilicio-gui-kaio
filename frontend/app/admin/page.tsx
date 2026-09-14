import Header from "@/components/Header";
import AdminLogin from "./AdminLoginPage";

export default async function Page({params,}: {params: Promise<{ postId: string }>}) {
  const { postId } = await params;

  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header/>
      </div>

      <div>
        <AdminLogin/>
      </div>
    </div>
  );
}