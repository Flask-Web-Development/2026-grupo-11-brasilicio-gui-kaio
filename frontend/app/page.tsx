import Header from "../components/Header";
import LandingPage from "./LandingPage";
import TabBar from "../components/TabBar";

export default function Page() {
  return (
    <div className="grid grid-rows-[5rem_1fr] md:grid-rows-[4rem_1fr] min-h-screen">
      <div>
        <Header/>
      </div>

      <div>
        <LandingPage/>
      </div>
    </div>
  );
}
