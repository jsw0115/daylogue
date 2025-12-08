import React, { useState } from 'react';

const TaskListScreen = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: '포트폴리오 프로젝트 최종 검토', priority: 'High', completed: false },
        { id: 2, text: 'Spring Boot 환경 설정 리서치', priority: 'Medium', completed: false },
        { id: 3, text: '운동 루틴 30분 완료', priority: 'Low', completed: true },
    ]);

    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High': return 'badge--danger';
            case 'Medium': return 'badge--warning';
            case 'Low': return 'badge--info';
            default: return 'badge--muted';
        }
    };

    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">할 일 목록 (Task List)</div>
                <button className="primary-button">+ 새 할 일 추가</button>
            </div>
            
            <div className="card p-4">
                <h4 className="dashboard-card__title mb-3">Today's Tasks</h4>
                
                <div className="task-list flex-col gap-2">
                    {tasks.map(task => (
                        <div key={task.id} className={`todo-item p-2 ${task.completed ? 'todo-item--completed' : ''}`}>
                            <label className="checkbox" onClick={() => toggleComplete(task.id)}>
                                <span className={`checkbox__box ${task.completed ? 'checkbox__box--checked' : ''}`}>
                                    {task.completed && <svg className="checkbox__icon" viewBox="0 0 16 16" fill="currentColor"><path d="M12.207 4.793a1 1 0 00-1.414 0L6 9.586 4.207 7.793a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"/></svg>}
                                </span>
                                <span className="checkbox__label">{task.text}</span>
                            </label>
                            <span className={`badge btn--sm ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title">Completed Tasks</h4>
                <p className="text-muted font-small">지난 7일간 완료한 항목: 12개</p>
            </div>
        </div>
    );
}

export default TaskListScreen;