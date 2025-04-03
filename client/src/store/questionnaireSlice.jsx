import { createSlice } from '@reduxjs/toolkit';

// Sample questionnaire data structure
const questionData = {
    q1: {
        id: "q1",
        text: "Do you currently have health insurance?",
        category: "coverage",
        importance: "high",
        answers: [
            { id: "a1", text: "Yes", nextQuestionId: "q2" },
            { id: "a2", text: "No", nextQuestionId: "q3" }
        ]
    },
    q2: {
        id: "q2",
        text: "Are you satisfied with your current coverage?",
        category: "satisfaction",
        importance: "medium",
        answers: [
            { id: "a3", text: "Yes", nextQuestionId: "q4" },
            { id: "a4", text: "No", nextQuestionId: "q5" }
        ]
    },
    q3: {
        id: "q3",
        text: "What's your primary reason for not having insurance?",
        category: "barriers",
        importance: "high",
        answers: [
            { id: "a5", text: "Cost", nextQuestionId: "q6" },
            { id: "a6", text: "Don't believe I need it", nextQuestionId: "q7" },
            { id: "a7", text: "Not sure how to get it", nextQuestionId: "q8" }
        ]
    },
    q4: {
        id: "q4",
        text: "Are there any specific aspects of healthcare you wish were better covered?",
        category: "improvement",
        importance: "medium",
        answers: [
            { id: "a8", text: "Prescription drugs", nextQuestionId: "q9" },
            { id: "a9", text: "Specialist visits", nextQuestionId: "q9" },
            { id: "a10", text: "Mental health services", nextQuestionId: "q9" },
            { id: "a11", text: "None, my coverage is good", nextQuestionId: "q10" }
        ]
    },
    q5: {
        id: "q5",
        text: "What aspects of your current insurance are you dissatisfied with?",
        category: "dissatisfaction",
        importance: "high",
        answers: [
            { id: "a12", text: "High premiums", nextQuestionId: "q11" },
            { id: "a13", text: "High deductibles", nextQuestionId: "q11" },
            { id: "a14", text: "Limited network", nextQuestionId: "q11" },
            { id: "a15", text: "Poor customer service", nextQuestionId: "q11" }
        ]
    },
    q6: {
        id: "q6",
        text: "What is your approximate annual household income?",
        category: "affordability",
        importance: "high",
        answers: [
            { id: "a16", text: "Less than $30,000", nextQuestionId: "q15" },
            { id: "a17", text: "Between $30,000 and $60,000", nextQuestionId: "q15" },
            { id: "a18", text: "Between $60,000 and $100,000", nextQuestionId: "q15" },
            { id: "a19", text: "More than $100,000", nextQuestionId: "q15" }
        ]
    },
    q7: {
        id: "q7",
        text: "Which of the following statements best describes your current health situation?",
        category: "health_status",
        importance: "high",
        answers: [
            { id: "a20", text: "I'm generally healthy and rarely need medical care", nextQuestionId: "q16" },
            { id: "a21", text: "I have minor health concerns but nothing serious", nextQuestionId: "q16" },
            { id: "a22", text: "I have one or more chronic conditions", nextQuestionId: "q16" },
            { id: "a23", text: "I prefer not to say", nextQuestionId: "q16" }
        ]
    },
    q8: {
        id: "q8",
        text: "Are you interested in learning about different health insurance options?",
        category: "education",
        importance: "high",
        answers: [
            { id: "a24", text: "Yes, please provide information about marketplace plans", nextQuestionId: "q17" },
            { id: "a25", text: "Yes, please provide information about employer plans", nextQuestionId: "q17" },
            { id: "a26", text: "Yes, please provide information about Medicaid/Medicare", nextQuestionId: "q17" },
            { id: "a27", text: "Not at this time", nextQuestionId: "q18" }
        ]
    },
    q9: {
        id: "q9",
        text: "Would you consider changing your insurance plan in the next enrollment period?",
        category: "intent",
        importance: "high",
        answers: [
            { id: "a28", text: "Yes", nextQuestionId: "q12" },
            { id: "a29", text: "No", nextQuestionId: "q13" },
            { id: "a30", text: "Not sure", nextQuestionId: "q13" }
        ]
    },
    q10: {
        id: "q10",
        text: "Thank you for your feedback! Would you like to receive information about wellness programs?",
        category: "conclusion",
        importance: "low",
        answers: [
            { id: "a31", text: "Yes", nextQuestionId: null },
            { id: "a32", text: "No", nextQuestionId: null }
        ]
    },
    q11: {
        id: "q11",
        text: "Are you interested in exploring alternative insurance options?",
        category: "solutions",
        importance: "high",
        answers: [
            { id: "a33", text: "Yes", nextQuestionId: "q14" },
            { id: "a34", text: "No", nextQuestionId: "q15" }
        ]
    },
    q12: {
        id: "q12",
        text: "Thank you for completing our assessment. We'll provide you with personalized insurance recommendations.",
        category: "conclusion",
        importance: "high",
        answers: [
            { id: "a35", text: "Finish", nextQuestionId: null }
        ]
    },
    q13: {
        id: "q13",
        text: "Would you like to receive information about improving your current coverage?",
        category: "improvement",
        importance: "medium",
        answers: [
            { id: "a62", text: "Yes, send me information", nextQuestionId: "q12" },
            { id: "a63", text: "No, thank you", nextQuestionId: "q12" }
        ]
    },
    q14: {
        id: "q14",
        text: "What type of alternative insurance options would you like to learn more about?",
        category: "alternatives",
        importance: "high",
        answers: [
            { id: "a64", text: "High-deductible health plans with HSA", nextQuestionId: "q15" },
            { id: "a65", text: "Catastrophic coverage plans", nextQuestionId: "q15" },
            { id: "a66", text: "Health sharing ministries", nextQuestionId: "q15" },
            { id: "a67", text: "Short-term health insurance", nextQuestionId: "q15" }
        ]
    },
    q15: {
        id: "q15",
        text: "Are you aware of potential subsidies or assistance programs for health insurance?",
        category: "assistance",
        importance: "high",
        answers: [
            { id: "a36", text: "Yes, and I believe I might qualify", nextQuestionId: "q19" },
            { id: "a37", text: "I've heard of them but don't know the details", nextQuestionId: "q19" },
            { id: "a38", text: "No, I wasn't aware of such programs", nextQuestionId: "q19" }
        ]
    },
    q16: {
        id: "q16",
        text: "Do you understand the potential financial risks of not having health insurance?",
        category: "risk_awareness",
        importance: "high",
        answers: [
            { id: "a39", text: "Yes, I understand but have made my decision", nextQuestionId: "q20" },
            { id: "a40", text: "Somewhat, but I'd like to learn more", nextQuestionId: "q20" },
            { id: "a41", text: "No, I'm not fully aware of the risks", nextQuestionId: "q20" }
        ]
    },
    q17: {
        id: "q17",
        text: "Which of these factors is most important to you when choosing health insurance?",
        category: "priorities",
        importance: "medium",
        answers: [
            { id: "a42", text: "Low monthly premiums", nextQuestionId: "q21" },
            { id: "a43", text: "Low out-of-pocket costs when using services", nextQuestionId: "q21" },
            { id: "a44", text: "Having specific doctors in network", nextQuestionId: "q21" },
            { id: "a45", text: "Comprehensive coverage for all services", nextQuestionId: "q21" }
        ]
    },
    q18: {
        id: "q18",
        text: "Is there a specific reason you're not interested in learning about health insurance options?",
        category: "barriers",
        importance: "medium",
        answers: [
            { id: "a46", text: "I don't think I can afford it", nextQuestionId: "q12" },
            { id: "a47", text: "I don't trust insurance companies", nextQuestionId: "q12" },
            { id: "a48", text: "I plan to get insurance through a different source", nextQuestionId: "q12" },
            { id: "a49", text: "Other/prefer not to say", nextQuestionId: "q12" }
        ]
    },
    q19: {
        id: "q19",
        text: "Would you like information about how to apply for health insurance subsidies?",
        category: "resources",
        importance: "high",
        answers: [
            { id: "a50", text: "Yes, please", nextQuestionId: "q12" },
            { id: "a51", text: "No, thank you", nextQuestionId: "q12" }
        ]
    },
    q20: {
        id: "q20",
        text: "Would you be interested in seeing cost comparisons between potential medical expenses and insurance premiums?",
        category: "education",
        importance: "medium",
        answers: [
            { id: "a52", text: "Yes, that would be helpful", nextQuestionId: "q12" },
            { id: "a53", text: "No, I'm not interested", nextQuestionId: "q12" }
        ]
    },
    q21: {
        id: "q21",
        text: "Thank you for your responses. When would be the best time to start exploring health insurance options?",
        category: "timing",
        importance: "medium",
        answers: [
            { id: "a54", text: "As soon as possible", nextQuestionId: "q12" },
            { id: "a55", text: "During the next open enrollment period", nextQuestionId: "q12" },
            { id: "a56", text: "In the next few months", nextQuestionId: "q12" },
            { id: "a57", text: "I'm not sure", nextQuestionId: "q12" }
        ]
    }
};

