"use client";

import { cn } from "../../lib/helpers";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconApi,
  IconMenu2,
  IconMessagePlus,
  IconRotate,
  IconX,
  IconArrowNarrowLeft,
  IconChecklist,
  IconUserCircle,
} from "@tabler/icons-react";

export function CollapsibleSidebar() {
  return (
    <SidebarLayout>
      <Dashboard />
    </SidebarLayout>
  );
}

function SidebarLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const primaryLinks = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const secondaryLinks = [
    {
      label: "Documentation",
      href: "#",
      icon: (
        <IconChecklist className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "API reference",
      href: "#",
      icon: (
        <IconApi className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Support",
      href: "#",
      icon: (
        <IconMessagePlus className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Sponser",
      href: "#",
      icon: (
        <IconRotate className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      className={cn(
        "flex h-screen w-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <motion.div
            className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {open ? <Logo /> : <LogoIcon />}
            <motion.div
              className="mt-8 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {primaryLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} index={idx} />
              ))}
            </motion.div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-px w-full bg-white dark:bg-neutral-900"></div>
            </motion.div>
            <motion.div
              className="mt-4 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {secondaryLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  index={idx + primaryLinks.length}
                />
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <SidebarLink
              link={{
                label: "User 1",
                href: "#",
                icon: (
                  <IconUserCircle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
            />
          </motion.div>
        </SidebarBody>
      </Sidebar>
      {children}
    </motion.div>
  );
}

/**
 * Smaller Logo & Bigger Font
 */
const TaoSwapLogo = () => {
  return (
    <svg
      // Remove the hard-coded 70x70; use Tailwind classes instead:
      className="h-10 w-10"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.0911458"
        y="0.0911458"
        width="69.8177"
        height="69.6357"
        rx="3.55469"
        fill="url(#paint0_linear_19_105)"
      />
      <rect
        x="0.0911458"
        y="0.0911458"
        width="69.8177"
        height="69.6357"
        rx="3.55469"
        stroke="white"
        strokeWidth="0.182292"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.1406 12.3955H15.8594V22.2393H28.896V22.2394H32.3568L28.896 23.5668V46.1922C28.9118 48.4494 29.6611 50.4231 31.1439 52.1132C32.6267 53.792 34.6774 55.0964 37.296 56.0265C39.8988 56.9566 42.9118 57.4217 46.3349 57.4217L46.4373 57.4216H46.3021V46.8488H38.6458L42.3404 45.7483C41.8071 45.4184 41.3877 44.9896 41.0819 44.462C40.6718 43.7814 40.4588 42.9364 40.4431 41.9269V22.2393H54.1406V12.3955Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_19_105"
          x1="35"
          y1="0"
          x2="35"
          y2="69.8179"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#262626" />
          <stop offset="1" stopColor="#2F2F2F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-base font-normal text-black"
    >
      <TaoSwapLogo />
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        // "text-base" for a bit larger text
        className="whitespace-pre font-medium text-black dark:text-white text-base"
      >
        TaoSwap
      </motion.span>
    </Link>
  );
};

// Collapsed sidebar version
const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-base font-normal text-black"
    >
      <TaoSwapLogo />
    </Link>
  );
};

const Dashboard = () => {
  return (
    <motion.div
      className="m-2 flex flex-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900 md:p-10">
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {[...new Array(4)].map((_, i) => (
            <motion.div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.div>
        <motion.div
          className="flex flex-1 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {[...new Array(2)].map((_, i) => (
            <motion.div
              key={"second-array" + i}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Sidebar Context & Hooks
 */
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "group/sidebar-btn relative m-2 hidden h-full w-[300px] flex-shrink-0 rounded-xl bg-white px-4 py-4 dark:bg-neutral-900 md:flex md:flex-col",
        className
      )}
      animate={{
        width: open ? "300px" : "70px",
      }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <motion.button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute -right-2 top-4 z-40 hidden h-5 w-5 transform items-center justify-center rounded-sm border border-neutral-200 bg-white transition duration-200 group-hover/sidebar-btn:flex dark:border-neutral-700 dark:bg-neutral-900",
          open ? "rotate-0" : "rotate-180"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconArrowNarrowLeft className="text-black dark:text-white" />
      </motion.button>
      {children as React.ReactNode}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:hidden"
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900",
              className
            )}
          >
            <motion.div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconX />
            </motion.div>
            {children as React.ReactNode}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SidebarLink = ({
  link,
  className,
  index = 0,
  ...props
}: {
  link: Links;
  className?: string;
  index?: number;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.3 }}
    >
      <Link
        href={link.href}
        className={cn(
          "group/sidebar flex items-center justify-start gap-2 rounded-sm px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700",
          className
        )}
        {...props}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {link.icon}
        </motion.div>
        <motion.span
          animate={{
            width: open ? "auto" : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="!m-0 inline-block whitespace-pre overflow-hidden !p-0 text-sm text-neutral-700 transition duration-150 dark:text-neutral-200"
        >
          {link.label}
        </motion.span>
      </Link>
    </motion.div>
  );
};
