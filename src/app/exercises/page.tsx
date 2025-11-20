"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ExercisesPage() {
  return (
    <div className="container max-w-4xl py-4 md:py-6 space-y-6 md:space-y-8 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center mx-auto px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mental Health Exercises</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Take a moment to ground yourself with these simple exercises. No tracking, just presence.
        </p>
      </div>

      <Tabs defaultValue="box-breathing" className="w-full flex flex-col items-center">
        <TabsList className="grid w-full grid-cols-3 max-w-full lg:w-[400px]">
          <TabsTrigger value="box-breathing" className="text-xs md:text-sm px-2 md:px-3">Box Breathing</TabsTrigger>
          <TabsTrigger value="4-7-8" className="text-xs md:text-sm px-2 md:px-3">4-7-8 Relax</TabsTrigger>
          <TabsTrigger value="grounding" className="text-xs md:text-sm px-2 md:px-3">Grounding</TabsTrigger>
        </TabsList>
        <TabsContent value="box-breathing" className="mt-6 w-full max-w-2xl">
          <BoxBreathing />
        </TabsContent>
        <TabsContent value="4-7-8" className="mt-6 w-full max-w-2xl">
          <RelaxBreathing />
        </TabsContent>
        <TabsContent value="grounding" className="mt-6 w-full max-w-2xl">
          <GroundingExercise />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
  const [scale, setScale] = useState(0.55);
  const [text, setText] = useState("Ready?");
  
  const CYCLE_DURATION = 16000; // 4s * 4
  const PHASE_DURATION = 4000;
  
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setScale(0.55);
    setText("Ready?");
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    startTimeRef.current = null;
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    
    const cycleTime = elapsed % CYCLE_DURATION;
    const currentPhaseIndex = Math.floor(cycleTime / PHASE_DURATION);
    const phaseProgress = (cycleTime % PHASE_DURATION) / PHASE_DURATION;

    if (currentPhaseIndex === 0) {
      setPhase("inhale");
      setText("Inhale");
      // Scale from 0.55 to 1.0
      setScale(0.55 + (phaseProgress * 0.45));
    } else if (currentPhaseIndex === 1) {
      setPhase("hold");
      setText("Hold");
      setScale(1.0);
    } else if (currentPhaseIndex === 2) {
      setPhase("exhale");
      setText("Exhale");
      // Scale from 1.0 to 0.55
      setScale(1.0 - (phaseProgress * 0.45));
    } else {
      setPhase("hold2");
      setText("Hold");
      setScale(0.55);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Box Breathing</CardTitle>
        <CardDescription>
          A simple technique to calm the nervous system. Inhale, hold, exhale, and hold for 4 seconds each.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-8">
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full border-1 border-black opacity-20" />
          
          {/* Animated Circle */}
          <div 
            className={cn(
              "absolute rounded-full bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-300",
              phase === "inhale" && "bg-blue-500/30",
              phase === "exhale" && "bg-green-500/30",
              (phase === "hold" || phase === "hold2") && "bg-purple-500/30"
            )}
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
            }}
          />
          
          <div className="z-10 text-2xl font-bold text-center px-4 py-2">
            {text}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            variant={isActive ? "secondary" : "default"}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RelaxBreathing() {
  const [isActive, setIsActive] = useState(false);
  // 4-7-8
  const [text, setText] = useState("Ready?");
  
  // Durations in ms
  const INHALE = 4000;
  const HOLD = 7000;
  const EXHALE = 8000;
  const CYCLE_DURATION = INHALE + HOLD + EXHALE;
  
  const [scale, setScale] = useState(0.55); // 0.55 to 1.0
  
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const reset = () => {
    setIsActive(false);
    setText("Ready?");
    setScale(0.55);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    startTimeRef.current = null;
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const cycleTime = elapsed % CYCLE_DURATION;

    if (cycleTime < INHALE) {
      setText("Inhale (4s)");
      // Scale from 0.55 to 1.0
      const p = cycleTime / INHALE;
      setScale(0.55 + (p * 0.45));
    } else if (cycleTime < INHALE + HOLD) {
      setText("Hold (7s)");
      setScale(1.0);
    } else {
      setText("Exhale (8s)");
      // Scale from 1.0 to 0.55
      const p = (cycleTime - (INHALE + HOLD)) / EXHALE;
      setScale(1.0 - (p * 0.45));
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>4-7-8 Relaxing Breath</CardTitle>
        <CardDescription>
          A natural tranquilizer for the nervous system. Inhale for 4s, hold for 7s, exhale for 8s.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-8">
        <div className="relative flex items-center justify-center w-64 h-64">
           <div className="absolute inset-0 rounded-full border-4 border-muted opacity-20" />
           <div 
            className="absolute rounded-full bg-indigo-500/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
            }}
          />
          <div className="z-10 text-2xl font-bold text-center">
            {text}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            variant={isActive ? "secondary" : "default"}
            onClick={() => setIsActive(!isActive)}
          >
             {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GroundingExercise() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const items = [
    { id: "see-1", category: "5 Things you see", label: "Look around and name an object" },
    { id: "see-2", category: "5 Things you see", label: "Notice a color in the room" },
    { id: "see-3", category: "5 Things you see", label: "Find a shape or shadow" },
    { id: "see-4", category: "5 Things you see", label: "Look at something small" },
    { id: "see-5", category: "5 Things you see", label: "Look at something far away" },
    
    { id: "feel-1", category: "4 Things you feel", label: "Feel your feet on the floor" },
    { id: "feel-2", category: "4 Things you feel", label: "Touch the fabric of your clothes" },
    { id: "feel-3", category: "4 Things you feel", label: "Feel the air on your skin" },
    { id: "feel-4", category: "4 Things you feel", label: "Touch a nearby object" },

    { id: "hear-1", category: "3 Things you hear", label: "Listen for a distant sound" },
    { id: "hear-2", category: "3 Things you hear", label: "Listen for a close sound" },
    { id: "hear-3", category: "3 Things you hear", label: "Listen to your own breath" },

    { id: "smell-1", category: "2 Things you smell", label: "Notice any scents in the air" },
    { id: "smell-2", category: "2 Things you smell", label: "Or name 2 favorite smells" },

    { id: "taste-1", category: "1 Thing you taste", label: "Notice the taste in your mouth" },
  ];

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = (Object.values(checked).filter(Boolean).length / items.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-4-3-2-1 Grounding</CardTitle>
        <CardDescription>
          Use your senses to anchor yourself in the present moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
            {["5 Things you see", "4 Things you feel", "3 Things you hear", "2 Things you smell", "1 Thing you taste"].map((category) => (
                <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">{category}</h3>
                    <div className="space-y-2 pl-2 border-l-2">
                        {items.filter(i => i.category === category).map((item) => (
                             <div key={item.id} className="flex items-center space-x-2">
                             <Checkbox 
                               id={item.id} 
                               checked={!!checked[item.id]}
                               onCheckedChange={() => toggle(item.id)}
                             />
                             <Label 
                                htmlFor={item.id} 
                                className={cn(
                                    "cursor-pointer transition-all",
                                    checked[item.id] && "text-muted-foreground line-through"
                                )}
                             >
                               {item.label}
                             </Label>
                           </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <Button 
            className="w-full mt-4" 
            variant="outline"
            onClick={() => setChecked({})}
            disabled={progress === 0}
        >
            Reset
        </Button>
      </CardContent>
    </Card>
  );
}

