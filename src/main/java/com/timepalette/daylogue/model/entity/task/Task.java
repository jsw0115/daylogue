package com.timepalette.daylogue.model.entity.task;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @Column(columnDefinition = "CHAR(26)")
    private String id;

    @Column(name = "user_id", nullable = false, columnDefinition = "CHAR(26)")
    private String userId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "st", nullable = false)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(name = "pri", nullable = false)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_lvl", nullable = false)
    @Builder.Default
    private EnergyLevel energyLevel = EnergyLevel.MEDIUM;

    @Column(name = "duration_min", nullable = false)
    @Builder.Default
    private int durationMin = 30;

    @Column(name = "due")
    private LocalDate due;

    @Column(name = "cat_id", columnDefinition = "CHAR(26)")
    private String categoryId;

    @Column(name = "cat_name", length = 60)
    private String categoryName;

    @Column(name = "cat_color", length = 7)
    private String categoryColor;

    @Column(name = "cat_icon", length = 16)
    private String categoryIcon;

    @Column(name = "event_id", columnDefinition = "CHAR(26)")
    private String eventId;

    @Column(name = "is_repeat", nullable = false)
    private boolean isRepeat;

    @CreationTimestamp
    @Column(name = "c_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "u_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "d_at")
    private LocalDateTime deletedAt;

    // --- 연관 관계 매핑 ---

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskMember> members = new ArrayList<>();

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private TaskRepeatRule repeatRule;

    // 연관 관계 편의 메서드
    public void addMember(TaskMember member) {
        this.members.add(member);
        member.setTask(this);
    }

    public void setRepeatRule(TaskRepeatRule repeatRule) {
        this.repeatRule = repeatRule;
        if (repeatRule != null) {
            repeatRule.setTask(this);
        }
    }

    // Enums
    public enum TaskStatus { TODO, DOING, DONE, CANCELED }
    public enum TaskPriority { LOW, MEDIUM, HIGH }
    public enum EnergyLevel { LOW, MEDIUM, HIGH }
}