import { Metadata } from "next";
import Hero from "@/components/Hero";
import RedditDashboard from "@/components/RedditDashboard";

export const metadata: Metadata = {
  title: "Reddit finder",

  // other metadata
  description: "Obtain relevant post information through the Reddit platform and use AI analysis to search and analyze to determine the most suitable posts"
};

export default async function Home() {

  return (
    <main>
      {/*<Hero/>*/}
      <RedditDashboard/>
    </main>
  );
}

