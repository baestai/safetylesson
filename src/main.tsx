import { StrictMode, useMemo, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type SubjectId =
  | 'safety'
  | 'human'
  | 'machine'
  | 'electric'
  | 'chemical'
  | 'construction'
  | 'practical';

type Question = {
  id: string;
  subjectId: SubjectId;
  chapter: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

type Subject = {
  id: SubjectId;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
};

type BadgeId = 'firstLesson' | 'perfectLesson' | 'streak3' | 'reviewer' | 'allRounder';

type StudyStats = {
  xp: number;
  streak: number;
  lastStudyDate: string;
  completedLessons: Record<string, number>;
  wrongIds: string[];
  subjectAttempts: Record<SubjectId, { total: number; correct: number }>;
  badges: BadgeId[];
};

const subjects: Subject[] = [
  {
    id: 'safety',
    title: '안전관리론',
    shortTitle: '관리',
    description: '안전보건관리 체계, 재해 예방, 교육과 법규 흐름',
    color: '#1b7f79',
  },
  {
    id: 'human',
    title: '인간공학 및 시스템안전공학',
    shortTitle: '인간',
    description: '작업자 특성, 휴먼에러, 시스템 안전 분석',
    color: '#7b5fc7',
  },
  {
    id: 'machine',
    title: '기계위험방지기술',
    shortTitle: '기계',
    description: '방호장치, 위험점, 프레스와 산업기계 안전',
    color: '#d46b35',
  },
  {
    id: 'electric',
    title: '전기위험방지기술',
    shortTitle: '전기',
    description: '감전, 접지, 방폭, 전기설비 위험 예방',
    color: '#2f6fce',
  },
  {
    id: 'chemical',
    title: '화학설비위험방지기술',
    shortTitle: '화학',
    description: '위험물, 폭발, 화재, 화학설비 안전관리',
    color: '#b23a55',
  },
  {
    id: 'construction',
    title: '건설안전기술',
    shortTitle: '건설',
    description: '추락, 굴착, 가설구조물, 건설장비 안전',
    color: '#75812a',
  },
  {
    id: 'practical',
    title: '실기 필답형',
    shortTitle: '실기',
    description: '서술형 대비를 위한 핵심 개념 객관식 점검',
    color: '#4c6072',
  },
];

const questions: Question[] = [
  {
    id: 'safety-1',
    subjectId: 'safety',
    chapter: '안전관리 기초',
    prompt: '재해 예방의 4원칙으로 가장 적절하지 않은 것은?',
    choices: ['예방 가능의 원칙', '손실 우연의 원칙', '원인 연계의 원칙', '책임 회피의 원칙'],
    answer: 3,
    explanation: '재해 예방은 예방 가능, 손실 우연, 원인 연계, 대책 선정의 원칙을 바탕으로 합니다.',
  },
  {
    id: 'safety-2',
    subjectId: 'safety',
    chapter: '안전관리 기초',
    prompt: '하인리히의 재해 발생 이론에서 직접 원인에 해당하는 것은?',
    choices: ['사회적 환경', '개인적 결함', '불안전한 행동과 상태', '관리자의 인사 평가'],
    answer: 2,
    explanation: '직접 원인은 불안전한 행동과 불안전한 상태이며, 이를 제거하는 관리가 중요합니다.',
  },
  {
    id: 'safety-3',
    subjectId: 'safety',
    chapter: '안전보건관리',
    prompt: '위험성평가의 일반적인 순서로 가장 알맞은 것은?',
    choices: ['대책 수립-위험 파악-위험성 추정', '위험 파악-위험성 추정-감소 대책 수립', '교육 실시-사고 조사-예산 편성', '작업 중지-보고-징계'],
    answer: 1,
    explanation: '위험요인을 찾고 위험성을 추정한 뒤 허용 가능 수준까지 감소 대책을 세웁니다.',
  },
  {
    id: 'safety-4',
    subjectId: 'safety',
    chapter: '재해분석',
    prompt: '도수율을 구할 때 사용하는 기준 노출 시간은?',
    choices: ['1천 시간', '1만 시간', '10만 시간', '100만 시간'],
    answer: 3,
    explanation: '도수율은 재해 발생 건수를 연근로시간 100만 시간당으로 환산한 지표입니다.',
  },
  {
    id: 'safety-5',
    subjectId: 'safety',
    chapter: '안전교육',
    prompt: '신규 채용자가 작업 전 받아야 하는 교육으로 가장 적절한 것은?',
    choices: ['정기 안전보건교육', '채용 시 안전보건교육', '특별 보건진단', '관리감독자 평가'],
    answer: 1,
    explanation: '신규 작업자는 채용 시 안전보건교육을 통해 작업 위험과 기본 수칙을 익혀야 합니다.',
  },
  {
    id: 'safety-6',
    subjectId: 'safety',
    chapter: '안전관리 체계',
    prompt: '산업재해 예방 계획에서 가장 먼저 확인해야 할 내용은?',
    choices: ['작업장의 위험요인', '휴게실 색상', '사내 행사 일정', '근무복 디자인'],
    answer: 0,
    explanation: '계획은 현장의 위험요인과 재해 발생 가능성을 파악하는 데서 출발합니다.',
  },
  {
    id: 'safety-7',
    subjectId: 'safety',
    chapter: '보호구',
    prompt: '보호구 관리 원칙으로 가장 알맞은 것은?',
    choices: ['공동으로만 사용한다', '작업 위험에 맞는 보호구를 지급하고 착용 상태를 확인한다', '착용 여부는 전적으로 개인 선택에 맡긴다', '오염되어도 세척하지 않는다'],
    answer: 1,
    explanation: '보호구는 위험성에 맞게 선정하고, 지급 후 착용 및 유지관리 상태를 확인해야 합니다.',
  },
  {
    id: 'safety-8',
    subjectId: 'safety',
    chapter: '재해조사',
    prompt: '사고 조사에서 가장 피해야 할 태도는?',
    choices: ['사실 확인', '근본 원인 분석', '재발 방지 대책 수립', '개인 책임만 단정하기'],
    answer: 3,
    explanation: '사고 조사는 처벌보다 원인 규명과 재발 방지에 초점을 둬야 합니다.',
  },
  {
    id: 'safety-9',
    subjectId: 'safety',
    chapter: '안전표지',
    prompt: '금지 표지의 일반적인 목적은?',
    choices: ['위험 행위의 금지', '피난 경로 안내', '장비 성능 광고', '작업 속도 향상'],
    answer: 0,
    explanation: '금지 표지는 출입 금지, 흡연 금지처럼 위험 행위를 막기 위해 사용합니다.',
  },
  {
    id: 'safety-10',
    subjectId: 'safety',
    chapter: '관리감독',
    prompt: '관리감독자의 안전 활동으로 가장 적절한 것은?',
    choices: ['작업 전 위험요인 확인', '방호장치 임의 해체', '보호구 미착용 방치', '사고 기록 삭제'],
    answer: 0,
    explanation: '관리감독자는 작업 전 위험요인을 확인하고 안전한 작업 절차를 유지해야 합니다.',
  },
  {
    id: 'human-1',
    subjectId: 'human',
    chapter: '인간공학',
    prompt: '작업대를 설계할 때 고려해야 할 인간공학 요소로 가장 적절한 것은?',
    choices: ['작업자의 신체 치수', '회사 로고 크기', '창고 임대료', '제품 포장 문구'],
    answer: 0,
    explanation: '작업자 신체 치수와 작업 자세를 고려하면 피로와 오류를 줄일 수 있습니다.',
  },
  {
    id: 'human-2',
    subjectId: 'human',
    chapter: '휴먼에러',
    prompt: '휴먼에러를 줄이기 위한 대책으로 가장 알맞은 것은?',
    choices: ['표준작업 절차와 표시 개선', '작업자에게 모든 책임 전가', '경고 표지 제거', '휴식 시간 축소'],
    answer: 0,
    explanation: '절차, 표시, 인터페이스, 교육을 개선하면 오류 가능성을 낮출 수 있습니다.',
  },
  {
    id: 'human-3',
    subjectId: 'human',
    chapter: '시스템안전',
    prompt: 'FTA의 주된 목적은?',
    choices: ['사고 원인을 논리적으로 분석', '작업복을 분류', '인건비를 산정', '제품 색상을 선정'],
    answer: 0,
    explanation: 'FTA는 정상 사건을 기준으로 하위 원인을 논리 게이트로 분석하는 기법입니다.',
  },
  {
    id: 'human-4',
    subjectId: 'human',
    chapter: '작업부하',
    prompt: '근골격계 부담을 줄이는 작업 설계로 가장 적절한 것은?',
    choices: ['반복 동작과 무리한 자세 감소', '중량물 단독 운반 증가', '작업대 높이 무시', '휴식 없이 장시간 작업'],
    answer: 0,
    explanation: '반복, 힘, 부자연스러운 자세를 줄이고 적절한 휴식을 주는 것이 중요합니다.',
  },
  {
    id: 'human-5',
    subjectId: 'human',
    chapter: '정보표시',
    prompt: '경고 표시 설계에서 가장 중요한 조건은?',
    choices: ['쉽게 눈에 띄고 의미가 명확할 것', '작게 숨겨둘 것', '복잡한 문장으로 쓸 것', '작업자 뒤쪽에만 둘 것'],
    answer: 0,
    explanation: '경고는 즉시 인지되고 행동으로 이어질 수 있도록 명확해야 합니다.',
  },
  {
    id: 'human-6',
    subjectId: 'human',
    chapter: '인간공학',
    prompt: '작업 중 피로를 줄이는 방법으로 가장 적절한 것은?',
    choices: ['작업-휴식 주기 설계', '조명 낮추기', '작업 높이 무시', '불편한 자세 유지'],
    answer: 0,
    explanation: '적절한 휴식과 작업 자세 개선은 피로 누적과 사고 가능성을 낮춥니다.',
  },
  {
    id: 'human-7',
    subjectId: 'human',
    chapter: '시스템안전',
    prompt: 'FMEA에서 중점적으로 검토하는 내용은?',
    choices: ['고장 형태와 영향', '근무자 취향', '제품 광고 문구', '건물 외관'],
    answer: 0,
    explanation: 'FMEA는 고장 형태, 원인, 영향, 위험 우선순위를 분석합니다.',
  },
  {
    id: 'human-8',
    subjectId: 'human',
    chapter: '인지특성',
    prompt: '작업자의 주의력 저하를 줄이는 대책으로 가장 적절한 것은?',
    choices: ['작업 변화와 휴식 제공', '단조로운 작업 장시간 지속', '경고음 제거', '작업량 무제한 증가'],
    answer: 0,
    explanation: '단조로움과 과부하를 줄이고 휴식과 피드백을 제공하면 주의력 유지에 도움이 됩니다.',
  },
  {
    id: 'human-9',
    subjectId: 'human',
    chapter: '표시장치',
    prompt: '계기판의 수치 표시가 적합한 경우는?',
    choices: ['정확한 값을 읽어야 할 때', '대략적 방향만 알면 될 때', '경고를 숨길 때', '장식 효과만 필요할 때'],
    answer: 0,
    explanation: '정량값을 정확히 읽어야 하는 작업에는 디지털 또는 명확한 수치 표시가 유리합니다.',
  },
  {
    id: 'human-10',
    subjectId: 'human',
    chapter: '작업환경',
    prompt: '소음 작업장의 관리 대책으로 가장 적절한 것은?',
    choices: ['소음원 저감과 청력보호구 착용', '소음 측정 생략', '보호구 미지급', '경고 표시 제거'],
    answer: 0,
    explanation: '소음은 공학적 저감, 작업관리, 보호구, 건강관리로 종합 관리합니다.',
  },
  {
    id: 'machine-1',
    subjectId: 'machine',
    chapter: '기계 위험점',
    prompt: '회전하는 롤러 사이에 신체가 말려 들어갈 위험점은?',
    choices: ['협착점', '절단점', '물림점', '충격점'],
    answer: 2,
    explanation: '두 회전체 또는 회전체와 고정체 사이에 끼이는 위험을 물림점이라고 합니다.',
  },
  {
    id: 'machine-2',
    subjectId: 'machine',
    chapter: '방호장치',
    prompt: '프레스 작업에서 손이 위험 영역에 들어가는 것을 막는 장치는?',
    choices: ['양수조작식 방호장치', '소음계', '접지봉', '안전모'],
    answer: 0,
    explanation: '양수조작식은 양손을 동시에 사용하게 해 손이 위험 영역에 들어가지 않도록 합니다.',
  },
  {
    id: 'machine-3',
    subjectId: 'machine',
    chapter: '운반기계',
    prompt: '지게차 운행 전 점검 항목으로 가장 적절한 것은?',
    choices: ['브레이크와 경보장치 상태', '사무실 조명 색상', '식당 메뉴', '포스터 디자인'],
    answer: 0,
    explanation: '브레이크, 조향, 경보장치, 포크 상태 등을 운행 전 확인해야 합니다.',
  },
  {
    id: 'machine-4',
    subjectId: 'machine',
    chapter: '절삭기계',
    prompt: '연삭기 사용 시 숫돌 파손 위험을 줄이기 위한 조치로 알맞은 것은?',
    choices: ['최고 사용 주속도 준수', '보호덮개 제거', '균열 숫돌 사용', '측면 연삭 강행'],
    answer: 0,
    explanation: '숫돌의 최고 사용 주속도와 균열 여부를 확인하고 보호덮개를 유지해야 합니다.',
  },
  {
    id: 'machine-5',
    subjectId: 'machine',
    chapter: '일반기계',
    prompt: '컨베이어 안전장치로 가장 적절한 것은?',
    choices: ['비상정지장치', '장식 조명', '음악 재생기', '문서 보관함'],
    answer: 0,
    explanation: '컨베이어에는 비상정지장치, 덮개, 이탈 방지 장치 등을 설치합니다.',
  },
  {
    id: 'machine-6',
    subjectId: 'machine',
    chapter: '프레스',
    prompt: '프레스 금형 교체 작업에서 필요한 안전 조치는?',
    choices: ['전원 차단과 불시 하강 방지', '페달 임의 고정', '방호장치 해체', '손으로 금형 지지'],
    answer: 0,
    explanation: '정비와 금형 교체 시 전원을 차단하고 하강 방지 조치를 해야 합니다.',
  },
  {
    id: 'machine-7',
    subjectId: 'machine',
    chapter: '보전작업',
    prompt: '기계 정비 중 예기치 않은 가동을 막는 절차는?',
    choices: ['잠금 및 표지 절차', '청소 생략', '작업자 교대', '문서 폐기'],
    answer: 0,
    explanation: '정비 중에는 에너지원 차단, 잠금, 표지로 오조작을 방지합니다.',
  },
  {
    id: 'machine-8',
    subjectId: 'machine',
    chapter: '위험점',
    prompt: '절단기 작업에서 가장 중요한 방호 원칙은?',
    choices: ['위험점 접근 방지', '보호덮개 제거', '한 손 작업 강제', '날 교체 중 전원 유지'],
    answer: 0,
    explanation: '위험점에 손이 접근하지 못하도록 덮개, 인터록, 지그 등을 사용합니다.',
  },
  {
    id: 'machine-9',
    subjectId: 'machine',
    chapter: '크레인',
    prompt: '와이어로프 사용 전 점검 사항으로 알맞은 것은?',
    choices: ['소선 절단과 마모 상태', '색상 취향', '작업자 혈액형', '사무실 온도'],
    answer: 0,
    explanation: '와이어로프는 마모, 부식, 소선 절단, 변형 여부를 점검해야 합니다.',
  },
  {
    id: 'machine-10',
    subjectId: 'machine',
    chapter: '산업용 로봇',
    prompt: '로봇 작업구역 안전대책으로 가장 적절한 것은?',
    choices: ['울타리와 인터록 설치', '안전문 상시 개방', '비상정지 제거', '작업구역 출입 자유화'],
    answer: 0,
    explanation: '로봇 작업구역은 방책, 인터록, 비상정지, 교시 모드 관리가 필요합니다.',
  },
  {
    id: 'electric-1',
    subjectId: 'electric',
    chapter: '감전 예방',
    prompt: '감전 위험을 줄이기 위한 기본 대책으로 가장 적절한 것은?',
    choices: ['접지와 누전차단기 설치', '절연장갑 미착용', '젖은 손 작업', '전원 표시 제거'],
    answer: 0,
    explanation: '접지, 절연, 누전차단기, 작업 전 전원 차단이 감전 예방의 기본입니다.',
  },
  {
    id: 'electric-2',
    subjectId: 'electric',
    chapter: '전기설비',
    prompt: '정전 작업 시 가장 먼저 해야 할 조치로 알맞은 것은?',
    choices: ['전원 차단 및 잠금 표시', '작업 완료 보고', '보호구 반납', '청소만 실시'],
    answer: 0,
    explanation: '전원을 차단하고 잠금 및 표지를 통해 오조작을 방지해야 합니다.',
  },
  {
    id: 'electric-3',
    subjectId: 'electric',
    chapter: '방폭',
    prompt: '폭발 위험 장소의 전기설비에서 중요한 기준은?',
    choices: ['위험 장소 등급에 맞는 방폭 구조 사용', '일반 스위치 무조건 사용', '환기 중지', '접지선 제거'],
    answer: 0,
    explanation: '가스나 분진 폭발 위험에 맞는 방폭 구조의 전기기기를 선정해야 합니다.',
  },
  {
    id: 'electric-4',
    subjectId: 'electric',
    chapter: '정전기',
    prompt: '정전기 재해 예방 대책으로 가장 알맞은 것은?',
    choices: ['접지와 가습', '절연만 강화', '금속 용기 미접지', '환기 차단'],
    answer: 0,
    explanation: '접지, 본딩, 가습, 유속 제한 등으로 정전기 축적을 줄입니다.',
  },
  {
    id: 'electric-5',
    subjectId: 'electric',
    chapter: '보호구',
    prompt: '활선 근접 작업에서 필요한 보호구로 가장 적절한 것은?',
    choices: ['절연용 보호구', '방진마스크만', '보안경만', '일반 면장갑'],
    answer: 0,
    explanation: '전기 작업에는 절연장갑, 절연화, 절연용 방호구 등 적합한 보호구가 필요합니다.',
  },
  {
    id: 'electric-6',
    subjectId: 'electric',
    chapter: '감전 예방',
    prompt: '감전 사고 시 구조자가 먼저 해야 할 조치는?',
    choices: ['전원 차단 후 구조', '맨손으로 끌어내기', '물을 뿌리기', '작업 계속 지시'],
    answer: 0,
    explanation: '구조자 2차 감전을 막기 위해 전원을 차단하고 절연 조치를 해야 합니다.',
  },
  {
    id: 'electric-7',
    subjectId: 'electric',
    chapter: '접지',
    prompt: '접지의 주된 목적은?',
    choices: ['누전 시 감전 위험 감소', '설비 무게 감소', '전선 색상 통일', '소음 증가'],
    answer: 0,
    explanation: '접지는 고장전류를 안전하게 흘려 보호장치 동작과 감전 예방을 돕습니다.',
  },
  {
    id: 'electric-8',
    subjectId: 'electric',
    chapter: '전기화재',
    prompt: '전기화재 예방 대책으로 가장 적절한 것은?',
    choices: ['과부하 방지와 접속부 점검', '문어발 배선 확대', '손상 전선 사용', '차단기 임의 대체'],
    answer: 0,
    explanation: '과부하, 단락, 접촉 불량을 관리하고 정격 보호장치를 사용해야 합니다.',
  },
  {
    id: 'electric-9',
    subjectId: 'electric',
    chapter: '정전작업',
    prompt: '검전의 목적은?',
    choices: ['전압이 남아 있는지 확인', '장비 가격 확인', '작업자 출석 확인', '소음 수준 확인'],
    answer: 0,
    explanation: '전원을 차단한 후에도 잔류 전압이나 오결선을 확인하기 위해 검전합니다.',
  },
  {
    id: 'electric-10',
    subjectId: 'electric',
    chapter: '방폭',
    prompt: '가연성 가스가 있는 장소에서 점화원을 줄이는 방법은?',
    choices: ['방폭 전기기기 사용', '스파크 발생 공구 사용', '접지 제거', '환기 중지'],
    answer: 0,
    explanation: '위험 장소에는 등급에 맞는 방폭 기기를 사용하고 점화원을 엄격히 관리합니다.',
  },
  {
    id: 'chemical-1',
    subjectId: 'chemical',
    chapter: '화재폭발',
    prompt: '연소의 3요소에 해당하지 않는 것은?',
    choices: ['가연물', '산소', '점화원', '방청유'],
    answer: 3,
    explanation: '연소에는 가연물, 산소 공급원, 점화원이 필요합니다.',
  },
  {
    id: 'chemical-2',
    subjectId: 'chemical',
    chapter: '위험물',
    prompt: '인화성 액체 취급 장소의 관리로 가장 적절한 것은?',
    choices: ['환기와 점화원 관리', '흡연 허용', '정전기 방치', '용기 개방 보관'],
    answer: 0,
    explanation: '인화성 증기 축적을 막고 점화원을 관리해야 화재폭발 위험을 낮출 수 있습니다.',
  },
  {
    id: 'chemical-3',
    subjectId: 'chemical',
    chapter: 'MSDS',
    prompt: 'MSDS에서 확인할 수 있는 정보로 가장 적절한 것은?',
    choices: ['유해위험성 및 취급 방법', '직원 취미', '회사 매출', '통근 거리'],
    answer: 0,
    explanation: 'MSDS에는 화학물질의 유해위험성, 응급조치, 취급 및 저장 방법 등이 담깁니다.',
  },
  {
    id: 'chemical-4',
    subjectId: 'chemical',
    chapter: '설비안전',
    prompt: '압력용기의 과압 방지 장치로 가장 적절한 것은?',
    choices: ['안전밸브', '온도계 케이스', '명찰', '방음재'],
    answer: 0,
    explanation: '안전밸브나 파열판은 압력이 허용치를 넘을 때 압력을 방출합니다.',
  },
  {
    id: 'chemical-5',
    subjectId: 'chemical',
    chapter: '독성물질',
    prompt: '유해가스 누출 대응에서 우선해야 할 조치는?',
    choices: ['대피와 환기 및 차단', '냄새 확인을 위한 접근', '보호구 없이 제거', '작업 계속'],
    answer: 0,
    explanation: '누출 시 사람을 먼저 대피시키고, 보호구 착용 후 차단과 환기를 실시합니다.',
  },
  {
    id: 'chemical-6',
    subjectId: 'chemical',
    chapter: '폭발한계',
    prompt: '폭발하한계보다 낮은 농도에서 일반적으로 나타나는 상태는?',
    choices: ['연료가 부족해 폭발하기 어렵다', '항상 폭발한다', '산소가 완전히 없다', '압력이 사라진다'],
    answer: 0,
    explanation: '폭발하한계 미만은 가연성 증기 농도가 부족해 연소가 지속되기 어렵습니다.',
  },
  {
    id: 'chemical-7',
    subjectId: 'chemical',
    chapter: '저장관리',
    prompt: '혼합 보관을 피해야 하는 물질 조합으로 알맞은 것은?',
    choices: ['산화성 물질과 가연성 물질', '동일 물질의 같은 용기', '물과 물', '빈 용기와 라벨'],
    answer: 0,
    explanation: '산화성 물질은 가연성 물질과 반응해 화재 위험을 높일 수 있습니다.',
  },
  {
    id: 'chemical-8',
    subjectId: 'chemical',
    chapter: '환기',
    prompt: '국소배기장치의 목적은?',
    choices: ['유해물질을 발생원에서 포집', '오염 공기 확산', '작업장 밀폐', '보호구 대체만'],
    answer: 0,
    explanation: '국소배기는 오염물질이 작업자 호흡영역으로 확산되기 전에 포집합니다.',
  },
  {
    id: 'chemical-9',
    subjectId: 'chemical',
    chapter: '화재 대응',
    prompt: '유류 화재에 물을 직접 분사할 때 생길 수 있는 위험은?',
    choices: ['화재 확산', '산소 완전 제거', '온도 영구 하락', '연료 즉시 고체화'],
    answer: 0,
    explanation: '유류가 물 위로 퍼지며 화재가 확산될 수 있어 적합한 소화약제를 써야 합니다.',
  },
  {
    id: 'chemical-10',
    subjectId: 'chemical',
    chapter: '반응위험',
    prompt: '반응성 화학물질 취급 전 확인해야 할 정보는?',
    choices: ['혼합 금지 물질과 반응 조건', '작업자 취미', '사무실 위치', '출퇴근 시간'],
    answer: 0,
    explanation: '반응 위험은 MSDS와 공정 조건을 통해 혼합 금지, 온도, 압력 등을 확인합니다.',
  },
  {
    id: 'construction-1',
    subjectId: 'construction',
    chapter: '추락 예방',
    prompt: '고소작업 추락 방지 대책으로 가장 적절한 것은?',
    choices: ['안전난간과 추락방호망 설치', '개구부 방치', '안전대 미착용', '작업발판 임의 해체'],
    answer: 0,
    explanation: '안전난간, 덮개, 추락방호망, 안전대 등 다중 방호가 필요합니다.',
  },
  {
    id: 'construction-2',
    subjectId: 'construction',
    chapter: '굴착작업',
    prompt: '굴착면 붕괴를 막기 위한 조치로 가장 적절한 것은?',
    choices: ['흙막이 지보공 설치', '배수 무시', '굴착면 수직 방치', '작업자 단독 투입'],
    answer: 0,
    explanation: '지반 상태에 맞는 흙막이, 경사, 배수, 출입 통제를 적용해야 합니다.',
  },
  {
    id: 'construction-3',
    subjectId: 'construction',
    chapter: '가설구조물',
    prompt: '비계 작업 전 점검해야 할 사항으로 가장 적절한 것은?',
    choices: ['작업발판과 결속 상태', '작업자 생일', '현장 광고 문구', '차량 색상'],
    answer: 0,
    explanation: '비계는 발판, 난간, 결속, 침하, 벽이음 상태를 확인해야 합니다.',
  },
  {
    id: 'construction-4',
    subjectId: 'construction',
    chapter: '양중작업',
    prompt: '크레인 작업에서 신호수의 역할로 알맞은 것은?',
    choices: ['운전자에게 명확한 작업 신호 제공', '하중 밑 대기', '와이어로프 손상 방치', '작업 반경 출입 유도'],
    answer: 0,
    explanation: '신호수는 정해진 신호로 운전자와 소통해 충돌과 낙하 위험을 줄입니다.',
  },
  {
    id: 'construction-5',
    subjectId: 'construction',
    chapter: '건설장비',
    prompt: '이동식 사다리 사용 시 적절한 조치는?',
    choices: ['미끄럼 방지와 전도 방지 확보', '최상단에서 작업', '파손 사다리 사용', '두 사람이 동시에 뛰어오르기'],
    answer: 0,
    explanation: '사다리는 견고한 바닥에 설치하고 미끄럼과 전도를 방지해야 합니다.',
  },
  {
    id: 'construction-6',
    subjectId: 'construction',
    chapter: '개구부',
    prompt: '바닥 개구부 안전조치로 가장 적절한 것은?',
    choices: ['견고한 덮개와 경고 표시', '개구부 방치', '덮개 임의 제거', '야간 표시 생략'],
    answer: 0,
    explanation: '개구부는 덮개, 난간, 표지로 추락 위험을 방지해야 합니다.',
  },
  {
    id: 'construction-7',
    subjectId: 'construction',
    chapter: '철골작업',
    prompt: '철골 조립 작업에서 추락 위험을 줄이는 조치는?',
    choices: ['안전대 부착설비 확보', '무보호 이동', '강풍 중 강행', '작업발판 생략'],
    answer: 0,
    explanation: '고소 철골 작업은 안전대 부착설비, 작업발판, 추락방호망을 확보해야 합니다.',
  },
  {
    id: 'construction-8',
    subjectId: 'construction',
    chapter: '거푸집',
    prompt: '거푸집 동바리 붕괴 예방에 필요한 조치는?',
    choices: ['구조 검토와 설치 상태 점검', '임의 해체', '과하중 방치', '침하 확인 생략'],
    answer: 0,
    explanation: '동바리는 하중, 간격, 수직도, 침하, 연결 상태를 확인해야 합니다.',
  },
  {
    id: 'construction-9',
    subjectId: 'construction',
    chapter: '건설장비',
    prompt: '굴착기 주변 작업의 안전수칙으로 알맞은 것은?',
    choices: ['작업반경 출입 통제', '후진 경보 무시', '버킷 아래 대기', '신호수 배치 금지'],
    answer: 0,
    explanation: '장비 작업반경은 출입을 통제하고 신호수와 경보장치를 활용해야 합니다.',
  },
  {
    id: 'construction-10',
    subjectId: 'construction',
    chapter: '토공사',
    prompt: '흙막이 지보공 점검 시 확인할 사항은?',
    choices: ['버팀대 변형과 누수 여부', '식당 거리', '작업자 취미', '현장 간판 글꼴'],
    answer: 0,
    explanation: '지보공은 변형, 침하, 누수, 볼트 풀림 등을 정기적으로 점검해야 합니다.',
  },
  {
    id: 'practical-1',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '위험성평가 결과에 따른 감소 대책 수립 원칙으로 가장 적절한 것은?',
    choices: ['제거-대체-공학적 대책-관리적 대책-보호구 순서 고려', '보호구만 지급', '위험요인 기록 생략', '사후 보고만 실시'],
    answer: 0,
    explanation: '위험 감소는 제거와 대체를 우선하고, 공학적/관리적 대책과 보호구를 보완합니다.',
  },
  {
    id: 'practical-2',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '작업허가서가 특히 필요한 작업으로 가장 적절한 것은?',
    choices: ['밀폐공간 또는 화기 작업', '일반 사무 문서 작성', '회의실 예약', '휴게실 정리'],
    answer: 0,
    explanation: '화기, 밀폐공간, 고소, 정전 등 고위험 작업은 사전 허가와 확인이 필요합니다.',
  },
  {
    id: 'practical-3',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '밀폐공간 작업 전 확인해야 할 핵심 사항은?',
    choices: ['산소 및 유해가스 농도 측정', '간식 수량', '작업복 색상', '휴대폰 배경화면'],
    answer: 0,
    explanation: '산소결핍과 유해가스 위험 때문에 작업 전, 작업 중 농도 측정과 환기가 필요합니다.',
  },
  {
    id: 'practical-4',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: 'LOTO 절차의 목적은?',
    choices: ['에너지원 차단과 오조작 방지', '장비 외관 개선', '작업 속도 증가만', '소모품 정리'],
    answer: 0,
    explanation: 'Lock Out Tag Out은 정비 중 예기치 않은 가동과 에너지 방출을 막는 절차입니다.',
  },
  {
    id: 'practical-5',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '재해 재발 방지 대책으로 가장 적절한 것은?',
    choices: ['근본 원인 제거와 교육 및 설비 개선', '사고 은폐', '동일 작업 즉시 재개', '기록 삭제'],
    answer: 0,
    explanation: '원인을 제거하고 설비, 절차, 교육을 개선해야 같은 사고를 막을 수 있습니다.',
  },
  {
    id: 'practical-6',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '안전보건표지의 효과를 높이는 방법으로 적절한 것은?',
    choices: ['보기 쉬운 위치에 명확하게 설치', '작업자 시야 밖에 설치', '오염된 상태로 방치', '서로 모순되게 표시'],
    answer: 0,
    explanation: '표지는 작업자가 쉽게 보고 즉시 의미를 알 수 있어야 합니다.',
  },
  {
    id: 'practical-7',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '작업 전 TBM의 목적은?',
    choices: ['당일 위험요인과 안전조치 공유', '출근 기록 대체', '임금 산정', '작업 생략'],
    answer: 0,
    explanation: 'TBM은 작업 전 짧은 회의로 위험요인, 역할, 안전조치를 공유합니다.',
  },
  {
    id: 'practical-8',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '안전대 사용 전 확인해야 할 사항은?',
    choices: ['벨트와 죔줄 손상 여부', '색상 유행', '브랜드 광고', '보관함 크기만'],
    answer: 0,
    explanation: '안전대는 훅, 죔줄, 벨트, 봉제부 손상 여부와 부착설비를 확인해야 합니다.',
  },
  {
    id: 'practical-9',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '비상대응훈련의 목적은?',
    choices: ['사고 시 역할과 절차 숙달', '업무 지연만 유발', '기록 생략', '장비 폐기'],
    answer: 0,
    explanation: '훈련은 대피, 신고, 응급조치, 초기 대응 절차를 몸에 익히게 합니다.',
  },
  {
    id: 'practical-10',
    subjectId: 'practical',
    chapter: '필답 핵심',
    prompt: '작업환경측정 결과를 활용하는 방법으로 적절한 것은?',
    choices: ['노출 수준에 따른 개선 대책 수립', '측정 결과 폐기', '작업자에게 비공개만', '위험요인 무시'],
    answer: 0,
    explanation: '측정 결과는 환기, 보호구, 공정 개선 등 노출 저감 대책의 근거가 됩니다.',
  },
];

const badgeLabels: Record<BadgeId, string> = {
  firstLesson: '첫 레슨 완료',
  perfectLesson: '만점 레슨',
  streak3: '3일 연속 학습',
  reviewer: '오답 정복자',
  allRounder: '전 과목 입문',
};

const emptySubjectAttempts = subjects.reduce(
  (acc, subject) => ({
    ...acc,
    [subject.id]: { total: 0, correct: 0 },
  }),
  {} as StudyStats['subjectAttempts'],
);

const defaultStats: StudyStats = {
  xp: 0,
  streak: 0,
  lastStudyDate: '',
  completedLessons: {},
  wrongIds: [],
  subjectAttempts: emptySubjectAttempts,
  badges: [],
};

const storageKey = 'industrial-safety-study-stats';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function loadStats(): StudyStats {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return defaultStats;
    }

    const parsed = JSON.parse(saved) as StudyStats;
    return {
      ...defaultStats,
      ...parsed,
      subjectAttempts: {
        ...emptySubjectAttempts,
        ...parsed.subjectAttempts,
      },
      badges: parsed.badges ?? [],
      wrongIds: parsed.wrongIds ?? [],
    };
  } catch {
    return defaultStats;
  }
}

