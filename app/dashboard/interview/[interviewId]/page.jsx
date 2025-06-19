"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

import { eq } from "drizzle-orm";
import { WebcamIcon } from "lucide-react";
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
    <div className="my-8 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl ">Lets Get Started</h2>
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
            <Button onClick={() => setWebCamEnabled(true)}>
              Enable Webcam & Mic
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col my-6 gap-5">
        <h2 className="text-lg">
          <strong>Job Role/Job Position:</strong>
          {interviewData.jobPosition}
        </h2>
        <h2 className="text-lg">
          <strong>Job Description/Tech Stack:</strong>
          {interviewData.jobDesc}
        </h2>
        <h2 className="text-lg">
          <strong>Years Of Experience:</strong>
          {interviewData.jobExperience}
        </h2>
      </div>
    </div>
  );
}

export default Interview;
