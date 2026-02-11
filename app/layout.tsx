import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./_components/ThemeToggle";
import { Footer } from "./_components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HypeShelf",
  description: "Collect and share the stuff you're hyped about.",
  icons: { icon: "/logo.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
        >
          <ThemeProvider>
            <ConvexClientProvider>
              <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4">
                    <Link
                      href="/"
                      className="flex min-w-0 items-center gap-1.5 sm:gap-2 text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-white"
                      aria-label="HypeShelf home"
                    >
                      <Image
                        src="/logo.png"
                        alt=""
                        width={64}
                        height={64}
                        className="h-9 w-9 shrink-0 rounded-lg sm:h-12 sm:w-12 md:h-14 md:w-14"
                        priority
                      />
                      <span className="truncate text-lg font-semibold sm:text-xl md:text-2xl md:font-bold">
                        HypeShelf
                      </span>
                    </Link>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      <SignedOut>
                        <SignInButton mode="modal">
                          <button
                            type="button"
                            className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white sm:px-0 sm:py-0 sm:text-sm sm:font-bold"
                          >
                            Sign in
                          </button>
                        </SignInButton>
                      </SignedOut>
                      <SignedIn>
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: "!w-9 !h-9 sm:!w-11 sm:!h-11",
                            },
                          }}
                        />
                      </SignedIn>
                    </div>
                  </div>
                </header>
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
              <div className="fixed bottom-4 right-4 z-50 [bottom:max(1rem,env(safe-area-inset-bottom))] [right:max(1rem,env(safe-area-inset-right))]">
                <ThemeToggle />
              </div>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
