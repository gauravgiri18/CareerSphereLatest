import { getCoverLetters } from "@/actions/cover-letter";
import { CoverLetterGenerator } from "@/components/cover-letter/cover-letter-generator";
import { CoverLetterList } from "@/components/cover-letter/cover-letter-list";
import { AiConfigBanner } from "@/components/ai-config-banner";
import { serialize } from "@/lib/utils";

export default async function CoverLetterPage() {
  const coverLetters = serialize(await getCoverLetters());

  return (
    <div className="container mx-auto px-4 py-8">
      <AiConfigBanner />
      <h1 className="text-4xl font-bold text-white mb-8">AI Cover Letters</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CoverLetterGenerator />
        <CoverLetterList coverLetters={coverLetters} />
      </div>
    </div>
  );
}
