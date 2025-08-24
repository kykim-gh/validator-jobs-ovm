# ValidatorJobs with OVM

DVT 오퍼레이터 평판 기반 검증자 관리 시스템 - OVM Builder Blitz 해커톤 프로젝트

## 🎯 프로젝트 개요

GitHub 활동과 POAP 이벤트 참여를 기반으로 DVT 오퍼레이터의 평판을 측정하고, Obol의 OVM(Obol Validator Manager)을 활용해 신뢰할 수 있는 팀을 구성하여 검증자를 공동 관리하는 혁신적인 시스템입니다.

## 🚀 주요 기능

### 1. 객관적 평판 측정 시스템
- **GitHub 활동 분석 (70% 가중치)**
  - 공개 저장소 수, 팔로워 수, 개발 경력
  - DVT/이더리움 관련 프로젝트 기여도 보너스
- **POAP 이벤트 참여 (30% 가중치)**
  - 이더리움 생태계 이벤트 참여 이력
  - EthGlobal 해커톤, DevConnect 등 고품질 이벤트 가산점

### 2. 스마트 팀 매칭
- 평판 점수 기반 자동 팀 구성
- 역할별 권한 분배 (리더, 기술, 재정, 일반)
- 팀 평균 평판 600점 이상 요구

### 3. OVM 통합 검증자 관리
- Obol Validator Manager Factory 활용
- 프로그래머블 스테이킹 구현
- 역할 기반 권한 관리 (WITHDRAWAL_ROLE, CONSOLIDATION_ROLE 등)

### 4. Hoodi 테스트넷 배포
- 실제 블록체인 환경에서 동작
- 투명한 보상 분배 시스템
- 실시간 성과 모니터링

## 🏗️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Ethers.js, Hoodi Testnet
- **APIs**: GitHub REST API, POAP API
- **Smart Contracts**: OVM Factory Integration

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 🌐 주요 엔드포인트

- `/` - 메인 페이지 및 통계
- `/reputation` - 개인 평판 점수 확인
- `/teams` - 팀 생성 및 관리
- `/dashboard` - 생태계 현황 대시보드

## 🔗 API 엔드포인트

### 평판 계산
```
POST /api/reputation/calculate
{
  "githubUsername": "vitalik",
  "walletAddress": "0x742d35Cc6639Ca0532e79025196765B368093"
}
```

### 팀 매칭
```
POST /api/team/match
{
  "operators": [
    {
      "githubUsername": "user1",
      "walletAddress": "0x...",
      "reputationScore": 750,
      "preferredRole": "leader"
    }
  ]
}
```

## 🏛️ 스마트 컨트랙트

### ValidatorTeamManager.sol
```solidity
// 핵심 기능
- createTeamValidator(): 팀 생성 및 OVM 배포
- validateTeamReputation(): 팀 평판 검증
- assignRoles(): 역할별 권한 할당
```

### 컨트랙트 주소
- **OVM Factory (Hoodi)**: `0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09`
- **Validator Team Manager**: 배포 후 업데이트 예정

## 🎮 데모 시나리오

1. **오퍼레이터 등록**: GitHub 계정과 지갑으로 평판 점수 확인
2. **팀 매칭**: 평판 기준으로 신뢰할 수 있는 팀원 찾기
3. **검증자 생성**: OVM Factory로 팀 검증자 배포
4. **역할 분배**: 팀원별 권한 할당 (리더, 보조, 관리자 등)
5. **운영 관리**: 성과 모니터링 및 보상 분배

## 📊 평판 점수 산정

### GitHub 점수 (최대 700점)
- 저장소 수: 저장소당 8점 (최대 200점)
- 팔로워: 5명당 1점 (최대 150점)
- 경력: 연차당 25점 (최대 200점)
- DVT 보너스: 관련 프로젝트 기여도 (최대 150점)

### POAP 점수 (최대 300점)
- 이더리움 이벤트: 이벤트당 25점 (최대 150점)
- 해커톤 참여: 이벤트당 50점, EthGlobal 보너스 20점 (최대 150점)

### 등급 체계
- **S급 (800+점)**: Elite DVT Operator
- **A급 (650-799점)**: Senior DVT Operator  
- **B급 (500-649점)**: Experienced Operator
- **C급 (350-499점)**: Junior Operator
- **D급 (0-349점)**: Novice Operator

## 🚨 팀 생성 요구사항

- 팀 평균 평판 600점 이상
- 최소 3명, 최대 6명의 멤버
- 리더는 700점 이상의 평판 필요
- 각 멤버는 500점 이상의 최소 평판 필요

## 🏆 해커톤 정보

**OVM Builder Blitz 2024**
- 마감: 8월 25일 23:59 UTC
- 상금: $1,000 OBOL 토큰 (1등 $650, 2등 $350)
- 목표: Obol의 OVM을 활용한 혁신적인 아이디어 구현

## 📞 지원 및 문의

- GitHub Issues
- Obol Discord: [discord.gg/obol](https://discord.gg/obol)
- Documentation: [docs.obol.tech](https://docs.obol.tech)

## 📄 라이선스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

---

**Built with ❤️ for the DVT ecosystem**