const initialState = {
    questions: questionData,
    currentQuestionId: 'q1',
    answers: {},
    questionPath: ['q1'],
    isComplete: false
};

// Load state from localStorage if available
const loadState = () => {
    try {
        // Get navigation type using the modern Performance API
        const navEntries = performance.getEntriesByType('navigation');
        const navigationType = navEntries.length > 0 ? navEntries[0].type : null;

        // Clear state on reload or if navigation type can't be determined
        if (navigationType === 'reload' || !navigationType) {
            localStorage.removeItem('questionnaireState');
            return initialState;
        }

        const savedState = localStorage.getItem('questionnaireState');
        if (!savedState) {
            return initialState;
        }

        // Parse and validate saved state
        const parsedState = JSON.parse(savedState);

        // Validate essential properties
        if (!parsedState.questions || !parsedState.currentQuestionId || typeof parsedState.isComplete !== 'boolean') {
            localStorage.removeItem('questionnaireState');
            return initialState;
        }

        return parsedState;

    } catch (error) {
        console.error('Error loading questionnaire state:', error);
        localStorage.removeItem('questionnaireState');
        return initialState;
    }
};

const questionnaireSlice = createSlice({
    name: 'questionnaire',
    initialState: loadState(),
    reducers: {
        answerQuestion: (state, action) => {
            const { questionId, answerId, answerText } = action.payload;
            const question = state.questions[questionId];
            const selectedAnswer = question.answers.find(a => a.id === answerId);

            // Save the answer
            state.answers[questionId] = {
                answerId,
                answerText,
                questionText: question.text
            };

            // Determine the next question
            if (selectedAnswer.nextQuestionId) {
                state.currentQuestionId = selectedAnswer.nextQuestionId;
                state.questionPath.push(selectedAnswer.nextQuestionId);
            } else {
                state.isComplete = true;
            }

            // Save to localStorage
            localStorage.setItem('questionnaireState', JSON.stringify(state));
        },

        goToPreviousQuestion: (state) => {
            if (state.questionPath.length > 1) {
                // Remove the current question from the path
                state.questionPath.pop();
                // Set the current question to the last one in the path
                state.currentQuestionId = state.questionPath[state.questionPath.length - 1];
                // Save to localStorage
                localStorage.setItem('questionnaireState', JSON.stringify(state));
            }
        },

        resetQuestionnaire: (state) => {
            // Reset to initial state
            Object.assign(state, initialState);
            // Clear localStorage
            localStorage.removeItem('questionnaireState');
        }
    }
});

export const { answerQuestion, goToPreviousQuestion, resetQuestionnaire } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;