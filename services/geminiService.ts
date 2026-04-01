import { GoogleGenAI, Modality } from "@google/genai";
import { Subject, TextLanguage, SourceUrl } from "../types";
import { SUBJECT_CONFIG } from "../constants";

const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

interface VerifiedGenerationResult {
  imageUrl: string;
  refinedPrompt: string;
  sourceUrls: SourceUrl[];
}

export const generateVerifiedEducationalImage = async (
  userPrompt: string, 
  subject: Subject,
  textLanguage: TextLanguage
): Promise<VerifiedGenerationResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // --- STEP 1: Fact Verification & Prompt Refinement ---
  // Use a text model with Google Search to ensure accuracy
  let refinedPrompt = userPrompt;
  let sourceUrls: SourceUrl[] = [];

  try {
    const searchPrompt = `
    You are an educational assistant ensuring visual accuracy for students.
    
    User Request: "${userPrompt}"
    Subject: ${subject}
    
    Task:
    1. Use Google Search to verify the visual details of this request (e.g., historical accuracy, scientific correctness, anatomical details).
    2. Write a highly detailed, fact-based description that can be used as a prompt for an image generator. 
    3. Explicitly describe physical attributes (colors, shapes, clothing, environment) based on your research.
    4. Keep the description safe and educational.
    
    Output ONLY the detailed visual description paragraph.
    `;

    const verificationResponse = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search for grounding
      },
    });

    // Extract refined prompt
    if (verificationResponse.text) {
      refinedPrompt = verificationResponse.text;
    }

    // Extract Grounding Metadata (Source URLs)
    const chunks = verificationResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sourceUrls.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

  } catch (error) {
    console.warn("Verification step failed, proceeding with original prompt:", error);
    // If verification fails, we just proceed with the original user prompt
    refinedPrompt = userPrompt;
  }

  // --- STEP 2: Image Generation ---
  
  // Safety and Context Engineering
  const safetyInstruction = "IMPORTANT: This is for an educational app for students. The image MUST be safe, family-friendly, and educational. DO NOT generate violent, sexual, hateful, or scary content. If the prompt asks for something inappropriate, generate a polite visual metaphor for 'safety' instead.";
  
  const subjectContext = SUBJECT_CONFIG[subject].promptSuffix;
  
  let languageInstruction = "";
  switch (textLanguage) {
    case TextLanguage.KOREAN:
      languageInstruction = "Any labels, diagrams, or text inside the generated image MUST be written in Korean (Hangul).";
      break;
    case TextLanguage.ENGLISH:
      languageInstruction = "Any labels, diagrams, or text inside the generated image MUST be written in English.";
      break;
    case TextLanguage.MIXED:
      languageInstruction = "Any labels, diagrams, or text inside the generated image MUST be written in BOTH English and Korean (Hangul) for bilingual learning.";
      break;
  }
  
  // We use the refined prompt from Step 1 here
  const finalPrompt = `${safetyInstruction}\n\nSubject: ${subject}\n\nVisual Description (Verified): ${refinedPrompt}\n\nStyle Guidance: ${subjectContext}\nText Language Requirement: ${languageInstruction}\nEnsure high resolution, clear details, and legible text suitable for a classroom presentation.`;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      
      return {
        imageUrl: `data:${mimeType};base64,${base64ImageBytes}`,
        refinedPrompt: refinedPrompt,
        sourceUrls: sourceUrls
      };
    } else {
      throw new Error("이미지 생성에 실패했습니다. 올바른 응답을 받지 못했습니다.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      throw new Error(`이미지 생성 중 오류가 발생했습니다: ${error.message}`);
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};