import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-8">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="text-base font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-white"
            >
              HypeShelf
            </Link>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Collect and share the stuff you're hyped about.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:mt-8 sm:pt-8">
          © {currentYear} HypeShelf. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
