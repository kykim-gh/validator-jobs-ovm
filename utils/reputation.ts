// 평판 점수 계산 유틸리티
export interface GitHubData {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string | null;
  blog: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface POAPEvent {
  event: {
    id: number;
    name: string;
    description: string;
    city: string;
  };
  tokenId: string;
  created: string;
}

export interface ReputationScore {
  total: number;
  github: number;
  poap: number;
  breakdown: {
    repos: number;
    followers: number;
    experience: number;
    dvtBonus: number;
    ethereumEvents: number;
    hackathons: number;
  };
}

// GitHub 평판 계산 (최대 700점)
export const calculateGitHubScore = (userData: GitHubData, repos: GitHubRepo[]): {score: number, breakdown: any} => {
  // 1. 저장소 점수 (최대 200점)
  const reposScore = Math.min(userData.public_repos * 8, 200);
  
  // 2. 팔로워 점수 (최대 150점)
  const followersScore = Math.min(Math.floor(userData.followers / 5), 150);
  
  // 3. 경력 점수 (최대 200점)
  const accountAge = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365));
  const experienceScore = Math.min(accountAge * 25, 200);
  
  // 4. DVT/이더리움 관련 보너스 (최대 150점)
  const dvtKeywords = ['dvt', 'obol', 'ethereum', 'validator', 'consensus', 'beacon', 'staking'];
  let dvtBonus = 0;
  
  repos.forEach(repo => {
    const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
    const keywordMatches = dvtKeywords.filter(keyword => repoText.includes(keyword)).length;
    if (keywordMatches > 0) {
      dvtBonus += Math.min(keywordMatches * 15 + repo.stargazers_count, 30);
    }
  });
  
  dvtBonus = Math.min(dvtBonus, 150);
  
  const totalGithubScore = reposScore + followersScore + experienceScore + dvtBonus;
  
  return {
    score: Math.min(totalGithubScore, 700),
    breakdown: {
      repos: reposScore,
      followers: followersScore,
      experience: experienceScore,
      dvtBonus: dvtBonus
    }
  };
};

// POAP 평판 계산 (최대 300점)
export const calculatePOAPScore = (poaps: POAPEvent[]): {score: number, breakdown: any} => {
  let ethereumEvents = 0;
  let hackathons = 0;
  
  const ethereumKeywords = ['ethereum', 'eth', 'devconnect', 'devcon', 'consensus', 'staking'];
  const hackathonKeywords = ['ethglobal', 'hackathon', 'buidl', 'hack', 'builder'];
  const dvtKeywords = ['dvt', 'obol', 'validator', 'distributed'];
  
  poaps.forEach(poap => {
    const eventText = `${poap.event.name} ${poap.event.description}`.toLowerCase();
    
    // 이더리움 관련 이벤트 (기본 25점)
    if (ethereumKeywords.some(keyword => eventText.includes(keyword))) {
      ethereumEvents += 25;
      
      // DVT 관련 추가 보너스
      if (dvtKeywords.some(keyword => eventText.includes(keyword))) {
        ethereumEvents += 15;
      }
    }
    
    // 해커톤 이벤트 (높은 점수)
    if (hackathonKeywords.some(keyword => eventText.includes(keyword))) {
      hackathons += 50;
      
      // EthGlobal 추가 보너스
      if (eventText.includes('ethglobal')) {
        hackathons += 20;
      }
    }
  });
  
  ethereumEvents = Math.min(ethereumEvents, 150);
  hackathons = Math.min(hackathons, 150);
  
  const totalPoapScore = ethereumEvents + hackathons;
  
  return {
    score: Math.min(totalPoapScore, 300),
    breakdown: {
      ethereumEvents,
      hackathons
    }
  };
};

// 전체 평판 점수 계산
export const calculateReputationScore = (
  githubData: GitHubData, 
  repos: GitHubRepo[], 
  poaps: POAPEvent[]
): ReputationScore => {
  const github = calculateGitHubScore(githubData, repos);
  const poap = calculatePOAPScore(poaps);
  
  return {
    total: github.score + poap.score,
    github: github.score,
    poap: poap.score,
    breakdown: {
      ...github.breakdown,
      ...poap.breakdown
    }
  };
};

// 평판 등급 계산
export const getReputationGrade = (score: number): {grade: string, color: string, description: string} => {
  if (score >= 800) {
    return {
      grade: 'S',
      color: 'text-purple-600 bg-purple-100',
      description: 'Elite DVT Operator'
    };
  } else if (score >= 650) {
    return {
      grade: 'A',
      color: 'text-green-600 bg-green-100',
      description: 'Senior DVT Operator'
    };
  } else if (score >= 500) {
    return {
      grade: 'B',
      color: 'text-blue-600 bg-blue-100',
      description: 'Experienced Operator'
    };
  } else if (score >= 350) {
    return {
      grade: 'C',
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Junior Operator'
    };
  } else {
    return {
      grade: 'D',
      color: 'text-red-600 bg-red-100',
      description: 'Novice Operator'
    };
  }
};

