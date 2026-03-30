import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetQuiz, useSubmitQuizAttempt } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Award, CheckCircle2, XCircle, AlertCircle, Trophy, ChevronRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const quizId = parseInt(id || "1", 10);
  
  const { data: quiz, isLoading } = useGetQuiz(quizId, {
    query: { enabled: !!quizId, queryKey: ["/api/quizzes", quizId] }
  });

  const submitMutation = useSubmitQuizAttempt();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (quiz && !isFinished) {
      // Initialize if starting
      if (timeLeft === 0 && selectedAnswers.length === 0) {
        setTimeLeft(quiz.timeLimit * 60);
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, isFinished]);

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIdx] = optionIdx;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (!quiz) return;
    setIsFinished(true);
    
    // Calculate simple mock score before API returns
    const timeTaken = quiz.timeLimit * 60 - timeLeft;
    
    submitMutation.mutate({
      data: {
        answers: selectedAnswers,
        timeTaken
      }
    }, {
      onSuccess: (res) => {
        setResult(res);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16" /><Skeleton className="h-16" />
          <Skeleton className="h-16" /><Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  if (!quiz) return <div className="text-center py-20 text-xl font-medium text-muted-foreground">Quiz not found.</div>;

  const currentQ = quiz.questions[currentQuestionIdx];
  const isAnswered = selectedAnswers[currentQuestionIdx] !== -1;
  const progressPercent = ((currentQuestionIdx) / quiz.questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isFinished) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-3xl p-8 shadow-lg text-center"
        >
          {submitMutation.isPending || !result ? (
            <div className="py-12 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-bold font-serif">Calculating your score...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-2">
                {result.passed ? <Trophy className="h-12 w-12" /> : <AlertCircle className="h-12 w-12 text-destructive" />}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold font-serif mb-2">
                  {result.passed ? "Congratulations!" : "Keep Trying!"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  You scored <span className="font-bold text-foreground">{result.score}%</span> on this quiz.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Correct</p>
                  <p className="text-xl font-bold text-emerald-600">{result.correctAnswers} <span className="text-sm font-normal text-muted-foreground">/ {result.totalQuestions}</span></p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Time Taken</p>
                  <p className="text-xl font-bold">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl border border-border col-span-2 md:col-span-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">XP Earned</p>
                  <p className="text-xl font-bold text-primary">+{result.passed ? 150 : 50}</p>
                </div>
              </div>

              {result.badge && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-2xl p-4 flex items-center justify-center gap-3">
                  <Award className="h-8 w-8 text-orange-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">New Badge Unlocked!</p>
                    <p className="font-bold">{result.badge}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button className="rounded-full font-semibold px-8" size="lg" onClick={() => window.location.reload()}>
                  <RefreshCcw className="mr-2 h-5 w-5" /> Retake Quiz
                </Button>
                <Link href="/quiz/leaderboard">
                  <Button variant="outline" className="rounded-full font-semibold px-8" size="lg">
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
      
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div>
          <Badge variant="secondary" className="mb-2">{quiz.sector}</Badge>
          <h1 className="text-xl font-bold font-serif">{quiz.title}</h1>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl">
          <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
          <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-destructive' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-muted-foreground">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
          <span className="text-primary">{Math.round(progressPercent)}% Completed</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border shadow-md bg-card overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-border/50">
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group
                        ${isSelected 
                          ? 'border-primary bg-primary/10 shadow-sm' 
                          : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-base font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {option}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={handleNext} 
          disabled={!isAnswered}
          className="rounded-full font-bold px-8 shadow-md"
        >
          {currentQuestionIdx < quiz.questions.length - 1 ? (
            <>Next Question <ChevronRight className="ml-2 h-5 w-5" /></>
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </div>

    </div>
  );
}