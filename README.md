# 소비 코치 (MVP)

지출을 간단히 기록하고, 자연어로 한 번에 입력하면 자동 분류/요약해 보여주는 프로젝트입니다. 학습한 내용을 실전에 적용하기 위해 구조를 최대한 모듈화하고, 코드 흐름을 간결하게 유지했습니다.

## 아키텍처 한눈에 보기
- 상태 관리: React Query 단일 소스 (localStorage mock 기반)
- 라우팅: React Router
- 날짜 처리: date-fns (월 범위 계산 등)
- 스타일: 전역 토큰(index.css) + 기능별 CSS
- 네이밍: boolean은 `is~`, 변수/매개변수는 역할 중심 이름

## 라우트
- `/` 대시보드
- `/add` 지출 입력(폼/자연어)
- `/analysis` 분석 결과(저장 후 반영)
- `/history` 내역(필터/정렬/가져오기/내보내기/삭제)
- `/board` 월별 보드(월별 그룹+합계)
- `/report` AI 리포트(월별/카테고리 평균/텍스트)

## 폴더 구조(기능 기준)
```
src/
  components/
    Nav.jsx
    nav.css
  features/
    add/        AddExpense.jsx, add.css
    analysis/   AnalysisResult.jsx, analysis.css
    dashboard/  Dashboard.jsx, dashboard.css
    history/    History.jsx, history.css
    board/      Board.jsx, board.css
    report/     AIReport.jsx, report.css
  # 아래 pages/는 초기(레거시) 샘플입니다. 앱은 features/* 만 사용합니다.
  # 필요 시 삭제하거나 _legacy/ 로 이동하세요.
  pages/        (legacy)
  hooks/
    useMonthlySummary.js
    useTextParser.js
  queries/
    useExpensesQuery.js
  services/
    expensesLocal.js     # React Query가 사용하는 로컬 mock
  utils/
    categories.js
    format.js
    parser.js
    dateRange.js
    sort.js
  App.jsx, main.jsx, index.css
```

## 데이터 모델
```
Expense {
  id: string
  date: string (YYYY-MM-DD)
  amount: number
  memo: string
  category: string
  isFixed: boolean   # 고정비 여부
}
```

## 핵심 흐름
- Add (폼)
  - 입력 → `useAddExpenseMutation()`으로 저장 → 대시보드/내역 즉시 반영
- Add (자연어)
  - 문자열 → `parseExpensesFromText()` → `/analysis`로 전달 → “저장하기”로 일괄 저장(`useAddManyExpensesMutation()`)
- Dashboard
  - `useExpensesQuery()`로 목록 가져와 `useMonthlySummary()`로 합계/전월대비/카테고리 합계 표시
- History
  - `useExpensesQuery()` 읽기 + 필터/정렬(`dateRange`, `sortBy`) + 가져오기/삭제는 뮤테이션
- Report
  - 최근 월별 합계/카테고리 월평균 계산 후 간단 텍스트 리포트 표시

## 설치/실행
```
npm install
npm run dev
```
- Local URL로 접속 (터미널 출력 확인)

## 코드 스타일 가이드
- boolean: `isFixed`, `isLoading` 등 `is~`
- 변수/매개변수: 역할 중심(`expenseList`, `naturalText`, `chosenCategory` 등)
- UI: 전역 토큰(index.css) + 기능 폴더 CSS에서 레이아웃/간격만 관리

## 나중에 서버로 전환하기
- 현재는 `services/expensesLocal.js`(localStorage mock)를 사용
- 서버 전환 시
  - `services/expensesLocal.js`를 실제 API 클라이언트로 교체
  - `useExpensesQuery()`/뮤테이션의 내부 fetcher만 변경(컴포넌트는 그대로)
  - 쿼리 키/무효화 전략 유지 가능

## 참고
- 자연어 파서: `utils/parser.js` (간단 규칙 기반)
- 카테고리 추정: `utils/categories.js`

## 레거시 정리
- 현재 라우팅과 기능은 모두 `features/*` 컴포넌트만 사용합니다.
- `src/pages/*`는 학습용/초기 구현 레거시로 더 이상 참조하지 않습니다.
- 정리 방법 예시(보존 이동):
  - git이 있다면: `git mv src/pages src/_legacy_pages`
  - 또는: `mv src/pages src/_legacy_pages`


7. Dashboard.jsx

8. AddExpense.jsx

9. AnalysisResult.jsx

10. History.jsx

11. AIReport.jsx

12. App.jsx

13. main.jsx