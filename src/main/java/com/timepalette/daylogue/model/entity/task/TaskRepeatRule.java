package com.timepalette.daylogue.model.entity.task;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "task_repeat_rule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRepeatRule {

    @Id
    @Column(name = "task_id", columnDefinition = "CHAR(26)")
    private String taskId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // 식별자(taskId)를 외래 키로 그대로 사용 (1:1 매핑)
    @JoinColumn(name = "task_id")
    private Task task;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RepeatFreq freq = RepeatFreq.DAILY;

    @Column(name = "interval_val", nullable = false)
    @Builder.Default
    private int intervalVal = 1;

    @Column(length = 30)
    private String weekdays; // 예: "mon,wed,fri"

    @Enumerated(EnumType.STRING)
    @Column(name = "end_type", nullable = false)
    @Builder.Default
    private RepeatEndType endType = RepeatEndType.NONE;

    @Column(name = "end_until")
    private LocalDate endUntil;

    public enum RepeatFreq { DAILY, WEEKLY, MONTHLY, YEARLY }
    public enum RepeatEndType { NONE, UNTIL }
}