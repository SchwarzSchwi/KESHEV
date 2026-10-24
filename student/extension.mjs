// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  return {
    renderIdentity({ me, devices, sessions } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-identity', 'true');

      const title = document.createElement('h3');
      title.textContent = '로그인 사용자·기기·세션';
      root.appendChild(title);

      const modeLine = document.createElement('p');
      const mode = me?.mode ?? devices?.mode ?? sessions?.mode;
      if (mode === 'demo') modeLine.textContent = '예제 자료';
      else if (mode === 'disconnected') modeLine.textContent = '연결 없음';
      else if (mode === 'unknown') modeLine.textContent = '확인 불가';
      if (modeLine.textContent) root.appendChild(modeLine);

      const statusLine = document.createElement('p');
      const meStatus = me?.status;
      const devicesStatus = devices?.status;
      const sessionsStatus = sessions?.status;

      if (meStatus === 'loading' || devicesStatus === 'loading' || sessionsStatus === 'loading') {
        statusLine.textContent = '불러오는 중';
        root.appendChild(statusLine);
        return root;
      },
    renderDecision() { return '학생 구현 대기: 서버의 판정과 이유를 연결하세요.'; },
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
