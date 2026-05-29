import { redirect } from "next/navigation";

// redeploy update
export default function Home() {
  redirect("/login");
}