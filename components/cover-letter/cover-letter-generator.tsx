"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { generateCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function CoverLetterGenerator() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle || !companyName) {
      toast.error("Please fill in job title and company name");
      return;
    }

    setLoading(true);
    try {
      await generateCoverLetter({ jobTitle, companyName, jobDescription });
      toast.success("Cover letter generated!");
      setJobTitle("");
      setCompanyName("");
      setJobDescription("");
      router.refresh();
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Generate New Cover Letter
      </h2>

      <div className="space-y-4">
        <div>
          <Label className="text-white/60">Job Title</Label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Software Engineer"
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>

        <div>
          <Label className="text-white/60">Company Name</Label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Google"
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>

        <div>
          <Label className="text-white/60">Job Description</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="bg-white/5 border-white/20 text-white mt-1 min-h-[200px]"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-white/90 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
