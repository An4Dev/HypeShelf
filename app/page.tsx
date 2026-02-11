import { HomeContent } from "./_components/HomeContent";
import { AnimatedText } from "./_components/AnimatedText";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <header className="mb-8 text-center sm:mb-12">
          <p className="text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
            <AnimatedText text="Collect and share the stuff you're hyped about." />
          </p>
        </header>

        <section className="mb-8 sm:mb-12">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white sm:mb-4 sm:text-xl">
            Latest recommendations
          </h2>
          <HomeContent />
        </section>
      </div>
    </main>
  );
}
