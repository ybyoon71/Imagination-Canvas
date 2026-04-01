import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SubjectSelector from './components/SubjectSelector';
import ImageDisplay from './components/ImageDisplay';
import { Subject, GeneratedImage, TextLanguage } from './types';
import { generateVerifiedEducationalImage } from './services/geminiService';
import { Wand2, AlertCircle, Languages, SearchCheck } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState<Subject>(Subject.GENERAL);
  const [textLanguage, setTextLanguage] = useState<TextLanguage>(TextLanguage.KOREAN);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'idle' | 'verifying' | 'generating'>('idle');
  
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setLoadingStage('verifying');
    setError(null);

    try {
      // 1. Verify Facts & Create Prompt (Step 1 inside service)
      // 2. Generate Image (Step 2 inside service)
      
      // We can't easily detect the transition between step 1 and 2 purely from the await call 
      // without splitting the service, but for UX 'verifying' is the most important "new" wait time to communicate.
      // Let's set a timeout to switch the text to 'generating' after a few seconds to make it feel responsive,
      // or just use a generic "smart" message. 
      // Ideally, the service could take a callback, but keeping it simple:
      
      // Simulate stage switch for UI feedback (optional but nice)
      const stageTimer = setTimeout(() => setLoadingStage('generating'), 2500);

      const result = await generateVerifiedEducationalImage(prompt, subject, textLanguage);
      
      clearTimeout(stageTimer);

      setGeneratedImage({
        imageUrl: result.imageUrl,
        prompt: result.refinedPrompt, // Store the refined prompt as it's what was actually drawn
        subject,
        timestamp: Date.now(),
        sourceUrls: result.sourceUrls
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("이미지를 생성하는 도중 문제가 발생했어요.");
      }
    } finally {
      setIsLoading(false);
      setLoadingStage('idle');
    }
  }, [prompt, subject, textLanguage]);

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-sky-100 border border-white mb-8">
          <form onSubmit={handleGenerate}>
            <SubjectSelector 
              selectedSubject={subject} 
              onSelect={setSubject} 
            />

            <div className="space-y-6">
              {/* Language Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-3 text-lg flex items-center gap-2">
                  <Languages className="w-5 h-5 text-sky-500" />
                  이미지 속 글자 언어 선택
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(TextLanguage).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setTextLanguage(lang)}
                      className={`
                        px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 border-2
                        ${textLanguage === lang
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md transform scale-105'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                        }
                      `}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-3 text-lg">
                  무엇을 그려볼까요?
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 19세기 증기 기관차의 모습, 빗살무늬 토기, 태양계 행성들의 크기 비교..."
                    className="w-full p-4 md:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all outline-none text-slate-700 text-lg resize-none h-32 placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md pointer-events-none flex items-center gap-1">
                    <SearchCheck className="w-3 h-3" />
                    정보 검증 후 생성됩니다
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className={`
                  w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
                  ${isLoading || !prompt.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-sky-200 hover:scale-[1.01] active:scale-[0.99]'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center leading-tight">
                    <span>
                      {loadingStage === 'verifying' ? '사실 확인 중...' : '그림 그리는 중...'}
                    </span>
                    <span className="text-xs opacity-80 font-normal">
                      {loadingStage === 'verifying' ? '정확한 정보를 찾고 있어요' : 'AI가 이미지를 생성하고 있어요'}
                    </span>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    검증된 그림 생성하기
                  </>
                )}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Display Section */}
        <section>
          <ImageDisplay image={generatedImage} isLoading={isLoading} />
        </section>

        {/* Footer Tip */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
             Powered by Google Gemini Nano Banana (Flash Image) & Google Search <br/>
             학생들을 위해 부적절한 내용은 필터링되며, 정보 검증을 거칩니다.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;