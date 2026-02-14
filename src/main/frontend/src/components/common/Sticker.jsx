import React from "react";
import { Smile, Flame, Coffee, Star, BookOpen, Activity, Zap, Leaf } from "lucide-react";
import { useTheme } from "../../shared/context/ThemeContext";

// 매핑 테이블
const MAP = {
  basic: {
    happy: <Smile size={20} />,
    fire: <Flame size={20} />,
    rest: <Coffee size={20} />,
    star: <Star size={20} />,
    study: <BookOpen size={20} />,
    exercise: <Activity size={20} />,
  },
  emoji: {
    happy: "🥰",
    fire: "🔥",
    rest: "☕",
    star: "⭐",
    study: "📚",
    exercise: "💪",
  },
  pixel: {
    // 실제로는 이미지나 픽셀 폰트를 써야 하지만 여기선 텍스트로 대체
    happy: "[^‿^]",
    fire: "[Fire]",
    rest: "[Coffee]",
    star: "[*]",
    study: "[Book]",
    exercise: "[Run]",
  }
};

/**
 * name: happy | fire | rest | star | study | exercise
 */
export default function Sticker({ name, className = "" }) {
  const { stickerPack } = useTheme(); // 현재 설정된 팩 가져오기 (basic/emoji/pixel)
  
  const pack = MAP[stickerPack] || MAP.basic;
  const icon = pack[name] || pack.happy; // fallback

  return (
    <span className={`tf-sticker ${stickerPack} ${className}`} style={{ fontSize: stickerPack !== 'basic' ? '20px' : 'inherit' }}>
      {icon}
    </span>
  );
}