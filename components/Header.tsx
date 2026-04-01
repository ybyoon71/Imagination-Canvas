import React from 'react';
import { Shapes } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-sky-100">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="bg-sky-500 p-2 rounded-xl text-white shadow-md rotate-3 hover:rotate-0 transition-transform duration-300">
          <Shapes size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            상상 캔버스
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            AI와 함께하는 즐거운 학습 이미지 만들기
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;