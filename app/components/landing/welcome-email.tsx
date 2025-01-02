import * as React from "react";

export const WelcomeEmail: React.FC = () => (
  <div>
    <h1
      style={{
        color: "#171717",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "24px",
      }}
    >
      Welcome to TaoSwap!
    </h1>
    <p
      style={{
        color: "#4B5563",
        fontSize: "16px",
        lineHeight: "24px",
        marginBottom: "16px",
      }}
    >
      Thank you for joining the TaoSwap waitlist! We&apos;re excited to have you
      as part of our community.
    </p>
    <p
      style={{
        color: "#4B5563",
        fontSize: "16px",
        lineHeight: "24px",
        marginBottom: "16px",
      }}
    >
      As the first DEX built on Bittensor, we&apos;re working hard to bring you
      secure TAO trading and innovative DeFi opportunities.
    </p>
    <p
      style={{
        color: "#4B5563",
        fontSize: "16px",
        lineHeight: "24px",
        marginBottom: "24px",
      }}
    >
      We&apos;ll keep you updated on our progress and let you know as soon as
      TaoSwap launches.
    </p>
    <div
      style={{
        color: "#6B7280",
        fontSize: "14px",
        marginTop: "32px",
        borderTop: "1px solid #E5E7EB",
        paddingTop: "16px",
      }}
    >
      <p>Best regards,</p>
      <p>The TaoSwap Team</p>
    </div>
  </div>
);
