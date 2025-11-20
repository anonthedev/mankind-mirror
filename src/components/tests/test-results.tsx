"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, RefreshCw, ArrowLeft } from "lucide-react";
import { TestType, TEST_METADATA } from "@/constants/mental-health-tests";

type TestResultsProps = {
  testType: TestType;
  score: number;
  onReset: () => void;
  onBackToList: () => void;
};

function getSeverityIcon(color: string) {
  if (color === "text-green-600") {
    return <CheckCircle className="h-6 w-6 text-green-600" />;
  } else if (color === "text-yellow-600") {
    return <Info className="h-6 w-6 text-yellow-600" />;
  } else {
    return <AlertCircle className={`h-6 w-6 ${color}`} />;
  }
}

export function TestResults({ testType, score, onReset, onBackToList }: TestResultsProps) {
  const testData = TEST_METADATA[testType];
  const severityInfo = testData.getSeverity(score);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={onBackToList}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              {getSeverityIcon(severityInfo.color)}
              {testData.name} Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <div className="text-6xl font-bold mb-2">{score}</div>
              <div className="text-xl text-muted-foreground">
                out of {testData.maxScore}
              </div>
            </div>

            <Alert className="border-2">
              <AlertTitle className={`text-xl font-bold ${severityInfo.color}`}>
                {severityInfo.level}
              </AlertTitle>
              <AlertDescription className="mt-2">
                {severityInfo.description}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations & Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {severityInfo.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="flex-1">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                This test is a screening tool and not a diagnostic instrument. The results
                should be discussed with a qualified healthcare professional for proper
                evaluation and diagnosis. If you're experiencing a mental health emergency,
                please contact emergency services or a crisis helpline immediately.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={onReset} className="flex-1" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Take Test Again
              </Button>
              <Button onClick={onBackToList} className="flex-1">
                View All Tests
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Based on your results, consider the following actions:
            </p>
            <ul className="space-y-2 ml-4">
              <li>
                • <span className="font-semibold text-foreground">Track your progress:</span> Take this test periodically to monitor changes in your symptoms
              </li>
              <li>
                • <span className="font-semibold text-foreground">Share with your provider:</span> Bring these results to discuss with your healthcare professional
              </li>
              <li>
                • <span className="font-semibold text-foreground">Explore resources:</span> Use our exercises and journaling features to support your mental health
              </li>
              <li>
                • <span className="font-semibold text-foreground">Seek support:</span> Don't hesitate to reach out to mental health professionals or support groups
              </li>
            </ul>
            
            <div className="pt-4 border-t">
              <p className="font-semibold text-foreground mb-2">Crisis Resources:</p>
              <ul className="space-y-1 ml-2">
                <li>• National Suicide Prevention Lifeline: <span className="font-semibold text-foreground">7893078930</span> (IN)</li>
                <li>• Emergency Services: <span className="font-semibold text-foreground">112</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