function saveStats(nextStats: StudyStats) {
  localStorage.setItem(storageKey, JSON.stringify(nextStats));
}

function getLessonQuestions(subjectId: SubjectId, lessonIndex: number) {
  const pool = questions.filter((question) => question.subjectId === subjectId);
  return Array.from({ length: 10 }, (_, index) => pool[(lessonIndex * 10 + index) % pool.length]);
}

function getLevel(xp: number) {
  return Math.floor(xp / 120) + 1;
}

function getHearts(answeredCount: number, score: number) {
  return Math.max(0, 10 - (answeredCount - score));
}

function uniqueList<T>(items: T[]) {
  return Array.from(new Set(items));
}

function App() {
  const [stats, setStats] = useState<StudyStats>(() => loadStats());
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>('safety');
  const [activeTab, setActiveTab] = useState<'learn' | 'mistakes' | 'analytics'>('learn');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lessonDone, setLessonDone] = useState(false);

  const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0];
  const lessonQuestions = useMemo(
    () => getLessonQuestions(activeSubjectId, lessonIndex),
    [activeSubjectId, lessonIndex],
  );
  const currentQuestion = lessonQuestions[questionIndex];
  const answeredCurrent = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCorrect = answeredCurrent === currentQuestion?.answer;
  const answeredCount = Object.keys(answers).length;
  const score = lessonQuestions.filter((question) => answers[question.id] === question.answer).length;
  const wrongQuestions = questions.filter((question) => stats.wrongIds.includes(question.id));
  const weakestSubject = subjects
    .map((subject) => {
      const attempt = stats.subjectAttempts[subject.id];
      const accuracy = attempt.total === 0 ? 1 : attempt.correct / attempt.total;
      return { subject, accuracy, total: attempt.total };
    })
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  function persist(nextStats: StudyStats) {
    setStats(nextStats);
    saveStats(nextStats);
  }

  function resetLesson(nextSubjectId = activeSubjectId, nextLessonIndex = lessonIndex) {
    setActiveSubjectId(nextSubjectId);
    setLessonIndex(nextLessonIndex);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswers({});
    setLessonDone(false);
  }

  function chooseSubject(subjectId: SubjectId) {
    resetLesson(subjectId, stats.completedLessons[subjectId] ?? 0);
  }

  function submitChoice(choiceIndex: number) {
    if (answeredCurrent !== undefined) {
      return;
    }

    setSelectedChoice(choiceIndex);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: choiceIndex,
    }));
  }

  function finishLesson() {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    const nextStreak =
      stats.lastStudyDate === today ? stats.streak : stats.lastStudyDate === yesterday ? stats.streak + 1 : 1;
    const wrongIdsInLesson = lessonQuestions
      .filter((question) => answers[question.id] !== question.answer)
      .map((question) => question.id);
    const correctedIds = lessonQuestions
      .filter((question) => answers[question.id] === question.answer)
      .map((question) => question.id);
    const nextWrongIds = uniqueList([...stats.wrongIds, ...wrongIdsInLesson]).filter(
      (id) => !correctedIds.includes(id) || wrongIdsInLesson.includes(id),
    );
    const nextAttempts = { ...stats.subjectAttempts };

    lessonQuestions.forEach((question) => {
      const current = nextAttempts[question.subjectId] ?? { total: 0, correct: 0 };
      nextAttempts[question.subjectId] = {
        total: current.total + 1,
        correct: current.correct + (answers[question.id] === question.answer ? 1 : 0),
      };
    });

    const completedSubjects = uniqueList([
      ...Object.keys(stats.completedLessons),
      activeSubjectId,
    ]) as SubjectId[];
    const earnedBadges: BadgeId[] = [
      ...(stats.badges.includes('firstLesson') ? [] : ['firstLesson' as BadgeId]),
      ...(score === 10 && !stats.badges.includes('perfectLesson') ? ['perfectLesson' as BadgeId] : []),
      ...(nextStreak >= 3 && !stats.badges.includes('streak3') ? ['streak3' as BadgeId] : []),
      ...(wrongIdsInLesson.length === 0 && stats.wrongIds.length > 0 && !stats.badges.includes('reviewer')
        ? ['reviewer' as BadgeId]
        : []),
      ...(completedSubjects.length === subjects.length && !stats.badges.includes('allRounder')
        ? ['allRounder' as BadgeId]
        : []),
    ];

    persist({
      xp: stats.xp + score * 12 + 20,
      streak: nextStreak,
      lastStudyDate: today,
      completedLessons: {
        ...stats.completedLessons,
        [activeSubjectId]: Math.max((stats.completedLessons[activeSubjectId] ?? 0) + 1, lessonIndex + 1),
      },
      wrongIds: nextWrongIds,
      subjectAttempts: nextAttempts,
      badges: uniqueList([...stats.badges, ...earnedBadges]),
    });
    setLessonDone(true);
  }

  function goNext() {
    if (questionIndex < lessonQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setSelectedChoice(null);
      return;
    }

    finishLesson();
  }

  function startMistakeLesson() {
    if (wrongQuestions.length === 0) {
      return;
    }

    const firstWrong = wrongQuestions[0];
    resetLesson(firstWrong.subjectId, 0);
    setActiveTab('learn');
  }

  function resetProgress() {
    persist(defaultStats);
    resetLesson('safety', 0);
    setActiveTab('learn');
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">산업안전기사 러닝 패스</p>
          <h1>오늘도 10문제로 안전 점수를 올려요</h1>
          <p className="lead">
            기출형 4지선다 문제를 짧은 레슨으로 풀고, 오답과 약한 과목은 자동으로 다시 학습합니다.
          </p>
        </div>
        <div className="profile-card" aria-label="학습 상태">
          <div>
            <span>레벨</span>
            <strong>{getLevel(stats.xp)}</strong>
          </div>
          <div>
            <span>XP</span>
            <strong>{stats.xp}</strong>
          </div>
          <div>
            <span>연속</span>
            <strong>{stats.streak}일</strong>
          </div>
        </div>
      </section>

      <nav className="tab-bar" aria-label="주요 메뉴">
        <button className={activeTab === 'learn' ? 'active' : ''} onClick={() => setActiveTab('learn')}>
          학습
        </button>
        <button className={activeTab === 'mistakes' ? 'active' : ''} onClick={() => setActiveTab('mistakes')}>
          오답노트
        </button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
          분석
        </button>
      </nav>

      {activeTab === 'learn' && (
        <section className="learn-grid">
          <aside className="subject-list" aria-label="과목 선택">
            {subjects.map((subject) => {
              const progress = stats.completedLessons[subject.id] ?? 0;
              return (
                <button
                  key={subject.id}
                  className={subject.id === activeSubjectId ? 'subject-item active' : 'subject-item'}
                  onClick={() => chooseSubject(subject.id)}
                  style={{ '--subject-color': subject.color } as CSSProperties}
                >
                  <span>{subject.shortTitle}</span>
                  <strong>{subject.title}</strong>
                  <small>{progress}개 레슨 완료</small>
                </button>
              );
            })}
          </aside>

          <section className="lesson-panel">
            <div className="lesson-header">
              <div>
                <p className="eyebrow" style={{ color: activeSubject.color }}>
                  {activeSubject.title}
                </p>
                <h2>챕터 {lessonIndex + 1}. {currentQuestion.chapter}</h2>
              </div>
              <div className="lesson-stats">
                <span>하트 {getHearts(answeredCount, score)}/10</span>
                <span>{questionIndex + 1}/10</span>
              </div>
            </div>

            <div className="progress-track" aria-label="레슨 진행률">
              <span style={{ width: `${((questionIndex + 1) / lessonQuestions.length) * 100}%` }} />
            </div>

            {!lessonDone ? (
              <article className="question-card">
                <p className="question-kicker">4지선다</p>
                <h3>{currentQuestion.prompt}</h3>
                <div className="choice-grid">
                  {currentQuestion.choices.map((choice, index) => {
                    const showResult = answeredCurrent !== undefined;
                    const choiceClass = [
                      'choice-button',
                      selectedChoice === index ? 'selected' : '',
                      showResult && index === currentQuestion.answer ? 'correct' : '',
                      showResult && selectedChoice === index && index !== currentQuestion.answer ? 'wrong' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <button
                        key={choice}
                        className={choiceClass}
                        disabled={showResult}
                        onClick={() => submitChoice(index)}
                      >
                        <span>{index + 1}</span>
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {answeredCurrent !== undefined && (
                  <div className={isCorrect ? 'feedback correct' : 'feedback wrong'}>
                    <strong>{isCorrect ? '정답입니다' : '다시 볼 문제로 저장했어요'}</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="lesson-actions">
                  <button
                    className="secondary-button"
                    onClick={() => resetLesson(activeSubjectId, lessonIndex)}
                  >
                    다시 시작
                  </button>
                  <button className="primary-button" disabled={answeredCurrent === undefined} onClick={goNext}>
                    {questionIndex === lessonQuestions.length - 1 ? '레슨 완료' : '다음 문제'}
                  </button>
                </div>
              </article>
            ) : (
              <article className="result-card">
                <p className="eyebrow">레슨 완료</p>
                <h3>{score}/10 정답</h3>
                <p>
                  XP {score * 12 + 20}점을 획득했습니다. 틀린 문제는 오답노트에 저장되고 다음 복습에 다시 등장합니다.
                </p>
                <div className="result-actions">
                  <button className="secondary-button" onClick={() => setActiveTab('analytics')}>
                    약점 보기
                  </button>
                  <button className="primary-button" onClick={() => resetLesson(activeSubjectId, lessonIndex + 1)}>
                    다음 레슨
                  </button>
                </div>
              </article>
            )}
          </section>
        </section>
      )}

      {activeTab === 'mistakes' && (
        <section className="panel-page">
          <div className="section-heading">
            <div>
              <p className="eyebrow">오답노트</p>
              <h2>틀린 문제를 다시 만나게 됩니다</h2>
            </div>
            <button className="primary-button" disabled={wrongQuestions.length === 0} onClick={startMistakeLesson}>
              오답 복습 시작
            </button>
          </div>

          <div className="mistake-list">
            {wrongQuestions.length === 0 ? (
              <div className="empty-state">아직 저장된 오답이 없습니다. 첫 레슨을 풀어보세요.</div>
            ) : (
              wrongQuestions.map((question) => (
                <article key={question.id} className="mistake-card">
                  <span>{subjects.find((subject) => subject.id === question.subjectId)?.title}</span>
                  <h3>{question.prompt}</h3>
                  <p>{question.explanation}</p>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === 'analytics' && (
        <section className="panel-page">
          <div className="section-heading">
            <div>
              <p className="eyebrow">학습 분석</p>
              <h2>약한 과목을 먼저 끌어올려요</h2>
            </div>
            <button className="secondary-button" onClick={resetProgress}>
              진행 초기화
            </button>
          </div>

          <div className="analytics-grid">
            <article className="summary-card">
              <span>가장 약한 과목</span>
              <strong>{weakestSubject.subject.title}</strong>
              <p>
                정답률 {Math.round(weakestSubject.accuracy * 100)}%
                {weakestSubject.total === 0 ? ' · 아직 풀이 기록 없음' : ` · ${weakestSubject.total}문제 풀이`}
              </p>
            </article>
            <article className="summary-card">
              <span>배지</span>
              <strong>{stats.badges.length}/{Object.keys(badgeLabels).length}</strong>
              <p>{stats.badges.length === 0 ? '첫 레슨을 완료하면 배지가 열립니다.' : stats.badges.map((badge) => badgeLabels[badge]).join(', ')}</p>
            </article>
            <article className="summary-card">
              <span>브라우저 저장</span>
              <strong>활성</strong>
              <p>진행도, 오답, XP는 이 브라우저의 localStorage에 저장됩니다.</p>
            </article>
          </div>

          <div className="subject-analysis">
            {subjects.map((subject) => {
              const attempt = stats.subjectAttempts[subject.id];
              const accuracy = attempt.total === 0 ? 0 : Math.round((attempt.correct / attempt.total) * 100);
              return (
                <article key={subject.id} className="analysis-row">
                  <div>
                    <strong>{subject.title}</strong>
                    <span>{attempt.correct}/{attempt.total} 정답</span>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: `${accuracy}%`, background: subject.color }} />
                  </div>
                  <b>{accuracy}%</b>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
