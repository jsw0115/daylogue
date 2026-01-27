// src/main/frontend/src/shared/api/authApi.js

import api from "../../api";

/**
 * ApiResponse 포맷 대응:
 * - 1) { success:true, data:{...} } 형태면 data를 반환
 * - 2) 바로 객체면 그대로 반환
 */
function unwrap(resData) {
  if (!resData) return null;
  if (resData.success === true && "data" in resData) return resData.data;
  return resData;
}

/**
 * 로그인 사용자 정보 조회
 * - RefreshToken(HttpOnly 쿠키) 기반으로 서버가 인증 상태면 me 반환
 * - AccessToken이 필요한 구조라면 axios 인터셉터가 자동 첨부할 것
 */
export async function fetchMe() {
  const res = await api.get("/api/auth/UserData");
  return unwrap(res.data);
}
