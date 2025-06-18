"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel";
import { Loader, Loader2, LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDescription, jobExperience, jobPosition);

    const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDescription +
      ", Years Of Experince: " +
      jobExperience +
      ",Depends on this information Give me " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Interview question with answers in json format,Give quesions and answers as field in JSON";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning({ mockId: MockInterview.mockId });
    console.log("inserted", resp);
    if (resp) {
      setOpenDialog(false);
      router.push("/dashboard/interview/" + resp[0]?.mockId);
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="border p-10 rounded-2xl bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all "
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tell us more about your job Interviwing</DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="mb-7 text-sm text-muted-foreground">
                  Add Details about your job position, job description and years
                  of experience
                </div>
                <form onSubmit={onSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">
                        Job Role/Job Position
                      </label>
                      <Input
                        placeholder="eg. Full Stack Developer"
                        required
                        onChange={(e) => setJobPosition(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        Job Description/ Tech Stack (In Short)
                      </label>
                      <Textarea
                        placeholder="eg. React, Angular, Nodejs, MySql"
                        required
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Years Of Experience</label>
                      <Input
                        placeholder="eg. 5"
                        type="number"
                        min="0"
                        required
                        onChange={(e) => setJobExperience(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-6 justify-end mt-5">
                    <Button
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Generating from AI...
                        </>
                      ) : (
                        "Start Interview"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
