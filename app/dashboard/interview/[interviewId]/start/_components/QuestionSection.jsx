import { Lightbulb } from "lucide-react";
import React, { useEffect } from "react";

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  useEffect(() => {
    console.log(mockInterviewQuestion);
  });

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-2xl mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5  ">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => (
              <h2
                key={index}
                className={`p-2 bg-blue-300 rounded-full text-center sm:text-xs md:text-sm lg:text-lg cursor-pointer ${
                  activeQuestionIndex == index &&
                  "bg-primary text-white shadow-gray-600 shadow-md"
                }`}
              >
                {" "}
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-10 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <div className="border rounded-2xl p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 text-primary">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-primary text-sm my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionSection;
