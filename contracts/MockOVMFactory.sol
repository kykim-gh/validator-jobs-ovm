// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockOVMFactory
 * @dev 해커톤 데모용 Mock OVM Factory
 * 실제 OVM과 동일한 인터페이스를 제공하여 완전한 플로우 테스트 가능
 */
contract MockOVMFactory {
    
    uint256 private ovmCounter;
    
    // 생성된 OVM 추적
    mapping(address => bool) public isOVM;
    mapping(address => OVMInfo) public ovmInfo;
    
    struct OVMInfo {
        address owner;
        address principalRecipient;
        address rewardRecipient;
        uint256 principalThreshold;
        uint256 createdAt;
    }
    
    event ObolValidatorManagerCreated(
        address indexed owner,
        address indexed ovm,
        address principalRecipient,
        address rewardRecipient,
        uint256 principalThreshold
    );
    
    /**
     * @dev Mock OVM 생성 - 실제 OVM Factory와 동일한 인터페이스
     */
    function createObolValidatorManager(
        address owner,
        address principalRecipient,
        address rewardRecipient,
        uint256 principalThreshold
    ) external returns (address) {
        
        // Mock OVM 주소 생성 (deterministic)
        ovmCounter++;
        address newOVM = address(uint160(uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            ovmCounter
        )))));
        
        // OVM 정보 저장
        ovmInfo[newOVM] = OVMInfo({
            owner: owner,
            principalRecipient: principalRecipient,
            rewardRecipient: rewardRecipient,
            principalThreshold: principalThreshold,
            createdAt: block.timestamp
        });
        
        isOVM[newOVM] = true;
        
        // 이벤트 발생 (실제 OVM과 동일)
        emit ObolValidatorManagerCreated(
            owner,
            newOVM,
            principalRecipient,
            rewardRecipient,
            principalThreshold
        );
        
        return newOVM;
    }
    
    /**
     * @dev 생성된 OVM 개수 조회
     */
    function getTotalOVMs() external view returns (uint256) {
        return ovmCounter;
    }
    
    /**
     * @dev OVM 정보 조회
     */
    function getOVMInfo(address ovm) external view returns (
        address owner,
        address principalRecipient,
        address rewardRecipient,
        uint256 principalThreshold,
        uint256 createdAt
    ) {
        OVMInfo memory info = ovmInfo[ovm];
        return (
            info.owner,
            info.principalRecipient,
            info.rewardRecipient,
            info.principalThreshold,
            info.createdAt
        );
    }
}

/**
 * @title MockOVM
 * @dev 실제 OVM의 핵심 기능을 시뮬레이션하는 Mock 컨트랙트
 */
contract MockOVM {
    
    address public owner;
    address public principalRecipient;
    address public rewardRecipient;
    uint256 public principalThreshold;
    
    // 역할 상수 (실제 OVM과 동일)
    uint256 public constant WITHDRAWAL_ROLE = 1;
    uint256 public constant CONSOLIDATION_ROLE = 2;
    uint256 public constant SET_PRINCIPAL_ROLE = 4;
    uint256 public constant RECOVER_FUNDS_ROLE = 8;
    
    mapping(address => uint256) public userRoles;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RolesGranted(address indexed user, uint256 roles);
    event WithdrawalRequested(address indexed requester, uint256 amount);
    event ConsolidationRequested(address indexed requester, address consolidationRecipient);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier hasRole(uint256 role) {
        require(userRoles[msg.sender] & role != 0, "Insufficient role");
        _;
    }
    
    constructor(
        address _owner,
        address _principalRecipient,
        address _rewardRecipient,
        uint256 _principalThreshold
    ) {
        owner = _owner;
        principalRecipient = _principalRecipient;
        rewardRecipient = _rewardRecipient;
        principalThreshold = _principalThreshold;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    function grantRoles(address user, uint256 roles) external onlyOwner {
        userRoles[user] = roles;
        emit RolesGranted(user, roles);
    }
    
    function requestWithdrawal(uint256 amount) external hasRole(WITHDRAWAL_ROLE) {
        emit WithdrawalRequested(msg.sender, amount);
    }
    
    function requestConsolidation(address consolidationRecipient) external hasRole(CONSOLIDATION_ROLE) {
        emit ConsolidationRequested(msg.sender, consolidationRecipient);
    }
}

