import { client } from "@/app/lib/redis";
import { resend } from "./resend";
import { WelcomeEmail } from "../components/landing/welcome-email";

const WAITLIST_KEY = "email_waitlist";

export async function addToWaitlist(email: string) {
  try {
    const exists = await isEmailRegistered(email);
    if (exists) {
      return { success: false, message: "Email already registered" };
    }

    await client.sadd(WAITLIST_KEY, email);
    return { success: true, message: "Successfully added to waitlist" };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    throw new Error("Failed to add to waitlist");
  }
}

export async function removeFromWaitlist(email: string) {
  try {
    const removed = await client.srem(WAITLIST_KEY, email);
    return {
      success: removed === 1,
      message:
        removed === 1
          ? "Successfully removed from waitlist"
          : "Email not found in waitlist",
    };
  } catch (error) {
    console.error("Error removing from waitlist:", error);
    throw new Error("Failed to remove from waitlist");
  }
}

export async function isEmailRegistered(email: string) {
  try {
    return await client.sismember(WAITLIST_KEY, email);
  } catch (error) {
    console.error("Error checking email registration:", error);
    throw new Error("Failed to check email registration");
  }
}

export async function getAllWaitlistEmails() {
  try {
    return await client.smembers(WAITLIST_KEY);
  } catch (error) {
    console.error("Error getting waitlist:", error);
    throw new Error("Failed to get waitlist");
  }
}

export async function getWaitlistCount() {
  try {
    return await client.scard(WAITLIST_KEY);
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    throw new Error("Failed to get waitlist count");
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    const response = await resend.emails.send({
      from: "TaoSwap <noreply@taoswap.finance>",
      to: email,
      subject: "Welcome to TaoSwap!",
      react: WelcomeEmail({}) as React.ReactNode,
    });
    console.log("Email send response:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}
