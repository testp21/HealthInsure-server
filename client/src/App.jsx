

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import QuestionnaireProgress from './components/QuestionnaireProgress';
import Question from './components/Question';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Health Insurance
            </h1>
            <p className="text-gray-600">
              Answer the following questions to help us determine the best insurance options for you.
            </p>
          </header>

          <QuestionnaireProgress />

          <Question />
        </div>
      </div>
    </Provider>
  );
}

export default App;
