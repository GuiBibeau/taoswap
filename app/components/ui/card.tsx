import clsx from "clsx";
import type React from "react";

type CardProps = {
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, className, children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10"
      )}
    >
      {title && (
        <div className="border-b border-zinc-950/5 px-6 py-4 dark:border-white/5">
          <h3 className="text-base/6 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
