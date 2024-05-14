import Image from "next/image";
import { Inter } from "next/font/google";
import Search from '@components/Search'
import Results from "@/components/ResultsExtras/Results";
import Filters from "@/components/Filters";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="grid-container">
      <Search/>
      <div className="grid grid-cols-[minmax(200px,1fr)_4fr]">
        <Filters/>
        <Results/>
      </div>
    </main>
  );
}

