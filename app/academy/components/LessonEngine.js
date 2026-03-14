'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// ANIMATED LESSON COMPONENT
// ============================================================================
const AnimatedLesson = ({ lesson, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [highlightedConcepts, setHighlightedConcepts] = useState([]);
  const textRef = useRef('');
  const timeoutRef = useRef(null);

  const narration = lesson.content.narration || '';
  const concepts = lesson.content.concepts || [];
  const steps = narration.split('|').filter(s => s.trim());
  const currentStepText = steps[currentStep]?.trim() || '';

  // Typewriter effect
  useEffect(() => {
    if (!isPlaying) return;

    if (displayedText === currentStepText) {
      return;
    }

    const timer = setTimeout(() => {
      if (displayedText.length < currentStepText.length) {
        const nextChar = currentStepText[displayedText.length];
        setDisplayedText(displayedText + nextChar);

        // Check for concept mentions
        const newText = displayedText + nextChar;
        const mentioned = concepts.filter(c =>
          newText.toLowerCase().includes(c.toLowerCase())
        );
        setHighlightedConcepts(mentioned);
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [isPlaying, displayedText, currentStepText, concepts]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setDisplayedText('');
      setHighlightedConcepts([]);
      setIsPlaying(true);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setDisplayedText('');
      setHighlightedConcepts([]);
      setIsPlaying(true);
    }
  };

  const getAnimationStyle = () => {
    const animType = lesson.content.animation_type || 'fade';
    const baseStyle = {
      width: '100%',
      height: '300px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(0, 206, 201, 0.1) 0%, rgba(232, 67, 147, 0.1) 100%)',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00cec9',
      fontSize: '14px',
      fontWeight: '500',
      overflow: 'hidden',
      position: 'relative',
    };

    if (animType === 'particles') {
      return {
        ...baseStyle,
        animation: 'floating-particles 4s ease-in-out infinite',
      };
    }
    if (animType === 'pulse') {
      return {
        ...baseStyle,
        animation: 'pulsing-glow 2s ease-in-out infinite',
      };
    }
    return {
      ...baseStyle,
      animation: 'fade-in-section 1s ease-out',
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        @keyframes fade-in-section {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floating-particles {
          0%, 100% { transform: translateY(0px); opacity: 0.5; }
          50% { transform: translateY(-20px); opacity: 1; }
        }
        @keyframes pulsing-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 206, 201, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 206, 201, 0.6); }
        }
      `}</style>

      <div style={getAnimationStyle()}>
        <span>{lesson.content.animation_type ? `${lesson.content.animation_type} animation` : 'Visual Area'}</span>
      </div>

      <div
        style={{
          background: 'rgba(0, 206, 201, 0.05)',
          border: '1px solid rgba(0, 206, 201, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          minHeight: '100px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#e0e0e0',
        }}
      >
        {displayedText}
      </div>

      {highlightedConcepts.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(232, 67, 147, 0.1)',
            border: '1px solid rgba(232, 67, 147, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#e84393',
          }}
        >
          Key concepts mentioned: {highlightedConcepts.join(', ')}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: isPlaying ? '#e84393' : '#00cec9',
            color: '#0a0a0f',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {currentStep > 0 && (
          <button
            onClick={handlePreviousStep}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 201, 0.3)',
              background: 'transparent',
              color: '#00cec9',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease',
            }}
          >
            ← Previous
          </button>
        )}

        <button
          onClick={handleNextStep}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 206, 201, 0.3)',
            background: 'transparent',
            color: '#00cec9',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
        >
          {currentStep < steps.length - 1 ? 'Next →' : 'Complete ✓'}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'rgba(224, 224, 224, 0.6)',
        }}
      >
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: idx === currentStep ? '#00cec9' : idx < currentStep ? '#e84393' : 'rgba(224, 224, 224, 0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CODE LAB LESSON COMPONENT
// ============================================================================
const CodeLabLesson = ({ lesson, onComplete }) => {
  const [code, setCode] = useState(lesson.content.starter_code || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);

    // Simulate code execution with a delay
    setTimeout(() => {
      try {
        // Check for expected patterns in the code
        const expectedPattern = lesson.content.expected_pattern || 'console.log';
        const success = code.includes(expectedPattern) || code.length > (lesson.content.starter_code?.length || 0);

        if (success) {
          setSuccess(true);
          setOutput(`✓ Code executed successfully!\n\nOutput:\n${code.substring(0, 100)}...`);
          setTimeout(() => onComplete(), 1500);
        } else {
          setOutput('Try adding more code or modifying the existing code.');
        }
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
      setIsRunning(false);
    }, 800);
  };

  const handleReset = () => {
    setCode(lesson.content.starter_code || '');
    setOutput('');
    setSuccess(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          background: 'rgba(232, 67, 147, 0.05)',
          border: '1px solid rgba(232, 67, 147, 0.2)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#e0e0e0',
          lineHeight: '1.6',
        }}
      >
        {lesson.content.instructions || 'Write and run your code below.'}
      </div>

      <div
        style={{
          background: '#0a0a0f',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '1px solid rgba(0, 206, 201, 0.2)',
        }}
      >
        {/* macOS-style toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            background: '#1a1a1f',
            borderBottom: '1px solid rgba(0, 206, 201, 0.1)',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#e84393',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#00cec9',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgba(224, 224, 224, 0.3)',
            }}
          />
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              color: 'rgba(224, 224, 224, 0.5)',
              fontWeight: '500',
            }}
          >
            Code Editor
          </div>
        </div>

        {/* Code editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '16px',
            background: '#0a0a0f',
            color: '#00cec9',
            border: 'none',
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="Write your code here..."
          spellCheck="false"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: success ? '#00cec9' : '#e84393',
            color: '#0a0a0f',
            fontWeight: '600',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: isRunning ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => !isRunning && (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {isRunning ? 'Running...' : success ? 'Success! ✓' : 'Run Code'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 206, 201, 0.3)',
            background: 'transparent',
            color: '#00cec9',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
        >
          Reset
        </button>
      </div>

      {output && (
        <div
          style={{
            padding: '16px',
            background: success ? 'rgba(0, 206, 201, 0.1)' : 'rgba(232, 67, 147, 0.1)',
            border: `1px solid ${success ? 'rgba(0, 206, 201, 0.3)' : 'rgba(232, 67, 147, 0.3)'}`,
            borderRadius: '8px',
            fontFamily: '"SF Mono", "Monaco", monospace',
            fontSize: '13px',
            color: success ? '#00cec9' : '#e84393',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {output}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QUIZ LESSON COMPONENT
// ============================================================================
const QuizLesson = ({ lesson, onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const questions = lesson.content.questions || [];
  const currentQuestion = questions[currentQuestionIdx];
  const totalQuestions = questions.length;
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer;

  const handleAnswerSelect = (optionIdx) => {
    if (answered) return;
    setSelectedAnswer(optionIdx);
    setAnswered(true);

    if (optionIdx === currentQuestion.correct_answer) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setIsComplete(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  if (isComplete) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = Math.round((percentage / 100) * 100);

    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <style>{`
          @keyframes float-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(-10px); }
          }
          .xp-badge {
            animation: float-up 0.6s ease-out;
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #00cec9, #e84393);
            borderRadius: 50px;
            color: white;
            fontSize: 24px;
            fontWeight: 700;
            marginTop: 20px;
          }
        `}        `}
        />

        <h2 style={{ fontSize: '32px', color: '#00cec9', margin: '0 0 10px 0' }}>
          Quiz Complete!
        </h2>

        <p style={{ fontSize: '18px', color: 'rgba(224, 224, 224, 0.8)', margin: '0 0 20px 0' }}>
          You got {correctCount} out of {totalQuestions} correct
        </p>

        <div
          style={{
            fontSize: '16px',
            color: '#e0e0e0',
            marginBottom: '20px',
          }}
        >
          Score: {percentage}%
        </div>

        <div className="xp-badge">
          +{xpEarned} XP
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Progress dots */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '30px',
        }}
      >
        {questions.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === currentQuestionIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background:
                idx < currentQuestionIdx
                  ? '#00cec9'
                  : idx === currentQuestionIdx
                    ? '#e84393'
                    : 'rgba(224, 224, 224, 0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Question */}
      <h3
        style={{
          fontSize: '20px',
          color: '#e0e0e0',
          marginBottom: '20px',
          fontWeight: '600',
        }}
      >
        {currentQuestion?.question}
      </h3>

      {/* Options */}
      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentQuestion?.options?.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectAnswer = idx === currentQuestion.correct_answer;
          const showCorrect = answered && isCorrectAnswer;
          const showWrong = answered && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              disabled={answered}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: showCorrect
                  ? 'rgba(0, 206, 201, 0.5)'
                  : showWrong
                    ? 'rgba(232, 67, 147, 0.5)'
                    : 'rgba(0, 206, 201, 0.2)',
                background: showCorrect
                  ? 'rgba(0, 206, 201, 0.1)'
                  : showWrong
                    ? 'rgba(232, 67, 147, 0.1)'
                    : 'rgba(0, 206, 201, 0.03)',
                color: showCorrect ? '#00cec9' : showWrong ? '#e84393' : '#e0e0e0',
                cursor: answered ? 'default' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                opacity: answered && !isSelected && !isCorrectAnswer ? 0.5 : 1,
              }}
              onMouseOver={(e) =>
                !answered && (e.target.style.borderColor = 'rgba(0, 206, 201, 0.5)')
              }
              onMouseOut={(e) =>
                !answered && (e.target.style.borderColor = 'rgba(0, 206, 201, 0.2)')
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: showCorrect
                      ? '#00cec9'
                      : showWrong
                        ? '#e84393'
                        : 'rgba(224, 224, 224, 0.3)',
                    background: isSelected && answered ? (isCorrect ? '#00cec9' : '#e84393') : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a0a0f',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {isSelected && answered && (isCorrect ? '✓' : '✗')}
                </div>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && currentQuestion?.explanation && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(0, 206, 201, 0.05)',
            border: '1px solid rgba(0, 206, 201, 0.2)',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#e0e0e0',
            lineHeight: '1.6',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <strong style={{ color: '#00cec9' }}>Explanation:</strong> {currentQuestion.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: '#00cec9',
            color: '#0a0a0f',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {currentQuestionIdx < totalQuestions - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// DRAG AND DROP LESSON COMPONENT
// ============================================================================
const DragDropLesson = ({ lesson, onComplete }) => {
  const [items, setItems] = useState(
    (lesson.content.items || []).map((item, idx) => ({
      ...item,
      id: item.id || idx,
      matched: false,
    }))
  );
  const [draggedItem, setDraggedItem] = useState(null);
  const [connections, setConnections] = useState([]);

  const targets = lesson.content.targets || [];
  const allMatched = items.every((item) => item.matched);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    if (!draggedItem) return;

    const isCorrectMatch = draggedItem.target_id === target.id;

    if (isCorrectMatch) {
      setItems(
        items.map((item) =>
          item.id === draggedItem.id ? { ...item, matched: true } : item
        )
      );

      const newConnection = {
        itemId: draggedItem.id,
        targetId: target.id,
      };
      setConnections([...connections, newConnection]);

      // Check completion
      const remainingUnmatched = items.filter(
        (item) => item.id !== draggedItem.id && !item.matched
      );
      if (remainingUnmatched.length === 0) {
        setTimeout(() => onComplete(), 1000);
      }
    }

    setDraggedItem(null);
  };

  const handleReset = () => {
    setItems(items.map((item) => ({ ...item, matched: false })));
    setConnections([]);
    setDraggedItem(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        @keyframes snap {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .snap-animation {
          animation: snap 0.4s ease-out;
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px',
        }}
      >
        {/* Items to drag */}
        <div>
          <h3
            style={{
              fontSize: '16px',
              color: '#00cec9',
              marginBottom: '16px',
              fontWeight: '600',
            }}
          >
            Items
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                draggable={!item.matched}
                onDragStart={(e) => handleDragStart(e, item)}
                style={{
                  padding: '16px',
                  background: item.matched
                    ? 'rgba(0, 206, 201, 0.15)'
                    : 'rgba(232, 67, 147, 0.1)',
                  border: `2px dashed ${
                    item.matched ? 'rgba(0, 206, 201, 0.4)' : 'rgba(232, 67, 147, 0.3)'
                  }`,
                  borderRadius: '8px',
                  cursor: item.matched ? 'default' : 'grab',
                  fontSize: '14px',
                  color: item.matched ? '#00cec9' : '#e84393',
                  fontWeight: '500',
                  opacity: item.matched ? 0.6 : 1,
                  userSelect: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label || item.text} {item.matched && '✓'}
              </div>
            ))}
          </div>
        </div>

        {/* Drop targets */}
        <div>
          <h3
            style={{
              fontSize: '16px',
              color: '#e84393',
              marginBottom: '16px',
              fontWeight: '600',
            }}
          >
            Targets
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {targets.map((target) => {
              const hasItem = connections.some((c) => c.targetId === target.id);
              return (
                <div
                  key={target.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, target)}
                  style={{
                    padding: '16px',
                    background: hasItem
                      ? 'rgba(0, 206, 201, 0.15)'
                      : 'rgba(0, 206, 201, 0.05)',
                    border: `2px dashed ${
                      hasItem ? 'rgba(0, 206, 201, 0.5)' : 'rgba(0, 206, 201, 0.2)'
                    }`,
                    borderRadius: '8px',
                    cursor: 'drop',
                    fontSize: '14px',
                    color: hasItem ? '#00cec9' : 'rgba(224, 224, 224, 0.6)',
                    fontWeight: '500',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: draggedItem && draggedItem.target_id === target.id
                      ? '0 0 12px rgba(0, 206, 201, 0.4)'
                      : 'none',
                  }}
                >
                  {hasItem ? '✓ Matched' : target.label || target.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {!allMatched && (
          <button
            onClick={handleReset}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 201, 0.3)',
              background: 'transparent',
              color: '#00cec9',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
          >
            Reset
          </button>
        )}

        {allMatched && (
          <div
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              background: '#00cec9',
              color: '#0a0a0f',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            ✓ All matched!
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SIMULATION LESSON COMPONENT
// ============================================================================
const SimulationLesson = ({ lesson, onComplete }) => {
  const parameters = lesson.content.parameters || [];
  const [values, setValues] = useState(
    parameters.reduce((acc, param) => ({
      ...acc,
      [param.id]: param.default || param.min,
    }), {})
  );
  const [insights, setInsights] = useState('');

  const presets = lesson.content.presets || [];

  const handleParameterChange = (parameterId, newValue) => {
    setValues({ ...values, [parameterId]: parseFloat(newValue) });
  };

  const handlePreset = (preset) => {
    const newValues = {};
    preset.values.forEach((value, idx) => {
      if (parameters[idx]) {
        newValues[parameters[idx].id] = value;
      }
    });
    setValues(newValues);
    updateInsights(newValues);
  };

  const updateInsights = (currentValues) => {
    // Generate insights based on parameter values
    const insights = Object.entries(currentValues)
      .map(([id, value]) => {
        const param = parameters.find((p) => p.id === id);
        if (param) {
          const percentage = ((value - param.min) / (param.max - param.min)) * 100;
          return `${param.label}: ${value} (${percentage.toFixed(0)}%)`;
        }
        return '';
      })
      .filter(Boolean);

    setInsights(insights.join('\n'));
  };

  const handleRunSimulation = () => {
    updateInsights(values);
  };

  // SVG visualization
  const getVisualization = () => {
    const avgValue =
      Object.values(values).reduce((a, b) => a + b, 0) / Object.values(values).length;
    const normalized = (avgValue - 0) / 100; // Assuming 0-100 range

    return (
      <svg
        width="100%"
        height="200"
        viewBox="0 0 300 200"
        style={{ marginBottom: '20px' }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00cec9', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e84393', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={50 * (i + 1)}
            x2="300"
            y2={50 * (i + 1)}
            stroke="rgba(224, 224, 224, 0.1)"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`v${i}`}
            x1={60 * (i + 1)}
            y1="0"
            x2={60 * (i + 1)}
            y2="200"
            stroke="rgba(224, 224, 224, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Main visualization */}
        <rect
          x="50"
          y={150 - normalized * 100}
          width="200"
          height={normalized * 100}
          fill="url(#grad)"
          opacity="0.8"
        />

        <circle
          cx={150}
          cy={150 - normalized * 100}
          r="6"
          fill="#00cec9"
          opacity="0.9"
        />

        {/* Labels */}
        <text x="10" y="20" fontSize="12" fill="rgba(224, 224, 224, 0.6)">
          Simulation
        </text>
        <text x="250" y="180" fontSize="12" fill="rgba(224, 224, 224, 0.6)">
          Time →
        </text>
      </svg>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Visualization */}
      {getVisualization()}

      {/* Parameters */}
      <div style={{ marginBottom: '30px' }}>
        <h3
          style={{
            fontSize: '16px',
            color: '#e84393',
            marginBottom: '16px',
            fontWeight: '600',
          }}
        >
          Parameters
        </h3>

        {parameters.map((param) => (
          <div key={param.id} style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              <label style={{ color: '#e0e0e0', fontWeight: '500' }}>
                {param.label}
              </label>
              <span style={{ color: '#00cec9', fontWeight: '600' }}>
                {values[param.id]}
              </span>
            </div>

            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step || 1}
              value={values[param.id]}
              onChange={(e) => handleParameterChange(param.id, e.target.value)}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(0, 206, 201, 0.2)',
                outline: 'none',
                cursor: 'pointer',
                accentColor: '#00cec9',
              }}
            />

            <div
              style={{
                fontSize: '12px',
                color: 'rgba(224, 224, 224, 0.5)',
                marginTop: '4px',
              }}
            >
              {param.min} - {param.max}
            </div>
          </div>
        ))}
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3
            style={{
              fontSize: '16px',
              color: '#00cec9',
              marginBottom: '12px',
              fontWeight: '600',
            }}
          >
            Presets
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePreset(preset)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 206, 201, 0.3)',
                  background: 'transparent',
                  color: '#00cec9',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.background = 'rgba(0, 206, 201, 0.1)')}
                onMouseOut={(e) => (e.target.style.background = 'transparent')}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={handleRunSimulation}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#e84393',
            color: '#0a0a0f',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Run Simulation
        </button>

        <button
          onClick={onComplete}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 206, 201, 0.3)',
            background: 'transparent',
            color: '#00cec9',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
        >
          Complete
        </button>
      </div>

      {/* Insights */}
      {insights && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(0, 206, 201, 0.05)',
            border: '1px solid rgba(0, 206, 201, 0.2)',
            borderRadius: '8px',
            fontFamily: '"SF Mono", "Monaco", monospace',
            fontSize: '13px',
            color: '#00cec9',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {insights}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN LESSON ENGINE WRAPPER
// ============================================================================
export default function LessonEngine({
  lesson,
  onComplete,
  onNextLesson,
  onPreviousLesson,
}) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);

    // Trigger XP reward animation
    setTimeout(() => {
      setIsCompleting(false);
      if (onComplete) onComplete(lesson);
    }, 500);
  };

  if (!lesson) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#e0e0e0' }}>
        No lesson data available
      </div>
    );
  }

  const lessonType = lesson.lesson_type || 'animated';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#e0e0e0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        body {
          margin: 0;
          padding: 0;
          background: #0a0a0f;
        }

        * {
          box-sizing: border-box;
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00cec9;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 206, 201, 0.4);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00cec9;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(0, 206, 201, 0.4);
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: '24px',
          background: 'rgba(0, 206, 201, 0.05)',
          borderBottom: '1px solid rgba(0, 206, 201, 0.1)',
          animation: 'fadeIn 0.5s ease',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '28px',
              margin: '0 0 8px 0',
              color: '#e0e0e0',
              fontWeight: '700',
            }}
          >
            {lesson.title || 'Lesson'}
          </h1>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              color: 'rgba(224, 224, 224, 0.7)',
            }}
          >
            {lessonType === 'animated' && 'Interactive Animation Lesson'}
            {lessonType === 'interactive_code' && 'Code Lab Challenge'}
            {lessonType === 'quiz' && 'Knowledge Quiz'}
            {lessonType === 'drag_drop' && 'Drag and Drop Exercise'}
            {lessonType === 'simulation' && 'Parameter Simulation'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '40px 24px',
          animation: 'fadeIn 0.6s ease',
        }}
      >
        {lessonType === 'animated' && (
          <AnimatedLesson lesson={lesson} onComplete={handleComplete} />
        )}
        {lessonType === 'interactive_code' && (
          <CodeLabLesson lesson={lesson} onComplete={handleComplete} />
        )}
        {lessonType === 'quiz' && (
          <QuizLesson lesson={lesson} onComplete={handleComplete} />
        )}
        {lessonType === 'drag_drop' && (
          <DragDropLesson lesson={lesson} onComplete={handleComplete} />
        )}
        {lessonType === 'simulation' && (
          <SimulationLesson lesson={lesson} onComplete={handleComplete} />
        )}
      </div>

      {/* Footer navigation */}
      <div
        style={{
          padding: '24px',
          background: 'rgba(0, 206, 201, 0.03)',
          borderTop: '1px solid rgba(0, 206, 201, 0.1)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {onPreviousLesson && (
          <button
            onClick={onPreviousLesson}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 201, 0.3)',
              background: 'transparent',
              color: '#00cec9',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.background = 'rgba(0, 206, 201, 0.1)')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            ← Previous Lesson
          </button>
        )}

        {onNextLesson && (
          <button
            onClick={onNextLesson}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 201, 0.3)',
              background: 'transparent',
              color: '#00cec9',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              marginLeft: 'auto',
            }}
            onMouseOver={(e) => (e.target.style.background = 'rgba(0, 206, 201, 0.1)')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            Next Lesson →
          </button>
        )}
      </div>

      {isCompleting && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(0, 206, 201, 0.1), rgba(232, 67, 147, 0.1))',
              border: '1px solid rgba(0, 206, 201, 0.3)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#00cec9',
                marginBottom: '12px',
              }}
            >
              ✓ Lesson Complete!
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(224, 224, 224, 0.8)' }}>
              Great work! You earned XP for this lesson.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
