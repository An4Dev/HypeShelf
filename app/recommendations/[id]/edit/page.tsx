"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useRef, useEffect, useCallback, FormEvent } from "react";
import { GENRES } from "@/app/_lib/genres";
import type { Id } from "@/convex/_generated/dataModel";

function EditRecommendationForm() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const recommendationId = params.id as Id<"recommendations">;
  
  const recommendation = useQuery(api.recommendations.getRecommendationById, { 
    recommendationId 
  });
  const updateRecommendation = useMutation(api.recommendations.updateRecommendation);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreSearch, setGenreSearch] = useState("");
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreContainerRef = useRef<HTMLDivElement>(null);

  // Initialize selectedGenres from recommendation data
  useEffect(() => {
    if (recommendation?.genre) {
      const genres = recommendation.genre.split(",").map((g) => g.trim()).filter(Boolean);
      setSelectedGenres(genres);
    }
  }, [recommendation]);

  const dropdownGenreOptions = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    const selectedSet = new Set(selectedGenres);
    let list = [...GENRES];
    if (q) list = list.filter((g) => g.toLowerCase().includes(q));
    return list.filter((g) => !selectedSet.has(g));
  }, [genreSearch, selectedGenres]);

  const addGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev : [...prev, genre]));
    setGenreSearch("");
    setGenreDropdownOpen(false);
  }, []);

  const removeGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genreContainerRef.current && !genreContainerRef.current.contains(event.target as Node)) {
        setGenreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim();
    const genre = (formData.get("genre") as string)?.trim();
    const link = (formData.get("link") as string)?.trim();
    const blurb = (formData.get("blurb") as string)?.trim();

    if (!title || !genre || !link || !blurb) {
      setError("Please fill in all fields.");
      return;
    }
    if (selectedGenres.length === 0) {
      setError("Please add at least one genre.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateRecommendation({ 
        recommendationId,
        title, 
        genre, 
        link, 
        blurb
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  if (recommendation === undefined) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (recommendation === null) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Recommendation not found.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to HypeShelf
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to HypeShelf
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Edit recommendation
      </h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Update your recommendation details.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={recommendation.title}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="e.g. My favorite album"
          />
        </div>

        <div ref={genreContainerRef} className="relative">
          <label
            htmlFor="genre-search"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Genres
          </label>
          <input
            type="hidden"
            name="genre"
            value={selectedGenres.join(", ")}
            readOnly
            aria-hidden
          />
          {selectedGenres.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedGenres.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100"
                >
                  {g}
                  <button
                    type="button"
                    onClick={() => removeGenre(g)}
                    className="-mr-0.5 flex h-4 w-4 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-300 hover:text-zinc-800 dark:hover:bg-zinc-500 dark:hover:text-zinc-100"
                    aria-label={`Remove ${g}`}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            id="genre-search"
            type="text"
            value={genreSearch}
            onChange={(e) => {
              setGenreSearch(e.target.value);
              setGenreDropdownOpen(true);
            }}
            onFocus={() => setGenreDropdownOpen(true)}
            placeholder="Type to search and add genres..."
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            aria-label="Search and add genres"
            aria-expanded={genreDropdownOpen}
          />
          {genreDropdownOpen && (
            <ul
              className="absolute left-0 right-0 z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-800"
              role="listbox"
            >
              {dropdownGenreOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400" role="option">
                  {genreSearch.trim() ? "No matching genres" : "All genres added"}
                </li>
              ) : (
                dropdownGenreOptions.map((g) => (
                  <li
                    key={g}
                    role="option"
                    className="cursor-pointer px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addGenre(g);
                    }}
                  >
                    {g}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Link
          </label>
          <input
            id="link"
            name="link"
            type="url"
            required
            defaultValue={recommendation.link}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="https://..."
          />
        </div>

        <div>
          <label
            htmlFor="blurb"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Blurb
          </label>
          <textarea
            id="blurb"
            name="blurb"
            required
            rows={3}
            maxLength={500}
            defaultValue={recommendation.blurb}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="A short description..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Updating…" : "Update recommendation"}
          </button>
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

export default function EditRecommendationPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <SignedIn>
          <EditRecommendationForm />
        </SignedIn>
        <SignedOut>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to HypeShelf
          </Link>
          <p className="mt-6 text-zinc-600 dark:text-zinc-400">
            Sign in to edit a recommendation.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="mt-4 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </main>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
    </svg>
  );
}
