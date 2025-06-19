"use client";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Mic } from "lucide-react";

function RecordAnswerSection() {
  const [userAnswer, setUserAnswer] = useState("");

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
        onClick={isRecording ? startSpeechToText : startSpeechToText}
        className="mb-6"
      >
        {isRecording ? (
          <h2 className="flex gap-2 text-red-600">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      <Button onClick={() => console.log(userAnswer)}>Show Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
