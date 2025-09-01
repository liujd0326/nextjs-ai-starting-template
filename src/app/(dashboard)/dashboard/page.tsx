import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4 text-muted-foreground">
        This is the dashboard page that requires authentication to access.
      </p>
    </div>
  );
};

export default DashboardPage;
