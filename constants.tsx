import React from 'react';
import { Subject } from './types';
import { FlaskConical, BookOpen, Palette, Globe2, Feather, Sparkles } from 'lucide-react';

export const SUBJECT_CONFIG: Record<Subject, { icon: React.ReactNode, color: string, promptSuffix: string }> = {
  [Subject.SCIENCE]: {
    icon: <FlaskConical className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
    promptSuffix: "Show details clearly like a science textbook illustration. Label major parts if applicable. Accurate scientific representation."
  },
  [Subject.HISTORY]: {
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    promptSuffix: "Historical accuracy is important. Vintage or realistic painting style suitable for a history book."
  },
  [Subject.ART]: {
    icon: <Palette className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
    promptSuffix: "Artistic and creative style. Focus on composition, color theory, and visual beauty."
  },
  [Subject.GEOGRAPHY]: {
    icon: <Globe2 className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
    promptSuffix: "Map or landscape style. Clear geographical features. National Geographic style."
  },
  [Subject.LITERATURE]: {
    icon: <Feather className="w-5 h-5" />,
    color: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
    promptSuffix: "Storybook illustration style. Whimsical, engaging, and captures the mood of a story."
  },
  [Subject.GENERAL]: {
    icon: <Sparkles className="w-5 h-5" />,
    color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    promptSuffix: "Educational, clear, and easy to understand for students. Bright and friendly colors."
  }
};