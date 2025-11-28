import { HomeContainer } from "@/features/home/components/HomeContainer";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContainer />
    </Suspense>
  );
}
