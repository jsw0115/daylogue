import React from "react";

export default function CommunityRaidScreen() {
  const hp = 65; // Mock HP percentage

  return (
    <div className="tf-animate-fadein">
      <div className="tf-raid-banner">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0, fontSize:20}}>👹 나태함의 마왕 (Lv.5)</h2>
          <span className="tf-chip" style={{background:'rgba(255,255,255,0.2)', color:'white'}}>D-3</span>
        </div>
        
        <div className="tf-hp-bar">
          <div className="tf-hp-fill" style={{width: `${hp}%`}}></div>
        </div>
        <div style={{textAlign:'right', color:'white', fontSize:12, marginTop:4, fontWeight:700}}>
          HP {hp}% 남음
        </div>
      </div>

      <div className="tf-card">
        <h3>⚔️ 기여도 (실시간 딜량)</h3>
        <div className="tf-list">
          {[1,2,3].map(i => (
             <div key={i} className="tf-row" style={{justifyContent:'space-between'}}>
               <span>User {i}</span>
               <span style={{color:'var(--tf-raid)', fontWeight:'bold'}}>-{500 - i*50} DMG</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}