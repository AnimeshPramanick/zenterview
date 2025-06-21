"use client";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Mic, StopCircle, AlertCircle, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();

  const [userAnswer, setUserAnswer] = useState("");
  const [webcamOn, setWebcamOn] = useState(false); // Set webcam off by default
  const [mounted, setMounted] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setMounted(true);
    setUserAnswer(transcript);
    // Check localStorage for webcam state
    if (typeof window !== "undefined") {
      const storedWebcam = localStorage.getItem("zenterview-webcam-enabled");
      if (storedWebcam !== null) {
        setWebcamOn(JSON.parse(storedWebcam));
      }
    }
  }, [transcript]);

  const SaveUserAnswer = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (userAnswer?.length < 10) {
        toast("ERROR While Saving Your Answer , please Record Again!!");
        return;
      }
      const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer" +
        userAnswer +
        ",Depends on question user answer for given interview questions " +
        "please give us rating for answer out of 10 and feedback as area of improvement if any " +
        "in just 3 to 5 lines to improve, in JSON format with rating field and feedback field.";
      const result = await chatSession.sendMessage(feedbackPrompt);
      const MockJsonResp = (await result.response.text())
        .replace("```json", "")
        .replace("```", "");
      console.log(MockJsonResp);
      let feedbackJson;
      try {
        feedbackJson = JSON.parse(MockJsonResp);
      } catch (e) {
        toast("Failed to parse feedback JSON");
        return;
      }

      try {
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: feedbackJson.feedback,
          rating: feedbackJson.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: new Date().toISOString(),
        });
        toast("User Answer recorded successfully");
      } catch (e) {
        toast("Failed to save answer to database");
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 flex items-center">
          <AlertCircle className="text-yellow-400 mr-2" />
          <p className="text-sm text-yellow-700">
            Speech recognition is not supported in this browser. Please use
            Chrome, Edge, or another supported browser.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-primary rounded-2xl p-5 my-10">
          <div className="relative rounded-2xl w-[400px] h-[310px] bg-[#062d49] flex items-center justify-center">
            <Image
              src={"/webcam.png"}
              width={100}
              height={100}
              alt="webcam"
              className="z-10"
            />
          </div>
        </div>
        <Button variant="outline" disabled className="mb-6 text-primary">
          Browser Not Supported
        </Button>
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 flex items-center">
          <AlertCircle className="text-red-400 mr-2" />
          <p className="text-sm text-red-700">
            Please allow microphone access to use speech recognition.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center bg-primary rounded-2xl p-5 my-10">
        <div className="relative rounded-2xl w-[400px] h-[310px] bg-[#062d49] flex items-center justify-center">
          {mounted && webcamOn ? (
            <Webcam
              mirrored={true}
              className="w-full h-full object-cover z-10 rounded-2xl"
            />
          ) : (
            <Image
              src={"/webcam.png"}
              width={100}
              height={100}
              alt="webcam"
              className="z-10"
            />
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={SaveUserAnswer}
          className="mb-6 text-primary"
        >
          {listening ? (
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
        {mounted && (
          <Button
            variant="outline"
            onClick={() => setWebcamOn((prev) => !prev)}
            className="mb-6 text-primary"
          >
            {webcamOn ? (
              <span className="flex gap-2 items-center">
                <VideoOff /> Webcam Off
              </span>
            ) : (
              <span className="flex gap-2 items-center">
                <Video /> Webcam On
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default RecordAnswerSection;
