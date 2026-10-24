# 케셰브 21단계 — 학생 실행 설명서와 글 구성도

## 1. 목적·범위·사실 확인 기준

다른 사람이 기존 작업을 보존하면서 실제 앱 폴더, 실행 명령, 상태와 담당 경계를 확인하는 문서입니다. 케셰브는 본인의 로그인·기기·세션, 업무 앱 접근 판정, 접속·XDR 기록을 표시하고, 별도 권한이 준비된 경우 AI 사건 설명을 요청합니다. 설치 패키지의 알려진 취약점 조회는 별도 대상 프로젝트에 대한 선택 기능입니다.

- 2026-10-24 현재 소스를 열람했습니다. 사전 조사 기준은 `08da065703691ccb2b21a0e15cc221c02a683afc`, 이번 열람 시작 HEAD는 `b2a902a3e102a9562eb785d83da71445c5934ec8`입니다. **둘 다 이번 문서의 제출 커밋을 뜻하지 않습니다.**
- 이번 변경은 이 학생 문서와 기존 내용을 보존한 [README](../README.md) 끝의 학생 안내뿐입니다. 변경 함수는 없습니다. 앞 단계 코드·Git 기록·제공 문서·인증·판정·설정은 유지합니다.
- `student/extension.mjs`는 학생 표시 영역, `student/engine-adapter.mjs`는 호스트 전달 경계입니다. 서버·브라우저 요청 제어·원천 검증·AI·조치·실행 도구는 제공 영역입니다. 현재 함수의 동작을 설명하는 것이 이번 단계에서 새 기능을 구현했다는 뜻은 아닙니다.
- 소스에 있는 기능, 과거 작성자의 검증 기록, 이번에 실행한 검사, 학생 PC에서 확인할 결과를 구분합니다. `demoEngine`을 읽은 것은 모의 실행이 아닙니다.
- 공식 21단계 범위는 서버 AI가 제출 커밋의 README·학생 문서·글 구성도·실행 파일·설정 견본을 함께 읽는 것입니다. **서버는 문서 명령이나 학생 코드를 실행하여 판정하지 않습니다.** 로컬 실행, 원문 전달, 서버 판정은 별도입니다.

## 2. 필요 프로그램·선언 버전·관측 버전

| 항목 | 소스에 선언된 기준·용도 | 학생 PC에서 실제 관측한 버전 |
|---|---|---|
| 앱 | `package.json`: `alekov-client-starter`, `0.2.13`, `type: module` | 설치본과 동일한지 미확인 |
| Node.js | `engines.node`: `24.19.0` 수업 기준. 실행 도구는 주 버전 22~24 허용 | 미확인 |
| Windows·PowerShell | `tools/start-alekov.ps1` 중심 실행. 내부 준비 도구는 Windows PowerShell 호출 | 정확한 OS·PowerShell 버전 미확인 |
| npm | 선택적 `npm start`, `npm run demo`, `npm run check` | 미확인 |
| Git | 작업 보존·Git 최상위·실제 커밋 확인 | 미확인 |
| 브라우저 | 로컬 주소에서 제공 화면과 학생 표시 확인 | 제품·정확한 버전 미확인 |

Windows PowerShell 실행 도구 중심의 범위입니다. 구체적인 OS·브라우저 지원 버전, macOS/Linux, 원격 접속·다중 사용자 배포는 미확인으로 지원을 보장하지 않습니다. 에이전트 검사 환경은 학생 PC가 아닙니다. 도구는 Node.js를 자동 설치하지 않습니다.

## 3. 실제 작업 위치와 순차 실행

### 3.1 폴더 찾기

아래는 **앱 폴더 기준 상대 경로**입니다. 이 저장소에서는 앱 파일이 Git 루트에 있지만, 학생 PC의 절대 경로는 모릅니다.

```text
앱 폴더/
├─ package.json
├─ .env.example
├─ README.md
├─ tools/start-alekov.ps1
├─ tools/prepare-native-host.ps1
├─ student/extension.mjs
├─ student/engine-adapter.mjs
├─ public/index.html
├─ public/app.js
├─ src/server.mjs
├─ src/engine.mjs
├─ src/engine/              SDP 호스트·설정 검증
├─ src/connection/          native 로그인·연결 관리
├─ src/ai/                  앱 권한·보관함·AI 서비스
├─ src/actions/             비활성 기본값의 조치 경계
├─ src/vulnerabilities/     프로젝트 검사·OSV
├─ vendor/clco-http.mjs
└─ docs/                   제공 문서 + 이 학생 문서
```

제공 [STUDENT_LAUNCH_GUIDE.md](STUDENT_LAUNCH_GUIDE.md)는 `on-client` 하위 앱과 부모 Git 루트를 전제합니다. **없는 `on-client` 폴더를 새로 만들거나 파일을 이동하지 않습니다.** `package.json`, `src/server.mjs`, `tools/start-alekov.ps1`가 있는 실제 폴더를 찾습니다.

1. 탐색기에서 그 앱 폴더를 열고 주소 표시줄에 `powershell`을 입력해 **새 창**을 엽니다. 기존 작업 창·실행 프로세스는 그대로 둡니다.
2. 아래 확인을 하나씩 수행하고 결과를 기록합니다. 경로 출력은 본인 PC에서만 확인하고 개인 절대 경로를 문서·채팅·제출에 복사하지 않습니다.

```powershell
Get-Location
Test-Path .\package.json
Test-Path .\src\server.mjs
Test-Path .\tools\start-alekov.ps1
git rev-parse --show-toplevel
```

