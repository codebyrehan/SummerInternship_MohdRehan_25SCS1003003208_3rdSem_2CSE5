export const improveTextWithAI = async (text, section) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  const prompt = `You are a professional resume writer. Rewrite the following to be impactful, concise, and ATS-friendly for a ${section} section:\n\n${text}`;

  // If no API key is provided, return a mock response after a short delay
  if (!apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[Mock Improved] ${text}\n\n(Note: Set VITE_AI_API_KEY in .env to use real AI)`);
      }, 1500);
    });
  }

  try {
    // Assuming OpenAI API format for simplicity
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch from AI API");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Service Error:', error);
    return `[Error] Failed to connect to AI Service. Original: ${text}`;
  }
};
