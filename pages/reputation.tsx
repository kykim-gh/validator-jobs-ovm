import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChartBarIcon, StarIcon, CodeBracketIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ReputationScore, getReputationGrade } from '../utils/reputation';

const ReputationPage = () => {
  const [githubUsername, setGithubUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReputationScore | null>(null);
  const [error, setError] = useState('');

  const calculateReputation = async () => {
    if (!githubUsername || !walletAddress) {
      setError('GitHub 사용자명과 지갑 주소를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/reputation/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUsername,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '평판 계산 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const grade = result ? getReputationGrade(result.total) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>평판 확인 - ValidatorJobs with OVM</title>
        <meta name="description" content="DVT 오퍼레이터 평판 점수를 확인하세요" />
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
              <Link href="/teams" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                팀 관리
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            DVT 오퍼레이터 평판 확인
          </h1>
          <p className="text-xl text-gray-300">
            GitHub 활동과 POAP 이벤트 참여를 기반으로 평판 점수를 계산합니다
          </p>
        </div>

        {/* Input Form */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub 사용자명
              </label>
              <input
                type="text"
                id="github"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="vitalik"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-2">
                이더리움 지갑 주소
              </label>
              <input
                type="text"
                id="wallet"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x742d35Cc6639Ca0532e79025196765B368093"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={calculateReputation}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '계산 중...' : '평판 점수 계산'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="glass-card rounded-xl p-8 text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold mb-4 ${grade?.color}`}>
                {grade?.grade}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {result.total}/1000 점
              </h2>
              <p className="text-lg text-gray-600 mb-4">{grade?.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="reputation-bar h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(result.total / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Score */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CodeBracketIcon className="w-8 h-8 text-gray-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">GitHub 활동</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {result.github}/700 점
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>저장소</span>
                    <span className="font-medium">{result.breakdown.repos}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>팔로워</span>
                    <span className="font-medium">{result.breakdown.followers}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>경력</span>
                    <span className="font-medium">{result.breakdown.experience}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DVT 관련 보너스</span>
                    <span className="font-medium">{result.breakdown.dvtBonus}점</span>
                  </div>
                </div>
              </div>

              {/* POAP Score */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-gray-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">POAP 이벤트</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {result.poap}/300 점
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>이더리움 이벤트</span>
                    <span className="font-medium">{result.breakdown.ethereumEvents}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span>해커톤 참여</span>
                    <span className="font-medium">{result.breakdown.hackathons}점</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">다음 단계</h3>
              <div className="space-y-3">
                {result.total >= 600 ? (
                  <>
                    <div className="flex items-center text-green-700">
                      <StarIcon className="w-5 h-5 mr-2" />
                      <span>팀 리더 자격 충족! 팀을 만들거나 기존 팀에 참여할 수 있습니다.</span>
                    </div>
                    <Link href="/teams" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                      팀 관리하기
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-amber-700">
                      <ChartBarIcon className="w-5 h-5 mr-2" />
                      <span>평판을 더 높여서 더 좋은 팀에 참여해보세요!</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• GitHub에서 더 많은 DVT/이더리움 관련 프로젝트에 기여하세요</p>
                      <p>• EthGlobal 해커톤이나 DevConnect 같은 이벤트에 참여하세요</p>
                      <p>• 오픈소스 검증자 도구 개발에 참여하세요</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationPage;

