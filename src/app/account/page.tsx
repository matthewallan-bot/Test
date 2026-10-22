import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Account",
};

/** Account home always redirects — allow blocking navigation. */
export const instant = false;

export default function AccountPage() {
  redirect("/account/profile");
}
