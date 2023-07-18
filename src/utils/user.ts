import { type Session } from "next-auth";

export function hasOnboarded(user: Session["user"]): boolean {
  return !!user.username;
}
