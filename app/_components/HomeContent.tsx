"use client";

import { useState } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { PublicRecommendationsSection } from "./PublicRecommendationsSection";

export function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PublicRecommendationsSection
      searchQuery={searchQuery}
      toolbarActions={
        <>
          <label htmlFor="page-search" className="sr-only">
            Search
          </label>
          <input
            id="page-search"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 sm:max-w-[200px] sm:flex-none md:max-w-[240px]"
            aria-label="Search recommendations"
          />
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full shrink-0 rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:border dark:border-zinc-500 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
              >
                Share your recommendations
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/recommendations/new"
              className="inline-block w-full shrink-0 rounded-lg bg-black px-4 py-2.5 text-center text-xs font-medium text-white transition hover:bg-zinc-800 dark:border dark:border-zinc-500 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
            >
              Add recommendation
            </Link>
          </SignedIn>
        </>
      }
    />
  );
}
