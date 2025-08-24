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
        <meta name="description" content="DVT Operator Reputation-based Validator Management System" />
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
                Check Reputation
              </Link>
              <Link href="/teams" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Team Management
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Connect Wallet
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
                  <span className="block">DVT Operator</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Reputation-based Team Matching
                  </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Measure DVT operator reputation based on GitHub activity and POAP event participation, 
                  and form trusted teams using OVM (Obol Validator Manager).
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link href="/reputation" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-colors">
                      Check Reputation
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/teams" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors">
                      Create Team
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
            <h2 className="text-3xl font-extrabold text-white">Platform Status</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Real-time DVT Ecosystem Data
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-lg mb-4">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalOperators}</div>
                <div className="text-sm text-gray-600">Registered Operators</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-lg mb-4">
                  <CpuChipIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTeams}</div>
                <div className="text-sm text-gray-600">Active Teams</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalValidators}</div>
                <div className="text-sm text-gray-600">Running Validators</div>
              </div>

              <div className="glass-card rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-lg mb-4">
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.averageReputation}</div>
                <div className="text-sm text-gray-600">Average Reputation Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Why ValidatorJobs with OVM?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Objective Reputation Measurement</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Transparent and objective reputation system based on GitHub activity and POAP event participation
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Smart Team Matching</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Optimal DVT team composition through automatic team matching considering reputation and roles
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <CpuChipIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">OVM Integration</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Programmable staking and role-based permission management using Obol's OVM
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <GlobeAltIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Hoodi Testnet</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Validator management and reward distribution system implemented in real blockchain environment
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
              © 2025 ValidatorJobs with OVM. Built for The OVM Builder Blitz 2025.
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

