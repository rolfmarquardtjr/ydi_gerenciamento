import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCandidateStore } from '../../store/candidateStore';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';
import { AssessmentType } from '../../store/assessmentTypes';
import KnowledgeTest from './KnowledgeTest';
import ReactionTest from './ReactionTest';
import RiskAnalysisTest from './RiskAnalysisTest';
import MaintenanceTest from './MaintenanceTest';

const AssessmentFlow: React.FC = () => {
  const { testType } = useParams<{ testType: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isTestCompleted = useCandidateStore(state => state.isTestCompleted);
  const getAssessmentProgress = useCandidateStore(state => state.getAssessmentProgress);
  const updateCandidateAssessment = useCandidateStore(state => state.updateCandidateAssessment);
  const configs = useAssessmentConfigStore(state => 
    user?.companyId ? state.getConfigsByCompany(user.companyId) : []
  );

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  // Get config for current test
  const config = configs.find(c => c.type === testType);

  // Verify test access and setup
  useEffect(() => {
    if (!user || !testType || !config) {
      navigate('/candidate/dashboard');
      return;
    }

    // Check if test is already completed
    if (isTestCompleted(user.id, testType as AssessmentType)) {
      navigate('/candidate/dashboard');
      return;
    }

    // Initialize timer
    setTimeRemaining(config.timeLimit);

    // Restore progress if exists
    const progress = getAssessmentProgress(user.id, testType as AssessmentType);
    if (progress) {
      setTimeRemaining(progress.timeSpent);
      setScores(prev => ({
        ...prev,
        [testType]: progress.score
      }));
    }

    // Timer cleanup
    return () => {
      const progress = getAssessmentProgress(user.id, testType as AssessmentType);
      if (progress && !progress.isCompleted) {
        updateCandidateAssessment(user.id, {
          type: testType as AssessmentType,
          score: progress.score,
          timeSpent: config.timeLimit - timeRemaining,
          isCompleted: false,
          completedAt: new Date().toISOString()
        });
      }
    };
  }, [user, testType, config, navigate, isTestCompleted, getAssessmentProgress]);

  const handleComplete = (score: number) => {
    if (!user || !testType || !config) return;

    // Save test result
    const timeSpent = config.timeLimit - timeRemaining;
    updateCandidateAssessment(user.id, {
      type: testType as AssessmentType,
      score,
      completedAt: new Date().toISOString(),
      timeSpent,
      isCompleted: true
    });

    // Update scores
    const newScores = { ...scores, [testType]: score };
    setScores(newScores);

    // Calculate final score if all tests are completed
    const completedTests = configs.filter(c => 
      isTestCompleted(user.id, c.type) || c.type === testType
    );

    if (completedTests.length === configs.length) {
      // Calculate weighted average
      const totalWeight = configs.reduce((sum, c) => sum + c.weight, 0);
      const finalScore = configs.reduce((sum, c) => {
        const testScore = newScores[c.type] || 0;
        return sum + (testScore * c.weight / totalWeight);
      }, 0);

      // Navigate to results with all scores
      navigate('/assessment-result', {
        state: {
          finalScore,
          scores: newScores,
          configs
        }
      });
    } else {
      // Navigate back to dashboard to continue with next test
      navigate('/candidate/dashboard');
    }
  };

  if (!config || !testType) return null;

  const renderTest = () => {
    const commonProps = {
      timeLimit: timeRemaining,
      onComplete: handleComplete,
      config
    };

    switch (testType) {
      case 'knowledge':
        return <KnowledgeTest {...commonProps} />;
      case 'reaction':
        return <ReactionTest {...commonProps} />;
      case 'risk':
        return <RiskAnalysisTest {...commonProps} />;
      case 'maintenance':
        return <MaintenanceTest {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {renderTest()}
    </div>
  );
};

export default AssessmentFlow;