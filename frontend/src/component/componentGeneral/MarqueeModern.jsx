import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarqueeModern = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get(`${apiUrl}/marquee`);
        if (res.data.isActive && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to load marquee messages:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquee();
  }, []);

  if (loading) return null;
  if (messages.length === 0) return null;

  return (
    <div className="w-full my-4  px-0">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes led-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px 1px rgba(34,211,238,0.8); }
          50%      { opacity: 0.35; box-shadow: 0 0 2px 0 rgba(34,211,238,0.4); }
        }
        .em-track {
          animation: marquee-scroll 22s linear infinite;
        }
        .em-track:hover {
          animation-play-state: paused;
        }
        .em-led {
          animation: led-pulse 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .em-track { animation: none; }
          .em-led { animation: none; }
        }
      `}</style>

      <div className="relative overflow-hidden bg-gray-100 ">
        <div className="flex xl:container xl:mx-auto items-center gap-3 pl-4 pr-2 py-2.5">
          <div className="overflow-hidden flex-1">
            <div className="em-track flex gap-10 whitespace-nowrap w-max">
              {[...messages, ...messages].map((msg, index) => (
                <span
                  key={index}
                  className="flex items-center primaryTextColor gap-10 font-mono text-xs sm:text-sm tracking-wide "
                >
                  <span>{msg}</span>
                  <span className="text-amber-400/70 select-none">&#9670;</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeModern;
