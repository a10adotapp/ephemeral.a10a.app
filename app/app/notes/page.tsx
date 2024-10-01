import { redirect } from "next/navigation";

export default function Page() {
  return redirect("/notes/new");
}
