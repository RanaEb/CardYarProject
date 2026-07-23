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
        <div className="mb-6 w-full">
          <span className="text-xs text-[#0057A3] bg-[#EAF3FF] px-3 py-1 rounded-full font-medium">
            سؤال
          </span>

          {card.questionImage && (
            <img
              src={card.questionImage}
              className="max-h-64 mx-auto mt-4 mb-4 rounded-lg"
            />
          )}

          {card.questionText && (
            <h2 className="text-2xl font-semibold mt-2 text-slate-800 leading-relaxed">
              {card.questionText}
            </h2>
          )}
        </div>

        {showAnswer ? (
          <div className="mt-6 pt-6 border-t border-[#D9E8FF] w-full animate-in fade-in duration-500">
            <span className="text-xs text-[#0057A3] bg-[#EAF3FF] px-3 py-1 rounded-full font-medium">
              پاسخ
            </span>

            {card.answerImage && (
              <img
                src={card.answerImage}
                className="max-h-64 mx-auto mt-4 mb-4 rounded-lg"
              />
            )}

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

      {showAnswer && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8 pt-6 border-t border-[#D9E8FF]">
          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer("again");
            }}
            className="bg-[#FDECEC] text-[#C93D3B] hover:bg-[#FAD4D4] border border-[#F5B5B5] rounded-xl h-11 font-medium"
          >
            😵 یادم نبود
          </Button>

          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer("hard");
            }}
            className="bg-[#FFF4E5] text-[#C47A00] hover:bg-[#FFE9C2] border border-[#FFD58A] rounded-xl h-11 font-medium"
          >
            😕 سخت بود
          </Button>

          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer("good");
            }}
            className="bg-[#E8F6EE] text-[#1D7A46] hover:bg-[#D7F1E3] border border-[#B9E5CB] rounded-xl h-11 font-medium"
          >
            🙂 خوب بود
          </Button>

          <Button
            onClick={() => {
              setShowAnswer(false);
              onAnswer("easy");
            }}
            className="bg-[#DDF4FF] text-[#006FA6] hover:bg-[#CBEFFF] border border-[#A8E0F7] rounded-xl h-11 font-medium"
          >
            😎 خیلی آسون
          </Button>
        </div>
      )}
    </Card>
  );
}
