import { todayStr } from "../utils/dateUtils";

// 실제 API 붙이기 전까지는 mock 데이터 리턴
export async function fetchDailyPlanner(date = todayStr()) {
  // 네트워크 지연 흉내
  await new Promise((res) => setTimeout(res, 200));

  const baseDate = date;

  return {
    day: {
      date: baseDate,
      mode: "BALANCE",
      oneLine: "오늘은 SQLD 2장을 완강하기 📝",
      mood: "😊",
    },
    timeBlocksPlan: [
      {
        id: 1,
        date: baseDate,
        type: "PLAN",
        startMinute: 7 * 60,
        endMinute: 8 * 60,
        categoryId: 3,
        title: "아침 스트레칭",
      },
      {
        id: 2,
        date: baseDate,
        type: "PLAN",
        startMinute: 9 * 60,
        endMinute: 11 * 60,
        categoryId: 1,
        title: "SQLD 공부",
      },
    ],
    timeBlocksActual: [
      {
        id: 101,
        date: baseDate,
        type: "ACTUAL",
        startMinute: 7 * 60 + 30,
        endMinute: 8 * 60 + 10,
        categoryId: 3,
        title: "산책",
      },
      {
        id: 102,
        date: baseDate,
        type: "ACTUAL",
        startMinute: 9 * 60 + 10,
        endMinute: 10 * 60 + 40,
        categoryId: 1,
        title: "SQLD 2장",
      },
    ],
    tasks: [
      {
        id: 1,
        title: "SQLD 2장 강의 완강",
        status: "TODO",
        categoryId: 1,
        expectedMinutes: 90,
      },
      {
        id: 2,
        title: "30분 러닝",
        status: "TODO",
        categoryId: 3,
        expectedMinutes: 30,
      },
      {
        id: 3,
        title: "루틴 플로우 정리",
        status: "IN_PROGRESS",
        categoryId: 2,
        expectedMinutes: 60,
      },
    ],
    routines: [
      { id: 1, name: "아침 물 1잔", categoryId: 3, checked: true },
      { id: 2, name: "일기 쓰기", categoryId: 1, checked: false },
      { id: 3, name: "간단 스트레칭", categoryId: 3, checked: false },
    ],
    events: [
      {
        id: 1,
        title: "회의: 프로젝트 일정 정리",
        startTime: "14:00",
        endTime: "15:00",
      },
    ],
    diary: {
      good: "계획한 공부를 거의 다 했다.",
      bad: "운동을 빼먹었다.",
      tomorrow: "아침에 바로 러닝부터!",
      free: "요즘 타임바 다이어리가 점점 내 루틴이 되는 느낌.",
    },
  };
}
