import type { Doc } from "@/convex/_generated/dataModel";

type Recommendation = Doc<"recommendations">;

export function RecommendationList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <ul className="space-y-4" role="list">
      {recommendations.map((rec) => (
        <li
          key={rec._id}
          className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {rec.title}
              </h3>
              {rec.isStaffPick && (
                <span
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                  aria-label="Staff pick"
                >
                  Staff Pick
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {rec.genre}
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">{rec.blurb}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Added by {rec.userName}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
