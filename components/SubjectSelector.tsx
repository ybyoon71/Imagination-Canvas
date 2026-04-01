import React from 'react';
import { Subject } from '../types';
import { SUBJECT_CONFIG } from '../constants';

interface SubjectSelectorProps {
  selectedSubject: Subject;
  onSelect: (subject: Subject) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selectedSubject, onSelect }) => {
  return (
    <div className="mb-6">
      <label className="block text-slate-700 font-bold mb-3 text-lg">
        어떤 과목을 공부하고 있나요?
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.values(Subject) as Subject[]).map((subject) => (
          <button
            key={subject}
            onClick={() => onSelect(subject)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
              ${selectedSubject === subject 
                ? 'bg-sky-50 border-sky-500 shadow-md scale-105' 
                : 'bg-white border-slate-100 hover:border-sky-200 hover:bg-slate-50'
              }
            `}
          >
            <div className={`p-2 rounded-full mb-2 ${SUBJECT_CONFIG[subject].color.split(' ')[0]} ${SUBJECT_CONFIG[subject].color.split(' ')[1]}`}>
              {SUBJECT_CONFIG[subject].icon}
            </div>
            <span className={`text-sm font-bold ${selectedSubject === subject ? 'text-sky-700' : 'text-slate-600'}`}>
              {subject}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;