import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import TimebarMiniMap from "../../components/diary/TimebarMiniMap";
import "../../styles/screens/home.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

function HomeDashboardScreen() {
  const navigate = useNavigate();

  const handleGoToday = () => {
    // TODO: 나중에 선택된 날짜 context 있으면 거기로 이동
    navigate(ROUTES.DAILY);
  };

  const handleNewEntry = () => {
    // TODO: 모달이나 새 다이어리/타임바 작성 화면으로 이동
    navigate(ROUTES.DIARY);
  };

  return (
    <div className="screen home-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">오늘의 팔레트</h2>
          <p className="screen-header__subtitle">
            오늘 하루의 타임바, 일정, 할 일, 루틴을 한 번에 확인해요.
          </p>
        </div>

        {/* 🔹 우측 액션 버튼 영역 */}
        <div className="home-header-actions">
          <Button className="btn--ghost" onClick={handleGoToday}>
            오늘로 이동
          </Button>
          <Button className="btn--primary" onClick={handleNewEntry}>
            + 새 기록
          </Button>
        </div>
      </header>

      {/* 아래는 기존 카드 레이아웃 그대로 유지 */}
      <div className="home-grid">
        <DashboardCard
          title="타임바 한눈에 보기"
          subtitle="계획 vs 실제"
        >
          <TimebarMiniMap />
        </DashboardCard>

        <DashboardCard
          title="오늘의 포커스"
          subtitle="해야 할 중요한 일 세 가지"
        >
          <ul className="home-list">
            <li>📚 SQLD 2장 강의 완강</li>
            <li>🏃 30분 러닝 또는 홈트</li>
            <li>🧠 25분 깊은 집중 한 세트</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="진행 상황" subtitle="이번 주 기준">
          <ul className="home-list">
            <li>완료한 할 일 18 / 30</li>
            <li>루틴 달성률 72%</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="일기/회고" subtitle="오늘 한 줄 요약">
          <textarea
            className="home-oneline"
            placeholder="예) 오늘은 업무가 많았지만, 공부와 운동도 놓치지 않았다."
          />
        </DashboardCard>
      </div>
    </div>
  );
}

export default HomeDashboardScreen;
