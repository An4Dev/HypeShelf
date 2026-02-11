"use client";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { getLinkThumbnail, FALLBACK_THUMBNAIL } from "@/app/_lib/linkPreview";
import { ConfirmModal } from "./ConfirmModal";
import Link from "next/link";

const ALL_GENRES = "All";

interface PublicRecommendationsSectionProps {
  toolbarActions?: ReactNode;
  searchQuery?: string;
}

export function PublicRecommendationsSection({
  toolbarActions,
  searchQuery = "",
}: PublicRecommendationsSectionProps) {
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const recommendations = useQuery(api.recommendations.getPublicRecommendations);
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isConvexAuthenticated ? {} : "skip"
  );
  const deleteRecommendation = useMutation(api.recommendations.deleteRecommendation);
  const markStaffPick = useMutation(api.recommendations.markStaffPick);
  const [deletingId, setDeletingId] = useState<Id<"recommendations"> | null>(null);
  const [staffPickId, setStaffPickId] = useState<Id<"recommendations"> | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [expandedBlurbs, setExpandedBlurbs] = useState<Set<Id<"recommendations">>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"recommendations"> | null>(null);

  const genres = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return [];
    const set = new Set<string>();
    for (const r of recommendations) {
      for (const g of r.genre.split(",").map((s) => s.trim()).filter(Boolean)) {
        set.add(g);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [recommendations]);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return Array.from(next);
    });
  }, []);

  const toggleBlurb = useCallback((recId: Id<"recommendations">) => {
    setExpandedBlurbs((prev) => {
      const next = new Set(prev);
      if (next.has(recId)) {
        next.delete(recId);
      } else {
        next.add(recId);
      }
      return next;
    });
  }, []);

  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    let list = recommendations;
    if (selectedGenres.length > 0) {
      const selectedSet = new Set(selectedGenres);
      list = list.filter((r) => {
        const recGenres = r.genre.split(",").map((s) => s.trim()).filter(Boolean);
        return recGenres.some((g) => selectedSet.has(g));
      });
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.genre.toLowerCase().includes(query) ||
          (r.blurb && r.blurb.toLowerCase().includes(query)) ||
          r.link.toLowerCase().includes(query) ||
          (r.userName && r.userName.toLowerCase().includes(query))
      );
    }
    return list;
  }, [recommendations, selectedGenres, searchQuery]);

  const handleDeleteClick = useCallback((recommendationId: Id<"recommendations">) => {
    setConfirmDeleteId(recommendationId);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (recommendationId: Id<"recommendations">) => {
      setDeletingId(recommendationId);
      try {
        await deleteRecommendation({ recommendationId });
      } finally {
        setDeletingId(null);
        setConfirmDeleteId(null);
      }
    },
    [deleteRecommendation]
  );

  const handleStaffPick = useCallback(
    async (recommendationId: Id<"recommendations">) => {
      setStaffPickId(recommendationId);
      try {
        await markStaffPick({ recommendationId });
      } finally {
        setStaffPickId(null);
      }
    },
    [markStaffPick]
  );

  const isOwn = (userId: string) =>
    currentUser?.clerkUserId !== undefined && userId === currentUser.clerkUserId;
  const isAdmin = currentUser?.role === "admin";
  const canDelete = (recUserId: string) =>
    isConvexAuthenticated && (isOwn(recUserId) || isAdmin);
  const canEdit = (recUserId: string) =>
    isConvexAuthenticated && isOwn(recUserId);
  const canToggleStaffPick = isConvexAuthenticated && isAdmin;

  if (recommendations === undefined) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Loading…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {recommendations.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setSelectedGenres([])}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedGenres.length === 0
                  ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                  : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
              }`}
            >
              {ALL_GENRES}
            </button>
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                      : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                  }`}
                  aria-pressed={isSelected}
                >
                  {genre}
                </button>
              );
            })}
          </>
        )}
        {toolbarActions != null && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
            {toolbarActions}
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No recommendations yet. Be the first to add one — sign in and share what you're hyped about.
        </p>
      ) : (
        <>
          {filteredRecommendations.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No recommendations match your search or filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" role="list">
          {filteredRecommendations.map((rec) => {
            const thumbnailUrl = getLinkThumbnail(rec.link) ?? FALLBACK_THUMBNAIL;
            return (
              <li
                key={rec._id}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                >
                  <img
                    src={thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_THUMBNAIL;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                    <PlayIcon className="h-12 w-12 text-white opacity-0 transition group-hover:opacity-100 sm:h-16 sm:w-16" />
                  </div>
                  {rec.isStaffPick && (
                    <span
                      className="absolute right-2 top-2 rounded bg-orange-500 px-2.5 py-0.5 text-xs font-medium text-white shadow"
                      aria-label="Staff pick"
                    >
                      Staff Pick
                    </span>
                  )}
                </a>
                <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
                  <h3 className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-base">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                    {rec.genre}
                  </p>
                  <div className="flex-1">
                    <p
                      className={`text-xs text-zinc-700 dark:text-zinc-300 sm:text-sm ${
                        expandedBlurbs.has(rec._id) ? "" : "line-clamp-2 sm:line-clamp-3"
                      }`}
                    >
                      {rec.blurb}
                    </p>
                    {rec.blurb.length > 120 && (
                      <button
                        type="button"
                        onClick={() => toggleBlurb(rec._id)}
                        className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {expandedBlurbs.has(rec._id) ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                    Added by {rec.userName}
                  </p>
                  {(canEdit(rec.userId) || canDelete(rec.userId) || canToggleStaffPick) && (
                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-200 pt-2 dark:border-zinc-700">
                      <div className="flex items-center gap-2">
                        {canEdit(rec.userId) && (
                          <Link
                            href={`/recommendations/${rec._id}/edit`}
                            className="flex cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40"
                            aria-label="Edit recommendation"
                          >
                            <EditIcon className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {canToggleStaffPick && (
                          <button
                            type="button"
                            onClick={() => handleStaffPick(rec._id)}
                            disabled={staffPickId === rec._id}
                            className="flex cursor-pointer items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-1.5 text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40"
                            aria-label={rec.isStaffPick ? "Remove Staff Pick" : "Add Staff Pick"}
                          >
                            {staffPickId === rec._id ? (
                              <span className="text-xs">Updating…</span>
                            ) : (
                              <StarIcon className={`h-3.5 w-3.5 ${rec.isStaffPick ? "fill-amber-600 dark:fill-amber-400" : ""}`} />
                            )}
                          </button>
                        )}
                      </div>
                      {canDelete(rec.userId) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(rec._id)}
                          disabled={deletingId === rec._id}
                          className="flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40"
                          aria-label="Delete recommendation"
                        >
                          {deletingId === rec._id ? (
                            <span className="text-xs">Deleting…</span>
                          ) : (
                            <TrashIcon className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
          )}
        </>
      )}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDeleteConfirm(confirmDeleteId);
          }
        }}
        title="Delete Recommendation"
        message="Are you sure you want to delete this recommendation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
      />
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.78-.217-2.78-1.643V5.653Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
