import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CpuChipIcon, 
  CurrencyDollarIcon,
  TrophyIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalOperators: number;
  totalTeams: number;
  totalValidators: number;
  totalStaked: number;
  averageReputation: number;
  topTeams: Array<{
    id: string;
    name: string;
    members: number;
    reputation: number;
    validators: number;
    staked: number;
  }>;
  recentActivity: Array<{
    type: 'team_created' | 'validator_deployed' | 'reward_distributed';
    description: string;
    timestamp: number;
    amount?: number;
  }>;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOperators: 0,
    totalTeams: 0,
    totalValidators: 0,
    totalStaked: 0,
    averageReputation: 0,
    topTeams: [],
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 API를 통해 데이터를 가져옴
    // 현재는 데모 데이터 사용
    setTimeout(() => {
      setStats({
        totalOperators: 127,
        totalTeams: 34,
        totalValidators: 89,
        totalStaked: 2847.5,
        averageReputation: 724,
        topTeams: [
          {
            id: 'team_1',
            name: 'Elite DVT Squad',
            members: 5,
            reputation: 856,
            validators: 12,
            staked: 384.0
          },
          {
            id: 'team_2', 
            name: 'Crypto Validators Pro',
            members: 4,
            reputation: 798,
            validators: 8,
            staked: 256.0
          },
          {
            id: 'team_3',
            name: 'Ethereum Alliance',
            members: 6,
            reputation: 742,
            validators: 15,
            staked: 480.0
          },
          {
            id: 'team_4',
            name: 'Staking Experts',
            members: 3,
            reputation: 687,
            validators: 6,
            staked: 192.0
          },
          {
            id: 'team_5',
            name: 'DVT Pioneers',
            members: 4,
            reputation: 654,
            validators: 9,
            staked: 288.0
          }
        ],
        recentActivity: [
          {
            type: 'team_created',
            description: 'Elite DVT Squad 팀이 생성되었습니다',
            timestamp: Date.now() - 3600000
          },
          {
            type: 'validator_deployed',
            description: 'Crypto Validators Pro가 새 검증자를 배포했습니다',
            timestamp: Date.now() - 7200000
          },
          {
            type: 'reward_distributed',
            description: 'Ethereum Alliance에 보상이 분배되었습니다',
            timestamp: Date.now() - 10800000,
            amount: 2.4
          },
          {
            type: 'team_created',
            description: 'Staking Experts 팀이 생성되었습니다', 
            timestamp: Date.now() - 14400000
          },
          {
            type: 'validator_deployed',
            description: 'DVT Pioneers가 새 검증자를 배포했습니다',
            timestamp: Date.now() - 18000000
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return '방금 전';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team_created':
        return <UserGroupIcon className="w-5 h-5 text-blue-500" />;
      case 'validator_deployed':
        return <CpuChipIcon className="w-5 h-5 text-green-500" />;
      case 'reward_distributed':
        return <CurrencyDollarIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>대시보드 - ValidatorJobs with OVM</title>
        <meta name="description" content="DVT 생태계 현황과 통계를 확인하세요" />
      </Head>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">ValidatorJobs</h1>
                <p className="text-sm text-purple-300">with OVM</p>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                홈
              </Link>
              <Link href="/reputation" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                평판 확인
              </Link>
              <Link href="/teams" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                팀 관리
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            DVT 생태계 대시보드
          </h1>
          <p className="text-xl text-gray-300">
            실시간 통계와 활동 현황을 확인하세요
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-lg mb-4">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalOperators}</div>
            <div className="text-sm text-gray-600">등록된 오퍼레이터</div>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-lg mb-4">
              <CpuChipIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTeams}</div>
            <div className="text-sm text-gray-600">활성화된 팀</div>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg mb-4">
              <CpuChipIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalValidators}</div>
            <div className="text-sm text-gray-600">운영 중인 검증자</div>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-lg mb-4">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalStaked.toFixed(1)}</div>
            <div className="text-sm text-gray-600">총 스테이킹 (ETH)</div>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-lg mb-4">
              <ChartBarIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.averageReputation}</div>
            <div className="text-sm text-gray-600">평균 평판 점수</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Teams */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center mb-6">
              <TrophyIcon className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">상위 팀 순위</h2>
            </div>
            
            <div className="space-y-4">
              {stats.topTeams.map((team, index) => (
                <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-600">
                        {team.members}명 • 평판 {team.reputation}점
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{team.validators}개 검증자</div>
                    <div className="text-sm text-gray-600">{team.staked} ETH</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center mb-6">
              <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">최근 활동</h2>
            </div>
            
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="mr-3 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900">{activity.description}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-gray-600">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-green-600">
                          +{activity.amount} ETH
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 실행</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/reputation" className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              평판 확인하기
            </Link>
            <Link href="/teams" className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              팀 만들기
            </Link>
            <a 
              href="https://docs.obol.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CpuChipIcon className="w-5 h-5 mr-2" />
              OVM 문서 보기
            </a>
          </div>
        </div>

        {/* Network Info */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">네트워크 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-gray-600">네트워크</div>
              <div className="font-medium">Hoodi Testnet</div>
            </div>
            <div>
              <div className="text-gray-600">OVM Factory</div>
              <div className="font-mono text-xs break-all">0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09</div>
            </div>
            <div>
              <div className="text-gray-600">블록 탐색기</div>
              <a 
                href="https://hoodiscan.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800"
              >
                hoodiscan.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

