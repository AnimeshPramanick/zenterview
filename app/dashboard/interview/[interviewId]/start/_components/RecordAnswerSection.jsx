import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Webcam from "react-webcam";

function RecordAnswerSection() {
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

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center bg-primary rounded-2xl p-5 my-10 relative">
        {/* Background Image */}
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute z-0 opacity-30"
          alt="webcam"
        />

        {/* Webcam Video */}
        <div className="overflow-hidden rounded-2xl w-full max-w-md z-10">
          <Webcam mirrored={true} className="w-full h-[310px] object-cover" />
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
        variant="outline"
        className="mb-4"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>

      {/* Status */}
      <h1 className="mb-4 font-medium">
        Recording: {isRecording ? "Yes" : "No"}
      </h1>

      {/* Results */}
      <ul className="text-center space-y-2">
        {results.map((result, index) => (
          <li key={index}>{result.transcript}</li>
        ))}
        {interimResult && <li className="text-gray-500">{interimResult}</li>}
      </ul>

      {/* Error */}
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </div>
  );
}

export default RecordAnswerSection;
