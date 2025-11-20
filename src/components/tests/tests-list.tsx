"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, ArrowRight } from "lucide-react";
import { TestType } from "@/constants/mental-health-tests";

type TestsListProps = {
  onSelectTest: (testType: TestType) => void;
};

export function TestsList({ onSelectTest }: TestsListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Mental Health Assessments</h1>
          <p className="text-muted-foreground text-lg">
            Take validated screening tests to understand your mental health better
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">PHQ-9</CardTitle>
                  <CardDescription>Depression Screening</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Patient Health Questionnaire-9 (PHQ-9) is a widely-used screening tool
                for depression. It consists of 9 questions about symptoms experienced over
                the past 2 weeks.
              </p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Duration:</span> 2-3 minutes
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Questions:</span> 9
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Measures:</span> Depression severity
                </div>
              </div>

              <Button
                onClick={() => onSelectTest("PHQ9")}
                className="w-full"
                size="lg"
              >
                Take PHQ-9 Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">GAD-7</CardTitle>
                  <CardDescription>Anxiety Screening</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Generalized Anxiety Disorder-7 (GAD-7) is a validated screening tool
                for anxiety disorders. It consists of 7 questions about anxiety symptoms
                over the past 2 weeks.
              </p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Duration:</span> 1-2 minutes
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Questions:</span> 7
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Measures:</span> Anxiety severity
                </div>
              </div>

              <Button
                onClick={() => onSelectTest("GAD7")}
                className="w-full"
                size="lg"
              >
                Take GAD-7 Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              These screening tools are designed to help identify potential mental health
              concerns. They are <span className="font-semibold text-foreground">not diagnostic instruments</span> and
              should not replace professional medical advice.
            </p>
            <p>
              If you're experiencing a mental health emergency or having thoughts of
              self-harm, please contact emergency services or a crisis helpline immediately:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>National Suicide Prevention Lifeline: <span className="font-semibold text-foreground">988</span> (US)</li>
              <li>Crisis Text Line: Text <span className="font-semibold text-foreground">HOME</span> to <span className="font-semibold text-foreground">741741</span></li>
              <li>International Association for Suicide Prevention: <span className="font-semibold text-foreground">iasp.info</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

