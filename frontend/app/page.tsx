import Header from "./components/Header";
import MainPage from "./views/MainPage";
import TabBar from "./components/TabBar";

export default function Page() {
  return (
    <div className="grid grid-rows-[4rem_1fr_4rem] min-h-screen">
      <div>
        <Header/>
      </div>

      <div>
        <MainPage/>
      </div>

      <div>
        {/*fix this shit later, do md:hidden */} 
        <TabBar/>
      </div>
    </div>
  );
}