세 `Test-Path`의 예상값은 `True`입니다. Git 최상위는 마지막 명령의 실제 결과로 판단합니다. 앱 폴더와 다르면 실행은 앱 폴더, 커밋·원문 준비는 Git 최상위에서 합니다. 경로가 다르거나 Git 오류가 나면 멈추고 위치부터 확인합니다.

### 3.2 설치 필요 여부 먼저 확인

같은 새 창에서 아래를 **한 줄씩** 확인합니다.

```powershell
node --version
$PSVersionTable.PSVersion
npm --version
git --version
```

브라우저·Windows 버전은 각 제품의 정보 화면에서 직접 기록합니다. Node가 없거나 도구 허용 범위 밖이면 수업 기준 `24.19.0` 설치가 필요한지 확인하고, 승인된 설치 후 새 PowerShell에서 다시 확인합니다. 이 문서는 설치를 실행하지 않습니다.

현재 `package.json`에 외부 npm 의존성 선언이 없고, 추적 트리에 lockfile·테스트 디렉터리가 없습니다. 따라서 무조건 `npm install`을 하거나, lockfile이 필요한 `npm ci`를 실행하지 않습니다. 문서 작성을 위해 의존성·lockfile·테스트 도구를 만들지 않습니다.

### 3.3 실행은 한 가지씩 선택

기본 일반 실행은 앱 폴더에서 다음 **하나**입니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1
```

실행 도구는 사용자 개인 폴더에 프로젝트별 native 계정 연결 설정을 준비하거나 검증된 기존 설정을 재사용할 수 있습니다. **설정 준비는 로그인·AI 승인 완료가 아닙니다.** `-ExecutionPolicy Bypass`는 이 호출에만 적용되며 전역 실행 정책을 바꾸지 않습니다.

계정 연결 설정의 자동 준비를 생략할 때만 기본 명령 **대신** 다음을 선택합니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1 -NoNativeHost
```

예제 자료만 볼 때는 앞 실행을 종료·확인한 뒤 다음으로 **대체**합니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1 -Demo
```

세 명령을 동시에 실행하는 절차가 아닙니다. `-Demo`는 실제 연결이 아니며 자동 계정 설정을 준비하지 않습니다. `-Demo`와 `-SdpHostConfig`는 함께 사용할 수 없고, `-NativeHostConfig`와 `-NoNativeHost`도 충돌합니다.

| 실행 도구 옵션 | 범위·주의 |
|---|---|
| `-Port` | 기본 5189, 1024~65535. 충돌 시 기존 프로세스를 종료하지 말고 다른 포트 선택 |
| `-Demo` / `-NoNativeHost` | 각각 예제 / native 자동 준비 생략. 실제 연결 성공을 만들지 않음 |
| `-NativeHostConfig` / `-SdpHostConfig` | 담당자가 확인한 프로젝트 밖 개인 설정의 실제 경로만 사용. 서로 다른 설정 계약이며 임의 생성·공유 금지 |
| `-WaitSeconds` | 기본 20초, 1~120초. HTTP 준비 대기이며 외부 연결 보장이 아님 |
| `-Background` | 선택 사항. 출력된 해당 실행 PID만 식별해 관리. 모든 `node` 강제 종료 금지 |

포트 5189가 이미 사용 중일 때만 기존 실행을 그대로 두고 다음처럼 바꿉니다.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1 -Port 5190
```

이 경우 브라우저 주소도 `http://127.0.0.1:5190/`입니다. 계정 미사용 확인이면 선택한 명령의 `-NoNativeHost`도 유지합니다.

`npm start`는 같은 `src/server.mjs`, `npm run demo`는 그 서버의 `--demo` 실행이지만, PowerShell 도구의 개인 native 설정 자동 준비 경로와 다릅니다. 실행 방식을 무심코 바꾸어 연결 결과가 같다고 가정하지 않습니다.

### 3.4 정상 시작 신호·화면·종료·재실행

기본 주소는 `http://127.0.0.1:5189/`입니다. 실행 도구가 출력하도록 작성된 두 줄은 다음과 같습니다. **이번에 실제 출력된 로그가 아니라 소스에서 확인한 예상 신호**입니다.

```text
케셰브가 켜졌습니다. 브라우저에서 http://127.0.0.1:5189/ 을 여세요.
서버가 응답한 것만 확인했습니다. AI 연결 상태는 화면에서 따로 확인해 주세요.
```

서버 자체 시작 로그는 `케셰브 연결 확인: http://127.0.0.1:5189` 또는 `케셰브 예제: http://127.0.0.1:5189`입니다(선택 포트에 따라 주소 변경). 도구의 HTTP 200 확인, 브라우저 렌더링, SDP 실제 연결, AI 권한·설명 성공, 단계 통과는 서로 다른 증거입니다.

1. 선택한 주소를 브라우저에서 열어 「보호 현황」·「업무 앱」·「보안 기록」을 확인합니다. `demo`는 예제, `disconnected`는 연결 없음, `unknown`은 확인 불가로 기록합니다.
2. 제공 종료 안내는 실행한 창의 `Ctrl+C`입니다. 종료 후 주소가 더 이상 응답하지 않는지 직접 확인합니다. 브라우저 캐시 화면이 남는 것만으로 실행 중이라고 판단하지 않습니다.
3. 종료 확인 후 같은 앱 폴더에서 선택한 명령을 다시 실행하고 같은 포트·정상 신호·화면을 재확인합니다. 이번 작업에서는 종료·재실행을 수행하지 않았습니다.
4. `-Background`를 선택했다면 해당 실행 도구가 출력한 PID를 확인한 뒤 그 프로세스만 작업 관리자에서 종료합니다. PID가 불명확하면 임의 종료하지 않습니다.

### 3.5 설정과 비밀 경계

