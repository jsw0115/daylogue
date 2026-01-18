// src/screens/auth/LoginScreen.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/screens/auth.css";
import safeStorage from "../../shared/utils/safeStorage";
import api from './../../api'; // api.js 파일 경로

export default function LoginScreen() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // // 서버 연동 전 임시 로그인 상태 저장
    // safeStorage.setJSON("auth.session", { email, loggedInAt: Date.now() });
    // nav("/home");
    try {
      const res = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: pw,
      });

      // 서버 응답 형식: { success:true, data:{...} } 형태라고 가정
      const payload = res.data?.data;

      debugger;

      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      // LoginResponseModel 기반이라면 userId/email/nickname/role이 같이 옴
      const user = {
        userId: payload?.userId,
        email: payload?.email,
        nickname: payload?.nickname,
        role: payload?.role,
      };

      if (!accessToken || !refreshToken) {
        console.log("accessToken OR refreshToken is missing");
        setError("로그인 응답에 토큰이 없습니다. 서버 응답 구조를 확인해 주세요.");
        return;
      }

      safeStorage.setJSON("auth.session", {
        ...user,
        accessToken,
        refreshToken,
        loggedInAt: Date.now(),
      });

      console.log("navigate to Home");

      // 기본 진입 화면 정책에 따라 이동
      nav("/home");
    } catch (err) {

      console.log("err : " + err);
      const status = err?.response?.status;
      const body = err?.response?.data;

      // 디버그용(필요하면 주석 해제)
      // console.log("login error", status, body);

      if (status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      if (status === 403) {
        setError("계정이 비활성화되었거나 접근 권한이 없습니다.");
        return;
      }
      if (status === 400) {
        setError("입력값을 확인해 주세요.");
        return;
      }
      if (!status) {
        setError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
        return;
      }
      setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-title">로그인</div>
        <div className="auth-subtitle">이메일/비밀번호로 로그인합니다.</div>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">이메일</label>
          <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />

          <label className="auth-label">비밀번호</label>
          <input className="auth-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />

          <button className="btn btn--primary auth-submit" type="submit" disabled={!email || !pw}>
            로그인
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">회원가입</Link>
          <Link to="/reset-password">비밀번호 재설정</Link>
          <Link to="/find-id">ID 찾기</Link>
        </div>
      </div>
    </div>
  );
}
