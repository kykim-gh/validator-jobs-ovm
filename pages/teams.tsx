import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { UserGroupIcon, PlusIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { connectWallet, createTeamValidator, isValidAddress } from '../utils/blockchain';

interface TeamMember {
  walletAddress: string;
  githubUsername: string;
  reputationScore: number;
  role: 'leader' | 'technical' | 'financial' | 'member';
}

const TeamsPage = () => {
  const [connectedAccount, setConnectedAccount] = useState<string>('');
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([
    { walletAddress: '', githubUsername: '', reputationScore: 0, role: 'leader' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const connectWalletHandler = async () => {
    try {
      const { address } = await connectWallet();
      setConnectedAccount(address);
      
      // Set connected wallet as first member
      if (members.length > 0) {
        const updatedMembers = [...members];
        updatedMembers[0].walletAddress = address;
        setMembers(updatedMembers);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    }
  };

  const addMember = () => {
    if (members.length < 6) {
      setMembers([...members, { 
        walletAddress: '', 
        githubUsername: '', 
        reputationScore: 0, 
        role: 'member' 
      }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const updatedMembers = members.filter((_, i) => i !== index);
      setMembers(updatedMembers);
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string | number) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const checkReputation = async (index: number) => {
    const member = members[index];
    if (!member.githubUsername || !member.walletAddress) {
      setError('GitHub 사용자명과 지갑 주소를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/reputation/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUsername: member.githubUsername,
          walletAddress: member.walletAddress,
        }),
      });

      const data = await response.json();
      if (data.success) {
        updateMember(index, 'reputationScore', data.data.total);
      } else {
        setError(data.error || '평판 조회에 실패했습니다.');
      }
    } catch (err) {
      setError('평판 조회 중 오류가 발생했습니다.');
    }
  };

  const createTeam = async () => {
    if (!connectedAccount) {
      setError('먼저 지갑을 연결해주세요.');
      return;
    }

    if (!teamName || teamName.length < 3) {
      setError('Please enter a team name of at least 3 characters.');
      return;
    }

    // 모든 멤버의 필수 정보 확인
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.walletAddress || !member.githubUsername) {
        setError(`${i + 1}번째 멤버의 정보를 모두 입력해주세요.`);
        return;
      }
      if (!isValidAddress(member.walletAddress)) {
        setError(`${i + 1}번째 멤버의 지갑 주소가 올바르지 않습니다.`);
        return;
      }
      if (member.reputationScore === 0) {
        setError(`${i + 1}번째 멤버의 평판을 먼저 확인해주세요.`);
        return;
      }
    }

    // 팀 평균 평판 확인
    const averageReputation = members.reduce((sum, member) => sum + member.reputationScore, 0) / members.length;
    if (averageReputation < 600) {
      setError(`팀 평균 평판이 600점 미만입니다. (현재: ${Math.round(averageReputation)}점)`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { signer } = await connectWallet();
      
      const teamData = {
        teamName,
        members: members.map(m => m.walletAddress),
        githubUsernames: members.map(m => m.githubUsername),
        reputationScores: members.map(m => m.reputationScore),
        roles: members.map(m => m.role),
      };

      const result = await createTeamValidator(signer, teamData);
      
      setSuccess(`팀이 성공적으로 생성되었습니다! 팀 ID: ${result.teamId}, OVM 주소: ${result.ovmAddress}`);
      
      // 폼 초기화
      setTeamName('');
      setMembers([{ walletAddress: connectedAccount, githubUsername: '', reputationScore: 0, role: 'leader' }]);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>Team Management - ValidatorJobs with OVM</title>
        <meta name="description" content="Create and manage DVT operator teams" />
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
              <Link href="/reputation" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Check Reputation
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              {connectedAccount ? (
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                  {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
                </div>
              ) : (
                <button 
                  onClick={connectWalletHandler}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Create DVT Team
          </h1>
          <p className="text-xl text-gray-300">
            신뢰할 수 있는 오퍼레이터들과 함께 검증자 팀을 만들어보세요
          </p>
        </div>

        {/* Team Creation Form */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 팀 만들기</h2>
          
          {/* Team Name */}
          <div className="mb-6">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="예: Elite DVT Operators"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">팀 멤버 ({members.length}/6)</h3>
              <button
                onClick={addMember}
                disabled={members.length >= 6}
                className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      멤버 #{index + 1} {index === 0 && '(리더)'}
                    </h4>
                    {index > 0 && (
                      <button
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        제거
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        지갑 주소
                      </label>
                      <input
                        type="text"
                        value={member.walletAddress}
                        onChange={(e) => updateMember(index, 'walletAddress', e.target.value)}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        disabled={index === 0 && !!connectedAccount}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub 사용자명
                      </label>
                      <input
                        type="text"
                        value={member.githubUsername}
                        onChange={(e) => updateMember(index, 'githubUsername', e.target.value)}
                        placeholder="username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        disabled={index === 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="leader">Leader</option>
                        <option value="technical">Technical</option>
                        <option value="financial">Financial</option>
                        <option value="member">Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reputation Score
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          value={member.reputationScore}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => checkReputation(index)}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-r-md text-sm"
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-2">팀 통계</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">평균 평판:</span>
                <span className="ml-2 font-medium">
                  {members.length > 0 ? Math.round(members.reduce((sum, member) => sum + member.reputationScore, 0) / members.length) : 0}점
                </span>
              </div>
              <div>
                <span className="text-gray-600">멤버 수:</span>
                <span className="ml-2 font-medium">{members.length}명</span>
              </div>
              <div>
                <span className="text-gray-600">상태:</span>
                <span className={`ml-2 font-medium ${members.reduce((sum, member) => sum + member.reputationScore, 0) / members.length >= 600 ? 'text-green-600' : 'text-red-600'}`}>
                  {members.reduce((sum, member) => sum + member.reputationScore, 0) / members.length >= 600 ? '생성 가능' : '평판 부족'}
                </span>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={createTeam}
            disabled={loading || !connectedAccount}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Creating Team...' : 'Create Team'}
          </button>
        </div>

        {/* Requirements */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Creation Requirements</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              <span>팀 평균 평판 600점 이상</span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-2" />
              <span>최소 3명, 최대 6명의 멤버</span>
            </div>
            <div className="flex items-center">
              <CpuChipIcon className="w-4 h-4 mr-2" />
              <span>리더는 700점 이상의 평판 필요</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;

