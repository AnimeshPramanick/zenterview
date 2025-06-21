"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  ChevronsUpDownIcon,
  LucideCircleChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const router = useRouter();
  const Params = React.use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, Params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
    if (result && result.length > 0) {
      const sum = result.reduce(
        (acc, item) => acc + (Number(item.rating) || 0),
        0
      );
      const avg = sum / result.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(null);
    }
  };

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-2xl text-gray-500">
          No interview record found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-600">Congratulation!</h2>
          <h2 className="font-bold text-2xl">
            Here is your interview feedback
          </h2>
          <h2 className="text-indigo-900 text-xl my-3">
            Your overall Rating :{" "}
            {averageRating ? (
              <strong>{averageRating}/10</strong>
            ) : (
              <strong>N/A</strong>
            )}
          </h2>
          <h2 className="text-md text-gray-500">
            Find below interview questions with correct answer , your answer and
            feedback for improvement{" "}
          </h2>
          {feedbackList &&
            feedbackList?.map((item, index) => (
              <Collapsible key={index} className="my-7">
                <CollapsibleTrigger className="bg-slate-800 rounded-lg p-3 my-2 text-left  border w-full flex justify-between gap-5">
                  {item.question}
                  <ChevronsUpDown />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-amber-300 p-3 border rounded-lg">
                      <strong>Rating: </strong>
                      {item.rating}
                    </h2>
                    <h2 className="text-yellow-800 bg-yellow-50 p-3 border rounded-lg">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="text-green-800 bg-green-50 p-3 border rounded-lg">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="text-indigo-800 bg-indigo-50 p-3 border rounded-lg">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Button className="mt-7" onClick={() => router.replace("/dashboard")}>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