`.env.example`에는 공개 가능한 `ON_PORT`, `ON_ENGINE_ADAPTER`, `ON_AI_MODEL`, `ON_PROJECT_DIRECTORY`, `ON_APPROVED_PUBLIC_PACKAGES` 견본이 있습니다. 서버는 `process.env`를 읽으며 `.env` 자동 로드 코드나 옵션이 없습니다. **파일을 복사·생성하는 것만으로 적용되지 않습니다.** 실행 도구는 `ON_PORT`를 지정하고 비밀로 보이는 환경변수를 제거하므로 직접 Node 실행과 환경 전달도 동일하다고 가정하지 않습니다.

현재 추적 트리에 `.gitignore`가 없습니다. `.env`나 비밀 파일이 자동 제외된다고 믿지 않습니다. 비밀 파일의 실제 Git 제외 여부를 확인하기 전 커밋·제출하지 않습니다. native/SDP 설정·자격은 호스트 계약대로 **프로젝트 밖 개인 경로·보관함**에 유지하고 `.env`로 옮기지 않습니다. 키·토큰·비밀번호·설정 원문·승인 링크를 요청하거나 출력·복사·문서화하지 않습니다.

## 4. 글로 쓴 시스템 구성도

아래 화살표는 요청 → 검증 결과 반환의 양방향 관계입니다. AI와 SDP는 별도 연결이며, 브라우저가 원천 인증이나 AI 키를 직접 보유하지 않습니다.

```text
브라우저: http://127.0.0.1:5189/
  public/index.html       제공 화면·필수 버튼
  public/app.js           요청·응답 검증·세대·취소·확인 티켓
  student/extension.mjs   검증 후 스냅샷 → 학생 상태 표시
        │ 로컬 HTTP 요청 / 본인 범위의 공개 결과·오류 ↑
        ▼
  src/server.mjs: createOnServer
  loopback 바인딩 / Host·Origin / 입력·본인 범위 검증
        ├─ 접근 제어·XDR 조회/판정
        │  src/engine.mjs → student/engine-adapter.mjs
        │    → src/engine/sdp-host.mjs → 접근 제어·XDR 원천
        │  ← 본인 신원·앱·판정·기록·기기·현재 연결, 검증된 coverage
        │
        ├─ 계정·앱 AI 연결（SDP와 별도）
        │  src/connection/native-context.mjs / native-login.mjs
        │  src/connection/manager.mjs
        │    ↔ 호스트 신원·프로젝트 밖 개인 보관함
        │  src/ai/app-authorization.mjs / vault-service.mjs / service.mjs
        │    → vendor/clco-http.mjs → AI 게이트웨이
        │  ← 모델 목록 점검 또는 사건 근거에 대한 검증된 설명·미실행 제안
        │
        ├─ 조치 경계: src/actions/（기본 비활성）
        │  준비 → 사람 확인 → 원천 집행 → 원천 결과·효과 관측
        │  이번 단계에서는 활성화·집행하지 않음
        │
        └─ 선택 OSV 가지: src/vulnerabilities/project-scan.mjs
           별도 대상 프로젝트의 lockfile·설치 메타데이터 검증
             → src/vulnerabilities/osv.mjs → OSV 공개 취약점 조회
           ← 승인된 공개 패키지 이름·버전의 알려진 취약점 결과
           미설정·미승인·검증 실패이면 조회 성공을 만들지 않음
```

서버는 `/student/extension.mjs`를 정적 제공하고 제공 UI가 이를 불러옵니다. 접근 판정 `{appId}`는 호스트에 전달하고, AI 설명 `{eventId}`는 서버가 본인 범위 사건·근거를 다시 읽어 검증한 후 전달합니다. AI 응답은 원천 판정이나 사건 기록을 수정하지 않습니다. 모델 목록 응답은 사건 설명·SDP 연결 성공이 아닙니다. AI 제안의 `executed:false`, `requiresHumanConfirmation:true`를 유지합니다. 운영 주소·개인 절대 경로·키·토큰·승인 링크는 이 구성도에 넣지 않습니다.

## 5. 함수·입력·담당 경계

표의 **소스 확인**은 구현을 읽었다는 뜻이며 실행 검증이 아닙니다. 이번 수정 함수는 모두 **없음**입니다.

