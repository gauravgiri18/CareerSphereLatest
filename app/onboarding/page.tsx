"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Engineering",
  "Design",
  "Consulting",
  "Retail",
  "Manufacturing",
  "Media",
  "Legal",
  "Real Estate",
  "Hospitality",
  "Automotive",
];

const onboardingSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  skills: z.string().min(1, "Please enter at least one skill"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      experience: 0,
      skills: "",
      bio: "",
    },
  });

  const industry = watch("industry");

  const onSubmit = async (data: OnboardingForm) => {
    setLoading(true);
    try {
      await updateUser({
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast.success("Profile saved to database!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setLoading(false);
      const message =
        err instanceof Error ? err.message : "Failed to save profile";
      toast.error(message);
      console.error("[CareerSphere] Onboarding save failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Complete Your Profile
        </h1>
        <p className="text-white/60 mb-8">
          Select your industry to get personalized career insights and
          recommendations.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Industry</Label>
            <Select
              value={industry}
              onValueChange={(value) => setValue("industry", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {industries.map((ind) => (
                  <SelectItem
                    key={ind}
                    value={ind}
                    className="text-white focus:bg-white/10"
                  >
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-red-500 text-sm">{errors.industry.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Years of Experience</Label>
            <Input
              type="number"
              min={0}
              {...register("experience")}
              className="bg-white/5 border-white/20 text-white"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Skills</Label>
            <Input
              {...register("skills")}
              placeholder="Python, JavaScript, AWS..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <p className="text-white/40 text-xs">
              Separate multiple skills with commas
            </p>
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Professional Bio</Label>
            <Textarea
              {...register("bio")}
              placeholder="Tell us about your professional background..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 min-h-[120px]"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
