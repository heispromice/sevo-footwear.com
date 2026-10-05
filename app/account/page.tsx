import type { Metadata } from "next";

import { AccountContent } from "./account-content";

export const metadata: Metadata = {
  title: "Account | SEVO",
  description: "Manage your SEVO account.",
};

export default function AccountPage() {
  return <AccountContent />;
}
