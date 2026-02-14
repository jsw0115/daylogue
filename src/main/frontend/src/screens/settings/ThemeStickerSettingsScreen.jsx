import React, { useState } from "react";
import { SettingsLayout } from "./SettingsLayout"; // Default import로 수정 (파일 구조에 맞게)
import { useTheme } from "../../shared/context/ThemeContext";
import Sticker from "../../components/common/Sticker"; 
import Button from "../../components/common/Button"; // 버튼 컴포넌트 경로 확인 필요
import "../../styles/timeflow-ui.css";

// 아이콘들
import { Sun, Moon, Palette, Briefcase, Check } from "lucide-react";

// 테마 프리셋 정의
const THEME_PRESETS = [
  {
    id: "light",
    name: "라이트 (기본)",
    desc: "밝고 깨끗한 기본 테마",
    icon: <Sun size={20} />,
    color: "#ffffff",
    textColor: "#0f172a"
  },
  {
    id: "dark",
    name: "다크 (집중)",
    desc: "눈이 편안한 어두운 테마",
    icon: <Moon size={20} />,
    color: "#1e293b",
    textColor: "#f1f5f9"
  },
  {
    id: "pastel",
    name: "파스텔 (감성)",
    desc: "따뜻하고 부드러운 색감",
    icon: <Palette size={20} />,
    color: "#fffbf0",
    textColor: "#5d5d5a"
  },
  {
    id: "chic",
    name: "시크 (모던)",
    desc: "세련된 고대비 흑백 테마",
    icon: <Briefcase size={20} />,
    color: "#f4f4f5",
    textColor: "#000000"
  },
];

const STICKER_PACKS = [
  { id: "basic", name: "심플 라인", desc: "깔끔한 선 아이콘 (기본)" },
  { id: "emoji", name: "컬러 이모지", desc: "친숙한 이모지 스타일 🍎" },
  { id: "pixel", name: "레트로 픽셀", desc: "8비트 게임 감성 👾" },
];

export default function ThemeStickerSettingsScreen() {
  const { theme, setTheme, stickerPack, setStickerPack } = useTheme();
  const [fontSize, setFontSize] = useState(16);

  return (
    <SettingsLayout
      title="테마 / 스타일 설정"
      description="앱의 분위기, 아이콘 스타일, 글자 크기를 변경합니다."
    >
      <div className="tf-animate-fadein">
        
        {/* 1. 테마 선택 */}
        <div className="tf-card">
          <div className="tf-item__title" style={{marginBottom: 16}}>🎨 컬러 테마</div>
          
          <div className="tf-grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {THEME_PRESETS.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="tf-btn"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    padding: 16, height: 'auto', textAlign: 'left',
                    border: isActive ? '2px solid var(--tf-primary)' : '1px solid var(--tf-border)',
                    background: 'var(--tf-surface)', position: 'relative'
                  }}
                >
                  {/* 미리보기 박스 */}
                  <div style={{
                    width: '100%', height: 80, borderRadius: 8, marginBottom: 12,
                    background: t.color, border: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.textColor
                  }}>
                    {t.icon}
                    <span style={{marginLeft: 8, fontWeight: 700}}>Aa</span>
                  </div>

                  <div style={{fontWeight: 700, fontSize: 15, color: 'var(--tf-text)'}}>{t.name}</div>
                  <div style={{fontSize: 12, color: 'var(--tf-text-muted)', marginTop: 4}}>{t.desc}</div>
                  
                  {isActive && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'var(--tf-primary)', color: 'white',
                      borderRadius: '50%', padding: 4, display:'flex'
                    }}>
                      <Check size={12} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 스티커 팩 선택 */}
        <div className="tf-card">
          <div className="tf-item__title" style={{marginBottom: 16}}>🧩 스티커 팩</div>
          
          <div className="tf-list">
            {STICKER_PACKS.map((pack) => (
              <div 
                key={pack.id} 
                className="tf-item" 
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  border: stickerPack === pack.id ? '2px solid var(--tf-primary)' : '1px solid var(--tf-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setStickerPack(pack.id)}
              >
                <div>
                  <div style={{fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8}}>
                    {pack.name}
                    {stickerPack === pack.id && <Check size={16} color="var(--tf-primary)" />}
                  </div>
                  <div className="tf-small tf-muted">{pack.desc}</div>
                </div>
                
                {/* 미리보기 (팩 적용된 모습) */}
                <div style={{display:'flex', gap: 12, background: 'var(--tf-bg)', padding: '8px 12px', borderRadius: 8}}>
                  {stickerPack === pack.id ? (
                    <>
                      <Sticker name="fire" />
                      <Sticker name="study" />
                      <Sticker name="rest" />
                    </>
                  ) : (
                    <span className="tf-small tf-muted">선택하여 미리보기</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 글자 크기 */}
        <div className="tf-card">
          <div className="tf-item__title" style={{marginBottom: 16}}>Aa 글자 크기</div>
          
          <div className="tf-row" style={{alignItems:'center', gap:16, padding: '0 8px'}}>
            <span style={{fontSize:12}}>가</span>
            <input 
              type="range" 
              min="14" max="20" step="1" 
              value={fontSize} 
              onChange={e => setFontSize(e.target.value)}
              style={{flex:1, accentColor: 'var(--tf-primary)', height: 6}}
            />
            <span style={{fontSize:20}}>가</span>
          </div>
          
          <div className="tf-divider" />
          
          <div style={{
            fontSize: `${fontSize}px`, 
            lineHeight: 1.6, 
            padding: 12, 
            background: 'var(--tf-bg)', 
            borderRadius: 8,
            border: '1px dashed var(--tf-border)'
          }}>
            이 텍스트는 설정된 <strong>글자 크기({fontSize}px)</strong>로 표시됩니다.<br/>
            본문 가독성을 미리 확인해 보세요.
          </div>
        </div>

        {/* 하단 저장 버튼 (필요 시) */}
        <div className="tf-row" style={{justifyContent: 'flex-end', marginTop: 24}}>
           <Button variant="primary" onClick={() => alert("설정이 저장되었습니다.")}>
             설정 저장
           </Button>
        </div>

      </div>
    </SettingsLayout>
  );
}