| 파일·함수 | 입력 | 담당 경계·소스에서 확인한 동작 | 이번 실행 확인 |
|---|---|---|---|
| `student/extension.mjs` · `createStudentView()` | 제공 UI의 `{api,onChange}` | 아래 8개 hook 반환. DOM 또는 text 반환 계약, 현재 DOM 구성은 `createElement`·`textContent`, label·button 사용 | 미확인 |
| `renderIdentity({me,devices,sessions})` | 세 자료의 snapshot | 본인 계정·기기·세션 표시. 실패를 임의 로그인 성공으로 대체하지 않음 | 미확인 |
| `renderDecision({status,mode,data,error,appId})` | 선택 앱·판정 snapshot | `allow/deny/challenge/unknown`과 요청 실패 구분 | 미확인 |
| `renderEvents({status,mode,data,error})` | 사건 snapshot | 접속·XDR 기록, 근거·규칙·상태 표시 | 미확인 |
| `renderStatus({devices,sessions,notifications,diagnostics,mode})` | 상태·진단 snapshot | 기기·세션·알림·도움정보 표시, 학생 「도움정보 복사」 | 미확인 |
| `renderVulnerabilities({status,mode,data,error})` | 패키지 조회 snapshot | 전체 조회 상태와 패키지별 상태·ID·출처·시각 구분 | 미확인 |
| `renderAiConnection({status,mode,data,error,checkedAt,explanationAccepted})` | 모델 점검 snapshot | 점검과 사건 설명 분리. 제공 UI는 `explanationAccepted:false` 전달 | 미확인 |
| `renderExplanation({event,explanation,checkedAt})` | 사건·설명 snapshot | 근거·제안 형식 검증, 오류 시 기존 기록 보존 | 미확인 |
| `renderAction({status,event,actionId,target,receipt,observation,message,confirmationExpiresAt,error})` | 조치 상태 | 상태 표시만 수행. 확인 티켓 생성·집행 담당 아님 | 미확인 |
| `public/app.js` · `snapshot`, `studentData`, `renderStudent` | 검증된 resource·kind | hook에 상태 전달, 요청·검증·세대·취소·필수 버튼·티켓은 제공 코드 담당 | 소스 확인만 |
| `student/engine-adapter.mjs` · `createEngine(host)` | `projectId`, `readIdentity/readApps/decideAccess` 필수 host | host가 제공한 `readEvents/readDevices/readSessions`만 선택 전달. 비밀 전달 금지, default는 `disconnected` | 소스 확인만 |
| `src/engine.mjs` · `loadEngine`, `engineMethod`, `demoEngine` | adapter·메서드·예제 선택 | 명시된 엔진 로드, 미연결을 가짜 성공·빈 목록으로 대체하지 않음. 예제는 실제 연결 아님 | 모의 실행 미실행 |
| `src/engine/sdp-host.mjs` · `readEvents/readDevices/readSessions` | 본인 scope·options | 신원·프로젝트·세대·기한·취소·coverage 검증 후 본인 범위 전달 | 실제 SDP 미확인 |
| `src/server.mjs` · `createOnServer` | 엔진·연결·AI·조치·scanner 구성 | loopback·Host/Origin·입력·본인 범위·결과 검증, 비밀 비공개 | 서버 실행 미실행 |
| `src/connection/manager.mjs` · `createConnectionManager` | 호스트 연결 구성·연결 ID | 앱 연결 시작·확인·상태·취소 관리. 설정 존재와 승인 완료 구분 | 실제 계정 연결 미확인 |
| `src/ai/service.mjs`, `vault-service.mjs`, `app-authorization.mjs` | 본인 사건·앱 권한·보관함 | 모델·권한·응답 검증 후 공개 결과만 전달, 유료 자동 재시도 금지 | 실제 AI 미확인 |
| `src/vulnerabilities/project-scan.mjs` · `createProjectScanner` | 절대 `projectDirectory`, `approvedPublicPackages`, client | 아래 검증 순서 후 승인 공개 패키지만 OSV 조회 | 실제 OSV 미실행 |

### 5.1 스냅샷·상태 노출

공통 snapshot은 `{status,mode,data 또는 error}`입니다. `public/app.js`의 `snapshot`은 `status==='ok'`일 때만 `data`, `status==='error'`일 때만 공개 `error.code/message`를 전달합니다. `idle`은 미요청, `loading`은 요청 중이며 이전 성공 데이터를 현재 결과처럼 노출하지 않습니다. 복제 실패 시 `status/mode`만 남을 수 있습니다. `connected`는 검증 경로의 모드이지 모든 기능 성공이 아니며, `demo`·`disconnected`·`unknown`을 정상 연결로 바꾸지 않습니다. 현재 함수명·API 상태값·`data-*`·필수 버튼 문구는 그대로 보존합니다.

### 5.2 HTTP 입력 계약

| 메서드·경로 | 입력·의미 |
|---|---|
| GET `/api/me`, `/api/apps`, `/api/events`, `/api/devices`, `/api/sessions` | 서버가 확인한 본인 범위 조회. 브라우저가 타인 scope 지정 불가 |
| POST `/api/access` | `{appId}` · 앱 접근 판정, HTTP 실패와 `deny` 구분 |
| GET `/api/diagnostics` | 비밀 없는 도움정보 |
| GET `/api/vulnerabilities` | 서버에 설정된 대상 프로젝트 검사. 브라우저가 경로·승인 목록 확장 불가 |
| POST `/api/ai/check` | `{}` · 모델 목록·앱 권한 점검, 생성 모델 설명 요청 아님 |
| POST `/api/ai/explain` | `{eventId}` · 서버가 사건을 다시 검증하여 설명 요청 |
| POST `/api/ai/connect/start` | `{}` · 앱 연결 시작 |
| POST `/api/ai/connect/finish`, `/status`, `/cancel` | 각각 `/api/ai/connect/` 아래 경로, `{connectionId}` · 확인 접수·조회·취소. 확인 중 취소는 결과 불명일 수 있음 |
| POST `/api/actions/prepare` | `{eventId,actionId}` · 원천 조치 준비, 아직 집행 아님 |
| POST `/api/actions/execute` | `{requestId,confirmationId}` · 확인 티켓 검증 후 집행 |
| POST `/api/actions/result` | `{requestId}` · 원천 결과만 조회, 재집행 아님 |

계약 문서의 공통 응답은 `{ok:true,data,meta:{mode,checkedAt}}` 또는 `{ok:false,error:{code,message,retryable},meta:{mode,checkedAt}}`입니다. 현재 `src/server.mjs`의 `send`는 `meta()`를 추가하며 직접 작성하는 AI JSON 응답도 `meta`를 포함합니다. 정적 파일 응답은 이 JSON 계약이 아닙니다. 사전 조사의 “경로에 따라 API meta 누락”은 이번 소스 열람으로 재확인되지 않았습니다. 제공 브라우저 `normalizeMeta`는 누락·잘못된 값을 `unknown`으로 처리하며 네트워크 등 로컬 실패도 확인 불가로 남깁니다. 이 방어 처리를 서버의 실제 누락 증거로 혼동하거나 문서에서 임의 정상화하지 않습니다.

