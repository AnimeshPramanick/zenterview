"use client";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Mic, StopCircle, StopCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  const SaveUserAnswer = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        toast("ERROR While Saving Your Answer , please Record Again!!");
        return;
      }
      const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer" +
        userAnswer +
        ",Depends on question user answer for given interview questions " +
        "please give us rating for answer ans feedback as area of improvement if any " +
        "in just 3 to 5 line to improve in in JSON format with rating field and feedback field ";
      const result = await chatSession.sendMessage(feedbackPrompt);

      const MockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(MockJsonResp);
      const JsonFeedbackResp = JSON.parse(MockJsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast("User Answer recorded successfully");
      }
      setUserAnswer("");
      setLoading(false);
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center bg-primary rounded-2xl p-5 my-10 ">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
          alt="webcam"
        />
        <div className="overflow-hidden rounded-2xl w-full max-w-md">
          <Webcam
            mirrored={true}
            className="w-full h-[310px] object-cover z-10"
          />
        </div>
      </div>
      <Button
        disabled={loading}
        variant="outline"
        onClick={SaveUserAnswer}
        className="mb-6 text-primary"
      >
        {isRecording ? (
          <h2 className="flex gap-2 text-red-600 items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="flex gap-2 items-center">
            <Mic />
            Record Answer
          </h2>
        )}
      </Button>
      <Button onClick={() => console.log(userAnswer)}>Show Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
