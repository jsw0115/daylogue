import React from "react";

export default function CommunityDepositScreen() {
  return (
    <div className="tf-grid-layout">
      <div className="tf-card" style={{border:'2px solid var(--tf-money)', background:'#fffbeb'}}>
        <div className="tf-row" style={{justifyContent:'space-between'}}>
           <div>
             <div style={{fontSize:12, color:'#92400e'}}>내 걸린 돈</div>
             <div style={{fontSize:24, fontWeight:900, color:'#b45309'}}>10,000 P</div>
           </div>
           <div style={{textAlign:'right'}}>
             <div style={{fontSize:12, color:'#92400e'}}>현재 상금 풀</div>
             <div style={{fontSize:18, fontWeight:700, color:'#b45309'}}>🏆 152,000 P</div>
           </div>
        </div>
        <div className="tf-divider" style={{background:'#fcd34d'}}/>
        <div style={{fontSize:13, color:'#92400e'}}>
          100% 달성 시 예상 환급: <strong>11,200 P</strong> (+1,200)
        </div>
      </div>

      <div className="tf-card">
        <h3>📅 인증 현황</h3>
        <div className="tf-row" style={{gap:4, flexWrap:'wrap'}}>
          {Array.from({length: 14}).map((_, i) => (
            <div key={i} style={{
               width: 32, height: 32, 
               borderRadius: 4, 
               background: i < 10 ? 'var(--tf-primary)' : '#e2e8f0',
               color: i < 10 ? 'white' : '#94a3b8',
               display: 'flex', alignItems:'center', justifyContent:'center', fontSize:12
            }}>
              {i+1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}