### 5.3 조치 상태와 효과 확인

기본 조치는 비활성입니다. 서버 CLI에서 `--alekov-actions`, `--alekov-actions-config`와 native/SDP 설정이 모두 필요합니다. 제공 실행 도구는 조치 활성 옵션을 전달하지 않습니다. **21단계에서는 활성화 명령을 생성·실행하거나 조치를 집행하지 않습니다.**

| `renderAction` 상태 | 해석 |
|---|---|
| `idle` / `loading` | 미준비 / 준비·조회 중 |
| `prepared` | 대상·기한·조치 확인 대기, 미집행 |
| `executing` | 사람 확인 후 전달 중, 완료 아님 |
| `pending` | 원천 접수 ACK·대기, 효과 확인 아님 |
| `denied` / `failed` | 거부 / 실패. 성공으로 바꾸지 않음 |
| `unknown` | 결과 불명. 재집행하지 말고 「원천 결과만 재조회」 |
| `expired` / `error` | 확인 기한 만료 / 오류 |
| `succeeded` | `observation.effectApplied===true`일 때만 실제 효과 확인. 접수나 상태 이름만으로 효과 단정 금지 |

「조치 화면 취소」는 화면 취소이며 원천 집행의 철회를 보장하지 않습니다.

### 5.4 취약점 검사 순서

1. `ON_PROJECT_DIRECTORY`가 절대 경로인지 확인합니다. 미설정·상대 경로는 `not_configured` / `PROJECT_NOT_CONFIGURED`입니다.
2. **별도 대상 프로젝트**의 `package-lock.json` v2/3과 경로·일반 파일·변경 여부를 검증합니다. 이 앱 자체에 lockfile이 없다는 사실과 혼동하지 않습니다.
3. 승인된 공개 패키지를 선별합니다. 검증된 lock에서 승인 대상이 없으면 `not_checked` / `NO_APPROVED_PACKAGES`이며 OSV 요청하지 않습니다. lock 검증이 먼저이므로 깨진 lock을 이 상태로 우회하지 않습니다.
4. 설치된 각 패키지의 `package.json` 이름·버전·공개 여부와 파일 snapshot을 확인한 대상만 조회합니다. 비공개·미승인 패키지를 승인 목록에 임의 추가하지 않습니다.
5. OSV 응답과 조회 후 파일 상태를 다시 검증합니다. 전체 `complete`는 조회 범위의 검증 완료이지 안전 보장이 아닙니다. `partial`은 일부 확인 불가, `unverifiable` / `LOCKFILE_UNVERIFIABLE`은 선별 전 lock·파일 등 검증 불가입니다. 선별 후 중단·변경은 받은 취약점 ID를 보존하더라도 정상·최신 주장 없이 `partial`이 될 수 있습니다.
6. 패키지별 `known_vulnerabilities`는 알려진 항목 있음, `none_found`는 해당 조회 범위에서 알려진 항목 없음, `unverifiable`은 확인 불가입니다. `none_found`는 앱 전체 안전 보장이 아닙니다.

이번 문서 작성을 위해 패키지 설치·lockfile 생성·OSV 실제 요청은 하지 않습니다.

## 6. 장애별 확인 순서와 복구

공통 순서는 **화면의 공개 코드·상태 기록 → 아래 담당 파일과 계약 대조 → 안전한 원인 확인 → 필요한 경우 담당자 확인 후 수동 재확인**입니다. 기존 기록·자격·파일을 지우거나 인증을 우회하지 않습니다. 비밀이 있을 수 있는 콘솔·설정 원문을 통째로 공유하지 않습니다.

