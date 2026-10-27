import Header from "@/components/Header";
import DashboardPage from "./DashboardPage";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session?.isAdmin) redirect("/auth");

  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header />
      </div>

      <div>
        <DashboardPage />
      </div>
    </div>
  );
}
