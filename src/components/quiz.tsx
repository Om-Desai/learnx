"use client";
import { useState } from "react";
import { z } from "zod";

const QuizQuestionSchema = z.object({
  id: z.string(),
  index: z.number(),
  prompt: z.string(),
  options: z.array(z.string()),
});

const QuizSchema = z.object({
  id: z.string(),
  questions: z.array(QuizQuestionSchema),
});

export type QuizType = z.infer<typeof QuizSchema>;

export function Quiz({ quiz }: { quiz: QuizType }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<null | { score: number; total: number }>(null);

  async function submit() {
    const payload = Object.entries(answers)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, idx]) => idx);

    const res = await fetch(`/api/quiz/${quiz.id}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answersIdx: payload }),
    });
    if (res.ok) {
      const j = await res.json();
      setResult({ score: j.score, total: j.total });
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-medium">Quiz</h3>
      {quiz.questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.index + 1}. {q.prompt}</p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={q.id}
                  value={i}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={submit} className="bg-emerald-600 text-white px-4 py-2 rounded">Submit Quiz</button>
      {result && (
        <p className="text-sm">You scored {result.score} / {result.total}</p>
      )}
    </div>
  );
}

