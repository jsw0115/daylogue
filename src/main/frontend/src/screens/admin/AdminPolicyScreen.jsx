import React, { useState } from "react";
import { Button, Card, Divider, InputNumber, Select, Space, Switch, Typography } from "antd";
import { Settings, Save } from "lucide-react";

const { Title, Text } = Typography;

export default function AdminPolicyScreen() {
  // PvA
  const [postponePolicy, setPostponePolicy] = useState("keep_denominator"); // keep_denominator | move_planDate | exclude
  const [cancelPolicy, setCancelPolicy] = useState("exclude"); // exclude | keep_denominator
  const [carryoverPolicy, setCarryoverPolicy] = useState("keep_planDate"); // keep_planDate | move_planDate | mark_postponed
  const [timeCapping, setTimeCapping] = useState("cap_100"); // cap_100 | allow_over
  const [actualSource, setActualSource] = useState("timebar"); // timebar | timer | manual
  const [actualMerge, setActualMerge] = useState("prefer_primary"); // prefer_primary | sum | max

  // Sync
  const [conflictPolicy, setConflictPolicy] = useState("manual"); // latest | manual | merge
  const [massDeleteGuard, setMassDeleteGuard] = useState(true);
  const [massDeleteThreshold, setMassDeleteThreshold] = useState(50);

  // Content/templates
  const [globalTemplatesEnabled, setGlobalTemplatesEnabled] = useState(true);

  const save = () => {
    alert("데모: 운영 정책 저장(추후 API)");
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>운영정책</Title>
          <Text type="secondary">PvA/루틴/동기화/콘텐츠 전역 기본값(데모)</Text>
        </div>

        <Button type="primary" icon={<Save size={16} />} onClick={save}>
          저장
        </Button>
      </div>

      <Card
        title={
          <Space size={8}>
            <Settings size={18} />
            <span>PvA/달성률 정책</span>
          </Space>
        }
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <div>
            <Text type="secondary">연기(Postpone) 처리</Text>
            <Select
              value={postponePolicy}
              onChange={setPostponePolicy}
              style={{ width: "100%" }}
              options={[
                { value: "keep_denominator", label: "분모 유지(기본)" },
                { value: "move_planDate", label: "planDate 이동(계획 조정)" },
                { value: "exclude", label: "분모에서 제외" },
              ]}
            />
          </div>

          <div>
            <Text type="secondary">취소(Cancel) 처리</Text>
            <Select
              value={cancelPolicy}
              onChange={setCancelPolicy}
              style={{ width: "100%" }}
              options={[
                { value: "exclude", label: "분모에서 제외(기본)" },
                { value: "keep_denominator", label: "분모 유지" },
              ]}
            />
          </div>

          <div>
            <Text type="secondary">자동 이월(Carryover) 처리</Text>
            <Select
              value={carryoverPolicy}
              onChange={setCarryoverPolicy}
              style={{ width: "100%" }}
              options={[
                { value: "keep_planDate", label: "표시만 이동(planDate 유지)" },
                { value: "move_planDate", label: "계획도 이동(planDate 이동)" },
                { value: "mark_postponed", label: "연기 상태로 변경 + planDate 유지" },
              ]}
            />
          </div>

          <Divider style={{ margin: "10px 0" }} />

          <div>
            <Text type="secondary">시간 PvA 캡핑 정책</Text>
            <Select
              value={timeCapping}
              onChange={setTimeCapping}
              style={{ width: "100%" }}
              options={[
                { value: "cap_100", label: "캡핑(최대 100%)" },
                { value: "allow_over", label: "초과 허용(120%, 180%...)" },
              ]}
            />
          </div>

          <div>
            <Text type="secondary">Actual 시간 소스(우선)</Text>
            <Select
              value={actualSource}
              onChange={setActualSource}
              style={{ width: "100%" }}
              options={[
                { value: "timebar", label: "타임바(블록)" },
                { value: "timer", label: "타이머(포커스)" },
                { value: "manual", label: "수기 입력" },
              ]}
            />
          </div>

          <div>
            <Text type="secondary">중복 발생 시 병합 규칙</Text>
            <Select
              value={actualMerge}
              onChange={setActualMerge}
              style={{ width: "100%" }}
              options={[
                { value: "prefer_primary", label: "우선 소스만 인정" },
                { value: "sum", label: "합산" },
                { value: "max", label: "최대값" },
              ]}
            />
          </div>

          <Text type="secondary">
            주의: 실제 Actual 수집 방식(타임바/타이머/수기)이 확정되지 않으면 여기 값은 운영 중 조정될 수 있음.
          </Text>
        </Space>
      </Card>

      <Card title="동기화(양방향 Sync) 운영 정책" style={{ marginTop: 12 }}>
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <div>
            <Text type="secondary">충돌 해결 기본 정책</Text>
            <Select
              value={conflictPolicy}
              onChange={setConflictPolicy}
              style={{ width: "100%" }}
              options={[
                { value: "latest", label: "최신 우선" },
                { value: "manual", label: "사용자 선택(권장)" },
                { value: "merge", label: "필드 병합" },
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <Text>대량 삭제/중복 폭증 안전장치</Text>
              <div><Text type="secondary">감지 시 동기화 일시정지/확인</Text></div>
            </div>
            <Switch checked={massDeleteGuard} onChange={setMassDeleteGuard} />
          </div>

          <div>
            <Text type="secondary">대량 삭제 임계값(건)</Text>
            <InputNumber
              min={1}
              value={massDeleteThreshold}
              onChange={(v) => setMassDeleteThreshold(Number(v || 0))}
              style={{ width: "100%" }}
              disabled={!massDeleteGuard}
            />
          </div>
        </Space>
      </Card>

      <Card title="공용 템플릿/기본 데이터" style={{ marginTop: 12 }}>
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <Text>공용 템플릿 기능 활성화</Text>
              <div><Text type="secondary">플래너/일정/업무보고 템플릿 전역 제공</Text></div>
            </div>
            <Switch checked={globalTemplatesEnabled} onChange={setGlobalTemplatesEnabled} />
          </div>
        </Space>
      </Card>
    </div>
  );
}
