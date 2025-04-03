
import React from 'react';
import { useSelector } from 'react-redux';

const QuestionnaireProgress = () => {
    const { questionPath, questions } = useSelector(state => state.questionnaire);
    const totalQuestions = Object.keys(questions).length;
    const progress = (questionPath.length / totalQuestions) * 100;

    return (
        <div className="mb-6">
            <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="text-sm text-gray-600 mt-2">
                Question {questionPath.length} of  {totalQuestions}
            </div>
        </div>
    );
};

export default QuestionnaireProgress;