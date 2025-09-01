import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignInView from "@/modules/auth/views/sign-in-view";

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 如果用户已经登录，重定向到首页
  if (session?.user) {
    redirect("/");
  }

  return <SignInView />;
};

export default SignInPage;
