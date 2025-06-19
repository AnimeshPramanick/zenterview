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
  const Params = React.use(params);

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(Params.interviewId);
    GetInterviewDetails();
  }, []);

  // Used to get interview details MockID/Interview Id

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, Params.interviewId));
    setInterviewData(result[0]);
  };
  return (
    <div className="my-8 ">
      <h2 className="font-bold text-2xl ">Lets Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
        <div className="flex flex-col my-8 gap-5 ">
          {" "}
          <div className="flex flex-col p-5 rounded-2xl border">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years Of Experience:</strong>
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-2xl border-amber-300 bg-yellow-200">
            <h2 className="flex gap-2 items-center text-yellow-700">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="my-3 text-yellow-700">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                widows: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="w-full h-66 p-15 my-8 bg-secondary border rounded-2xl " />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Webcam & Mic
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={"/dashboard/interview/" + Params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
