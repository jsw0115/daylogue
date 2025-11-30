// src/shared/hooks/useAuth.js
import { useMemo } from "react";

export function useAuth() {
    // TODO: 실제 로그인/유저 상태 연동 시 여기 교체
    const user = useMemo(
        () => ({
            name: "DATA",
            email: "you@example.com",
            role: "ADMIN", // 일반 유저면 "USER" 로 바꾸면 됨
        }),
        []
    );

    const isAdmin = user?.role === "ADMIN";
    return { user, isAdmin };
}
