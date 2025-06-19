"use client";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Mic, StopCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModel";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setUserAnswer(transcript);
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
        "please give us rating for answer ans feedback as area of improvement if any " +
        "in just 3 to 5 line to improve in in JSON format with rating field and feedback field ";
      const result = await chatSession.sendMessage(feedbackPrompt);
      const MockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(MockJsonResp);
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
    </div>
  );
}

export default RecordAnswerSection;
