"use client";

import { useState } from "react";
import { Sparkles, Plus, Pencil, Trash2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ResumeFormProps {
  content: string;
  onChange: (content: string) => void;
}

interface ContactInfo {
  email: string;
  mobile: string;
  linkedin: string;
  twitter: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  url: string;
}

function generateId() {
  return Math.random().toString(36).substring(7);
}

function formatDisplayDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function parseMarkdown(content: string) {
  const contact: ContactInfo = {
    email: "",
    mobile: "",
    linkedin: "",
    twitter: "",
  };
  let summary = "";
  let skills = "";
  const experiences: ExperienceEntry[] = [];
  const education: EducationEntry[] = [];
  const projects: ProjectEntry[] = [];

  if (!content) {
    return { contact, summary, skills, experiences, education, projects };
  }

  const sections = content.split(/^## /m);
  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.split("\n");
    const title = lines[0]?.trim().toLowerCase() || "";
    const body = lines.slice(1).join("\n").trim();

    if (title.includes("contact")) {
      const emailMatch = body.match(/Email:\s*(.+)/i);
      const mobileMatch = body.match(/Mobile:\s*(.+)/i);
      const linkedinMatch = body.match(/LinkedIn:\s*(.+)/i);
      const twitterMatch = body.match(/Twitter:\s*(.+)/i);
      if (emailMatch) contact.email = emailMatch[1].trim();
      if (mobileMatch) contact.mobile = mobileMatch[1].trim();
      if (linkedinMatch) contact.linkedin = linkedinMatch[1].trim();
      if (twitterMatch) contact.twitter = twitterMatch[1].trim();
    } else if (title.includes("summary")) {
      summary = body;
    } else if (title.includes("skill")) {
      skills = body;
    }
  }

  return { contact, summary, skills, experiences, education, projects };
}

function generateMarkdown(
  contact: ContactInfo,
  summary: string,
  skills: string,
  experiences: ExperienceEntry[],
  education: EducationEntry[],
  projects: ProjectEntry[]
): string {
  let md = "# Resume\n\n";

  md += "## Contact Information\n";
  if (contact.email) md += `- Email: ${contact.email}\n`;
  if (contact.mobile) md += `- Mobile: ${contact.mobile}\n`;
  if (contact.linkedin) md += `- LinkedIn: ${contact.linkedin}\n`;
  if (contact.twitter) md += `- Twitter: ${contact.twitter}\n`;
  md += "\n";

  if (summary) {
    md += "## Professional Summary\n";
    md += `${summary}\n\n`;
  }

  if (skills) {
    md += "## Skills\n";
    md += `${skills}\n\n`;
  }

  if (experiences.length > 0) {
    md += "## Work Experience\n";
    for (const exp of experiences) {
      md += `### ${exp.title} @ ${exp.company}\n`;
      md += `*${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}*\n\n`;
      md += `${exp.description}\n\n`;
    }
  }

  if (education.length > 0) {
    md += "## Education\n";
    for (const edu of education) {
      md += `### ${edu.degree}\n`;
      md += `**${edu.school}** | ${formatDisplayDate(edu.startDate)} - ${formatDisplayDate(edu.endDate)}\n\n`;
    }
  }

  if (projects.length > 0) {
    md += "## Projects\n";
    for (const proj of projects) {
      md += `### ${proj.name}\n`;
      md += `${proj.description}\n`;
      if (proj.url) md += `[${proj.url}](${proj.url})\n`;
      md += "\n";
    }
  }

  return md;
}

export function ResumeForm({ content, onChange }: ResumeFormProps) {
  const parsed = parseMarkdown(content);
  const [contact, setContact] = useState<ContactInfo>(parsed.contact);
  const [summary, setSummary] = useState(parsed.summary);
  const [skills, setSkills] = useState(parsed.skills);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    parsed.experiences
  );
  const [education, setEducation] = useState<EducationEntry[]>(
    parsed.education
  );
  const [projects, setProjects] = useState<ProjectEntry[]>(parsed.projects);
  const [editingExp, setEditingExp] = useState<string | null>(null);
  const [editingEdu, setEditingEdu] = useState<string | null>(null);
  const [improving, setImproving] = useState(false);

  const updateContent = (
    newContact = contact,
    newSummary = summary,
    newSkills = skills,
    newExperiences = experiences,
    newEducation = education,
    newProjects = projects
  ) => {
    onChange(
      generateMarkdown(
        newContact,
        newSummary,
        newSkills,
        newExperiences,
        newEducation,
        newProjects
      )
    );
  };

  const handleImprove = async (text: string, type: string, setter: (v: string) => void) => {
    if (!text.trim()) return;
    setImproving(true);
    try {
      const improved = await improveWithAI({ current: text, type });
      setter(improved);
      toast.success("Improved with AI!");
    } catch {
      toast.error("Failed to improve with AI");
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/60">Email</Label>
            <Input
              value={contact.email}
              onChange={(e) => {
                const newContact = { ...contact, email: e.target.value };
                setContact(newContact);
                updateContent(newContact);
              }}
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Mobile Number</Label>
            <Input
              value={contact.mobile}
              onChange={(e) => {
                const newContact = { ...contact, mobile: e.target.value };
                setContact(newContact);
                updateContent(newContact);
              }}
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">LinkedIn URL</Label>
            <Input
              value={contact.linkedin}
              onChange={(e) => {
                const newContact = { ...contact, linkedin: e.target.value };
                setContact(newContact);
                updateContent(newContact);
              }}
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/60">Twitter/X Profile</Label>
            <Input
              value={contact.twitter}
              onChange={(e) => {
                const newContact = { ...contact, twitter: e.target.value };
                setContact(newContact);
                updateContent(newContact);
              }}
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Professional Summary
          </h3>
          <Button
            variant="outline"
            size="sm"
            disabled={improving}
            onClick={() =>
              handleImprove(summary, "professional summary", (v) => {
                setSummary(v);
                updateContent(contact, v);
              })
            }
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Improve with AI
          </Button>
        </div>
        <Textarea
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
            updateContent(contact, e.target.value);
          }}
          className="bg-white/5 border-white/20 text-white min-h-[100px]"
          placeholder="Write a compelling professional summary..."
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
        <Textarea
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            updateContent(contact, summary, e.target.value);
          }}
          className="bg-white/5 border-white/20 text-white"
          placeholder="List your skills..."
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Work Experience</h3>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-white/10 rounded-lg p-4"
            >
              {editingExp === exp.id ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((x) =>
                          x.id === exp.id ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((x) =>
                          x.id === exp.id
                            ? { ...x, company: e.target.value }
                            : x
                        )
                      )
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DateInput
                      label="Start Date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = experiences.map((x) =>
                          x.id === exp.id
                            ? { ...x, startDate: e.target.value }
                            : x
                        );
                        setExperiences(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          updated
                        );
                      }}
                    />
                    <DateInput
                      label="End Date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = experiences.map((x) =>
                          x.id === exp.id
                            ? { ...x, endDate: e.target.value }
                            : x
                        );
                        setExperiences(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          updated
                        );
                      }}
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((x) =>
                          x.id === exp.id
                            ? { ...x, description: e.target.value }
                            : x
                        )
                      )
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={improving}
                    onClick={() =>
                      handleImprove(
                        exp.description,
                        "work experience description",
                        (v) => {
                          const updated = experiences.map((x) =>
                            x.id === exp.id ? { ...x, description: v } : x
                          );
                          setExperiences(updated);
                          updateContent(
                            contact,
                            summary,
                            skills,
                            updated
                          );
                        }
                      )
                    }
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Improve with AI
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingExp(null);
                      updateContent();
                    }}
                    className="bg-white text-black ml-2"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">
                      {exp.title} @ {exp.company}
                    </p>
                    <p className="text-white/40 text-sm">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-white/60 text-sm mt-2">
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingExp(exp.id)}
                      className="text-white/60 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = experiences.filter(
                          (x) => x.id !== exp.id
                        );
                        setExperiences(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          updated
                        );
                      }}
                      className="text-white/60 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-white/20 text-white hover:bg-white/10"
          onClick={() => {
            const newExp: ExperienceEntry = {
              id: generateId(),
              title: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
            };
            setExperiences([...experiences, newExp]);
            setEditingExp(newExp.id);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border border-white/10 rounded-lg p-4">
              {editingEdu === edu.id ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      setEducation(
                        education.map((x) =>
                          x.id === edu.id ? { ...x, degree: e.target.value } : x
                        )
                      )
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Input
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) =>
                      setEducation(
                        education.map((x) =>
                          x.id === edu.id ? { ...x, school: e.target.value } : x
                        )
                      )
                    }
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DateInput
                      label="Start Date"
                      value={edu.startDate}
                      onChange={(e) => {
                        const updated = education.map((x) =>
                          x.id === edu.id
                            ? { ...x, startDate: e.target.value }
                            : x
                        );
                        setEducation(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          experiences,
                          updated
                        );
                      }}
                    />
                    <DateInput
                      label="End Date"
                      value={edu.endDate}
                      onChange={(e) => {
                        const updated = education.map((x) =>
                          x.id === edu.id
                            ? { ...x, endDate: e.target.value }
                            : x
                        );
                        setEducation(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          experiences,
                          updated
                        );
                      }}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingEdu(null);
                      updateContent();
                    }}
                    className="bg-white text-black"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{edu.degree}</p>
                    <p className="text-white/60 text-sm">{edu.school}</p>
                    <p className="text-white/40 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingEdu(edu.id)}
                      className="text-white/60 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = education.filter(
                          (x) => x.id !== edu.id
                        );
                        setEducation(updated);
                        updateContent(
                          contact,
                          summary,
                          skills,
                          experiences,
                          updated
                        );
                      }}
                      className="text-white/60 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-white/20 text-white hover:bg-white/10"
          onClick={() => {
            const newEdu: EducationEntry = {
              id: generateId(),
              degree: "",
              school: "",
              startDate: "",
              endDate: "",
            };
            setEducation([...education, newEdu]);
            setEditingEdu(newEdu.id);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Projects</h3>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="border border-white/10 rounded-lg p-4 space-y-2">
              <Input
                placeholder="Project Name"
                value={proj.name}
                onChange={(e) => {
                  const updated = projects.map((x) =>
                    x.id === proj.id ? { ...x, name: e.target.value } : x
                  );
                  setProjects(updated);
                  updateContent(
                    contact,
                    summary,
                    skills,
                    experiences,
                    education,
                    updated
                  );
                }}
                className="bg-white/5 border-white/20 text-white"
              />
              <Textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) => {
                  const updated = projects.map((x) =>
                    x.id === proj.id
                      ? { ...x, description: e.target.value }
                      : x
                  );
                  setProjects(updated);
                  updateContent(
                    contact,
                    summary,
                    skills,
                    experiences,
                    education,
                    updated
                  );
                }}
                className="bg-white/5 border-white/20 text-white"
              />
              <Input
                placeholder="URL"
                value={proj.url}
                onChange={(e) => {
                  const updated = projects.map((x) =>
                    x.id === proj.id ? { ...x, url: e.target.value } : x
                  );
                  setProjects(updated);
                  updateContent(
                    contact,
                    summary,
                    skills,
                    experiences,
                    education,
                    updated
                  );
                }}
                className="bg-white/5 border-white/20 text-white"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updated = projects.filter((x) => x.id !== proj.id);
                  setProjects(updated);
                  updateContent(
                    contact,
                    summary,
                    skills,
                    experiences,
                    education,
                    updated
                  );
                }}
                className="text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-white/20 text-white hover:bg-white/10"
          onClick={() => {
            const newProj: ProjectEntry = {
              id: generateId(),
              name: "",
              description: "",
              url: "",
            };
            setProjects([...projects, newProj]);
            updateContent(
              contact,
              summary,
              skills,
              experiences,
              education,
              [...projects, newProj]
            );
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    </div>
  );
}
