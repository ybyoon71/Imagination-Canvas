import React from 'react';
import { Download, RefreshCcw, ExternalLink, Search, Link2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isLoading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading }) => {
  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `edumagin-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-square md:aspect-[16/9] bg-white rounded-3xl border-4 border-dashed border-sky-200 flex flex-col items-center justify-center p-8 animate-pulse">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-sky-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 w-6 h-6 animate-bounce" />
        </div>
        <p className="text-xl font-bold text-sky-600">AI가 열심히 작업 중이에요</p>
        <p className="text-slate-400 text-sm mt-2">1단계: 정보 확인 → 2단계: 그림 그리기</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-full aspect-square md:aspect-[16/9] bg-white rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 text-center shadow-sm">
        <div className="bg-sky-100 p-6 rounded-full mb-4">
          <ExternalLink className="w-12 h-12 text-sky-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">상상력을 펼쳐보세요!</h3>
        <p className="text-slate-500 max-w-md">
          위의 입력창에 궁금한 내용을 적고 "그림 생성하기" 버튼을 눌러보세요.
          <br />
          예: "우주복을 입은 고양이", "고대 로마의 콜로세움", "광합성을 하는 식물 세포"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 transition-all duration-500 animate-fade-in">
      <div className="relative group overflow-hidden rounded-2xl mb-4 bg-slate-100">
         {/* Background Pattern to show transparency/loading if needed */}
        <img 
          src={image.imageUrl} 
          alt={image.prompt} 
          className="w-full h-auto object-contain max-h-[600px] mx-auto shadow-inner"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 mb-6">
        <div>
          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full mb-1">
            {image.subject}
          </span>
          <h3 className="text-slate-800 font-medium line-clamp-1" title={image.prompt}>
            {image.prompt}
          </h3>
        </div>
        
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 w-full sm:w-auto justify-center"
        >
          <Download size={20} />
          저장하기
        </button>
      </div>

      {/* Source Citations */}
      {image.sourceUrls && image.sourceUrls.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Link2 className="w-4 h-4 text-emerald-500" />
            참고 자료 (References)
          </h4>
          <div className="flex flex-wrap gap-2">
            {image.sourceUrls.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:shadow-sm transition-all"
              >
                <span className="truncate max-w-[150px]">{source.title}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            * 위 자료는 이미지 생성을 위해 AI가 참조한 내용입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;