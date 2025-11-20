"use client";

import { useState } from "react";
import { TestsList } from "@/components/tests/tests-list";
import { TestQuestionnaire } from "@/components/tests/test-questionnaire";
import { TestResults } from "@/components/tests/test-results";
import { TestType } from "@/constants/mental-health-tests";

type ViewState = "list" | "questionnaire" | "results";

export default function TestsPage() {
  const [currentView, setCurrentView] = useState<ViewState>("list");
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const handleSelectTest = (testType: TestType) => {
    setSelectedTest(testType);
    setAnswers({});
    setCurrentView("questionnaire");
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(totalScore);
    setCurrentView("results");
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentView("questionnaire");
  };

  const handleBackToList = () => {
    setAnswers({});
    setSelectedTest(null);
    setScore(0);
    setCurrentView("list");
  };

  if (currentView === "list") {
    return <TestsList onSelectTest={handleSelectTest} />;
  }

  if (currentView === "questionnaire" && selectedTest) {
    return (
      <TestQuestionnaire
        testType={selectedTest}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        onBack={handleBackToList}
      />
    );
  }

  if (currentView === "results" && selectedTest) {
    return (
      <TestResults
        testType={selectedTest}
        score={score}
        onReset={handleReset}
        onBackToList={handleBackToList}
      />
    );
  }

  return null;
}
