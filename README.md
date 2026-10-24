# 내 보안 Agent 시작 틀 0.2.13

이 보안 Agent는 회사 직원이 자기 로그인 상태, 업무 앱 접속 결과, 최근 접속 기록과 보안 경보를 보는 보안 앱입니다. 13단계부터 22단계까지 이 프로젝트 하나로 화면을 채워 가며 완성합니다. 처음이라면 docs/GETTING_STARTED_STUDENT.md부터 읽습니다. 무엇을 왜 만드는지와 단계별 순서가 그 문서에 있습니다.

이 시작 틀을 받은 것만으로 단계를 통과하지 않습니다. 단계마다 docs/STUDENT_PROMPTS.md의 안내를 수업용 AI에 붙여 넣어 student/extension.mjs를 고치고, 화면에서 확인하고, 커밋한 뒤 ALEPH에 제출합니다. 제출하면 서버가 그 커밋의 코드를 받아 AI가 단계 과제 기준으로 읽고 판정합니다. 코드를 실행해서 판정하지 않습니다.

## 켜기

검수 환경은 Node.js 24.19.0이며 외부 npm 의존성이 없습니다. 이 폴더의 PowerShell에서 아래를 실행하고 PC 브라우저로 http://127.0.0.1:5189 를 엽니다. 자세한 켜기·끄기·다시 켜기는 docs/STUDENT_LAUNCH_GUIDE.md에 있습니다.

    powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1

npm start도 같은 서버를 켭니다. 기본 실행은 실제 회사 시스템(기존 엔진)에 연결되지 않은 상태입니다. npm run demo는 예제 자료로 화면을 보여 줄 뿐이며 실제 연결이나 성취가 아닙니다. npm run check는 student/extension.mjs의 문법만 확인합니다.

## 지킬 것

- 기존 1~3차 프로젝트와 학생 파일은 지우거나 덮어쓰지 않습니다. 새 폴더에서 시작하거나, 이미 하던 프로젝트를 이어 씁니다.
- AI 열쇠·비밀번호·토큰을 코드, 커밋, 캡처, 도움정보에 넣지 않습니다. 주소나 열쇠를 직접 입력하는 칸도 만들지 않습니다.
- .env.example에는 비밀 없는 설정만 있습니다.

## 더 읽을 곳

- 단계별 안내와 AI에 붙여 넣을 문장: docs/STUDENT_PROMPTS.md
- 단계별 확인 항목: docs/CURRICULUM.json, docs/IMPLEMENTATION_CONTRACT.md
- 오류 코드별 해결: docs/CONNECTION_TROUBLESHOOT.md
- 시작 틀 업데이트(내 파일 보존): docs/STARTER_UPDATE.md
- 실제 회사 시스템(SDP)·앱 안 AI 연결은 담당자가 따로 안내할 때만 씁니다: docs/SDP_HOST_CONNECTION.md, docs/AI_SETUP_GUIDE.md. 이 연결은 앱을 처음 켜고 13~16단계 화면을 만들거나 공식 AI 코드 판정을 받기 위한 전제 조건은 아닙니다. 다만 17단계 이후의 실제 연결과 새 환경 재현은 해당 단계의 기준에 따라 따로 확인합니다.

## 21단계 학생 안내 — 케셰브 실행 설명서·구성도

- **목적·기능**: 기존 작업을 보존하며 케셰브를 실행하고, 본인 로그인·기기·세션·업무 앱 접근 판정·접속/XDR 기록을 확인하는 방법을 설명합니다. AI 사건 설명은 별도 앱 권한이, 선택 OSV 조회는 별도 대상 프로젝트와 승인된 공개 패키지가 필요합니다. 조치는 기본 비활성이며 이번 단계에서 활성화·집행하지 않습니다.
- **구성**: 브라우저(`public/index.html`, `public/app.js`, 학생 `student/extension.mjs`) → 로컬 `src/server.mjs` → 접근 제어·XDR 엔진(`student/engine-adapter.mjs`, `src/engine/sdp-host.mjs`). AI는 별도 호스트·보관함·앱 권한·`vendor/clco-http.mjs`를 거쳐 AI 게이트웨이로 연결됩니다. 학생 화면은 상태 표시, 제공 코드는 요청·검증·취소·확인 티켓을 담당합니다. 이번 변경 함수는 없습니다.
- **지원 환경·버전**: 앱 `alekov-client-starter` **0.2.13**, Node.js 선언·수업 기준 **24.19.0**(실행 도구 허용 주 버전 22~24), Windows PowerShell 실행 도구 중심입니다. 학생 PC의 실제 Node·PowerShell·npm·Git·OS·브라우저 버전은 미확인입니다. macOS/Linux·원격·다중 사용자 배포를 보장하지 않습니다.
- **실행 위치·검증**: 현재 앱 파일은 저장소 루트에 있습니다. PC에서는 `package.json`·`src/server.mjs`·`tools/start-alekov.ps1`가 있는 앱 폴더와 실제 Git 최상위를 구분합니다. 외부 npm 의존성·lockfile이 없어 무조건 설치하거나 `npm ci`를 실행하지 않습니다. 기본 실행 도구는 개인 계정 연결 설정을 준비할 수 있지만 로그인·AI 승인 완료가 아닙니다. `npm start`는 이 자동 준비 경로와 다릅니다. HTTP 응답·예제·실제 연결·단계 통과도 별개입니다.
- **상세 안내**: [학생 실행 설명서와 글 구성도](docs/STUDENT_RUNBOOK.md)에 순차 실행·정상 신호·종료·재실행, 함수·입력 계약, 장애·차이·검증 표와 미확인 항목을 정리했습니다. 기존 제공 문서는 보존하며, 다른 폴더 전제나 과거 PASS 기록을 이번 확인으로 간주하지 않습니다.
- **21단계 제출**: 공식 안내상 「포털 제출 준비」는 13~20단계만 지원합니다. 21·22단계는 과제 화면에 저장소 주소와 실제 40자리 커밋을 직접 입력합니다. 비공개 공개 전환은 불필요하며, 원문 전달은 학생 문서의 공식 동선을 따릅니다. 서버 AI는 제출 소스를 읽고 문서 명령을 실행하지 않습니다. 실제 실행·제출·판정은 미확인입니다.
