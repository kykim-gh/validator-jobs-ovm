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
      setError('Please enter both GitHub username and wallet address.');
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
        setError(data.error || 'An error occurred while calculating reputation.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const grade = result ? getReputationGrade(result.total) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>Check Reputation - ValidatorJobs with OVM</title>
        <meta name="description" content="Check your DVT operator reputation score" />
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
                Home
              </Link>
              <Link href="/teams" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Team Management
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            DVT Operator Reputation Check
          </h1>
          <p className="text-xl text-gray-300">
            Calculate reputation score based on GitHub activity and POAP event participation
          </p>
        </div>

        {/* Input Form */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Username
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
                Ethereum Wallet Address
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
              {loading ? 'Calculating...' : 'Calculate Reputation Score'}
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
                {result.total}/1000 points
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
                  <h3 className="text-xl font-semibold text-gray-900">GitHub Activity</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {result.github}/700 points
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Repositories</span>
                    <span className="font-medium">{result.breakdown.repos}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Followers</span>
                    <span className="font-medium">{result.breakdown.followers}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <span className="font-medium">{result.breakdown.experience}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DVT Related Bonus</span>
                    <span className="font-medium">{result.breakdown.dvtBonus}pts</span>
                  </div>
                </div>
              </div>

              {/* POAP Score */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-gray-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">POAP Events</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {result.poap}/300 points
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ethereum Events</span>
                    <span className="font-medium">{result.breakdown.ethereumEvents}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hackathon Participation</span>
                    <span className="font-medium">{result.breakdown.hackathons}pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                {result.total >= 600 ? (
                  <>
                    <div className="flex items-center text-green-700">
                      <StarIcon className="w-5 h-5 mr-2" />
                      <span>Team leader qualification met! You can create a team or join an existing team.</span>
                    </div>
                    <Link href="/teams" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                      Manage Teams
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-amber-700">
                      <ChartBarIcon className="w-5 h-5 mr-2" />
                      <span>Increase your reputation to join better teams!</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Contribute to more DVT/Ethereum related projects on GitHub</p>
                      <p>• Participate in events like EthGlobal hackathons or DevConnect</p>
                      <p>• Participate in open source validator tool development</p>
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

