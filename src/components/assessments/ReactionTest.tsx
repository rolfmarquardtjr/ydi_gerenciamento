import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface ReactionTestProps {
  config: any;
  timeLimit: number;
  onComplete: (score: number) => void;
}

const ReactionTest: React.FC<ReactionTestProps> = ({ config, timeLimit, onComplete }) => {
  const [status, setStatus] = useState<'ready' | 'waiting' | 'stimulus' | 'complete'>('ready');
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [missedSignals, setMissedSignals] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  const showStimulus = useCallback(() => {
    const delay = Math.random() * 3000 + 1000; // Random delay between 1-4 seconds
    setTimeout(() => {
      if (status === 'waiting') {
        setStatus('stimulus');
        setStartTime(Date.now());
      }
    }, delay);
  }, [status]);

  const handleClick = () => {
    if (status === 'ready') {
      setStatus('waiting');
      showStimulus();
    } else if (status === 'stimulus') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes(prev => [...prev, reactionTime]);
      
      if (currentAttempt + 1 >= config.attempts) {
        calculateScore();
      } else {
        setCurrentAttempt(prev => prev + 1);
        setStatus('waiting');
        showStimulus();
      }
    } else if (status === 'waiting') {
      setMissedSignals(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    const validTimes = reactionTimes.filter(time => time <= config.maxReactionTime);
    const averageTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
    
    // Calculate score based on average reaction time
    // maxReactionTime = 0% score, 150ms = 100% score
    const score = Math.max(0, Math.min(100, (
      (config.maxReactionTime - averageTime) / 
      (config.maxReactionTime - 150)
    ) * 100));

    setStatus('complete');
    onComplete(score);
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      calculateScore();
    }

    const timer = setInterval(() => {
      if (status !== 'complete') {
        setTimeRemaining(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, status]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      {status === 'complete' ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Teste Concluído!</h3>
          <p className="text-gray-600">
            Tempo médio de reação: {(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2)}ms
          </p>
          <p className="text-gray-600">
            Sinais perdidos: {missedSignals}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold mb-2">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-gray-600">
              Tentativa {currentAttempt + 1} de {config.attempts}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {status === 'ready' ? 'Clique para começar' :
               status === 'waiting' ? 'Aguarde o sinal...' :
               'CLIQUE AGORA!'}
            </p>
          </div>

          <button
            onClick={handleClick}
            className={`w-48 h-48 rounded-full transition-colors ${
              status === 'stimulus' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          />

          <div className="mt-6 flex items-center text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <p>
              {status === 'ready' 
                ? 'Clique no círculo para iniciar o teste' 
                : 'Clique APENAS quando o círculo ficar verde'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ReactionTest;