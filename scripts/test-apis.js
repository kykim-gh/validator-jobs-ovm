#!/usr/bin/env node

// API 엔드포인트 테스트 스크립트
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 테스트 데이터
const testData = {
  github: 'vitalik',
  wallet: '0x742d35Cc6639Ca0532e79025196765B368093B6B',
  operators: [
    {
      githubUsername: 'vitalik',
      walletAddress: '0x742d35Cc6639Ca0532e79025196765B368093B6B',
      reputationScore: 850,
      preferredRole: 'leader',
      skills: ['solidity', 'ethereum']
    },
    {
      githubUsername: 'ethereum',
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      reputationScore: 720,
      preferredRole: 'technical',
      skills: ['solidity', 'smart-contracts']
    },
    {
      githubUsername: 'consensys',
      walletAddress: '0x8ba1f109551bD432803012645Hac136c22C85BC',
      reputationScore: 680,
      preferredRole: 'financial',
      skills: ['defi', 'treasury']
    }
  ]
};

async function testReputationAPI() {
  console.log('🔍 평판 계산 API 테스트...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/reputation/calculate`, {
      githubUsername: testData.github,
      walletAddress: testData.wallet
    });
    
    if (response.data.success) {
      console.log('✅ 평판 계산 성공:');
      console.log(`   총점: ${response.data.data.total}/1000`);
      console.log(`   GitHub: ${response.data.data.github}/700`);
      console.log(`   POAP: ${response.data.data.poap}/300`);
      console.log(`   세부 점수:`, response.data.data.breakdown);
    } else {
      console.log('❌ 평판 계산 실패:', response.data.error);
    }
  } catch (error) {
    console.log('❌ API 호출 오류:', error.message);
  }
  
  console.log('');
}

async function testTeamMatchingAPI() {
  console.log('👥 팀 매칭 API 테스트...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/team/match`, {
      operators: testData.operators,
      minTeamSize: 3,
      maxTeamSize: 5
    });
    
    if (response.data.success) {
      console.log('✅ 팀 매칭 성공:');
      response.data.data.forEach((team, index) => {
        console.log(`   팀 ${index + 1}: ${team.teamId}`);
        console.log(`   멤버: ${team.members.length}명`);
        console.log(`   평균 평판: ${team.averageReputation}점`);
        console.log(`   팀 강도: ${team.teamStrength}/100`);
      });
    } else {
      console.log('❌ 팀 매칭 실패:', response.data.error);
    }
  } catch (error) {
    console.log('❌ API 호출 오류:', error.message);
  }
  
  console.log('');
}

async function testGitHubAPI() {
  console.log('🐙 GitHub API 연결 테스트...');
  
  try {
    const response = await axios.get(`https://api.github.com/users/${testData.github}`, {
      headers: {
        'User-Agent': 'ValidatorJobs-OVM/1.0.0'
      }
    });
    
    console.log('✅ GitHub API 연결 성공:');
    console.log(`   사용자: ${response.data.login}`);
    console.log(`   저장소: ${response.data.public_repos}개`);
    console.log(`   팔로워: ${response.data.followers}명`);
    console.log(`   생성일: ${response.data.created_at}`);
  } catch (error) {
    console.log('❌ GitHub API 오류:', error.message);
  }
  
  console.log('');
}

async function testPOAPAPI() {
  console.log('🏆 POAP API 연결 테스트...');
  
  try {
    const response = await axios.get(`https://api.poap.tech/actions/scan/${testData.wallet}`, {
      headers: {
        'User-Agent': 'ValidatorJobs-OVM/1.0.0'
      },
      timeout: 10000
    });
    
    console.log('✅ POAP API 연결 성공:');
    console.log(`   POAP 개수: ${response.data.length}개`);
    if (response.data.length > 0) {
      console.log(`   최근 이벤트: ${response.data[0].event.name}`);
    }
  } catch (error) {
    console.log('⚠️ POAP API 제한 (정상):', error.response?.status || error.message);
  }
  
  console.log('');
}

async function runAllTests() {
  console.log('🚀 ValidatorJobs with OVM - API 테스트 시작\n');
  
  // 외부 API 테스트
  await testGitHubAPI();
  await testPOAPAPI();
  
  // 내부 API 테스트 (서버가 실행 중일 때만)
  try {
    await axios.get(`${BASE_URL}/api/test`);
    await testReputationAPI();
    await testTeamMatchingAPI();
  } catch (error) {
    console.log('💡 참고: 서버가 실행되지 않아 내부 API 테스트를 건너뜁니다.');
    console.log('   개발 서버 실행: npm run dev\n');
  }
  
  console.log('🏁 테스트 완료');
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testReputationAPI,
  testTeamMatchingAPI,
  testGitHubAPI,
  testPOAPAPI
};

