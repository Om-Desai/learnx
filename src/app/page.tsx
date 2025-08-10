import Link from "next/link";
import { EventTracker } from "@/components/event-tracker";

export default function Home() {
  return (
    <div className="space-y-6">
      <EventTracker page="home" />
      <h1 className="text-3xl font-bold">LearnX</h1>
      <p className="text-gray-700 max-w-2xl">
        Interactive learning with text, videos, and quizzes. Create an account, pick a course, and your activity will be tracked to improve your learning experience.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded">Get started</Link>
        <Link href="/login" className="border px-4 py-2 rounded">I have an account</Link>
      </div>
    </div>
  );
}