| 증상·코드 | 근거 파일 | 확인 순서 | 복구·금지 사항 |
|---|---|---|---|
| 앱 폴더 아님·파일 없음 | `tools/start-alekov.ps1` | 세 파일 존재 → 실제 앱 위치 → Git 최상위 구분 | 실제 앱 폴더에서 다시 열기. 가짜 `on-client` 생성·기존 파일 이동 금지 |
| Node 없음·버전 범위 밖 | `package.json`, 실행 도구 | 새 창 `node --version` → 주 버전 22~24 → 수업 기준 24.19.0 대조 | 필요 설치는 사용자 확인 후 수행. 자동 설치했다고 쓰지 않음 |
| 포트 사용 중·시작 대기 초과 | 실행 도구 | 현재 포트 → 해당 실행 로그 → 선택 주소 | 기존 프로세스 보존, `-Port 5190`처럼 다른 포트와 주소 일치. 전체 node 종료 금지 |
| `NETWORK_ERROR` | `public/app.js` · `request` | 서버 창 → 실행 중 주소·포트 → 브라우저 로컬 연결 | 원인 확인 후 수동 다시 불러오기. AI 인증 실패로 단정하지 않음 |
| `ENGINE_NOT_CONNECTED` | `src/engine.mjs`, adapter | `demo/disconnected` 여부 → 명시된 호스트 유무 | 담당자의 실제 연결 준비 확인. 가짜 신원·빈 성공 목록 금지 |
| `ENGINE_RESULT_UNVERIFIED` | `src/server.mjs`, `src/engine/sdp-host.mjs` | 응답 형식 → coverage → 시각·세대 → 원천 오류 | 검증 계약은 그대로 유지. 담당자와 공개 코드로 확인, 정상 결과로 치환 금지 |
| `ENGINE_TIMEOUT` | `src/server.mjs`, SDP host | 서버/원천 응답 시간 → 취소 여부 → 현재 연결 상태 | 원인 확인 후 필요한 조회만 수동 요청. 타임아웃을 접근 거부나 성공으로 해석하지 않음 |
| `SUBJECT_SCOPE_UNVERIFIED` | 서버, SDP host, AI 서비스 | 현재 본인·프로젝트·세션 → 사건 귀속 → 세대·신원 매핑 | 담당자 확인. 타인 scope·운영자 권한으로 우회 금지 |
| `CONTRACT_MISMATCH`·meta 확인 불가 | `public/app.js` · `normalizeMeta`, 응답 검증; 서버 `send` | JSON·자료 형식 → mode·checkedAt → 현재 요청 세대 | 누락 meta는 `unknown`, 자료 계약 위반은 확인 불가. 둘이 항상 같은 오류인 것은 아님. 코드 수정·임의 기본 성공값 금지 |
| `NATIVE_HOST_DISABLED` | `src/server.mjs`, `src/connection/native-context.mjs` | `-NoNativeHost`·직접 npm 실행 여부 → 호스트 준비 여부 | 계정 미사용 실행이면 예상된 미연결. 필요 시 기본 도구·담당자 안내 확인. 비밀 복사 금지 |
| `ON_AI_PROVISIONING_PENDING`, `WB_CLCO_AUTH_REQUIRED`, `WB_CLCO_ACCESS_BLOCKED` | `src/ai/service.mjs`, `app-authorization.mjs`, `public/app.js` | 앱 전용 연결 → 본인 신원 → 앱 승인·제한 | 담당자 권한 확인. Workbench 자격 복사·인증 우회 금지 |
| `WB_CLCO_SESSION_CLOSED`, `WB_CLCO_COHORT_BUDGET_EXHAUSTED`, `WB_CLCO_LIMIT_REACHED` | AI 서비스, `vendor/clco-http.mjs` | 이용 시간 → 반 사용량·앱 한도 | 담당자 확인. 유료 자동 재시도 금지 |
| `WB_CLCO_RATE_LIMITED`, `WB_CLCO_TIMEOUT`, `REQUEST_TIMEOUT`, `TIMEOUT` | AI 서비스, HTTP client, 제공 UI | 제한·시간 초과 구분 → 취소 여부 → 현재 상태 | 필요성을 확인한 사용자만 나중에 직접 요청. 자동 반복·성공 추측 금지 |
| `MODEL_NOT_CONFIGURED`, `ON_AI_MODEL_LIST_EMPTY`, `ON_AI_AUTHORIZATION_CHANGED` | AI 서비스·권한 검증 | 모델 지정 → 허용 모델 → 점검 중 권한 변경 | 담당자 확인 후 연결 점검. 모델 목록과 사건 설명을 분리 |
| `ON_AI_INVALID_INPUT`, `ON_AI_INVALID_OUTPUT`, `AI_REQUEST_UNVERIFIED` | AI 서비스, 제공 UI, 학생 `renderExplanation` | 사건·근거·규칙 → 참조 ID·제안 형식 → 현재 요청 | 검증되지 않은 설명 사용 금지. 기존 기록은 유지하며 AI 실패를 과제 실패로 단정하지 않음 |
| `CANCELLED`, `WB_CLCO_CANCELLED`, `REQUEST_CANCELLED` | 제공 UI·서버·HTTP client | 현재 요청 취소 → 세대 변경 → 이전 결과 여부 | 이전 응답을 현재 결과로 표시하지 않음. 연결 확인 중 취소는 발급 여부 불명일 수 있어 자동 재발급 금지 |
| OSV `not_configured/not_checked/unverifiable/partial` | `src/vulnerabilities/project-scan.mjs`, `osv.mjs` | 절대 대상 경로 → lock 검증 → 승인 대상 → 설치 버전 → OSV·재검증 | 5.4절 순서 유지. 이 앱에 lock을 임의 생성하지 않음. 받은 ID는 보존하되 안전 보장 금지 |
| `ACTION_UNSUPPORTED` | `src/server.mjs`, `src/actions/` | 기본 비활성 여부 → 제공 도구의 옵션 범위 | 21단계에서는 활성화하지 않음. 미지원은 성공 아님 |
| 조치 `pending/unknown/expired` | 제공 UI `renderAction`, 학생 hook, 조치 서비스 | 접수·효과 구분 → 확인 기한 → 원천 관측 | `unknown`은 재집행 금지·원천 결과만 재조회. `succeeded`도 효과 관측 필수 |

### 6.1 버튼 이름 대조

| 실제 화면·파일 | 그대로 확인할 문구 | 의미·주의 |
|---|---|---|
| `public/index.html` | 「보호 현황」「업무 앱」「보안 기록」「다시 불러오기」 | 탭·현재 자료 갱신. 단계 통과 버튼 아님 |
| 제공 도움정보 | 「도움정보 불러오기」→ 내용 확인 →「확인했으며 복사합니다」 | 확인 후 복사. AI 연결 도움정보에도 제공 복사 버튼이 있음 |
| `student/extension.mjs` · `renderStatus` | 「도움정보 복사」 | 학생 표시 영역의 버튼. 제공 복사 버튼과 혼동 금지 |
| 제공 패키지·AI 점검 | 「설치 패키지 조회」「AI 연결 점검」 | 외부 조회 가능. 이번 작업에서는 누르지 않음 |
| `public/app.js` 사건별 버튼 | 「AI 설명 요청」 | 유료 모델 요청 가능. 이번 작업에서는 누르지 않음 |
| 제공 조치 영역 | 「대상과 조치를 확인했으며 집행합니다」「원천 결과만 재조회」「조치 화면 취소」 | 집행·조회·화면 취소는 별개. 이번 단계는 조치 실행하지 않음 |

