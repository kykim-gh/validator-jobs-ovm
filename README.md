# ValidatorJobs with OVM

DVT Operator Reputation-based Validator Management System - The OVM Builder Blitz 2025 Project

## 🎯 Project Overview

An innovative system that measures DVT operator reputation based on GitHub activity and POAP event participation, utilizing Obol's OVM (Obol Validator Manager) to form trusted teams for collaborative validator management.

## 🚀 Key Features

### 1. Objective Reputation Measurement System
- **GitHub Activity Analysis (70% Weight)**
  - Public repository count, follower count, development experience
  - DVT/Ethereum-related project contribution bonus
- **POAP Event Participation (30% Weight)**
  - Ethereum ecosystem event participation history
  - Premium event bonus for EthGlobal hackathons, DevConnect, etc.

### 2. Smart Team Matching
- Automatic team composition based on reputation scores
- Role-based permission distribution (Leader, Technical, Financial, General)
- Requires team average reputation of 600+ points

### 3. OVM-Integrated Validator Management
- Utilizes Obol Validator Manager Factory
- Implements programmable staking
- Role-based permission management (WITHDRAWAL_ROLE, CONSOLIDATION_ROLE, etc.)

### 4. Hoodi Testnet Deployment
- Operating in real blockchain environment
- Transparent reward distribution system
- Real-time performance monitoring

## 🏗️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Ethers.js, Hoodi Testnet
- **APIs**: GitHub REST API, POAP API
- **Smart Contracts**: OVM Factory Integration

## 📦 Installation and Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
npm start
```

## 🌐 Main Endpoints

- `/` - Main page and statistics
- `/reputation` - Personal reputation score check
- `/teams` - Team creation and management
- `/dashboard` - Ecosystem status dashboard

## 🔗 API Endpoints

### Reputation Calculation
```
POST /api/reputation/calculate
{
  "githubUsername": "vitalik",
  "walletAddress": "0x742d35Cc6639Ca0532e79025196765B368093"
}
```

### Team Matching
```
POST /api/team/match
{
  "operators": [
    {
      "githubUsername": "user1",
      "walletAddress": "0x...",
      "reputationScore": 750,
      "preferredRole": "leader"
    }
  ]
}
```

## 🏛️ Smart Contracts

### ValidatorTeamManager.sol
```solidity
// Core Functions
- createTeamValidator(): Team creation and OVM deployment
- validateTeamReputation(): Team reputation verification
- assignRoles(): Role-based permission assignment
```

### Contract Addresses
- **OVM Factory (Hoodi)**: `0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09`
- **Validator Team Manager**: To be updated after deployment

## 🎮 Demo Scenario

1. **Operator Registration**: Check reputation score with GitHub account and wallet
2. **Team Matching**: Find trustworthy team members based on reputation
3. **Validator Creation**: Deploy team validator using OVM Factory
4. **Role Distribution**: Assign permissions to team members (Leader, Assistant, Manager, etc.)
5. **Operations Management**: Performance monitoring and reward distribution

## 📊 Reputation Score Calculation

### GitHub Score (Max 700 points)
- Repository Count: 8 points per repository (max 200 points)
- Followers: 1 point per 5 followers (max 150 points)
- Experience: 25 points per year (max 200 points)
- DVT Bonus: Related project contributions (max 150 points)

### POAP Score (Max 300 points)
- Ethereum Events: 25 points per event (max 150 points)
- Hackathon Participation: 50 points per event, 20 bonus for EthGlobal (max 150 points)

### Grade System
- **S Grade (800+ points)**: Elite DVT Operator
- **A Grade (650-799 points)**: Senior DVT Operator  
- **B Grade (500-649 points)**: Experienced Operator
- **C Grade (350-499 points)**: Junior Operator
- **D Grade (0-349 points)**: Novice Operator

## 🚨 Team Creation Requirements

- Team average reputation of 600+ points
- Minimum 3 members, maximum 6 members
- Leader must have 700+ reputation points
- Each member must have minimum 500+ reputation points

## 🔗 Links and Resources

- **Live Demo**: http://65.21.156.254:3000
- **GitHub Repository**: https://github.com/kykim-gh/validator-jobs-ovm
- **OVM Factory**: [0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09](https://hoodiscan.com/address/0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09)
- **Demo Scenario**: `demo/DEMO_SCENARIO.md`

## 📞 Support and Contact

- GitHub Issues
- Obol Discord: [discord.gg/obol](https://discord.gg/obol)
- Documentation: [docs.obol.tech](https://docs.obol.tech)

## 📄 License

MIT License - See LICENSE file for details.

---

**Built with ❤️ for the DVT ecosystem and The OVM Builder Blitz 2025**

*"Objective reputation system for a trustworthy DVT ecosystem"*