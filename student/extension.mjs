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

      const deviceStatusLabels = {
        compliant: '보안 기준 충족',
        noncompliant: '보안 기준 미충족',
        unknown: '확인 불가',
      };
      const sessionStatusLabels = {
        active: '활성',
        expired: '만료',
        revoked: '철회됨',
        unknown: '확인 불가',
      };
      const modeLabels = {
        demo: '예제 자료',
        disconnected: '연결 없음',
        unknown: '확인 불가',
      };

      const valueText = (value) => {
        if (value === undefined || value === null || value === '') {
          return '확인 불가';
        }
        return String(value);
      };

      const deviceStatusText = (status) =>
        Object.hasOwn(deviceStatusLabels, status)
          ? deviceStatusLabels[status]
          : '확인 불가';

      const sessionStatusText = (status) =>
        Object.hasOwn(sessionStatusLabels, status)
          ? sessionStatusLabels[status]
          : '확인 불가';

      const addLine = (parent, text) => {
        const line = document.createElement('p');
        line.textContent = text;
        parent.appendChild(line);
      };

      const addDevice = (parent, device) => {
        addLine(
          parent,
          `기기: ${valueText(device?.label)} · ID: ${valueText(device?.id)} · 상태: ${deviceStatusText(device?.status)}`
        );
      };

      const addSession = (parent, session) => {
        addLine(
          parent,
          `세션 ID: ${valueText(session?.id)} · 상태: ${sessionStatusText(session?.status)}`
        );
      };

      const renderResource = (heading, resource, renderData) => {
        const section = document.createElement('section');
        const label = document.createElement('h4');
        label.textContent = heading;
        section.appendChild(label);
        root.appendChild(section);

        // 모드 안내는 loading/error 상태에서도 표시합니다.
        if (Object.hasOwn(modeLabels, resource?.mode)) {
          addLine(section, modeLabels[resource.mode]);
        }

        if (resource?.status === 'loading') {
          addLine(section, '불러오는 중');
          return;
        }

        if (resource?.status === 'error') {
          addLine(
            section,
            `연결 실패: ${valueText(resource.error?.message)}`
          );
          return;
        }

        if (resource?.status !== 'ok') {
          addLine(section, '확인 불가');
          return;
        }

        renderData(section, resource.data);
      };

      renderResource('현재 계정·기기·세션', me, (section, data) => {
        if (!data) {
          addLine(section, '확인 불가');
          return;
        }
        addLine(
          section,
          `사용자: ${valueText(data.user?.label)} · ID: ${valueText(data.user?.id)}`
        );
        addDevice(section, data.device);
        addSession(section, data.session);
      });

      renderResource('내 기기', devices, (section, data) => {
        if (!Array.isArray(data)) {
          addLine(section, '확인 불가');
          return;
        }
        if (data.length === 0) {
          addLine(section, '기기 목록이 비어 있습니다.');
          return;
        }
        for (const device of data) {
          addDevice(section, device);
        }
      });

      renderResource('내 세션', sessions, (section, data) => {
        if (!Array.isArray(data)) {
          addLine(section, '확인 불가');
          return;
        }
        if (data.length === 0) {
          addLine(section, '세션 목록이 비어 있습니다.');
          return;
        }
        for (const session of data) {
          addSession(section, session);
        }
      });

      return root;
    },
    renderDecision({ status, mode, data, error, appId } = {}) {
      const root = document.createElement('section');
      const title = document.createElement('h3');
      title.textContent = '앱 접속 판정';
      root.appendChild(title);

      const addLine = (text) => {
        const line = document.createElement('p');
        line.textContent = text;
        root.appendChild(line);
      };
      const valueText = (value) =>
        typeof value === 'string' && value !== '' ? value : '확인 불가';

      if (mode === 'demo') {
        addLine('예제 자료이며 실제 앱 연결이 아닙니다.');
      }

      if (status === 'idle') {
        addLine('앱을 골라 접속을 요청하세요.');
        return root;
      }

      if (status === 'loading') {
        addLine('판정 확인 중');
        addLine(`앱 ID: ${valueText(appId)}`);
        return root;
      }

      if (status === 'error') {
        addLine(`앱 ID: ${valueText(appId)}`);
        addLine(`요청 실패: ${valueText(error?.message)}`);
        addLine('요청 실패는 접근 거부 판정이나 접근 허용 판정이 아닙니다.');
        return root;
      }

      if (status !== 'ok') {
        addLine('판정 상태 확인 불가. 접근 허용을 뜻하지 않습니다.');
        return root;
      }

      const decisionLabels = {
        allow: '접근 허용',
        deny: '접근 거부',
        challenge: '추가 확인 필요',
        unknown: '판정 확인 불가',
      };
      const decision =
        typeof data?.decision === 'string' && Object.hasOwn(decisionLabels, data.decision)
          ? data.decision
          : 'unknown';

      addLine(`${decisionLabels[decision]}(${decision})`);
      addLine(`앱 ID: ${valueText(data?.appId)}`);
      addLine(`이유: ${valueText(data?.reason)}`);
      addLine(`판정 시각: ${valueText(data?.checkedAt)}`);

      if (decision === 'allow') {
        addLine('정책상 접근이 허용됩니다. 실제 앱에 성공적으로 연결됨을 보장하지 않습니다.');
      } else if (decision === 'challenge') {
        addLine('추가 인증 또는 확인이 필요합니다. 이 앱은 사용자를 대신해 추가 인증이나 확인을 수행하지 않습니다.');
      } else if (decision === 'unknown') {
        addLine('unknown은 접근 허용을 뜻하지 않습니다.');
      }

      return root;
    },
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
