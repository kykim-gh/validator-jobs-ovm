import { ethers } from 'ethers';

// MetaMask 타입 선언
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Holesky Testnet Configuration (실제 OVM이 배포된 네트워크)
export const HOLESKY_CONFIG = {
  chainId: 17000,
  name: 'Holesky Testnet',
  rpcUrl: 'https://ethereum-holesky.publicnode.com',
  explorerUrl: 'https://holesky.etherscan.io',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  OVM_FACTORY: '0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09',
  VALIDATOR_TEAM_MANAGER: '', // 배포 후 업데이트 예정
};

// Contract ABIs
export const OVM_FACTORY_ABI = [
  "function createObolValidatorManager(address owner, address principalRecipient, address rewardRecipient, uint256 principalThreshold) external returns (address)",
  "event ObolValidatorManagerCreated(address indexed owner, address indexed ovm, address principalRecipient, address rewardRecipient, uint256 principalThreshold)"
];

export const VALIDATOR_TEAM_MANAGER_ABI = [
  "function createTeamValidator(string memory teamName, address[] memory members, string[] memory githubUsernames, uint256[] memory reputationScores, string[] memory roles) external returns (uint256 teamId, address ovmAddress)",
  "function getTeamInfo(uint256 teamId) external view returns (string memory teamName, address[] memory members, address ovmAddress, uint256 averageReputation, bool isActive)",
  "function getMemberInfo(uint256 teamId, address member) external view returns (string memory githubUsername, uint256 reputationScore, string memory role, bool isActive)",
  "function getTotalTeams() external view returns (uint256)",
  "function memberTeamId(address member) external view returns (uint256)",
  "event TeamCreated(uint256 indexed teamId, string teamName, address[] members, address ovmAddress, uint256 averageReputation)",
  "event ValidatorDeployed(uint256 indexed teamId, address indexed ovmAddress, uint256 principalThreshold)",
  "event RolesAssigned(uint256 indexed teamId, address indexed member, string role, uint256 ovmRoles)"
];

export const OVM_ABI = [
  "function transferOwnership(address newOwner) external",
  "function grantRoles(address user, uint256 roles) external",
  "function requestWithdrawal(uint256 amount) external",
  "function requestConsolidation(address consolidationRecipient) external",
  "function owner() external view returns (address)",
  "function principalRecipient() external view returns (address)",
  "function rewardRecipient() external view returns (address)",
  "function principalThreshold() external view returns (uint256)"
];

// Provider 생성
export const getProvider = () => {
  return new ethers.JsonRpcProvider(HOLESKY_CONFIG.rpcUrl);
};

// Wallet 연결
export const connectWallet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // 네트워크 체크 및 전환
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${HOLESKY_CONFIG.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // 네트워크가 추가되지 않은 경우
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${HOLESKY_CONFIG.chainId.toString(16)}`,
          chainName: HOLESKY_CONFIG.name,
          rpcUrls: [HOLESKY_CONFIG.rpcUrl],
          blockExplorerUrls: [HOLESKY_CONFIG.explorerUrl],
          nativeCurrency: HOLESKY_CONFIG.nativeCurrency
        }],
      });
    } else {
      throw switchError;
    }
  }

  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  return { provider, signer, address };
};

// OVM Factory 컨트랙트 인스턴스
export const getOVMFactoryContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.OVM_FACTORY,
    OVM_FACTORY_ABI,
    signerOrProvider
  );
};

// Validator Team Manager 컨트랙트 인스턴스
export const getValidatorTeamManagerContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  if (!CONTRACT_ADDRESSES.VALIDATOR_TEAM_MANAGER) {
    throw new Error('Validator Team Manager contract not deployed yet');
  }
  
  return new ethers.Contract(
    CONTRACT_ADDRESSES.VALIDATOR_TEAM_MANAGER,
    VALIDATOR_TEAM_MANAGER_ABI,
    signerOrProvider
  );
};

// OVM 컨트랙트 인스턴스
export const getOVMContract = (ovmAddress: string, signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(ovmAddress, OVM_ABI, signerOrProvider);
};

// 팀 생성 함수
export const createTeamValidator = async (
  signer: ethers.Signer,
  teamData: {
    teamName: string;
    members: string[];
    githubUsernames: string[];
    reputationScores: number[];
    roles: string[];
  }
) => {
  const contract = getValidatorTeamManagerContract(signer);
  
  const tx = await contract.createTeamValidator(
    teamData.teamName,
    teamData.members,
    teamData.githubUsernames,
    teamData.reputationScores,
    teamData.roles
  );
  
  const receipt = await tx.wait();
  
  // TeamCreated 이벤트에서 teamId와 ovmAddress 추출
  const teamCreatedEvent = receipt.logs.find((log: any) => {
    try {
      const parsedLog = contract.interface.parseLog(log);
      return parsedLog?.name === 'TeamCreated';
    } catch {
      return false;
    }
  });
  
  if (teamCreatedEvent) {
    const parsedLog = contract.interface.parseLog(teamCreatedEvent);
    if (!parsedLog) {
      throw new Error('Failed to parse TeamCreated event');
    }
    return {
      teamId: parsedLog.args.teamId.toString(),
      ovmAddress: parsedLog.args.ovmAddress,
      txHash: tx.hash
    };
  }
  
  throw new Error('TeamCreated event not found');
};

// 팀 정보 조회
export const getTeamInfo = async (provider: ethers.Provider, teamId: number) => {
  const contract = getValidatorTeamManagerContract(provider);
  return await contract.getTeamInfo(teamId);
};

// 멤버 정보 조회
export const getMemberInfo = async (provider: ethers.Provider, teamId: number, memberAddress: string) => {
  const contract = getValidatorTeamManagerContract(provider);
  return await contract.getMemberInfo(teamId, memberAddress);
};

// 총 팀 수 조회
export const getTotalTeams = async (provider: ethers.Provider) => {
  const contract = getValidatorTeamManagerContract(provider);
  const total = await contract.getTotalTeams();
  return total.toString();
};

// 트랜잭션 상태 확인
export const waitForTransaction = async (provider: ethers.Provider, txHash: string) => {
  return await provider.waitForTransaction(txHash);
};

// 이더리움 주소 검증
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Wei to Ether 변환
export const formatEther = (wei: bigint): string => {
  return ethers.formatEther(wei);
};

// Ether to Wei 변환
export const parseEther = (ether: string): bigint => {
  return ethers.parseEther(ether);
};
