import React, { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import {
  Button, Card, Typography, Tag, Divider, Statistic, Row, Col, Empty, Tooltip, message
} from "antd";

import {
  ChevronLeft, ChevronRight, SmilePlus, Smile, Meh, Frown, Angry,
  Edit3, Hash, CalendarDays, Flame, BarChart3
} from "lucide-react";

import { safeStorage } from "../../shared/utils/safeStorage";
import "../../styles/screens/diary.css";

const { Title, Text } = Typography;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const MOODS = [
  { id: "great", label: "최고", Icon: SmilePlus, color: "#10b981", bg: "#d1fae5" },
  { id: "good", label: "좋음", Icon: Smile, color: "#3b82f6", bg: "#dbeafe" },
  { id: "soso", label: "보통", Icon: Meh, color: "#f59e0b", bg: "#fef3c7" },
  { id: "bad", label: "나쁨", Icon: Frown, color: "#f97316", bg: "#ffedd5" },
  { id: "terrible", label: "최악", Icon: Angry, color: "#ef4444", bg: "#fee2e2" },
];

function toDateKey(date) { return dayjs(date).format("YYYY-MM-DD"); }
function loadDiaryMap() { return safeStorage.getJSON("diary.entries", {}); }

export default function DiaryCalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
  const [diaryMap, setDiaryMap] = useState({});

  useEffect(() => { setDiaryMap(loadDiaryMap()); }, []);

  // --- Monthly Grid Data ---
  const monthCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - firstDay.getDay());
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = toDateKey(d);
      cells.push({
        dateKey: key,
        day: d.getDate(),
        isCurrentMonth: d.getMonth() === month,
        isToday: key === toDateKey(new Date()),
      });
    }
    return cells;
  }, [currentDate]);

  // --- Yearly Heatmap Data (Dummy Logic for Demo) ---
  const heatmapData = useMemo(() => {
    const months = [];
    for(let i=4; i>=0; i--) {
      const d = dayjs().subtract(i, 'month');
      months.push(d);
    }
    return months;
  }, []);

  const selectedEntry = diaryMap[selectedDateKey];
  const selectedMood = selectedEntry ? MOODS.find(m => m.id === selectedEntry.mood) : null;

  // Handlers
  const handlePrev = () => setCurrentDate(dayjs(currentDate).subtract(1, 'month').toDate());
  const handleNext = () => setCurrentDate(dayjs(currentDate).add(1, 'month').toDate());
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateKey(toDateKey(now));
  };
  
  const navigateToWrite = (key) => {
    console.log("Go to write:", key);
    message.info(`${key} 작성 화면으로 이동`);
  };

  return (
    <div className="screen diary-calendar-screen">
      <header className="diary-ui__header">
        <div className="diary-ui__titleBlock">
          <Title level={3} style={{ margin: 0 }}>다이어리 인사이트</Title>
          <Text type="secondary">나의 기록 패턴과 감정 흐름을 분석합니다.</Text>
        </div>
        <div className="diary-ui__actions">
           <div className="diary-cal-nav">
             <Button type="text" icon={<ChevronLeft size={16}/>} onClick={handlePrev} />
             <span className="diary-cal-title">{dayjs(currentDate).format("YYYY년 M월")}</span>
             <Button type="text" icon={<ChevronRight size={16}/>} onClick={handleNext} />
             <Button size="small" onClick={handleToday}>오늘</Button>
           </div>
        </div>
      </header>

      <div className="diary-ui__layout">
        {/* Main: Calendar & Heatmap */}
        <div className="diary-ui__mainPanel">
          
          {/* 1. Monthly Calendar */}
          <Card className="diary-ui__card diary-cal-card" bodyStyle={{padding:0}}>
            <div className="diary-cal-weekdays">
              {WEEKDAYS.map((w,i) => <div key={w} className={clsx("weekday", i===0&&"sun", i===6&&"sat")}>{w}</div>)}
            </div>
            <div className="diary-cal-grid">
              {monthCells.map(cell => {
                const entry = diaryMap[cell.dateKey];
                const moodItem = entry ? MOODS.find(m => m.id === entry.mood) : null;
                const MoodIcon = moodItem?.Icon;
                
                return (
                  <div 
                    key={cell.dateKey}
                    className={clsx("diary-cal-cell", !cell.isCurrentMonth && "outside", cell.dateKey === selectedDateKey && "selected", cell.isToday && "today")}
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    onDoubleClick={() => navigateToWrite(cell.dateKey)}
                  >
                    <div className="cell-header">
                      <span className="day-num">{cell.day}</span>
                      {cell.isToday && <span className="today-dot"/>}
                    </div>
                    <div className="cell-content">
                      {moodItem && (
                        <div className="mood-badge" style={{background: moodItem.bg, color: moodItem.color}}>
                          <MoodIcon size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 2. Yearly Heatmap (Simple Ver.) */}
          <Card size="small" title={<><Flame size={16} style={{marginRight:8, verticalAlign:'text-bottom', color:'#f59e0b'}}/>기록 잔디 (Heatmap)</>} className="diary-ui__card">
             <div className="diary-heatmap-container">
               {heatmapData.map(m => (
                 <div key={m.toString()} className="heatmap-month">
                   <div className="heatmap-title">{m.format("M월")}</div>
                   <div className="heatmap-grid">
                     {Array.from({length: m.daysInMonth()}).map((_, i) => {
                       const d = m.date(i+1);
                       const k = d.format("YYYY-MM-DD");
                       const hasEntry = !!diaryMap[k];
                       return (
                         <Tooltip key={k} title={`${k}: ${hasEntry ? '기록됨' : '없음'}`}>
                           <div className={clsx("heatmap-cell", hasEntry && "filled")} />
                         </Tooltip>
                       )
                     })}
                   </div>
                 </div>
               ))}
             </div>
          </Card>
        </div>

        {/* Side: Detail */}
        <div className="diary-ui__sidePanel">
          <Card className="diary-ui__card diary-detail-card" title={dayjs(selectedDateKey).format("M월 D일 (ddd)")}>
            {selectedEntry ? (
              <div className="diary-detail-content">
                <div className="detail-mood-header" style={{background: selectedMood?.bg}}>
                   {selectedMood && <selectedMood.Icon size={40} color={selectedMood.color}/>}
                   <div className="mood-text">
                     <span className="label">Mood</span>
                     <span className="value" style={{color: selectedMood?.color}}>{selectedMood?.label}</span>
                   </div>
                </div>
                <Divider style={{margin:'12px 0'}}/>
                <div className="detail-section">
                  <Text type="secondary" className="section-label"><Edit3 size={12}/> 한 줄 요약</Text>
                  <div className="summary-box">{selectedEntry.summary || "-"}</div>
                </div>
                {selectedEntry.tags?.length > 0 && (
                  <div className="detail-section">
                    <div className="tags-wrap">
                      {selectedEntry.tags.map(t => <Tag key={t}>#{t}</Tag>)}
                    </div>
                  </div>
                )}
                <Button block type="primary" icon={<Edit3 size={14}/>} onClick={() => navigateToWrite(selectedDateKey)}>
                  수정하기
                </Button>
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="기록이 없습니다.">
                 <Button type="primary" ghost onClick={() => navigateToWrite(selectedDateKey)}>새 일기 쓰기</Button>
              </Empty>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}