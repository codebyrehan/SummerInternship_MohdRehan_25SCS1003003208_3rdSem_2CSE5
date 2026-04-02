import React from 'react';

const highlights = [
  "✦ ATS Optimized",
  "⚡ AI Powered",
  "🎨 Premium Templates",
  "📄 One-Click PDF Export",
  "🌐 Portfolio Ready",
  "🔗 Shareable Link",
  "🤖 Job Description Matcher",
  "📊 Resume Score"
];

export default function HighlightsStrip() {
  return (
    <div className="w-full overflow-hidden bg-background border-y border-white/5 py-6">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the array for seamless infinite scroll */}
        {[...highlights, ...highlights, ...highlights].map((text, idx) => (
          <div 
            key={idx} 
            className="glass-pill mx-4 text-text-muted border border-primary/20 bg-white/[0.02]"
          >
            {text}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: 300%;
        }
      `}} />
    </div>
  );
}
