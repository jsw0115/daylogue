// FILE: src/main/frontend/src/shared/constants/categoryIconOptions.js

/**
 * 아이콘 옵션은 "선택 UI"에만 쓰는 용도.
 * 실제 저장은 iconKey("lucide:Briefcase" 같은 문자열)로 통일.
 *
 * 주의(근거 부족): 아이콘 export 이름은 패키지 버전에 따라 달라질 수 있음.
 * 만약 import 에러가 나면 해당 아이콘만 제거/대체하면 됨.
 */

// lucide-react
import {
  Briefcase,
  BookOpen,
  Dumbbell,
  Coffee,
  Code,
  GraduationCap,
  Heart,
  Plane,
  ShoppingCart,
  PenLine,
  StickyNote,
  MessageSquare,
  CalendarDays,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  Zap,
  Flame,
  Leaf,
  Music,
  Camera,
  Palette,
  Users,
  Folder,
  Settings,
} from "lucide-react";

// @radix-ui/react-icons
import {
  HomeIcon,
  CalendarIcon,
  Pencil2Icon,
  RocketIcon,
  BarChartIcon,
  ChatBubbleIcon,
  TargetIcon,
  PersonIcon,
  GearIcon,
  LightningBoltIcon,
  BookmarkIcon,
  BellIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

/** 렌더용 MAP */
export const LUCIDE_ICON_MAP = {
  Briefcase,
  BookOpen,
  Dumbbell,
  Coffee,
  Code,
  GraduationCap,
  Heart,
  Plane,
  ShoppingCart,
  PenLine,
  StickyNote,
  MessageSquare,
  CalendarDays,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  Zap,
  Flame,
  Leaf,
  Music,
  Camera,
  Palette,
  Users,
  Folder,
  Settings,
};

export const RADIX_ICON_MAP = {
  HomeIcon,
  CalendarIcon,
  Pencil2Icon,
  RocketIcon,
  BarChartIcon,
  ChatBubbleIcon,
  TargetIcon,
  PersonIcon,
  GearIcon,
  LightningBoltIcon,
  BookmarkIcon,
  BellIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckIcon,
};

/** 선택 UI 옵션 목록 */
export const LUCIDE_ICON_OPTIONS = [
  { key: "lucide:Briefcase", label: "업무", name: "Briefcase" },
  { key: "lucide:BookOpen", label: "공부", name: "BookOpen" },
  { key: "lucide:Dumbbell", label: "운동", name: "Dumbbell" },
  { key: "lucide:Coffee", label: "휴식", name: "Coffee" },
  { key: "lucide:Code", label: "개발", name: "Code" },
  { key: "lucide:GraduationCap", label: "학습", name: "GraduationCap" },
  { key: "lucide:Heart", label: "건강", name: "Heart" },
  { key: "lucide:Plane", label: "여행", name: "Plane" },
  { key: "lucide:ShoppingCart", label: "쇼핑", name: "ShoppingCart" },
  { key: "lucide:PenLine", label: "기록", name: "PenLine" },
  { key: "lucide:StickyNote", label: "메모", name: "StickyNote" },
  { key: "lucide:MessageSquare", label: "대화", name: "MessageSquare" },
  { key: "lucide:CalendarDays", label: "일정", name: "CalendarDays" },
  { key: "lucide:Clock", label: "시간", name: "Clock" },
  { key: "lucide:Target", label: "목표", name: "Target" },
  { key: "lucide:BarChart3", label: "통계", name: "BarChart3" },
  { key: "lucide:Sparkles", label: "AI", name: "Sparkles" },
  { key: "lucide:Zap", label: "포커스", name: "Zap" },
  { key: "lucide:Flame", label: "스트릭", name: "Flame" },
  { key: "lucide:Leaf", label: "웰빙", name: "Leaf" },
  { key: "lucide:Music", label: "취미", name: "Music" },
  { key: "lucide:Camera", label: "사진", name: "Camera" },
  { key: "lucide:Palette", label: "디자인", name: "Palette" },
  { key: "lucide:Users", label: "커뮤니티", name: "Users" },
  { key: "lucide:Folder", label: "프로젝트", name: "Folder" },
  { key: "lucide:Settings", label: "설정", name: "Settings" },
];

export const RADIX_ICON_OPTIONS = [
  { key: "radix:HomeIcon", label: "홈", name: "HomeIcon" },
  { key: "radix:CalendarIcon", label: "캘린더", name: "CalendarIcon" },
  { key: "radix:Pencil2Icon", label: "작성", name: "Pencil2Icon" },
  { key: "radix:RocketIcon", label: "성장", name: "RocketIcon" },
  { key: "radix:BarChartIcon", label: "리포트", name: "BarChartIcon" },
  { key: "radix:ChatBubbleIcon", label: "채팅", name: "ChatBubbleIcon" },
  { key: "radix:TargetIcon", label: "목표", name: "TargetIcon" },
  { key: "radix:PersonIcon", label: "유저", name: "PersonIcon" },
  { key: "radix:GearIcon", label: "설정", name: "GearIcon" },
  { key: "radix:LightningBoltIcon", label: "집중", name: "LightningBoltIcon" },
  { key: "radix:BookmarkIcon", label: "북마크", name: "BookmarkIcon" },
  { key: "radix:BellIcon", label: "알림", name: "BellIcon" },
  { key: "radix:GlobeIcon", label: "공유", name: "GlobeIcon" },
  { key: "radix:MagnifyingGlassIcon", label: "검색", name: "MagnifyingGlassIcon" },
  { key: "radix:ClockIcon", label: "시간", name: "ClockIcon" },
  { key: "radix:CheckIcon", label: "완료", name: "CheckIcon" },
];
