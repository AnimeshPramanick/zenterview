"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const Params = React.use(params); // keeping as you mentioned

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(Params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, Params.interviewId));
    setInterviewData(result[0]);
  };

  return (
    <div className="my-8 px-4 md:px-10">
      <h2 className="font-bold text-2xl mb-4">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start min-h-[400px]">
        {/* Left Side */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-2xl border">
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years Of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>

          <div className="p-5 border rounded-2xl border-amber-300 bg-yellow-200">
            <h2 className="flex gap-2 items-center text-yellow-700 mb-2">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="text-yellow-700 text-sm leading-relaxed">
              Enable Video Web Cam and Microphone to start your AI Generated
              Mock Interview. It has 5 questions which you can answer, and at
              the end, you'll get a report based on your answers. <br />
              <strong>NOTE:</strong> We never record your video. You can disable
              webcam access anytime.
            </h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-start items-center w-full h-full">
          {webCamEnabled ? (
            <div className="overflow-hidden rounded-2xl w-full max-w-md">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                className="w-full h-[300px] object-cover"
              />
            </div>
          ) : (
            <WebcamIcon className="w-full h-64 p-10 my-8 bg-secondary border rounded-2xl" />
          )}

          <Button
            variant="outline"
            className="w-full mt-4 max-w-md"
            onClick={() => {
              setWebCamEnabled((prev) => {
                const newState = !prev;
                localStorage.setItem(
                  "zenterview-webcam-enabled",
                  JSON.stringify(newState)
                );
                return newState;
              });
            }}
          >
            {webCamEnabled ? "Disable Webcam & Mic" : "Enable Webcam & Mic"}
          </Button>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end mt-8 md:col-span-2">
        <Link href={`/dashboard/interview/${Params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