### 6.2 제공 문서·사전 조사와 현재 소스 차이

기존 문서는 수정·삭제하지 않습니다. 현재 기능 설명은 소스에, 이번 제출 동선은 사용자가 제공한 공식 21단계 안내에 맞춥니다.

| 항목 | 제공 설명·사전 조사 | 현재 확인과 적용 |
|---|---|---|
| 폴더 | `STUDENT_LAUNCH_GUIDE.md`는 `on-client`와 부모 Git 루트 전제 | 현재 앱은 저장소 루트. 실제 파일과 `git rev-parse --show-toplevel`로 구분 |
| Node | 실행 도구는 22~24, package는 24.19.0 | 허용 범위와 수업 지정 버전을 별도 표기, 설치 버전은 미확인 |
| 테스트·lock | 다른 제공 문서의 검사·환경 기록 | 현재 추적 트리에는 lockfile·테스트 기반 없음. 존재하지 않는 명령 사용 금지 |
| SDP 조회 | `SDP_HOST_CONNECTION.md` 48·56행은 세 경로만, 기록·기기·세션 미제공으로 설명 | 현재 `sdp-host.mjs`에는 세 조회 존재. `SDP_HOST_OBSERVATION.md`와 현재 코드 참조. AI 연결은 여전히 별도 |
| meta | 계약은 공통 meta, 사전 조사는 경로별 누락 가능 설명 | 이번 서버 JSON `send`와 AI 직접 JSON에는 meta 있음. 브라우저 `unknown` 처리는 누락 관측 증거 아님 |
| 과거 PASS/NOT_RUN | `SDP_HOST_OBSERVATION.md` 등의 작성자 기록 | 과거 기록이며 이번 실행·학생 PC·운영 검증으로 전용하지 않음 |
| 제출 | 제공 실행 안내의 포털 제출 준비·21/22 미확정 설명 | 이번 공식 안내는 13~20 포털 준비, 21/22 저장소 주소·실제 40자리 커밋 직접 입력. 아래 9절 적용 |

## 7. 이번 검증 기록

| 구분 | 이번 수행·명령·결과 |
|---|---|
| 소스 열람 | 2026-10-24 package·실행 도구·학생 hooks·제공 UI·서버·엔진·SDP·AI·조치·scanner·설정 견본·관련 문서 열람. 실행 계약과 차이 확인 |
| 작업 보존 | 열람 시작 시 `git status --short`, `git diff --cached --stat`: 출력 없음. 기존 staged·작업 변경 없음 |
| 파일·경로 정적 대조 | `python -` 표준입력 assertion 검사: 상대 링크 3개·소스 경로 18개 존재, 버튼 문구 13개·hook 8개·조치 상태 11개 소스 대조, 코드 블록 닫힘·기존 README prefix 보존 모두 PASS. 파일 경로·스크립트 명령은 열람으로도 대조. runtime 실행 아님 |
| 공백 오류 검사 | `git diff --check`: 추적 변경 PASS. 새 문서 포함 최종 staged diff도 확인하며, 렌더링·기능 검사와 구분 |
| 구문 검사 | 이번 작업에서는 미실행. `npm run check`는 `node --check student/extension.mjs`만 수행하며 렌더링·연결·단계 통과 검사가 아님 |
| 모의 데이터 | 미실행. `demoEngine` 소스 열람만 수행 |
| 실제 브라우저 | 미확인. 로컬 화면·키보드 조작·도움정보 복사 확인 안 함 |
| 실제 Windows 실행 | 미확인. PowerShell 시작·HTTP 응답·종료·재실행·Background 확인 안 함 |
| 실제 SDP | 미확인. 실제 신원·앱 판정·기록·기기·세션 조회 안 함 |
| 실제 AI | 미확인. 계정 승인·모델 목록·사건 설명·유료 요청 안 함 |
| 실제 OSV | 미실행. 패키지 설치·lock 생성·외부 취약점 조회 안 함 |
| 보안 조치 | 미실행. 활성화·준비·집행·결과 조회 안 함 |
| 제출·원문 전달 | 미실행. 제출 SHA·JSON·접수 결과를 만들어 내지 않음 |
| 서버 AI 판정 | 미확인. 원문 전달 성공이나 로컬 검사만으로 통과 주장 금지 |

문서만 변경하므로 기존 테스트를 추가·삭제하거나 별도 테스트 도구를 설치하지 않습니다.

## 8. 사용자가 직접 확인할 순서

**체크 하나씩 진행하고, 결과를 기록하기 전 완료 처리하지 않습니다.** 이 목록은 아직 모두 미확인입니다. 경로·비밀이 아닌 “파일 존재 여부·버전·공개 코드·상태”만 공유합니다.

### 확인 1 — 기존 작업을 보존한 새 PowerShell 실행

- [ ] 첫 작업: 기존 창과 파일을 그대로 두고, 세 실행 파일이 있는 실제 앱 폴더를 탐색기로 찾아 새 PowerShell 창을 엽니다. 아직 명령을 실행하지 않고 창을 연 사실만 기록합니다.
- [ ] 첫 결과 확인 후 3.1절 위치·파일·Git 최상위를 한 명령씩 확인합니다.
- [ ] 위치 결과 확인 후 3.2절 프로그램·버전을 한 항목씩 기록하고 설치 필요 여부를 판단합니다.
- [ ] 앞 결과 확인 후 3.3절에서 목적에 맞는 실행 명령 하나만 선택해 실행합니다. 계정 자동 준비 유무도 기록합니다.
- [ ] 시작 신호와 주소·포트 확인 후 브라우저의 기존 탭과 `demo/disconnected/unknown` 등 실제 상태를 기록합니다. HTTP 응답과 SDP·AI 성공을 구분합니다.
- [ ] 확인 후 실행 창에서 종료하고 응답 종료 여부를 기록합니다. 그 뒤 같은 명령으로 재실행한 결과를 별도 기록합니다.

