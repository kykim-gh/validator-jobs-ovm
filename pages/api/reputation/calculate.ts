import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { calculateReputationScore, GitHubData, GitHubRepo, POAPEvent, ReputationScore } from '../../../utils/reputation';

interface ApiResponse {
  success: boolean;
  data?: ReputationScore;
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

  const { githubUsername, walletAddress } = req.body;

  if (!githubUsername || !walletAddress) {
    return res.status(400).json({ 
      success: false, 
      error: 'GitHub username and wallet address are required' 
    });
  }

  try {
    // GitHub 사용자 정보 조회
    console.log(`Fetching GitHub data for: ${githubUsername}`);
    const githubUserResponse = await axios.get<GitHubData>(
      `https://api.github.com/users/${githubUsername}`,
      {
        headers: {
          'User-Agent': 'ValidatorJobs-OVM/1.0.0',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 10000
      }
    );

    // GitHub 저장소 목록 조회
    console.log(`Fetching GitHub repos for: ${githubUsername}`);
    const githubReposResponse = await axios.get<GitHubRepo[]>(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'User-Agent': 'ValidatorJobs-OVM/1.0.0',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 10000
      }
    );

    // POAP 데이터 조회 (에러 처리 포함)
    let poapData: POAPEvent[] = [];
    try {
      console.log(`Fetching POAP data for: ${walletAddress}`);
      const poapResponse = await axios.get<POAPEvent[]>(
        `https://api.poap.tech/actions/scan/${walletAddress}`,
        {
          headers: {
            'User-Agent': 'ValidatorJobs-OVM/1.0.0',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );
      poapData = poapResponse.data || [];
    } catch (poapError) {
      console.warn('POAP API error, continuing without POAP data:', poapError);
      // POAP 데이터 없이 계속 진행
    }

    // 평판 점수 계산
    const reputationScore = calculateReputationScore(
      githubUserResponse.data,
      githubReposResponse.data,
      poapData
    );

    console.log('Reputation calculated:', {
      github: githubUsername,
      wallet: walletAddress,
      score: reputationScore.total
    });

    res.status(200).json({
      success: true,
      data: reputationScore
    });

  } catch (error) {
    console.error('Error calculating reputation:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'GitHub user not found'
        });
      } else if (error.response?.status === 403) {
        return res.status(429).json({
          success: false,
          error: 'GitHub API rate limit exceeded'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to calculate reputation score'
    });
  }
}

