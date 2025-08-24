import type { NextApiRequest, NextApiResponse } from 'next';

interface Operator {
  githubUsername: string;
  walletAddress: string;
  reputationScore: number;
  skills: string[];
  preferredRole: 'leader' | 'member' | 'technical' | 'financial';
}

interface TeamMatch {
  teamId: string;
  members: Operator[];
  averageReputation: number;
  teamStrength: number;
  roles: {
    leader: Operator;
    technical: Operator[];
    financial: Operator;
  };
}

interface ApiResponse {
  success: boolean;
  data?: TeamMatch[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const { operators, minTeamSize = 3, maxTeamSize = 5 } = req.body;

  if (!operators || !Array.isArray(operators) || operators.length < minTeamSize) {
    return res.status(400).json({ 
      success: false, 
      error: `At least ${minTeamSize} operators required for team matching` 
    });
  }

  try {
    // 평판 점수로 정렬 (높은 순)
    const sortedOperators = operators.sort((a: Operator, b: Operator) => 
      b.reputationScore - a.reputationScore
    );

    const teams: TeamMatch[] = [];
    const usedOperators = new Set<string>();

    // 탐욕적 알고리즘으로 팀 구성
    for (let i = 0; i < sortedOperators.length; i++) {
      const leader = sortedOperators[i];
      
      if (usedOperators.has(leader.walletAddress) || leader.reputationScore < 600) {
        continue;
      }

      // 팀 멤버 선택
      const teamMembers: Operator[] = [leader];
      usedOperators.add(leader.walletAddress);

      // 기술적 역할 담당자 찾기
      const technicalCandidates = sortedOperators.filter(op => 
        !usedOperators.has(op.walletAddress) && 
        op.reputationScore >= 500 &&
        (op.preferredRole === 'technical' || op.skills.includes('solidity') || op.skills.includes('ethereum'))
      );

      if (technicalCandidates.length > 0) {
        const technical = technicalCandidates[0];
        teamMembers.push(technical);
        usedOperators.add(technical.walletAddress);
      }

      // 재정 관리 역할 담당자 찾기
      const financialCandidates = sortedOperators.filter(op => 
        !usedOperators.has(op.walletAddress) && 
        op.reputationScore >= 450 &&
        (op.preferredRole === 'financial' || op.skills.includes('defi') || op.skills.includes('treasury'))
      );

      if (financialCandidates.length > 0) {
        const financial = financialCandidates[0];
        teamMembers.push(financial);
        usedOperators.add(financial.walletAddress);
      }

      // 추가 멤버로 팀 완성
      while (teamMembers.length < maxTeamSize) {
        const candidates = sortedOperators.filter(op => 
          !usedOperators.has(op.walletAddress) && 
          op.reputationScore >= 400
        );

        if (candidates.length === 0) break;

        const nextMember = candidates[0];
        teamMembers.push(nextMember);
        usedOperators.add(nextMember.walletAddress);
      }

      // 최소 팀 크기 확인
      if (teamMembers.length >= minTeamSize) {
        const averageReputation = teamMembers.reduce((sum, member) => 
          sum + member.reputationScore, 0) / teamMembers.length;

        // 팀 평균 평판이 600점 이상인 경우만 유효한 팀으로 인정
        if (averageReputation >= 600) {
          const teamMatch: TeamMatch = {
            teamId: `team_${teams.length + 1}`,
            members: teamMembers,
            averageReputation: Math.round(averageReputation),
            teamStrength: calculateTeamStrength(teamMembers),
            roles: {
              leader: leader,
              technical: teamMembers.filter(m => 
                m.preferredRole === 'technical' || 
                m.skills.includes('solidity') || 
                m.skills.includes('ethereum')
              ),
              financial: teamMembers.find(m => 
                m.preferredRole === 'financial' || 
                m.skills.includes('defi') || 
                m.skills.includes('treasury')
              ) || teamMembers[teamMembers.length - 1]
            }
          };

          teams.push(teamMatch);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: teams
    });

  } catch (error) {
    console.error('Error matching teams:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to match teams'
    });
  }
}

// 팀 강도 계산 (다양성, 평판 분포, 역할 커버리지 고려)
function calculateTeamStrength(members: Operator[]): number {
  const reputations = members.map(m => m.reputationScore);
  const avgReputation = reputations.reduce((sum, rep) => sum + rep, 0) / reputations.length;
  
  // 평판 편차 (낮을수록 좋음)
  const variance = reputations.reduce((sum, rep) => sum + Math.pow(rep - avgReputation, 2), 0) / reputations.length;
  const diversityScore = Math.max(0, 100 - Math.sqrt(variance) / 10);
  
  // 역할 커버리지
  const roles = new Set(members.map(m => m.preferredRole));
  const roleCoverage = (roles.size / 4) * 100; // 4가지 역할 타입
  
  // 스킬 다양성
  const allSkills = new Set(members.flatMap(m => m.skills));
  const skillDiversity = Math.min(allSkills.size * 10, 100);
  
  // 종합 점수 (0-100)
  const teamStrength = (avgReputation / 10) * 0.5 + diversityScore * 0.2 + roleCoverage * 0.15 + skillDiversity * 0.15;
  
  return Math.round(Math.min(teamStrength, 100));
}

