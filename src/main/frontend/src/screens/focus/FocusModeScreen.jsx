import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Progress, Typography, Space, Tooltip, Badge, Modal, Input, Radio, Divider } from "antd";
import { Play, Pause, RotateCcw, Coffee, Zap, Maximize2, Volume2, ListTodo } from "lucide-react";
import "../../styles/screens/focus.css";

const { Title, Text } = Typography;

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FocusModeScreen() {
  const [mode, setMode] = useState("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [phase, setPhase] = useState("focus"); 

  const [sessionCount, setSessionCount] = useState(0);
  const [taskName, setTaskName] = useState("집중 업무");

  const timerRef = useRef(null);
  const totalTime = phase === "focus" ? workTime * 60 : breakTime * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  const formatTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${pad(m)}:${pad(s)}`;
  }, [timeLeft]);

  useEffect(() => {
    resetTimer();
  }, [workTime, breakTime, mode]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (phase === "focus") {
      setSessionCount(c => c + 1);
      Modal.confirm({
        title: "집중 시간 종료! 👏",
        content: "수고하셨습니다. 잠깐 휴식할까요?",
        okText: "휴식 시작",
        cancelText: "건너뛰기",
        onOk: () => {
          setPhase("break");
          setTimeLeft(breakTime * 60);
          setIsRunning(true);
        },
        onCancel: () => {
          setPhase("focus");
          setTimeLeft(workTime * 60);
        }
      });
    } else {
      Modal.info({
        title: "휴식 종료 ☕️",
        content: "다시 집중할 준비 되셨나요?",
        onOk: () => {
          setPhase("focus");
          setTimeLeft(workTime * 60);
        }
      });
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setPhase("focus");
    setTimeLeft(workTime * 60);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={`focus-screen-container ${phase === 'break' ? 'theme-break' : 'theme-focus'}`}>
      
      <div className="focus-header">
        <div className="focus-title-block">
          <Title level={3} style={{margin:0, color: 'inherit'}}>집중 모드</Title>
          <Text style={{color: 'inherit', opacity: 0.8}}>
            {phase === 'focus' ? '몰입의 시간입니다. 🔥' : '잠시 뇌를 식혀주세요. 🍃'}
          </Text>
        </div>
        <Space>
          <Button icon={<Maximize2 size={16}/>} onClick={toggleFullScreen} ghost>전체화면</Button>
        </Space>
      </div>

      <Card className="focus-timer-card" bordered={false}>
        <div className="timer-display-wrapper">
           <Progress 
             type="circle" 
             percent={progressPercent} 
             format={() => <div className="timer-text">{formatTime}</div>}
             width={280}
             strokeWidth={4}
             strokeColor={phase === 'focus' ? '#ef4444' : '#10b981'}
             trailColor="rgba(0,0,0,0.05)"
           />
           <div className="phase-badge">
             {phase === 'focus' ? <Badge status="processing" text="FOCUS" color="#ef4444"/> : <Badge status="success" text="BREAK" color="#10b981"/>}
           </div>
        </div>

        <div className="focus-task-input">
           <ListTodo size={16} style={{marginRight: 8, opacity: 0.5}}/>
           <Input 
             variant="borderless" 
             value={taskName} 
             onChange={(e) => setTaskName(e.target.value)}
             placeholder="지금 무슨 일을 하고 있나요?"
             style={{textAlign: 'center', fontSize: 16, fontWeight: 500}}
           />
        </div>

        <div className="timer-controls">
          <Button 
            type="primary" 
            shape="circle" 
            size="large" 
            icon={isRunning ? <Pause size={24} fill="white"/> : <Play size={24} fill="white" style={{marginLeft:2}}/>} 
            onClick={toggleTimer}
            className={`main-play-btn ${isRunning ? 'pulse' : ''}`}
            style={{backgroundColor: phase === 'focus' ? '#ef4444' : '#10b981'}}
          />
          <Tooltip title="리셋">
            <Button shape="circle" icon={<RotateCcw size={18}/>} onClick={resetTimer} />
          </Tooltip>
        </div>
      </Card>

      <div className="focus-bottom-panel">
        <Card size="small" className="focus-settings-card">
          <div className="setting-row">
            <Text strong><Zap size={14}/> 집중 시간</Text>
            <Radio.Group value={workTime} onChange={e => setWorkTime(e.target.value)} size="small" disabled={isRunning}>
              <Radio.Button value={25}>25분</Radio.Button>
              <Radio.Button value={50}>50분</Radio.Button>
            </Radio.Group>
          </div>
          <div className="setting-row">
            <Text strong><Coffee size={14}/> 휴식 시간</Text>
            <Radio.Group value={breakTime} onChange={e => setBreakTime(e.target.value)} size="small" disabled={isRunning}>
              <Radio.Button value={5}>5분</Radio.Button>
              <Radio.Button value={10}>10분</Radio.Button>
            </Radio.Group>
          </div>
        </Card>

        <Card size="small" className="focus-stat-card">
          <div className="stat-item">
            <div className="stat-label">완료한 세션</div>
            <div className="stat-value">{sessionCount}</div>
          </div>
          <Divider type="vertical" style={{height: '2em'}}/>
          <div className="stat-item">
            <div className="stat-label">백색 소음</div>
            <Button size="small" icon={<Volume2 size={14}/>}>켜기</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}