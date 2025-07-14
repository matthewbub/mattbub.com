"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw, Pause } from "lucide-react";
import { gsap } from "gsap";

interface MergeItem {
  value: number;
  id: number;
  isComparing?: boolean;
  isActive?: boolean;
  level?: number;
}

const Index = () => {
  const [array, setArray] = useState<MergeItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [speed, setSpeed] = useState(300);
  const animationRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize random array
  const initializeArray = () => {
    const newArray = Array.from({ length: 8 }, (_, index) => ({
      value: Math.floor(Math.random() * 90) + 10,
      id: index,
      isComparing: false,
      isActive: false,
      level: 0,
    }));
    setArray(newArray);
    setCurrentStep("");
    setSortedIndices(new Set());
    setIsRunning(false);
    setIsPaused(false);

    // Reset any ongoing animations
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Reset GSAP transforms
    if (elementsRef.current.length > 0) {
      gsap.set(
        elementsRef.current.filter((el) => el !== null),
        {
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "all",
        }
      );
    }
  };

  // Initialize on component mount
  useEffect(() => {
    initializeArray();
  }, []);

  // Merge sort implementation with visualization
  const mergeSort = async (start: number, end: number, level: number = 0): Promise<void> => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    // Highlight the current division
    setCurrentStep(`Dividing at level ${level}: indices ${start}-${mid} | ${mid + 1}-${end}`);
    
    // Animate division
    if (elementsRef.current.length > 0) {
      // Highlight left side
      for (let i = start; i <= mid; i++) {
        if (elementsRef.current[i]) {
          gsap.to(elementsRef.current[i], {
            x: -20,
            y: -level * 15,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
      
      // Highlight right side
      for (let i = mid + 1; i <= end; i++) {
        if (elementsRef.current[i]) {
          gsap.to(elementsRef.current[i], {
            x: 20,
            y: -level * 15,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    }

    await new Promise((resolve) => {
      animationRef.current = setTimeout(resolve, speed) as unknown as number;
    });

    if (!isRunningRef.current) return;

    // Recursively sort both halves
    await mergeSort(start, mid, level + 1);
    if (!isRunningRef.current) return;
    
    await mergeSort(mid + 1, end, level + 1);
    if (!isRunningRef.current) return;

    // Merge the sorted halves
    await merge(start, mid, end, level);
  };

  // Merge function with visualization
  const merge = async (start: number, mid: number, end: number, level: number): Promise<void> => {
    if (!isRunningRef.current) return;

    // Create temporary arrays for left and right subarrays
    const leftArray: MergeItem[] = [];
    const rightArray: MergeItem[] = [];

    // Copy data to temp arrays
    for (let i = start; i <= mid; i++) {
      leftArray.push({ ...array[i] });
    }
    for (let i = mid + 1; i <= end; i++) {
      rightArray.push({ ...array[i] });
    }

    setCurrentStep(`Merging at level ${level}: [${leftArray.map(item => item.value).join(', ')}] + [${rightArray.map(item => item.value).join(', ')}]`);

    let leftIndex = 0;
    let rightIndex = 0;
    let mergedIndex = start;

    // Merge the temp arrays back into the main array
    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
      if (!isRunningRef.current) return;

      const leftItem = leftArray[leftIndex];
      const rightItem = rightArray[rightIndex];
      
      setCurrentStep(`Comparing ${leftItem.value} and ${rightItem.value}`);

      // Highlight comparing elements
      const leftPos = start + leftIndex;
      const rightPos = mid + 1 + rightIndex;
      
      if (elementsRef.current[leftPos] && elementsRef.current[rightPos]) {
        gsap.to([elementsRef.current[leftPos], elementsRef.current[rightPos]], {
          scale: 1.3,
          y: -30,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      await new Promise((resolve) => {
        animationRef.current = setTimeout(resolve, speed) as unknown as number;
      });

      if (!isRunningRef.current) return;

      // Choose the smaller element and update the array
      if (leftItem.value <= rightItem.value) {
        setArray(prevArray => {
          const newArray = [...prevArray];
          newArray[mergedIndex] = { ...leftItem, isActive: true };
          return newArray;
        });
        leftIndex++;
      } else {
        setArray(prevArray => {
          const newArray = [...prevArray];
          newArray[mergedIndex] = { ...rightItem, isActive: true };
          return newArray;
        });
        rightIndex++;
      }

      // Highlight the merged position
      if (elementsRef.current[mergedIndex]) {
        gsap.to(elementsRef.current[mergedIndex], {
          scale: 1.2,
          backgroundColor: "#10b981",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Reset comparison highlighting
      if (elementsRef.current[leftPos] && elementsRef.current[rightPos]) {
        gsap.to([elementsRef.current[leftPos], elementsRef.current[rightPos]], {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      mergedIndex++;

      await new Promise((resolve) => {
        animationRef.current = setTimeout(resolve, speed / 2) as unknown as number;
      });
    }

    // Copy remaining elements of leftArray
    while (leftIndex < leftArray.length) {
      if (!isRunningRef.current) return;
      
      setArray(prevArray => {
        const newArray = [...prevArray];
        newArray[mergedIndex] = { ...leftArray[leftIndex], isActive: true };
        return newArray;
      });
      
      if (elementsRef.current[mergedIndex]) {
        gsap.to(elementsRef.current[mergedIndex], {
          scale: 1.2,
          backgroundColor: "#10b981",
          duration: 0.3,
          ease: "power2.out",
        });
      }
      
      leftIndex++;
      mergedIndex++;
    }

    // Copy remaining elements of rightArray
    while (rightIndex < rightArray.length) {
      if (!isRunningRef.current) return;
      
      setArray(prevArray => {
        const newArray = [...prevArray];
        newArray[mergedIndex] = { ...rightArray[rightIndex], isActive: true };
        return newArray;
      });
      
      if (elementsRef.current[mergedIndex]) {
        gsap.to(elementsRef.current[mergedIndex], {
          scale: 1.2,
          backgroundColor: "#10b981",
          duration: 0.3,
          ease: "power2.out",
        });
      }
      
      rightIndex++;
      mergedIndex++;
    }

    // Reset all elements in the merged range
    if (elementsRef.current.length > 0) {
      for (let i = start; i <= end; i++) {
        if (elementsRef.current[i]) {
          gsap.to(elementsRef.current[i], {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }
    }

    // Mark this range as active
    setArray(prevArray => {
      const newArray = [...prevArray];
      for (let i = start; i <= end; i++) {
        newArray[i] = { ...newArray[i], isActive: false };
      }
      return newArray;
    });

    await new Promise((resolve) => {
      animationRef.current = setTimeout(resolve, speed) as unknown as number;
    });
  };

  // Main sorting function
  const startMergeSort = async () => {
    if (!isRunningRef.current) return;

    try {
      await mergeSort(0, array.length - 1);
      
      if (isRunningRef.current) {
        setSortedIndices(new Set(Array.from({ length: array.length }, (_, i) => i)));
        setCurrentStep("Merge sort complete!");
        
        // Celebration animation
        if (elementsRef.current.length > 0) {
          gsap.to(
            elementsRef.current.filter((el) => el !== null),
            {
              scale: 1.2,
              y: -20,
              duration: 0.5,
              stagger: 0.1,
              ease: "bounce.out",
              yoyo: true,
              repeat: 1,
            }
          );
        }
        
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Merge sort error:", error);
      setIsRunning(false);
    }
  };

  // Main sorting effect
  useEffect(() => {
    isRunningRef.current = isRunning && !isPaused;

    if (!isRunning || isPaused) {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      return;
    }

    startMergeSort();

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Start sorting
  const startSort = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  // Pause sorting
  const pauseSort = () => {
    setIsPaused(true);
    setIsRunning(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Merge Sort Visualization
          </h1>
          <p className="text-gray-600 text-lg">
            Watch the divide and conquer algorithm in action!
          </p>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button
              onClick={startSort}
              disabled={isRunning}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <Play className="w-4 h-4 mr-2" />
              {isPaused ? "Resume" : "Start Sort"}
            </Button>

            <Button
              onClick={pauseSort}
              disabled={!isRunning}
              variant="outline"
              className="px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>

            <Button
              onClick={initializeArray}
              disabled={isRunning}
              variant="outline"
              className="px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <input
                type="range"
                min="50"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isRunning}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{speed}ms</span>
            </div>
          </div>
        </Card>

        {/* Visualization Area */}
        <div className="flex gap-4 justify-center items-end min-h-[300px]">
          {array.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (elementsRef.current[index] = el)}
              className={`
                  relative
                  ${item.isComparing ? "z-10" : ""}
                  ${item.isActive ? "z-20" : ""}
                `}
            >
              {/* Element */}
              <div
                className={`
                    w-16 h-16 rounded-lg flex items-center justify-center
                    text-white font-bold text-lg shadow-lg
                    transition-all duration-300 ease-in-out
                    ${
                      sortedIndices.has(index)
                        ? "bg-green-600 animate-pulse"
                        : item.isComparing
                        ? "bg-orange-500"
                        : item.isActive
                        ? "bg-pink-500"
                        : "bg-purple-500"
                    }
                  `}
              >
                {item.value}
              </div>

              {/* Height bar */}
              <div
                className={`
                    w-16 rounded-t-lg mt-2 transition-all duration-300
                    ${
                      sortedIndices.has(index)
                        ? "bg-green-500"
                        : item.isComparing
                        ? "bg-orange-500"
                        : item.isActive
                        ? "bg-pink-500"
                        : "bg-purple-500"
                    }
                  `}
                style={{ height: `${item.value * 2}px` }}
              />

              {/* Index label */}
              <div className="text-center mt-2 text-sm text-gray-600 font-medium">
                {index}
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          {isRunning && currentStep && (
            <p className="text-lg text-purple-600 font-medium animate-pulse">
              {currentStep}
            </p>
          )}
          {sortedIndices.size === array.length && array.length > 0 && (
            <p className="text-lg text-green-600 font-bold animate-bounce">
              🎉 Sorting Complete! 🎉
            </p>
          )}
          {!isRunning && sortedIndices.size === 0 && (
            <p className="text-lg text-gray-600">
              Click &quot;Start Sort&quot; to begin the merge sort animation
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;