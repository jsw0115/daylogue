// FILE: src/main/frontend/src/screens/settings/SettingsScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "./SettingsLayout";


export default function SettingsScreen() {
  const nav = useNavigate();
  
  useEffect(() => {
    // PC 화면(폭 900px 이상)에서 /settings로 들어오면 자동으로 첫 메뉴로 이동
    if (window.innerWidth > 900) {
      nav("/settings/general", { replace: true });
    }
  }, [nav]);

  return <SettingsLayout />;
}
