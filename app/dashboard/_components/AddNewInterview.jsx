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

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();

  const onSubmit = async (e) => {
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

    console.log(result.response.text());
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
            <DialogDescription>
              <p className="mb-7">
                Add Details about your job position, job description and years
                of experience
              </p>
              <form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Job Role/Job Position</label>
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
                  <Button type="submit">Start Interview</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
