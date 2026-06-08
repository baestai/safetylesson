# 산업안전기사 학습 앱

GitHub 저장소와 Vercel 배포를 기준으로 준비한 React + Vite 프로젝트입니다. 듀오링고식 짧은 레슨 구조를 참고해 산업안전기사 전 과목을 10문제 단위로 학습할 수 있게 구성했습니다.

## 주요 기능

- 전 과목 챕터형 학습: 안전관리론, 인간공학 및 시스템안전공학, 기계, 전기, 화학, 건설, 실기 필답형
- 레슨당 10문제 4지선다 풀이
- XP, 레벨, 연속 학습, 하트, 배지형 보상
- 오답노트 자동 저장과 복습 진입
- 과목별 정답률과 약한 과목 분석
- 별도 로그인 없이 브라우저 `localStorage`에 진행도 저장

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## Vercel 배포

1. GitHub에 이 저장소를 푸시합니다.
2. Vercel에서 **Add New Project**를 선택합니다.
3. GitHub 저장소를 Import합니다.
4. Framework Preset은 `Vite`, Build Command는 `npm run build`, Output Directory는 `dist`로 둡니다.
5. 필요한 환경 변수는 Vercel Project Settings의 Environment Variables에 추가합니다.

## 환경 변수

`.env.example`을 기준으로 `.env.local`을 만들어 로컬 값을 관리합니다. 실제 비밀 값은 Git에 커밋하지 않습니다.

## 현재 개발 환경 메모

이 저장소는 앱 소스와 배포 설정이 준비되어 있습니다. 로컬 머신에서 `npm`이 설치되어 있어야 `npm install`, `npm run build` 검증을 실행할 수 있습니다.
# safetylesson
