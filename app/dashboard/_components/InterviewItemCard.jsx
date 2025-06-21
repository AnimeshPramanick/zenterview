import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };

  const OnFeedbackPress = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="rounded-2xl shadow-md p-3 border my-5 hover:shadow-xl hover:scale-105 transition-all">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="font-medium text-gray-600 text-md">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="font-medium text-gray-400 text-md">
        Created At: {interview?.createdAt}
      </h2>
      <div className="flex justify-between mt-5 gap-5">
        <Button
          size="sm"
          variant="outline"
          className="w-[47%]"
          onClick={OnFeedbackPress}
        >
          Feedback
        </Button>
        <Button size="sm" className="w-[47%]" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
