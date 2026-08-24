import Header from "./components/Header";
import MainPage from "./views/MainPage";

export default function Page() {
  return (
    <div className="grid grid-rows-[100px_1fr_100px] min-h-screen">
      <div>
        <Header/>
      </div>

      <div>
        <MainPage/>
      </div>

      <div>
        <Header/>
      </div>
    </div>
  );
}
