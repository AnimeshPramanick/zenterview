import Image from "next/image";
import React from "react";
import Webcam from "react-webcam";

function RecordAnswerSection() {
  return (
    <div className="flex flex-col items-center justify-center bg-primary rounded-2xl p-5 my-20 ">
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
  );
}

export default RecordAnswerSection;
