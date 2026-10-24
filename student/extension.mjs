// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  // 15단계 renderEvents 전용 화면 상태입니다. 받은 배열 안에서만 사용합니다.
  const eventFilters = { kind: 'all', appId: 'all', access: 'all' };
  let selectedEventId = null;
  let eventsRenderCount = 0;

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
      title.textContent = '업무 앱 접근 판정';
      root.appendChild(title);

      const addLine = (text) => {
        const line = document.createElement('p');
        line.textContent = text;
        root.appendChild(line);
      };

      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0
          ? value
          : fallback;

      const modeLabels = {
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };

      if (Object.hasOwn(modeLabels, mode)) {
        addLine(modeLabels[mode]);
      }

      if (status === 'idle') {
        addLine('앱을 골라 접속을 요청하세요.');
        return root;
      }

      if (status === 'loading') {
        addLine('판정 확인 중');
        addLine(`요청 앱 ID: ${textOr(appId, '확인 불가')}`);
        return root;
      }

      if (status === 'error') {
        addLine(`요청 앱 ID: ${textOr(appId, '확인 불가')}`);
        addLine(
          `요청 실패: ${textOr(error?.message, '오류 내용을 확인할 수 없습니다.')}`
        );
        addLine('요청 실패는 접근 거부 판정이나 접근 허용 판정이 아닙니다.');
        return root;
      }

      if (status !== 'ok') {
        addLine('요청 상태를 확인할 수 없습니다. 접근 허용으로 간주하지 마세요.');
        return root;
      }

      const decisionLabels = {
        allow: '접근 허용(allow)',
        deny: '접근 거부(deny)',
        challenge: '추가 확인 필요(challenge)',
        unknown: '판정 확인 불가(unknown)',
      };

      const decision =
        typeof data?.decision === 'string' &&
        Object.hasOwn(decisionLabels, data.decision)
          ? data.decision
          : 'unknown';

      addLine(`앱 ID: ${textOr(data?.appId, textOr(appId, '확인 불가'))}`);
      addLine(`판정: ${decisionLabels[decision]}`);
      addLine(`판정 이유: ${textOr(data?.reason, '이유 정보 없음')}`);
      addLine(`판정 시각: ${textOr(data?.checkedAt, '시각 정보 없음')}`);

      if (decision === 'allow') {
        addLine('정책상 접근 허용이며, 실제 업무 앱 접속 성공을 보장하지 않습니다.');
      } else if (decision === 'challenge') {
        addLine('추가 인증 또는 확인이 필요합니다. 이 앱은 해당 절차를 대신 수행하지 않습니다.');
      } else if (decision === 'unknown') {
        addLine('접근 판정을 확인할 수 없습니다. 접근 허용으로 간주하지 마세요.');
      }

      return root;
    },
    renderEvents({ status, mode, data, error } = {}) {
      // 새 입력(다시 불러오기 포함)이 올 때마다 이전 상세 선택을 지우고 처음부터 다시 그립니다.
      selectedEventId = null;
      eventsRenderCount += 1;
      const idPrefix = `student-events-${eventsRenderCount}`;

      const root = document.createElement('section');
      root.setAttribute('data-student-events', 'true');

      const title = document.createElement('h3');
      title.textContent = '내 접속 기록·XDR 경보';
      root.appendChild(title);

      const addLine = (parent, text) => {
        const line = document.createElement('p');
        line.textContent = text;
        parent.appendChild(line);
        return line;
      };

      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0
          ? value
          : fallback;

      const modeLabels = {
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      if (Object.hasOwn(modeLabels, mode)) {
        addLine(root, modeLabels[mode]);
      }

      if (status === 'loading') {
        addLine(root, '기록을 불러오는 중입니다.');
        return root;
      }

      if (status === 'error') {
        // 실패 화면에는 이전 목록을 표시하지 않습니다(빈 목록과 다른 문구).
        const message = textOr(error?.message, '오류 내용을 확인할 수 없습니다.');
        if (error?.code === 'CONTRACT_MISMATCH') {
          addLine(root, `기록을 불러오지 못했습니다(확인 불가 · CONTRACT_MISMATCH): ${message}`);
          addLine(root, '응답 형식을 확인할 수 없어 목록을 표시하지 않습니다.');
        } else {
          addLine(root, `기록을 불러오지 못했습니다: ${message}`);
        }
        return root;
      }

      if (status !== 'ok' || !Array.isArray(data)) {
        addLine(root, '기록 상태를 확인할 수 없습니다. 목록을 표시하지 않습니다.');
        return root;
      }

      if (data.length === 0) {
        addLine(root, '표시할 기록이 없습니다.');
        return root;
      }

      addLine(
        root,
        '본인의 최근 기록(최대 40건)만 표시합니다. XDR 경보는 서버에 저장된 경보이며, 이 화면에서 새로 탐지하지 않습니다.'
      );

      const kindLabels = { access: '접속 기록(access)', xdr: 'XDR 경보(xdr)' };
      const accessLabels = {
        allowed: '접근 허용',
        denied: '접근 거부',
        unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성',
        expired: '만료',
        revoked: '철회됨',
        unknown: '확인 불가',
      };
      const deviceLabels = {
        compliant: '보안 기준 충족',
        noncompliant: '보안 기준 미충족',
        unknown: '확인 불가',
      };

      const kindText = (kind) =>
        Object.hasOwn(kindLabels, kind)
          ? kindLabels[kind]
          : `확인 불가(${textOr(kind, '종류 없음')})`;
      const hasAppId = (event) => typeof event?.appId === 'string' && event.appId.length > 0;
      const appText = (event) =>
        hasAppId(event) ? event.appId : '앱 확인 불가(appId 없음)';
      const stateText = (labels, value) => {
        if (typeof value === 'string' && Object.hasOwn(labels, value)) {
          return `${labels[value]}(${value})`;
        }
        return `확인 불가(unknown) · 받은 값: ${textOr(value, '없음')}`;
      };
      const timeMs = (at) => {
        const ms = typeof at === 'string' ? Date.parse(at) : NaN;
        return Number.isFinite(ms) ? ms : -Infinity;
      };
      const timeText = (at) => {
        const ms = timeMs(at);
        if (ms === -Infinity) return `시각 확인 불가(${textOr(at, '값 없음')})`;
        const kst = new Intl.DateTimeFormat('ko-KR', {
          timeZone: 'Asia/Seoul',
          dateStyle: 'medium',
          timeStyle: 'medium',
        }).format(ms);
        return `${at} (한국 시각 ${kst})`;
      };

      // 1) 원본을 바꾸지 않도록 복사한 뒤 at 기준 최신순으로 정렬합니다.
      const events = [...data].sort((a, b) => timeMs(b?.at) - timeMs(a?.at));

      // 3) 필터: 전체 값은 all, 나머지는 받은 원래 값입니다.
      const filtersBox = document.createElement('div');
      root.appendChild(filtersBox);

      const uniqueValues = (pick) => {
        const values = [];
        for (const event of events) {
          const value = pick(event);
          if (!values.includes(value)) values.push(value);
        }
        return values;
      };

      const filterDefs = [
        {
          key: 'kind',
          label: '기록 종류',
          pick: (event) => String(event?.kind ?? ''),
          optionText: (value) => kindText(value),
        },
        {
          key: 'appId',
          label: '업무 앱',
          pick: (event) => (hasAppId(event) ? event.appId : ''),
          optionText: (value) => (value === '' ? '앱 확인 불가(appId 없음)' : value),
        },
        {
          key: 'access',
          label: '접속 상태',
          pick: (event) => String(event?.state?.access ?? ''),
          optionText: (value) => stateText(accessLabels, value),
        },
      ];

      const countLine = document.createElement('p');
      countLine.setAttribute('aria-live', 'polite');
      const list = document.createElement('ul');

      let draw = () => {};

      for (const def of filterDefs) {
        const values = uniqueValues(def.pick);
        if (eventFilters[def.key] !== 'all' && !values.includes(eventFilters[def.key])) {
          eventFilters[def.key] = 'all';
        }
        const wrap = document.createElement('p');
        const label = document.createElement('label');
        const selectId = `${idPrefix}-${def.key}`;
        label.htmlFor = selectId;
        label.textContent = def.label;
        const select = document.createElement('select');
        select.id = selectId;
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = '전체';
        select.appendChild(allOption);
        for (const value of values) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = def.optionText(value);
          select.appendChild(option);
        }
        select.value = eventFilters[def.key];
        select.addEventListener('change', () => {
          eventFilters[def.key] = select.value;
          draw();
        });
        wrap.appendChild(label);
        wrap.appendChild(document.createTextNode(' '));
        wrap.appendChild(select);
        filtersBox.appendChild(wrap);
      }

      root.appendChild(countLine);
      root.appendChild(list);

      const matches = (event) =>
        filterDefs.every(
          (def) => eventFilters[def.key] === 'all' || def.pick(event) === eventFilters[def.key]
        );

      // 4) 상세: evidence·rules·세 상태를 구분해 표시합니다. 조치 버튼은 만들지 않습니다.
      const renderDetail = (event, detailId) => {
        const detail = document.createElement('section');
        detail.id = detailId;
        detail.setAttribute('data-student-event-detail', String(event?.id ?? ''));

        const heading = document.createElement('h5');
        heading.textContent = `${String(event?.id ?? '')} 상세`;
        detail.appendChild(heading);

        addLine(detail, `사건 ID: ${textOr(event?.id, '확인 불가')}`);
        addLine(detail, `앱: ${appText(event)}`);

        const addItems = (headingText, items, emptyText) => {
          const h = document.createElement('h6');
          h.textContent = headingText;
          detail.appendChild(h);
          if (!Array.isArray(items) || items.length === 0) {
            addLine(detail, emptyText);
            return;
          }
          const ul = document.createElement('ul');
          for (const item of items) {
            const li = document.createElement('li');
            li.textContent = `${textOr(item?.id, 'ID 없음')}: ${textOr(item?.text, '내용 없음')}`;
            ul.appendChild(li);
          }
          detail.appendChild(ul);
        };

        addItems('근거(evidence)', event?.evidence, '근거 정보가 없습니다.');
        addItems('규칙(rules)', event?.rules, '규칙 정보가 없습니다.');

        const stateHeading = document.createElement('h6');
        stateHeading.textContent = '상태(state)';
        detail.appendChild(stateHeading);
        addLine(detail, `접속 상태(access): ${stateText(accessLabels, event?.state?.access)}`);
        addLine(detail, `세션 상태(session): ${stateText(sessionLabels, event?.state?.session)}`);
        addLine(detail, `기기 상태(device): ${stateText(deviceLabels, event?.state?.device)}`);

        return detail;
      };

      draw = (focusEventId) => {
        list.replaceChildren();
        const filtered = events.filter(matches);
        if (selectedEventId !== null && !filtered.some((event) => event?.id === selectedEventId)) {
          selectedEventId = null;
        }
        countLine.textContent = `표시 중인 기록: ${filtered.length}건 / 받은 기록: ${events.length}건`;

        if (filtered.length === 0) {
          const empty = document.createElement('li');
          empty.textContent = '선택한 필터에 맞는 기록이 없습니다.';
          list.appendChild(empty);
          return;
        }

        filtered.forEach((event, index) => {
          const eventId = String(event?.id ?? '');
          const row = document.createElement('li');
          row.setAttribute('data-student-event-id', eventId);

          // 2) 각 행에 ID·시각·종류·앱·요약을 글자로 표시합니다.
          addLine(row, `사건 ID: ${textOr(eventId, '확인 불가')}`);
          addLine(row, `시각: ${timeText(event?.at)}`);
          addLine(row, `종류: ${kindText(event?.kind)}`);
          addLine(row, `앱: ${appText(event)}`);
          addLine(row, `요약: ${textOr(event?.summary, '요약 없음')}`);

          const detailId = `${idPrefix}-detail-${index}`;
          const isOpen = selectedEventId !== null && selectedEventId === event?.id;
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = `${eventId} 상세`;
          button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (isOpen) button.setAttribute('aria-controls', detailId);
          button.addEventListener('click', () => {
            selectedEventId = selectedEventId === event?.id ? null : event?.id;
            draw(eventId);
          });
          row.appendChild(button);

          if (isOpen) row.appendChild(renderDetail(event, detailId));
          list.appendChild(row);

          if (focusEventId === eventId) {
            queueMicrotask(() => button.focus());
          }
        });
      };

      draw();
      return root;
    },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
