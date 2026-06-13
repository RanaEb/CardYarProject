"use client";
import React, { useState } from "react";
import { Card } from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";

export default function Flashcard({ card, onAnswer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!card)
    return (
      <div className="text-center p-10 text-slate-500">
        کارتی برای مرور وجود ندارد 🎉
      </div>
    );

  return (
    <Card className="max-w-md mx-auto mt-10 p-8 bg-white border border-[#BFD8F8] rounded-2xl shadow-sm">
      <div className="min-h-[220px] flex flex-col items-center justify-center text-center">
        {/* سوال */}
        <div className="mb-6 w-full">
          <span className="text-xs text-[#0057A3] bg-[#EAF3FF] px-3 py-1 rounded-full font-medium">
            سؤال
          </span>

          {/* عکس سوال */}
          {card.questionImage && (
            <img
              src={card.questionImage}
              className="max-h-64 mx-auto mt-4 mb-4 rounded-lg"
            />
          )}

          {/* متن سوال */}
          {card.questionText && (
            <h2 className="text-2xl font-semibold mt-2 text-slate-800 leading-relaxed">
              {card.questionText}
            </h2>
          )}
        </div>

        {/* پاسخ */}
        {showAnswer ? (
          <div className="mt-6 pt-6 border-t border-[#D9E8FF] w-full animate-in fade-in duration-500">
            <span className="text-xs text-[#0057A3] bg-[#EAF3FF] px-3 py-1 rounded-full font-medium">
              پاسخ
            </span>

            {/* عکس پاسخ */}
            {card.answerImage && (
              <img
                src={card.answerImage}
                className="max-h-64 mx-auto mt-4 mb-4 rounded-lg"
              />
            )}

            {/* متن پاسخ */}
            {card.answerText && (
              <p className="text-lg mt-2 text-slate-700 leading-relaxed">
                {card.answerText}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => setShowAnswer(true)}
            className="mt-6 text-white rounded-xl px-6 h-11"
          >
            نمایش پاسخ
          </Button>
        )}
      </div>

      {/* دکمه‌های پاسخ */}
      {showAnswer && (
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#D9E8FF]">
          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer(false);
            }}
            className="bg-[#FDECEC] text-[#C93D3B] hover:bg-[#FAD4D4] border border-[#F5B5B5] rounded-xl h-11 font-medium"
          >
            یادم نبود
          </Button>

          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer(true);
            }}
            className="bg-[#34A38A] hover:bg-[#2C8C76] text-white rounded-xl h-11 font-medium"
          >
            بلد بودم
          </Button>
        </div>
      )}
    </Card>
  );
}
