"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download, Loader2, Save } from "lucide-react";
import { saveResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeForm } from "./resume-form";
import { toast } from "sonner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface ResumeBuilderProps {
  initialContent?: string;
}

export function ResumeBuilder({ initialContent }: ResumeBuilderProps) {
  const [content, setContent] = useState(
    initialContent ||
      "# Resume\n\n## Contact Information\n\n## Professional Summary\n\n## Skills\n\n"
  );
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume(content);
      toast.success("Resume saved successfully!");
    } catch {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById("resume-pdf-export");
      if (!element) {
        toast.error("Preview not ready. Try again in a moment.");
        return;
      }

      const html2pdf = (await import("html2pdf.js")).default;

      await html2pdf()
        .set({
          margin: [12, 12, 12, 12],
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(element)
        .save();

      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Resume Builder</h1>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Always-mounted export target (html2canvas cannot capture hidden tabs) */}
      <div
        aria-hidden
        className="fixed left-0 top-0 -z-10 opacity-0 pointer-events-none w-[210mm]"
      >
        <div
          id="resume-pdf-export"
          data-color-mode="light"
          className="bg-white text-black p-10 prose prose-slate max-w-none"
          style={{ width: "210mm", minHeight: "297mm" }}
        >
          <MarkdownPreview source={content} />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-white/5 border border-white/10 mb-6">
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
          >
            Form
          </TabsTrigger>
          <TabsTrigger
            value="markdown"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
          >
            Markdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <ResumeForm content={content} onChange={setContent} />
        </TabsContent>

        <TabsContent value="markdown">
          <div className="space-y-4">
            {editMode ? (
              <div data-color-mode="dark">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  height={500}
                />
              </div>
            ) : (
              <div
                id="resume-preview"
                data-color-mode="dark"
                className="bg-white/5 border border-white/10 rounded-xl p-8 prose prose-invert max-w-none"
              >
                <MarkdownPreview source={content} />
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setEditMode(!editMode)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {editMode ? "Preview Resume" : "Edit Resume"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
