"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { TestType, RESPONSE_OPTIONS, TEST_METADATA } from "@/constants/mental-health-tests";

type TestQuestionnaireProps = {
  testType: TestType;
  answers: Record<number, number>;
  onAnswerChange: (questionId: number, value: number) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function TestQuestionnaire({
  testType,
  answers,
  onAnswerChange,
  onSubmit,
  onBack,
}: TestQuestionnaireProps) {
  const testData = TEST_METADATA[testType];
  const isTestComplete = Object.keys(answers).length === testData.questions.length;
  const progress = (Object.keys(answers).length / testData.questions.length) * 100;

  return (
    <div className="bg-background min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-2 md:mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{testData.fullName}</CardTitle>
            <CardDescription className="text-sm md:text-base">
              {testData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="text-sm md:text-base">Instructions</AlertTitle>
              <AlertDescription className="text-xs md:text-sm">
                {testData.instructions} Please answer all questions honestly for the most accurate results.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-1">
                <span>Progress</span>
                <span>
                  {Object.keys(answers).length} of {testData.questions.length} completed
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-4 md:space-y-8">
              {testData.questions.map((q, index) => (
                <Card
                  key={q.id}
                  className={answers[q.id] !== undefined ? "border-primary" : ""}
                >
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-lg font-medium leading-snug">
                      {index + 1}. {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[q.id]?.toString()}
                      onValueChange={(value) => onAnswerChange(q.id, parseInt(value))}
                    >
                      <div className="space-y-2 md:space-y-3">
                        {RESPONSE_OPTIONS.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2 md:space-x-3">
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={`${testType}-q${q.id}-${option.value}`}
                            />
                            <Label
                              htmlFor={`${testType}-q${q.id}-${option.value}`}
                              className="flex-1 cursor-pointer font-normal text-sm md:text-base"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={onSubmit}
                disabled={!isTestComplete}
                size="lg"
                className="min-w-[160px] md:min-w-[200px] text-sm md:text-base"
              >
                {isTestComplete
                  ? "View Results"
                  : `Complete All (${Object.keys(answers).length}/${testData.questions.length})`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">About the {testData.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 text-xs md:text-sm text-muted-foreground">
            <p>{testData.about}</p>
            <div>
              <p className="font-semibold text-foreground mb-2">Scoring Interpretation:</p>
              <ul className="space-y-1 ml-4">
                {testData.scoreRanges.map((range, index) => (
                  <li key={index}>
                    • {range.range}: {range.level}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-semibold text-foreground">Disclaimer:</span> This
              screening tool is not a substitute for professional medical advice, diagnosis,
              or treatment. Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical condition.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