### 확인 2 — 경로·명령·버튼 대조

- [ ] 확인 1의 기록을 검토한 뒤 폴더 구조·파일 이름·스크립트·선택 포트와 주소를 대조합니다.
- [ ] 제공 영역과 학생 영역을 구분하고 6.1절 버튼 이름이 실제 화면과 같은지 하나씩 확인합니다. 문구 확인을 위해 유료 AI·OSV·조치 버튼을 누르지 않습니다.
- [ ] 공개 도움정보를 읽고 복사 기능을 확인할 경우 두 종류 복사 버튼을 구분합니다. 비밀·개인 경로가 없는지 먼저 확인합니다.
- [ ] 문서의 계약·장애·검증 표와 실제 결과를 대조합니다. 확인하지 못한 항목은 미확인으로 남깁니다.

결과 기록 형식: `확인 항목 / 선택한 명령 또는 화면 / 비밀 없는 관측 결과 / 확인·미확인 / 다음 확인`. 이 문서에는 학생 결과를 미리 채우지 않았습니다.

## 9. 최종 커밋·원문·제출 안내

아래 제출 규칙은 사용자가 제공한 공식 안내에 따른 것이며, 이번 작업에서 제출을 실행했다는 뜻이 아닙니다.

### 9.1 대상 파일만 같은 커밋에 저장

1. Git 최상위에서 기존 작업·staged를 **먼저** 확인합니다. `git diff`에 비밀이 포함될 수 있으므로 본인 PC에서만 검토하고 원문을 공유하지 않습니다.

   ```powershell
   git status --short
   git diff --cached --name-only
   git diff --cached
   git diff
   ```

2. 이미 staged 변경이 있으면 일괄 commit하지 말고 **멈춰 내용을 확인**합니다. 다른 변경을 임의 unstage·삭제·덮어쓰기하지 않습니다. 이번 두 파일과 기존 변경이 섞여 있으면 분리 방법부터 사용자와 확인합니다.
3. 비밀·개인 설정이 Git에서 실제 제외되는지 확인합니다. `.gitignore`가 없으므로 `.env` 자동 제외를 가정하지 않습니다. 제외 확인 전 커밋·제출 금지입니다.
4. 실제 Git 상대 경로를 확인한 후 **대상 파일만** stage합니다. `git add .`는 사용하지 않습니다. 앱 폴더가 Git 최상위인 현재 구조에서만 다음 경로가 맞습니다. 하위 앱 구조라면 확인한 실제 상대 경로를 사용하며 추측하지 않습니다.

   ```powershell
   git add -- README.md docs/STUDENT_RUNBOOK.md
   git diff --cached --name-only
   git diff --cached
   ```

5. staged가 의도한 두 문서뿐인지, 기존 README가 보존됐는지, 비밀·다른 변경이 없는지 확인한 후 문서 전용 **한 커밋**으로 저장합니다. 학생 문서와 이번 단계 변경을 같은 커밋으로 묶는 규칙입니다. 이번 단계는 runtime 코드 변경이 필요 없으므로 형식상 함수·코드 변경을 만들지 않습니다.
6. 저장 후 실제 `git rev-parse HEAD` 결과와 `git status --short`를 확인합니다. **제출할 실제 40자리 커밋**은 그때 확인합니다. 조사 SHA나 예시 값을 대신 입력하지 않습니다.

### 9.2 21단계 제출과 비공개 원문

1. 방어전 상황실 **4차 탭의 PowerShell 커밋 안내는 13~22단계**를 받습니다. Workbench **「포털 제출 준비」는 13~20단계만** 지원합니다. **21·22단계는 과제 화면에 저장소 주소와 실제 40자리 커밋을 직접 입력**합니다. 비공개 저장소를 공개로 바꿀 필요는 없습니다.
2. 비공개 커밋은 같은 단계의 **「비공개 저장소 원문 준비 방법」**을 펼쳐 **「원문 전달 도구 받기」**로 ZIP을 받습니다. **프로젝트 밖**에 압축을 해제하고, JSON을 저장할 **프로젝트 밖 새 폴더도 미리** 만듭니다.
3. 제출할 프로젝트의 **Git 최상위**에서 PowerShell을 열고 화면에 안내된 `student-source-cli.mjs` 명령을 사용합니다. 도구·출력 경로는 본인 PC의 실제 경로로, `--commit` 뒤는 제출할 실제 40자리 커밋으로 바꿉니다. **구체 명령·나머지 옵션은 과제 화면과 실제 경로를 확인하기 전 추측하지 않습니다.**
4. 도구는 **커밋된 원문만 묶으며 학생 코드를 실행하거나 업로드하지 않습니다.** 생성 JSON을 같은 단계의 **「비공개 저장소 원문 묶음」**에서 선택합니다.
5. 저장소·커밋·단계를 다시 확인한 뒤 사용자가 제출합니다. 원문 전달 완료와 AI 검토 통과는 다르므로 서버 상태·판정 설명을 확인합니다. 원문 전달만 실패하면 **기존 접수를 유지하고 「원문만 다시 보내기」**를 사용합니다.

이번 문서 작업은 실제 제출·유료 AI 요청·보안 조치를 수행하지 않으며 비밀을 요구·출력하지 않습니다. 다음 작업은 **8절 확인 1의 첫 작업 하나**이고, 그 결과를 확인하기 전 다음 체크로 진행하지 않습니다.
