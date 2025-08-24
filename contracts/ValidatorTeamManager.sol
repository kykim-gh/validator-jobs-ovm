// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IOVMFactory {
    function createObolValidatorManager(
        address owner,
        address principalRecipient,
        address rewardRecipient,
        uint256 principalThreshold
    ) external returns (address);
}

interface IObolValidatorManager {
    function transferOwnership(address newOwner) external;
    function grantRoles(address user, uint256 roles) external;
    function requestWithdrawal(uint256 amount) external;
    function requestConsolidation(address consolidationRecipient) external;
}

contract ValidatorTeamManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // OVM Factory on Hoodi Testnet (해커톤에서 제공된 주소 - 실제 배포 확인 필요)
    IOVMFactory public constant OVM_FACTORY = IOVMFactory(0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09);
    
    // 역할 상수
    uint256 public constant WITHDRAWAL_ROLE = 1;
    uint256 public constant CONSOLIDATION_ROLE = 2;
    uint256 public constant SET_PRINCIPAL_ROLE = 4;
    uint256 public constant RECOVER_FUNDS_ROLE = 8;
    
    // 최소 평판 점수 요구사항
    uint256 public constant MIN_TEAM_AVERAGE_REPUTATION = 600;
    uint256 public constant MIN_LEADER_REPUTATION = 700;
    uint256 public constant MIN_MEMBER_REPUTATION = 500;
    
    Counters.Counter private _teamIds;
    
    struct TeamMember {
        address walletAddress;
        string githubUsername;
        uint256 reputationScore;
        string role; // "leader", "technical", "financial", "member"
        bool isActive;
    }
    
    struct ValidatorTeam {
        uint256 teamId;
        string teamName;
        address[] members;
        mapping(address => TeamMember) memberInfo;
        address ovmAddress;
        uint256 averageReputation;
        uint256 createdAt;
        bool isActive;
        uint256 totalStaked;
        uint256 totalRewards;
    }
    
    // 팀 ID => 팀 정보
    mapping(uint256 => ValidatorTeam) public teams;
    
    // 지갑 주소 => 참여 중인 팀 ID
    mapping(address => uint256) public memberTeamId;
    
    // OVM 주소 => 팀 ID
    mapping(address => uint256) public ovmToTeamId;
    
    event TeamCreated(
        uint256 indexed teamId,
        string teamName,
        address[] members,
        address ovmAddress,
        uint256 averageReputation
    );
    
    event ValidatorDeployed(
        uint256 indexed teamId,
        address indexed ovmAddress,
        uint256 principalThreshold
    );
    
    event RolesAssigned(
        uint256 indexed teamId,
        address indexed member,
        string role,
        uint256 ovmRoles
    );
    
    event ReputationUpdated(
        address indexed member,
        uint256 oldScore,
        uint256 newScore
    );
    
    constructor() {}
    
    /**
     * @dev 새로운 팀 생성 및 OVM 배포
     */
    function createTeamValidator(
        string memory teamName,
        address[] memory members,
        string[] memory githubUsernames,
        uint256[] memory reputationScores,
        string[] memory roles
    ) external nonReentrant returns (uint256 teamId, address ovmAddress) {
        require(members.length >= 3 && members.length <= 6, "Team size must be 3-6 members");
        require(
            members.length == githubUsernames.length && 
            members.length == reputationScores.length &&
            members.length == roles.length,
            "Array lengths must match"
        );
        
        // 평판 검증
        require(validateTeamReputation(reputationScores, roles), "Team reputation requirements not met");
        
        // 팀원 중복 체크
        for (uint i = 0; i < members.length; i++) {
            require(memberTeamId[members[i]] == 0, "Member already in another team");
            require(reputationScores[i] >= MIN_MEMBER_REPUTATION, "Member reputation too low");
        }
        
        // 팀 ID 생성
        _teamIds.increment();
        teamId = _teamIds.current();
        
        // 평균 평판 계산
        uint256 totalReputation = 0;
        for (uint i = 0; i < reputationScores.length; i++) {
            totalReputation += reputationScores[i];
        }
        uint256 averageReputation = totalReputation / reputationScores.length;
        
        // 팀 리더 찾기 (가장 높은 평판)
        address teamLeader = members[0];
        uint256 highestReputation = reputationScores[0];
        for (uint i = 1; i < members.length; i++) {
            if (reputationScores[i] > highestReputation) {
                highestReputation = reputationScores[i];
                teamLeader = members[i];
            }
        }
        
        // OVM 생성
        ovmAddress = OVM_FACTORY.createObolValidatorManager(
            address(this),          // 이 컨트랙트가 초기 소유자
            teamLeader,             // 팀 리더가 원금 수령자
            address(this),          // 보상은 이 컨트랙트에서 분배
            16 ether               // 16 ETH 원금 임계값
        );
        
        // 팀 정보 저장
        ValidatorTeam storage team = teams[teamId];
        team.teamId = teamId;
        team.teamName = teamName;
        team.members = members;
        team.ovmAddress = ovmAddress;
        team.averageReputation = averageReputation;
        team.createdAt = block.timestamp;
        team.isActive = true;
        
        // 팀원 정보 저장
        for (uint i = 0; i < members.length; i++) {
            team.memberInfo[members[i]] = TeamMember({
                walletAddress: members[i],
                githubUsername: githubUsernames[i],
                reputationScore: reputationScores[i],
                role: roles[i],
                isActive: true
            });
            memberTeamId[members[i]] = teamId;
        }
        
        // 매핑 업데이트
        ovmToTeamId[ovmAddress] = teamId;
        
        // 이벤트 발생
        emit TeamCreated(teamId, teamName, members, ovmAddress, averageReputation);
        emit ValidatorDeployed(teamId, ovmAddress, 16 ether);
        
        // 역할 할당
        _assignRoles(teamId, ovmAddress);
        
        return (teamId, ovmAddress);
    }
    
    /**
     * @dev OVM에 팀원별 역할 할당
     */
    function _assignRoles(uint256 teamId, address ovmAddress) internal {
        ValidatorTeam storage team = teams[teamId];
        IObolValidatorManager ovm = IObolValidatorManager(ovmAddress);
        
        for (uint i = 0; i < team.members.length; i++) {
            address member = team.members[i];
            TeamMember memory memberInfo = team.memberInfo[member];
            uint256 roles = 0;
            
            // 역할에 따른 권한 부여
            if (keccak256(bytes(memberInfo.role)) == keccak256(bytes("leader"))) {
                roles = WITHDRAWAL_ROLE | CONSOLIDATION_ROLE | SET_PRINCIPAL_ROLE;
            } else if (keccak256(bytes(memberInfo.role)) == keccak256(bytes("financial"))) {
                roles = WITHDRAWAL_ROLE | SET_PRINCIPAL_ROLE;
            } else if (keccak256(bytes(memberInfo.role)) == keccak256(bytes("technical"))) {
                roles = CONSOLIDATION_ROLE | RECOVER_FUNDS_ROLE;
            } else {
                roles = WITHDRAWAL_ROLE; // 기본 멤버는 출금 권한만
            }
            
            // OVM에 역할 부여
            ovm.grantRoles(member, roles);
            
            emit RolesAssigned(teamId, member, memberInfo.role, roles);
        }
    }
    
    /**
     * @dev 팀 평판 검증
     */
    function validateTeamReputation(
        uint256[] memory scores,
        string[] memory roles
    ) internal pure returns (bool) {
        uint256 totalScore = 0;
        bool hasLeader = false;
        
        for (uint i = 0; i < scores.length; i++) {
            totalScore += scores[i];
            
            // 리더 평판 체크
            if (keccak256(bytes(roles[i])) == keccak256(bytes("leader"))) {
                if (scores[i] < MIN_LEADER_REPUTATION) {
                    return false;
                }
                hasLeader = true;
            }
        }
        
        // 평균 평판 체크
        uint256 averageScore = totalScore / scores.length;
        return averageScore >= MIN_TEAM_AVERAGE_REPUTATION && hasLeader;
    }
    
    /**
     * @dev 팀원 평판 업데이트
     */
    function updateMemberReputation(
        address member,
        uint256 newScore
    ) external onlyOwner {
        uint256 teamId = memberTeamId[member];
        require(teamId != 0, "Member not in any team");
        
        ValidatorTeam storage team = teams[teamId];
        uint256 oldScore = team.memberInfo[member].reputationScore;
        team.memberInfo[member].reputationScore = newScore;
        
        // 팀 평균 평판 재계산
        uint256 totalReputation = 0;
        for (uint i = 0; i < team.members.length; i++) {
            totalReputation += team.memberInfo[team.members[i]].reputationScore;
        }
        team.averageReputation = totalReputation / team.members.length;
        
        emit ReputationUpdated(member, oldScore, newScore);
    }
    
    /**
     * @dev 팀 정보 조회
     */
    function getTeamInfo(uint256 teamId) external view returns (
        string memory teamName,
        address[] memory members,
        address ovmAddress,
        uint256 averageReputation,
        bool isActive
    ) {
        ValidatorTeam storage team = teams[teamId];
        return (
            team.teamName,
            team.members,
            team.ovmAddress,
            team.averageReputation,
            team.isActive
        );
    }
    
    /**
     * @dev 팀원 정보 조회
     */
    function getMemberInfo(uint256 teamId, address member) external view returns (
        string memory githubUsername,
        uint256 reputationScore,
        string memory role,
        bool isActive
    ) {
        TeamMember memory memberInfo = teams[teamId].memberInfo[member];
        return (
            memberInfo.githubUsername,
            memberInfo.reputationScore,
            memberInfo.role,
            memberInfo.isActive
        );
    }
    
    /**
     * @dev 총 팀 수 조회
     */
    function getTotalTeams() external view returns (uint256) {
        return _teamIds.current();
    }
}

