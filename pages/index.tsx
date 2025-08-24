import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChartBarIcon, UserGroupIcon, CpuChipIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalOperators: 0,
    totalTeams: 0,
    totalValidators: 0,
    averageReputation: 0
  });

  useEffect(() => {
    // 통계 데이터 로드 (실제 구현에서는 API 호출)
    setStats({
      totalOperators: 127,
      totalTeams: 34,
      totalValidators: 89,
      averageReputation: 724
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>ValidatorJobs with OVM - DVT Operator Reputation System</title>
        <meta name="description" content="DVT 오퍼레이터 평판 기반 검증자 관리 시스템" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">ValidatorJobs</h1>
                <p className="text-sm text-purple-300">with OVM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/reputation" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                평판 확인
              </Link>
              <Link href="/teams" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                팀 관리
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                대시보드
              </Link>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                지갑 연결
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">DVT 오퍼레이터</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    평판 기반 팀 매칭
                  </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  GitHub 활동과 POAP 이벤트 참여를 기반으로 DVT 오퍼레이터의 평판을 측정하고, 
                  OVM(Obol Validator Manager)을 활용해 신뢰할 수 있는 팀을 구성하세요.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link href="/reputation" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-colors">
                      평판 확인하기
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/teams" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors">
                      팀 만들기
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-white">플랫폼 현황</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              실시간 DVT 생태계 데이터
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-lg mb-4">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalOperators}</div>
                <div className="text-sm text-gray-600">등록된 오퍼레이터</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-lg mb-4">
                  <CpuChipIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTeams}</div>
                <div className="text-sm text-gray-600">활성화된 팀</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalValidators}</div>
                <div className="text-sm text-gray-600">운영 중인 검증자</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-lg mb-4">
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.averageReputation}</div>
                <div className="text-sm text-gray-600">평균 평판 점수</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">특징</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              왜 ValidatorJobs with OVM인가?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">객관적 평판 측정</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  GitHub 활동과 POAP 이벤트 참여를 기반으로 한 투명하고 객관적인 평판 시스템
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">스마트 팀 매칭</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  평판과 역할을 고려한 자동 팀 매칭으로 최적의 DVT 팀 구성
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <CpuChipIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">OVM 통합</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Obol의 OVM을 활용한 프로그래머블 스테이킹과 역할 기반 권한 관리
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <GlobeAltIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Hoodi 테스트넷</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  실제 블록체인 환경에서 검증자 관리와 보상 분배 시스템 구현
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 ValidatorJobs with OVM. Built for OVM Builder Blitz Hackathon.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="https://github.com" className="text-gray-400 hover:text-white">
                GitHub
              </a>
              <a href="https://docs.obol.tech" className="text-gray-400 hover:text-white">
                Obol Docs
              </a>
              <a href="https://hoodiscan.com" className="text-gray-400 hover:text-white">
                Hoodi Explorer
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

