import Header from "../../components/Header";
import BlogPage from "./BlogPage";
import TabBar from "../../components/TabBar";

export default function Page() {
  return (
    <div className="grid grid-rows-[5rem_1fr] min-h-screen">
      <div className="sticky top-0">
        <Header/>
      </div>

      <div>
        <BlogPage/>
      </div>
    </div>
  );
}
