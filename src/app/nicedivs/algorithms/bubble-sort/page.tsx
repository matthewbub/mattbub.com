"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw, Pause } from "lucide-react";
import { gsap } from "gsap";

interface BubbleItem {
  value: number;
  id: number;
  isComparing?: boolean;
  isSwapping?: boolean;
}

const Index = () => {
  const [array, setArray] = useState<BubbleItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
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
      isSwapping: false,
    }));
    setArray(newArray);
    setCurrentI(0);
    setCurrentJ(0);
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

  // Bubble sort step function with GSAP animations
  const performSortStep = async (
    currentArray: BubbleItem[],
    i: number,
    j: number,
    sorted: Set<number>
  ): Promise<{
    newArray: BubbleItem[];
    newI: number;
    newJ: number;
    newSorted: Set<number>;
    completed: boolean;
  }> => {
    // Highlight comparing elements
    const comparingArray = currentArray.map((item, index) => ({
      ...item,
      isComparing: index === j || index === j + 1,
      isSwapping: false,
    }));

    setArray([...comparingArray]);
    setCurrentI(i);
    setCurrentJ(j);

    // Animate comparison highlight
    if (elementsRef.current[j] && elementsRef.current[j + 1]) {
      gsap.to([elementsRef.current[j], elementsRef.current[j + 1]], {
        scale: 1.1,
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // Wait for comparison visualization
    await new Promise((resolve) => {
      animationRef.current = setTimeout(resolve, speed) as unknown as number;
    });

    const resultArray = [...currentArray];

    if (currentArray[j].value > currentArray[j + 1].value) {
      // Animate the swap using GSAP
      if (elementsRef.current[j] && elementsRef.current[j + 1]) {
        const element1 = elementsRef.current[j];
        const element2 = elementsRef.current[j + 1];

        // Get the distance to swap
        const element1Rect = element1.getBoundingClientRect();
        const element2Rect = element2.getBoundingClientRect();
        const distance = element2Rect.left - element1Rect.left;

        // Create timeline for smooth swap animation
        const tl = gsap.timeline();

        // First, lift both elements
        tl.to([element1, element2], {
          y: -30,
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
        })
          // Then move them horizontally
          .to(
            element1,
            {
              x: distance,
              duration: 0.4,
              ease: "power2.inOut",
            },
            "-=0.1"
          )
          .to(
            element2,
            {
              x: -distance,
              duration: 0.4,
              ease: "power2.inOut",
            },
            "-=0.4"
          )
          // Finally, bring them back down
          .to([element1, element2], {
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.in",
          });

        // Wait for animation to complete
        await new Promise((resolve) => {
          tl.then(resolve);
        });

        // Reset transforms after animation
        gsap.set([element1, element2], { x: 0, y: 0, scale: 1 });
      }

      // Perform the actual data swap
      [resultArray[j], resultArray[j + 1]] = [
        resultArray[j + 1],
        resultArray[j],
      ];

      // Update the array state
      setArray([...resultArray]);
    } else {
      // Reset comparison highlighting if no swap
      if (elementsRef.current[j] && elementsRef.current[j + 1]) {
        gsap.to([elementsRef.current[j], elementsRef.current[j + 1]], {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }

    // Clear highlighting
    const clearedArray = resultArray.map((item) => ({
      ...item,
      isComparing: false,
      isSwapping: false,
    }));

    let newI = i;
    let newJ = j + 1;
    const newSorted = new Set(sorted);

    // Check if we've completed this pass
    if (newJ >= currentArray.length - i - 1) {
      newSorted.add(currentArray.length - i - 1);
      newI = i + 1;
      newJ = 0;
    }

    // Check if sorting is complete
    const completed = newI >= currentArray.length - 1;

    if (completed) {
      // Mark all elements as sorted
      for (let idx = 0; idx < currentArray.length; idx++) {
        newSorted.add(idx);
      }

      // Celebration animation for completed sort
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
    }

    return {
      newArray: clearedArray,
      newI,
      newJ,
      newSorted,
      completed,
    };
  };

  // Main sorting loop
  useEffect(() => {
    isRunningRef.current = isRunning && !isPaused;

    if (!isRunning || isPaused) {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      return;
    }

    const runSortingLoop = async () => {
      let currentArray = [...array];
      let i = currentI;
      let j = currentJ;
      let sorted = new Set(sortedIndices);

      while (isRunningRef.current && i < currentArray.length - 1) {
        try {
          const result = await performSortStep(currentArray, i, j, sorted);

          if (!isRunningRef.current) break;

          currentArray = result.newArray;
          i = result.newI;
          j = result.newJ;
          sorted = result.newSorted;

          setArray([...result.newArray]);
          setCurrentI(result.newI);
          setCurrentJ(result.newJ);
          setSortedIndices(new Set(result.newSorted));

          if (result.completed) {
            setIsRunning(false);
            break;
          }

          // Small delay between steps
          await new Promise((resolve) => {
            animationRef.current = setTimeout(resolve, 50) as unknown as number;
          });
        } catch (error) {
          console.error("Sorting error:", error);
          setIsRunning(false);
          break;
        }
      }

      if (i >= currentArray.length - 1) {
        setIsRunning(false);
      }
    };

    runSortingLoop();

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Bubble Sort
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center mb-12 px-4">
          <Button
            onClick={startSort}
            disabled={isRunning}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
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

          <div className="flex items-center gap-2 w-full justify-center">
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

        <div className="flex gap-4 justify-center items-end min-h-[300px]">
          {array.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (elementsRef.current[index] = el)}
              className={`
                  relative
                  ${item.isComparing ? "z-10" : ""}
                  ${item.isSwapping ? "z-20" : ""}
                `}
            >
              {/* Bubble */}
              <div
                className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    text-white font-bold text-lg shadow-lg
                    transition-all duration-300 ease-in-out
                    ${
                      sortedIndices.has(index)
                        ? "bg-green-600 animate-pulse"
                        : item.isComparing
                        ? "bg-orange-500"
                        : item.isSwapping
                        ? "bg-red-500"
                        : "bg-blue-500"
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
                        : item.isSwapping
                        ? "bg-red-500"
                        : "bg-blue-500"
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

        <div className="mt-8 text-center">
          {isRunning && (
            <p className="text-lg text-blue-600 font-medium animate-pulse">
              Comparing positions {currentJ} and {currentJ + 1}...
            </p>
          )}
          {sortedIndices.size === array.length && array.length > 0 && (
            <p className="text-lg text-green-600 font-bold animate-bounce">
              🎉 Sorting Complete! 🎉
            </p>
          )}
          {!isRunning && sortedIndices.size === 0 && (
            <p className="text-lg text-gray-600">
              Click "Start Sort" to begin the bubble sort animation
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
