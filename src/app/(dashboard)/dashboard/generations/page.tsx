import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getGenerations } from "@/modules/replicate/actions/get-generations";
import { GenerationHistoryView } from "@/modules/replicate/views/generation-history-view";

const GenerationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get user's generations
  const result = await getGenerations(1, 50); // Get first 50 generations

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error Loading Generations</h1>
          <p className="text-muted-foreground">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <GenerationHistoryView 
        initialGenerations={result.generations || []}
        className="max-w-7xl mx-auto"
      />
    </div>
  );
};

export default GenerationsPage;