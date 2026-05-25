"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { coverLetter } from "@prisma/client";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CoverLetterListProps {
  coverLetters: coverLetter[];
}

export function CoverLetterList({ coverLetters }: CoverLetterListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete cover letter");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">
        Saved Cover Letters ({coverLetters.length})
      </h2>

      {coverLetters.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/60">No cover letters yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{letter.jobTitle}</h3>
                  <p className="text-white/60 text-sm">{letter.companyName}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {format(new Date(letter.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setExpandedId(
                        expandedId === letter.id ? null : letter.id
                      )
                    }
                    className="text-white/60 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === letter.id}
                    onClick={() => handleDelete(letter.id)}
                    className="text-white/60 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedId === letter.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/80 whitespace-pre-wrap text-sm">
                    {letter.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
