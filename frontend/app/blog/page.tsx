import Header from "../../components/Header";
import BlogPage from "./BlogPage";
import TabBar from "../../components/TabBar";

export default function Page() {
  return (
    <div className="grid grid-rows-[4rem_1fr_4rem] min-h-screen">
      <div>
        <Header/>
      </div>

      <div>
        <BlogPage/>
      </div>

      <div className="hidden">
        {/*fix this shit later, do md:hidden */} 
        <TabBar/>
      </div>
    </div>
  );
}
