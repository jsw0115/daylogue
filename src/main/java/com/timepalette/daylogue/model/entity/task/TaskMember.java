package com.timepalette.daylogue.model.entity.task;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    /**
     * 참여자의 user_id. 
     * 다른 DB/MS의 User 엔티티와 강결합하지 않고 값으로 보관 (MSA 패턴)
     */
    @Column(name = "user_id", nullable = false, columnDefinition = "CHAR(26)")
    private String userId;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

}