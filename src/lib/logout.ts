"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();

  const isSuperUser = (await cookieStore).get("isSuperUser")?.value === "true";

  // Delete access_token and refresh_token cookies
  (await cookieStore).set("accessToken", "", { expires: new Date(0) });
  (await cookieStore).set("refreshToken", "", { expires: new Date(0) });
  (await cookieStore).set("isSuperUser", "", { expires: new Date(0) });

  // Redirect user to login page
  redirect(isSuperUser ? "/admin/login" : "/venue/login");
}
