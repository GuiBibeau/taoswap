"use server";

import { addToWaitlist, sendWelcomeEmail } from "@/app/lib/email-list";
import { redirect } from "next/navigation";

export async function subscribeToWaitlist(formData: FormData) {
  "use server";
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    redirect("/something-went-wrong");
  }

  const result = await addToWaitlist(email);

  console.log("Result:", result);

  if (!result.success && result.message === "Email already registered") {
    redirect("/email-already-exists");
  }

  await sendWelcomeEmail(email);

  redirect("/thank-you");
}
