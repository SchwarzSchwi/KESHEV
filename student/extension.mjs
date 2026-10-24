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

      // 4) 상세: evidence·rules·세 상태와 입력된 미지원 조치를 표시합니다. 실행 요청은 보내지 않습니다.
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

        if (Array.isArray(event?.supportedActions) && event.supportedActions.length > 0) {
          addLine(detail, '아직 지원하지 않음 · 조치 실행 연결은 준비 중입니다.');
          for (const action of event.supportedActions) {
            if (typeof action !== 'string' || !action.trim()) continue;
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = `${action} 미지원`;
            button.disabled = true;
            detail.appendChild(button);
          }
        }

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
    renderStatus({ devices, sessions, notifications, diagnostics, mode } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-status', 'true');

      const text = (value) => {
        if (typeof value === 'string' && value.trim()) return value;
        if (typeof value === 'number' && Number.isFinite(value)) return String(value);
        if (typeof value === 'boolean') return String(value);
        return '확인 불가';
      };
      const credentialPattern = /(?:password|passwd|pwd|secret|token|api[\s_-]*key|authorization|credential|private[\s_-]*key|bearer\s|basic\s|-----BEGIN|(?:sk|pk)[-_](?:live|test)[-_]|sk-[a-z0-9]|gh[pousr]_|github_pat_|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|eyJ[a-z0-9_-]*\.[a-z0-9_-]+\.[a-z0-9_-]+)/i;
      const codeText = (value) =>
        typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/i.test(value) && !credentialPattern.test(value)
          ? value
          : '확인 불가';
      const addLine = (parent, content) => {
        const line = document.createElement('p');
        line.textContent = content;
        parent.appendChild(line);
        return line;
      };
      const section = (heading) => {
        const node = document.createElement('section');
        const title = document.createElement('h4');
        title.textContent = heading;
        node.appendChild(title);
        root.appendChild(node);
        return node;
      };
      const modeLabels = {
        connected: '연결됨(connected) · 모든 점검의 통과를 뜻하지 않습니다.',
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      const showMode = (parent, value) => {
        addLine(parent, typeof value === 'string' && Object.hasOwn(modeLabels, value)
          ? modeLabels[value] : modeLabels.unknown);
      };
      const showError = (parent, name, resource, retry) => {
        const code = resource?.error?.code;
        const timeout = ['TIMEOUT', 'ENGINE_TIMEOUT', 'REQUEST_TIMEOUT'].includes(code);
        addLine(parent, `${name}을 불러오지 못했습니다${timeout ? ' · 시간 초과' : ''}: ${text(resource?.error?.message)}`);
        addLine(parent, `오류 코드: ${codeText(code)}`);
        addLine(parent, retry);
      };
      const renderList = (name, resource, emptyText, key, labels) => {
        const parent = section(name);
        showMode(parent, resource?.mode);
        if (resource?.status === 'loading') {
          addLine(parent, '불러오는 중');
        } else if (resource?.status === 'error') {
          showError(parent, name, resource, '다시 시도는 위쪽 다시 불러오기 버튼을 직접 누르세요. 자동으로 재요청하지 않습니다.');
        } else if (resource?.status !== 'ok' || !Array.isArray(resource.data)) {
          addLine(parent, `${name} 자료를 확인할 수 없습니다.`);
        } else if (resource.data.length === 0) {
          addLine(parent, emptyText);
        } else {
          for (const item of resource.data) {
            const status = item?.status;
            const label = typeof status === 'string' && Object.hasOwn(labels, status)
              ? labels[status] : '확인 불가';
            addLine(parent, `${key}: ${text(item?.[key])} · 상태: ${text(status)} (${label})`);
          }
        }
      };

      showMode(root, mode);
      renderList('기기', devices, '등록된 기기가 없음', 'label', {
        compliant: '보안 기준 충족', noncompliant: '보안 기준 미충족', unknown: '확인 불가',
      });
      addLine(root, '세션은 현재 검증된 연결 최대 한 개만 표시합니다. 과거 또는 전체 세션 목록이 아닙니다.');
      renderList('세션', sessions, '현재 연결 없음', 'id', {
        active: '활성', expired: '만료', revoked: '철회됨', unknown: '확인 불가',
      });

      const notificationSection = section('알림');
      if (!Array.isArray(notifications)) {
        addLine(notificationSection, '알림 자료를 확인할 수 없습니다.');
      } else if (notifications.length === 0) {
        addLine(notificationSection, '주의할 알림이 없습니다.');
      } else {
        for (const notification of notifications) {
          addLine(notificationSection, `자료(resource): ${text(notification?.resource)} · 코드: ${codeText(notification?.code)} · 메시지: ${text(notification?.message)}`);
        }
      }

      const diagnosticSection = section('진단 정보');
      showMode(diagnosticSection, diagnostics?.mode);
      let diagnosticSnapshot = null;
      if (diagnostics?.status === 'idle') {
        addLine(diagnosticSection, '진단 정보를 아직 조회하지 않았습니다. 제공 화면의 도움정보 불러오기 버튼을 직접 누르세요.');
      } else if (diagnostics?.status === 'loading') {
        addLine(diagnosticSection, '불러오는 중');
      } else if (diagnostics?.status === 'error') {
        showError(diagnosticSection, '진단 정보', diagnostics, '제공 화면의 도움정보 불러오기 버튼을 직접 눌러 다시 시도하세요. 위쪽 다시 불러오기는 진단 정보를 재조회하지 않습니다.');
      } else if (diagnostics?.status === 'ok' && diagnostics.data &&
        typeof diagnostics.data === 'object' && !Array.isArray(diagnostics.data)) {
        const safeValue = (value) => {
          const valueText = text(value);
          return credentialPattern.test(valueText) ? '[민감정보 가림]' : valueText;
        };
        const engine = diagnostics.data.engine;
        const validEngine = engine && typeof engine === 'object' && !Array.isArray(engine);
        const snapshot = {
          requestId: safeValue(diagnostics.data.requestId),
          component: safeValue(diagnostics.data.component),
          version: safeValue(diagnostics.data.version),
          checkedAt: safeValue(diagnostics.data.checkedAt),
          engine: {
            mode: safeValue(validEngine ? engine.mode : undefined),
            code: safeValue(validEngine ? engine.code : undefined),
          },
        };
        const usable = [
          snapshot.requestId, snapshot.component, snapshot.version,
          snapshot.checkedAt, snapshot.engine.mode, snapshot.engine.code,
        ].some(value => value !== '확인 불가' && value !== '[민감정보 가림]');
        if (usable) {
          diagnosticSnapshot = snapshot;
          addLine(diagnosticSection, `requestId: ${snapshot.requestId}`);
          addLine(diagnosticSection, `component: ${snapshot.component}`);
          addLine(diagnosticSection, `version: ${snapshot.version}`);
          addLine(diagnosticSection, `checkedAt: ${snapshot.checkedAt}`);
          addLine(diagnosticSection, `engine.mode: ${snapshot.engine.mode}`);
          addLine(diagnosticSection, `engine.code: ${snapshot.engine.code}`);
        } else {
          addLine(diagnosticSection, '표시할 진단 정보를 확인할 수 없습니다.');
        }
      } else {
        addLine(diagnosticSection, '표시할 진단 정보를 확인할 수 없습니다.');
      }
      addLine(diagnosticSection, '도움 요청에 사용할 위 여섯 항목만 복사합니다. 외부로 전송하지 않습니다.');
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = '도움정보 복사';
      copy.disabled = diagnosticSnapshot === null;
      diagnosticSection.appendChild(copy);
      const feedback = addLine(diagnosticSection, '');
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      copy.addEventListener('click', async () => {
        if (!diagnosticSnapshot) return;
        copy.disabled = true;
        try {
          if (typeof globalThis.navigator?.clipboard?.writeText !== 'function') {
            feedback.textContent = '이 환경에서는 클립보드 복사를 사용할 수 없습니다. 복사하지 않았습니다.';
            return;
          }
          await globalThis.navigator.clipboard.writeText(JSON.stringify(diagnosticSnapshot, null, 2));
          feedback.textContent = '도움정보를 클립보드에 복사했습니다.';
        } catch {
          feedback.textContent = '클립보드에 복사하지 못했습니다. 브라우저 권한을 확인하고 직접 다시 시도하세요.';
        } finally {
          copy.disabled = false;
        }
      });
      return root;
    },
    renderVulnerabilities({ status, mode, data, error } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-vulnerabilities', 'true');
      
      const title = document.createElement('h3');
      title.textContent = '설치 패키지 버전·알려진 취약점 조회';
      root.appendChild(title);
      
      const addLine = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        root.appendChild(p);
        return p;
      };
      
      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0 ? value : fallback;
    
      const modeLabels = {
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      if (Object.hasOwn(modeLabels, mode)) {
        addLine(modeLabels[mode]);
      }
      
      // 1) idle/loading/error/ok 구분 + 진행/오류 시 표 미표시
      if (status === 'idle') {
        addLine('조회 전(idle)');
        addLine('아직 설치 패키지 버전 조회를 실행하지 않았습니다.');
        return root;
      }
    
      if (status === 'loading') {
        addLine('조회 중(loading)');
        addLine('설치 패키지 버전과 알려진 취약점 정보를 확인하고 있습니다.');
        return root;
      }
    
      if (status === 'error') {
        addLine(`조회 실패(error): ${textOr(error?.message, '오류 내용을 확인할 수 없습니다.')}`);
        addLine('조회 실패는 취약점 없음이 아닙니다.');
        return root;
      }
    
      if (status !== 'ok') {
        addLine(`조회 상태 확인 불가(${textOr(status, '값 없음')})`);
        addLine('현재 결과를 표시하지 않습니다.');
        return root;
      }
    
      // 2) data.status 원래 값 + 한국어 설명
      const overallStatusLabels = {
        complete: '모두 조회',
        partial: '일부 조회 실패',
        not_checked: '아직 조회 안 함',
        not_configured: '조회 준비 미완료',
        unverifiable: 'lock 파일 확인 불가',
      };
    
      const overallStatus =
        typeof data?.status === 'string' && Object.hasOwn(overallStatusLabels, data.status)
          ? data.status
          : 'unverifiable';
    
      addLine(`전체 조회 상태: ${overallStatusLabels[overallStatus]}(${overallStatus})`);
    
      if (overallStatus === 'not_checked') {
        addLine('not_checked: 승인된 공개 조회 대상이 아직 없어 조회하지 않은 상태입니다.');
      } else if (overallStatus === 'not_configured') {
        addLine('not_configured: 조회 대상 프로젝트 설정이 필요합니다.');
      } else if (overallStatus === 'partial') {
        addLine('partial: 일부 패키지 조회에 실패했습니다. 실패는 취약점 없음이 아닙니다.');
      } else if (overallStatus === 'unverifiable') {
        addLine('unverifiable: 전체 조회를 확인할 수 없습니다. 확인 가능한 항목만 표시합니다.');
      }
      
      // 3) 전달된 경우에만 lockfile 메타 표시
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (Object.hasOwn(data, 'lockfileVersion')) {
          addLine(`lockfileVersion: ${data.lockfileVersion === undefined || data.lockfileVersion === null ? '확인 불가' : String(data.lockfileVersion)}`);
        }
        if (Object.hasOwn(data, 'lockfileHash')) {
          addLine(`lockfileHash: ${textOr(data.lockfileHash, '확인 불가')}`);
        }
        if (Object.hasOwn(data, 'checkedAt')) {
          addLine(`전체 확인 시각(checkedAt): ${textOr(data.checkedAt, '확인 불가')}`);
        }
      }
      
      const packages = Array.isArray(data?.packages) ? data.packages : [];
      addLine(`패키지 수: ${packages.length}`);
    
      if (packages.length === 0) {
        addLine('표시할 패키지가 없습니다.');
        return root;
      }
    
      const packageStatusLabels = {
        known_vulnerabilities: '알려진 항목 있음',
        none_found: '알려진 항목 없음',
        unverifiable: '조회 확인 불가',
      };
      
      const list = document.createElement('ul');
      root.appendChild(list);
    
      for (const pkg of packages) {
        const row = document.createElement('li');
    
        const packageName = textOr(pkg?.name, '확인 불가');
        const packageVersion = textOr(pkg?.version, '확인 불가');
    
        // 요구 속성
        row.setAttribute('data-student-package-name', packageName);
        row.setAttribute('data-student-package-version', packageVersion);
    
        const line = document.createElement('p');
        const packageStatusRaw =
          typeof pkg?.status === 'string' && Object.hasOwn(packageStatusLabels, pkg.status)
            ? pkg.status
            : 'unverifiable';
    
        line.textContent =
          `패키지: ${packageName} · 버전: ${packageVersion} · 상태: ${packageStatusLabels[packageStatusRaw]}(${packageStatusRaw})` +
          ` · 출처(source): ${textOr(pkg?.source, '확인 불가')}` +
          ` · 패키지 확인 시각(checkedAt): ${textOr(pkg?.checkedAt, '확인 불가')}`;
        row.appendChild(line);
    
        // none_found 의미 명확화
        if (packageStatusRaw === 'none_found') {
          const note = document.createElement('p');
          note.textContent = 'none_found: 조회 범위에서 알려진 취약점 항목이 없다는 뜻이며, 안전 보장을 의미하지 않습니다.';
          row.appendChild(note);
        }
      
        // partial/unverifiable에서도 이미 받은 vulnerabilities ID 표시 유지
        const vulns = Array.isArray(pkg?.vulnerabilities) ? pkg.vulnerabilities : [];
        if (vulns.length === 0) {
          const empty = document.createElement('p');
          empty.textContent = '취약점 항목: 없음';
          row.appendChild(empty);
        } else {
          const vulnList = document.createElement('ul');
          for (const vuln of vulns) {
            const item = document.createElement('li');
            item.textContent =
              `ID: ${textOr(vuln?.id, '확인 불가')} · modified: ${textOr(vuln?.modified, '확인 불가')}`;
            vulnList.appendChild(item);
          }
          row.appendChild(vulnList);
        }
      
        if (packageStatusRaw === 'unverifiable' && vulns.length > 0) {
          const partialInfo = document.createElement('p');
          partialInfo.textContent = '일부 확인·전체 조회 확인 불가: 받은 취약점 ID는 유지하여 표시합니다.';
          row.appendChild(partialInfo);
        }
    
        list.appendChild(row);
      }
      
        addLine('OSV는 알려진 취약점 데이터베이스입니다. 조회 결과가 없다는 사실만으로 패키지나 앱 전체의 안전이 보장되지는 않습니다.');
        return root;
      },
    
      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0 ? value : fallback;
    
      const modeLabels = {
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      if (Object.hasOwn(modeLabels, mode)) {
        addLine(modeLabels[mode]);
      }
    
      if (status === 'idle') {
        addLine('조회 전(idle)');
        addLine('아직 설치 패키지 버전 조회를 실행하지 않았습니다.');
        return root;
      }
    
      if (status === 'loading') {
        addLine('조회 중(loading)');
        addLine('설치 패키지 버전과 알려진 취약점 정보를 확인하고 있습니다.');
        return root;
      }
    
      if (status === 'error') {
        addLine(`조회 실패(error): ${textOr(error?.message, '오류 내용을 확인할 수 없습니다.')}`);
        addLine('조회 실패는 취약점 없음이 아닙니다.');
        return root;
      }
    
       if (status !== 'ok') {
        addLine(`조회 상태 확인 불가(${textOr(status, '값 없음')})`);
        addLine('현재 결과를 표시하지 않습니다.');
        return root;
      }
    
      const overallStatusLabels = {
        complete: '모두 조회',
        partial: '일부 조회 실패',
        not_checked: '아직 조회 안 함',
        not_configured: '조회 준비 미완료',
        unverifiable: 'lock 파일 확인 불가',
      };
    
      const overallStatus =
        typeof data?.status === 'string' && Object.hasOwn(overallStatusLabels, data.status)
          ? data.status
          : 'unverifiable';
    
      addLine(`전체 조회 상태: ${overallStatusLabels[overallStatus]}(${overallStatus})`);
    
      if (overallStatus === 'not_checked') {
        addLine('승인된 공개 조회 대상이 아직 없어 조회하지 않은 상태일 수 있습니다.');
      } else if (overallStatus === 'not_configured') {
        addLine('조회 대상 프로젝트 설정이 필요합니다.');
      } else if (overallStatus === 'partial') {
        addLine('일부 패키지 조회에 실패했습니다. 실패는 취약점 없음이 아닙니다.');
      } else if (overallStatus === 'unverifiable') {
        addLine('전체 조회를 확인할 수 없습니다. 확인 가능한 항목만 표시해야 합니다.');
      }
    
      // ok 상세 표시는 다음 단계에서 추가
      addLine('조회 완료(ok)');
      return root;
    },
    renderAiConnection({ status, mode, data, error, checkedAt, explanationAccepted } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-ai-connection', 'true');

      const title = document.createElement('h3');
      title.textContent = 'AI 연결 점검 상태';
      root.appendChild(title);

      const addLine = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        root.appendChild(p);
      };

      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0 ? value : fallback;

      const modeLabels = {
        demo: '예제 자료(demo) · 실제 연결 결과가 아닙니다.',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      if (Object.hasOwn(modeLabels, mode)) {
        addLine(modeLabels[mode]);
      }

      if (status === 'idle') {
        addLine('AI 연결 점검 전');
        addLine('다시 점검은 사용자가 버튼을 직접 눌러야 합니다. 자동 재점검하지 않습니다.');
        return root;
      }

      if (status === 'loading') {
        addLine('AI 연결 점검 중');
        addLine('점검 중 취소할 수 있습니다. 자동 재점검하지 않습니다.');
        return root;
      }

      if (status === 'error') {
        const code = textOr(error?.code, 'AI_REQUEST_UNVERIFIED');
        const message = textOr(error?.message, '오류 내용을 확인할 수 없습니다.');
        addLine(`연결 점검 실패 코드: ${code}`);
        addLine(`연결 점검 실패 내용: ${message}`);

        const guideByCode = {
          ON_AI_PROVISIONING_PENDING: '권한 준비 중·확인 불가: 담당자에게 계정 연결과 앱 권한 확인을 요청하세요.',
          WB_CLCO_AUTH_REQUIRED: '인증 실패: 계정 연결을 다시 확인하고 담당자에게 문의하세요.',
          WB_CLCO_ACCESS_BLOCKED: '접근 제한: 계정 연결 상태를 확인하고 담당자에게 문의하세요.',
          WB_CLCO_COHORT_BUDGET_EXHAUSTED: '반 사용량 소진: 담당자에게 확인하세요.',
          WB_CLCO_LIMIT_REACHED: '이용 한도 도달: 담당자에게 확인하세요.',
          WB_CLCO_SESSION_CLOSED: '이용 시간 아님: 이용 가능 시간을 확인하세요.',
          WB_CLCO_RATE_LIMITED: '요청 제한: 잠시 뒤 사용자가 직접 다시 점검하세요.',
          WB_CLCO_TIMEOUT: '시간 초과: 잠시 뒤 사용자가 직접 다시 점검하세요.',
          REQUEST_TIMEOUT: '시간 초과: 잠시 뒤 사용자가 직접 다시 점검하세요.',
          ENGINE_TIMEOUT: '시간 초과: 잠시 뒤 사용자가 직접 다시 점검하세요.',
          TIMEOUT: '시간 초과: 잠시 뒤 사용자가 직접 다시 점검하세요.',
          CANCELLED: '취소됨: 이전 점검 결과는 현재 결과가 아닙니다.',
          WB_CLCO_CANCELLED: '취소됨: 이전 점검 결과는 현재 결과가 아닙니다.',
          REQUEST_CANCELLED: '취소됨: 이전 점검 결과는 현재 결과가 아닙니다.',
          ON_AI_MODEL_LIST_EMPTY: '쓸 수 있는 모델 없음: 담당자에게 모델 허용 설정 확인을 요청하세요.',
          AI_REQUEST_UNVERIFIED: '연결 확인 불가: 잠시 뒤 사용자가 직접 다시 점검하세요.',
        };

        addLine(guideByCode[code] ?? '연결 확인 불가: 잠시 뒤 사용자가 직접 다시 점검하세요.');
        addLine('사건 설명은 아직 실행하지 않았습니다.');
        return root;
      }

      if (status !== 'ok') {
        addLine('AI 연결 상태 확인 불가');
        addLine('다시 점검은 사용자가 버튼을 직접 눌러야 합니다.');
        return root;
      }

      const auth = data?.audienceAuthorization;
      if (auth === 'test') addLine('점검 구분: 시험 연결 점검(test)');
      else if (auth === 'verified') addLine('점검 구분: 앱 권한 확인 후 점검(verified)');
      else addLine(`점검 구분: 확인 불가(${textOr(auth, '없음')})`);

      addLine(`응답 모델 수: ${Number.isFinite(data?.modelCount) ? String(data.modelCount) : '확인 불가'}`);
      addLine(`점검 시각: ${textOr(checkedAt, '시각 정보 없음')}`);
      addLine('사건 설명은 아직 실행하지 않았습니다.');
      addLine('모델 목록 응답은 사건 설명 실행 성공이 아닙니다.');

      return root;
    },

    renderExplanation({ event, explanation, checkedAt } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-explanation', 'true');

      const title = document.createElement('h3');
      title.textContent = 'AI 사건 설명 상태';
      root.appendChild(title);

      const addLine = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        root.appendChild(p);
      };

      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0 ? value : fallback;

      const status = explanation?.status;
      const errorCode = textOr(explanation?.error?.code, '');
      const eventId = textOr(event?.id, '확인 불가');

      // 1) 실패는 event 가 null 이어도 먼저 표시합니다. 오류 코드는 만들어 내지 않습니다.
      if (status === 'error') {
        addLine(`AI 설명 실패: ${textOr(explanation?.error?.message, '오류 내용을 확인할 수 없습니다.')}`);
        addLine(`오류 코드: ${errorCode || '확인 불가'}`);
        if (event) addLine(`사건 ID: ${eventId}`);
        if (errorCode === 'ON_AI_INVALID_INPUT') {
          addLine('실패 까닭: 근거 부족 — 설명에 필요한 사건 근거·규칙을 확인할 수 없습니다.');
        }
        addLine('기록은 그대로입니다.');
        addLine('AI 설명 실패는 과제 실패가 아닙니다.');
        return root;
      }

      if (!event) {
        addLine('보안 기록에서 기록을 먼저 고르세요');
        return root;
      }

      if (status === 'loading') {
        addLine(`사건 ID: ${eventId}`);
        addLine('AI 사건 설명 요청 중');
        return root;
      }

      if (status !== 'ok') {
        addLine(`사건 ID: ${eventId}`);
        addLine(status === 'idle' || status === undefined
          ? '아직 사건 설명을 요청하지 않았습니다.'
          : 'AI 사건 설명 상태 확인 불가');
        return root;
      }

      // 쓸 수 없는 설명은 내용 없이 까닭만 보이고 성공 표식을 붙이지 않습니다.
      const refuse = (reason) => {
        addLine(`사건 ID: ${eventId}`);
        addLine('AI 설명을 쓸 수 없습니다.');
        addLine(`까닭: ${reason}`);
        if (errorCode) addLine(`오류 코드: ${errorCode}`);
        addLine('기록은 그대로입니다.');
        return root;
      };

      const data = explanation?.data;
      const summary = textOr(data?.summary, '');
      if (!textOr(event.id, '')) return refuse('사건 ID를 확인할 수 없습니다.');
      if (!data || typeof data !== 'object') return refuse('설명 자료가 없습니다.');
      if (data.executed === true) return refuse('AI가 이미 실행했다고 답한 설명은 쓸 수 없습니다(executed:true).');
      if (data.executed !== false) return refuse('설명의 실행 여부(executed)를 확인할 수 없습니다.');
      if (data.requiresHumanConfirmation !== true) return refuse('사람 확인 필요 여부(requiresHumanConfirmation)를 확인할 수 없습니다.');
      if (!summary) return refuse('AI 요약이 없습니다.');

      // 근거 ID는 현재 기록의 event.evidence 와 정확히 같은 id 로만 연결합니다. 없는 ID는 만들지 않습니다.
      const isEntry = (row) => row && typeof row === 'object'
        && textOr(row.id, '') !== '' && textOr(row.text, '') !== '';
      const validList = (list) => (Array.isArray(list) && list.every(isEntry) ? list : []);
      const evidence = validList(event.evidence);
      const rules = validList(event.rules);
      if (evidence.length === 0) return refuse('근거 부족 — 이 기록에 확인할 수 있는 근거가 없습니다.');
      if (rules.length === 0) return refuse('근거 부족 — 이 기록에 확인할 수 있는 규칙이 없습니다.');
      const evidenceById = new Map(evidence.map((row) => [row.id, row.text]));
      const bindIds = (ids) => Array.isArray(ids) && ids.length > 0
        && new Set(ids).size === ids.length
        && ids.every((id) => typeof id === 'string' && evidenceById.has(id));
      if (!bindIds(data.evidenceIds)) {
        return refuse('근거가 맞지 않음 — 설명이 인용한 근거 ID가 없거나 이 기록의 근거에 없습니다.');
      }

      const supportedActions = Array.isArray(event.supportedActions) ? event.supportedActions : [];
      const proposals = data.proposals;
      if (!Array.isArray(proposals)) return refuse('AI 제안 목록을 확인할 수 없습니다.');
      const proposalOk = (p) => p && typeof p === 'object'
        && textOr(p.action, '') !== '' && supportedActions.includes(p.action)
        && textOr(p.reason, '') !== ''
        && (p.evidenceIds === undefined || bindIds(p.evidenceIds));
      if (!proposals.every(proposalOk)) {
        return refuse('AI 제안의 조치 또는 근거 ID가 이 기록과 맞지 않습니다.');
      }

      const addHeading = (text) => {
        const h = document.createElement('h4');
        h.textContent = text;
        root.appendChild(h);
      };

      addLine(`사건 ID: ${event.id}`);
      addHeading('AI 설명(참고용)');
      addLine(summary);

      const addList = (lines) => {
        const ul = document.createElement('ul');
        for (const text of lines) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        }
        root.appendChild(ul);
      };

      addHeading('인용한 근거');
      addList(data.evidenceIds.map((id) => `${id} — ${evidenceById.get(id)}`));
      addHeading('규칙');
      addList(rules.map((row) => `${row.id} — ${row.text}`));

      // unknown 은 확인 불가이며 정상·안전으로 바꾸지 않습니다.
      const stateLabels = { access: '접속', session: '세션', device: '기기' };
      const unknownLines = [];
      for (const [key, label] of Object.entries(stateLabels)) {
        const value = event.state?.[key];
        if (value === 'unknown') unknownLines.push(`${label}: 확인 불가(unknown)`);
        else if (textOr(value, '') === '') unknownLines.push(`${label}: 확인 불가(값 없음)`);
      }
      addHeading('확인 불가 상태');
      if (unknownLines.length > 0) addList(unknownLines);
      else addLine('없음');

      addHeading('AI 제안 조치');
      if (proposals.length === 0) {
        addLine(supportedActions.length === 0
          ? '연동 시스템이 지원하는 조치가 없어 제안이 없습니다(정상)'
          : 'AI가 제안한 조치가 없습니다');
      } else {
        for (const p of proposals) {
          const lines = [`조치: ${p.action}`, `이유: ${p.reason}`];
          if (Array.isArray(p.evidenceIds)) lines.push(`제안 근거 ID: ${p.evidenceIds.join(', ')}`);
          lines.push('사람 확인이 필요하며 실행되지 않았습니다');
          addList(lines);
        }
      }
      addLine('AI 설명은 해석이며 참고용입니다. 사실 판단은 근거 글과 연동 시스템이 알려 준 상태로 합니다.');
      addLine('AI 설명·제안만으로 보안 조치는 실행되지 않습니다.');

      addLine(`설명 확인 시각: ${textOr(checkedAt, '시각 정보 없음')}`);

      // 모든 확인을 통과한 뒤에만 성공 표식을 붙입니다.
      root.setAttribute('data-student-explanation-event', event.id);
      return root;
    },

        renderAction({
      status,
      event,
      actionId,
      target,
      receipt,
      observation,
      message,
      confirmationExpiresAt,
      error,
    } = {}) {
      const root = document.createElement('section');
      root.setAttribute('data-student-action', 'true');

      const title = document.createElement('h3');
      title.textContent = '학생 조치 상태 표시';
      root.appendChild(title);

      const addLine = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        root.appendChild(p);
      };

      const textOr = (value, fallback) =>
        typeof value === 'string' && value.trim().length > 0 ? value : fallback;

      const modeGuide = document.createElement('p');
      modeGuide.textContent =
        '제공 화면의 버튼(대상과 조치를 확인했으며 집행합니다 / 원천 결과만 재조회 / 조치 화면 취소)을 사용하세요. 이 학생 화면은 상태 표시만 합니다.';
      root.appendChild(modeGuide);

      // 상태별 기본 문구
      const statusLines = {
        idle: '상태: 아직 미실행(idle)',
        loading: '상태: 조치 준비 또는 결과 조회 중(loading)',
        prepared: '상태: 준비됨·미실행(prepared) · 사람 확인 후 집행 필요',
        executing: '상태: 서버에 전달 중(executing) · 결과가 아직 확인되지 않았습니다.',
        pending: '상태: 서버 접수·처리 중(pending) · ACK는 효과 확인이 아닙니다.',
        denied: '상태: 거절(denied)',
        failed: '상태: 실패(failed)',
        unknown: '상태: 결과 불명(unknown) · 성공/효과 없음으로 단정하지 말고 원천 결과만 재조회하세요.',
        expired: '상태: 확인 기한 지남(expired) · 다시 준비하세요.',
        error: '상태: 요청 처리 안 됨(error)',
      };

      const succeededObserved = status === 'succeeded' && observation?.effectApplied === true;
      if (succeededObserved) {
        addLine('상태: 효과 확인(succeeded)');
      } else if (status === 'succeeded') {
        addLine(
          '상태: 결과 불명(unknown) · succeeded 응답이라도 observation.effectApplied===true가 아니면 효과 확인으로 표시하지 않습니다.'
        );
      } else {
        addLine(statusLines[status] ?? `상태: 확인 불가(${textOr(status, '값 없음')})`);
      }

      // 상태별 부가 안내
      if (status === 'prepared') {
        addLine('안내: 아직 실행되지 않았습니다. 대상과 확인 기한을 읽고 제공 화면에서 사람 확인 후 집행하세요.');
      } else if (status === 'executing' || status === 'pending' || status === 'loading') {
        addLine('안내: 처리 진행 상태입니다. 완료/성공으로 해석하지 마세요.');
      } else if (status === 'unknown') {
        addLine('안내: 결과를 확인할 수 없습니다. 효과 없음이나 성공으로 판단하지 말고 결과만 다시 조회하세요.');
      } else if (status === 'expired') {
        addLine('안내: 기존 확인 의도는 만료되었습니다. 현재 사건으로 다시 준비하세요.');
      } else if (status === 'denied' || status === 'failed') {
        addLine(`안내: ${textOr(message, '원천 메시지 없음')}`);
      } else if (status === 'error') {
        addLine(`안내: ${textOr(error?.message, textOr(message, '오류 내용을 확인할 수 없습니다.'))}`);
      }

      // 현재 사건/근거/조치
      if (event?.id) addLine(`사건 ID: ${event.id}`);
      if (Array.isArray(event?.evidence) && event.evidence.length > 0) {
        const ids = event.evidence
          .map((row) => (typeof row?.id === 'string' && row.id.trim() ? row.id : null))
          .filter((id) => id !== null);
        if (ids.length > 0) {
          addLine(`근거 ID: ${ids.join(', ')}`);
        }
      }
      if (typeof actionId === 'string' && actionId.trim()) {
        addLine(`조치 ID: ${actionId}`);
      }

      // 실제 대상
      if (target && (target.id || target.generation !== undefined)) {
        addLine(`실제 대상 ID: ${textOr(target?.id, '확인 불가')}`);
        addLine(
          `대상 세대(generation): ${
            Number.isFinite(target?.generation) ? String(target.generation) : textOr(target?.generation, '확인 불가')
          }`
        );
      }

      // 확인 기한
      if (typeof confirmationExpiresAt === 'string' && confirmationExpiresAt.trim()) {
        addLine(`확인 기한: ${confirmationExpiresAt}`);
      }

      // 요청/접수
      if (receipt && typeof receipt === 'object') {
        if (typeof receipt.requestId === 'string' && receipt.requestId.trim()) {
          addLine(`요청 ID(requestId): ${receipt.requestId}`);
        }
        if (typeof receipt.receiptId === 'string' && receipt.receiptId.trim()) {
          addLine(`접수 ID(receiptId): ${receipt.receiptId}`);
        }
        if (receipt.version !== undefined && receipt.version !== null) {
          addLine(`버전(version): ${String(receipt.version)}`);
        }
      }

      // 효과 관측
      if (observation && typeof observation === 'object') {
        if (typeof observation.observedAt === 'string' && observation.observedAt.trim()) {
          addLine(`관측 시각(observedAt): ${observation.observedAt}`);
        }
        if (observation.effectApplied === true) {
          addLine('effectApplied: true');
        } else if (observation.effectApplied === false) {
          addLine('effectApplied: false');
        }
      }

      // 안전한 오류 출력
      if (status === 'error' && error && typeof error === 'object') {
        if (typeof error.code === 'string' && error.code.trim()) {
          addLine(`오류 코드: ${error.code}`);
        }
        if (typeof error.message === 'string' && error.message.trim()) {
          addLine(`오류 메시지: ${error.message}`);
        }
      }

      // 성공적으로 렌더링한 경우만 데이터 속성 부여(입력에 있는 값만)
      if (typeof event?.id === 'string' && event.id.trim()) {
        root.setAttribute('data-student-action-event', event.id);
      }
      if (typeof receipt?.requestId === 'string' && receipt.requestId.trim()) {
        root.setAttribute('data-student-action-request', receipt.requestId);
      }

      return root;
    },
  };
}
