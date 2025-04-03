import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { answerQuestion, goToPreviousQuestion, resetQuestionnaire } from '../store/questionnaireSlice';

const Question = () => {
    const dispatch = useDispatch();
    const { currentQuestionId, questions, isComplete } = useSelector(state => state.questionnaire);
    const canGoBack = useSelector(state => state.questionnaire.questionPath.length > 1);
    const currentQuestion = questions[currentQuestionId];

    const handleAnswer = (answerId, answerText) => {
        dispatch(answerQuestion({
            questionId: currentQuestionId,
            answerId,
            answerText
        }));
    };

    if (isComplete) {
        return (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Assessment Complete</h2>
                <p className="text-green-600 mb-4">
                    Thank you for completing the health insurance assessment.
                </p>
                <button
                    onClick={() => dispatch(resetQuestionnaire())}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Start Over
                </button>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div>Loading questions...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                {currentQuestion.category && (
                    <span className="text-sm text-gray-500 uppercase">{currentQuestion.category}</span>
                )}
                {currentQuestion.importance === 'high' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Important</span>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

            <div className="space-y-3">
                {currentQuestion.answers.map(answer => (
                    <button
                        key={answer.id}
                        className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => handleAnswer(answer.id, answer.text)}
                    >
                        {answer.text}
                    </button>
                ))}
            </div>

            {canGoBack && (
                <button
                    onClick={() => dispatch(goToPreviousQuestion())}
                    className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Previous Question
                </button>
            )}
        </div>
    );
};

export default Question;