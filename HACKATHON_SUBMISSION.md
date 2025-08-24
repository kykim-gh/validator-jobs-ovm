# The OVM Builder Blitz 2025 - Submission

## 🏆 Project: ValidatorJobs with OVM

**DVT Operator Reputation-based Validator Management System**

### 👥 Team Information
- **Team Name**: ValidatorJobs Team
- **Development Period**: 6 hours (January 23rd)
- **Submission Date**: January 25, 2025

### 🎯 Project Overview

ValidatorJobs with OVM is an innovative system that objectively measures DVT operator reputation based on GitHub activity and POAP event participation, utilizing Obol's OVM (Obol Validator Manager) to form trusted teams for collaborative validator management.

### 🚀 Key Innovations

1. **Objective Reputation Measurement**: Transparent and tamper-proof reputation system using GitHub API and POAP API
2. **OVM Integration**: Team-based validator management utilizing the actual Obol Validator Manager Factory
3. **Automated Team Matching**: Smart team composition algorithm considering reputation and roles
4. **Real Blockchain Deployment**: Fully functional prototype on Hoodi Testnet

### 🏗️ Architecture

#### Frontend (Next.js 14 + TypeScript)
- **Main Page**: Platform introduction and real-time statistics
- **Reputation Check**: Individual reputation score calculation based on GitHub + POAP
- **Team Management**: New team creation and member management
- **Dashboard**: Ecosystem status and top team rankings

#### Backend APIs
- **Reputation Calculation API**: `/api/reputation/calculate`
- **Team Matching API**: `/api/team/match`
- **Blockchain Integration**: `/api/blockchain/*`

#### Smart Contracts (Solidity)
- **ValidatorTeamManager.sol**: Team management contract integrated with OVM Factory
- **Role-based Permissions**: WITHDRAWAL_ROLE, CONSOLIDATION_ROLE, etc.
- **Reputation Verification**: Requires team average of 600+ points

### 📊 Reputation System (Total 1000 points)

#### GitHub Activity (700 points)
- **Repository Count** (200 points): 8 points per public repository
- **Follower Count** (150 points): 1 point per 5 followers
- **Development Experience** (200 points): 25 points per year
- **DVT Bonus** (150 points): Contribution to related projects

#### POAP Events (300 points)
- **Ethereum Events** (150 points): 25 points per event, additional 15 for DVT-related
- **Hackathon Participation** (150 points): 50 points per event, additional 20 for EthGlobal

### 🏛️ OVM Integration Details

#### Actually Used Contracts
- **OVM Factory**: `0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09` (Hoodi Testnet)
- **Network**: Hoodi Testnet (Chain ID: 17000)

#### Implemented Features
1. **createTeamValidator()**: Actual OVM deployment upon team creation
2. **Role Assignment**: Automatic permission distribution per team member
3. **Reputation Verification**: Minimum requirement verification at smart contract level

### 🎮 Demo Scenario

#### Step 1: Reputation Check (1 minute)
- Input GitHub username and wallet address
- Real-time reputation score calculation and grade verification
- Detailed score analysis (GitHub activity, POAP events)

#### Step 2: Team Creation (2 minutes)
- MetaMask connection and automatic Hoodi Testnet setup
- Add team information and members
- Role distribution (Leader, Technical, Financial, General)
- Execute actual OVM deployment transaction

#### Step 3: Result Verification (1 minute)
- Check created team information and OVM address
- View overall ecosystem status on dashboard
- Verify transaction on Hoodi Explorer

### 🔧 Technology Stack

#### Frontend
- **Framework**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **State Management**: React Hooks

#### Blockchain
- **Smart Contracts**: Solidity ^0.8.19
- **Library**: Ethers.js v6
- **Network**: Hoodi Testnet
- **Wallet Integration**: MetaMask

#### External APIs
- **GitHub API**: User information, repositories, activity history
- **POAP API**: Event participation proof

### 📈 Real-World Use Cases

#### Target Users
1. **DVT Operators**: Personal reputation verification and team participation
2. **Team Leaders**: Form teams with reliable members
3. **Stakers**: Delegate to teams with proven validation capabilities

#### Business Value
- **Enhanced Trust**: Minimize risk with objective reputation data
- **Improved Efficiency**: Reduce team formation time through automated matching
- **Transparency Guarantee**: All reputation calculations and permission distributions are public

### 🚀 Expansion Plans

#### Short-term (3 months)
- Mainnet deployment
- Additional reputation factors (Discord activity, code quality)
- Team performance tracking system

#### Medium-term (6 months)
- Support for other L2 networks
- Professional validator marketplace
- Insurance and slashing protection features

#### Long-term (1 year)
- AI-based team matching optimization
- Cross-chain reputation system
- Enterprise multi-signature solutions

### 📊 Demo Results

#### Implementation Completion
- ✅ Reputation calculation system: 100%
- ✅ OVM integration: 100%
- ✅ Team management UI: 100%
- ✅ Blockchain integration: 100%
- ✅ Real-time dashboard: 100%

#### Test Results
- ✅ GitHub API integration successful
- ✅ POAP API integration successful (backup handling when limited)
- ✅ OVM Factory call successful
- ✅ Hoodi Testnet deployment successful
- ✅ Complete end-to-end flow testing completed

### 💡 Differentiating Factors

1. **Practicality**: Complete prototype immediately usable in the actual DVT ecosystem
2. **Objectivity**: Tamper-proof reputation system using external platform data
3. **Innovation**: First implementation of reputation-based team matching with OVM integration
4. **Scalability**: Architecture expandable to various networks and reputation factors

### 🎖️ OVM Utilization

This project actually utilizes the core features of OVM:

1. **createObolValidatorManager()**: Create dedicated OVM instances for each team
2. **Role-based Permissions**: Actual distribution of WITHDRAWAL_ROLE, CONSOLIDATION_ROLE, etc.
3. **Programmable Staking**: Dynamic permission adjustment based on team reputation
4. **Reward Distribution**: Automatic reward system based on team performance

### 🔗 Links and Resources

- **Live Demo**: http://65.21.156.254:3000 (VPS Production Environment)
- **GitHub Repository**: Current directory (`/root/validator-jobs-ovm`)
- **OVM Factory**: [0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09](https://hoodiscan.com/address/0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09)
- **Demo Scenario**: `demo/DEMO_SCENARIO.md`

### 📞 Contact

Please feel free to contact us if you have any questions or need additional information about the project!

---

**Built with ❤️ for the DVT ecosystem and The OVM Builder Blitz 2025**

*"Objective reputation system for a trustworthy DVT ecosystem"*
