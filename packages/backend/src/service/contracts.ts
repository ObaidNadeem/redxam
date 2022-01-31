import axios from 'axios';
import Web3 from 'web3';
import { User } from '@/database';

const web3Celo = new Web3('https://forno.celo.org');
const web3 = new Web3('https://mainnet.infura.io/v3/9a22885f01d8436787173c4c95ad4bdd');

const ownContract = '0x635Dc716B223e89783D6a95045d3939fCb445AB4';
const coingeckoApiPrice =
  'https://api.coingecko.com/api/v3/simple/price?ids=aave-usdc&vs_currencies=usd';

const harverstContract = new web3.eth.Contract(
  [
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Invest',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newStrategy',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'time',
          type: 'uint256',
        },
      ],
      name: 'StrategyAnnounced',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newStrategy',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'oldStrategy',
          type: 'address',
        },
      ],
      name: 'StrategyChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Withdraw',
      type: 'event',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
      name: 'announceStrategyUpdate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'availableToInvestOut',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
      name: 'canUpdateStrategy',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'controller',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'deposit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'holder', type: 'address' },
      ],
      name: 'depositFor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'doHardWork',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'finalizeStrategyUpdate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'finalizeUpgrade',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'futureStrategy',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getPricePerFullShare',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'governance',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'string', name: 'symbol', type: 'string' },
        { internalType: 'uint8', name: 'decimals', type: 'uint8' },
      ],
      name: 'initialize',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_underlying', type: 'address' },
        {
          internalType: 'uint256',
          name: '_toInvestNumerator',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_toInvestDenominator',
          type: 'uint256',
        },
        { internalType: 'uint256', name: '_underlyingUnit', type: 'uint256' },
        {
          internalType: 'uint256',
          name: '_implementationChangeDelay',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_strategyChangeDelay',
          type: 'uint256',
        },
      ],
      name: 'initialize',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: '_storage', type: 'address' }],
      name: 'initialize',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_storage', type: 'address' },
        { internalType: 'address', name: '_underlying', type: 'address' },
        {
          internalType: 'uint256',
          name: '_toInvestNumerator',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_toInvestDenominator',
          type: 'uint256',
        },
      ],
      name: 'initializeVault',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'nextImplementation',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'nextImplementationDelay',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'nextImplementationTimestamp',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'rebalance',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: 'impl', type: 'address' }],
      name: 'scheduleUpgrade',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: '_store', type: 'address' }],
      name: 'setStorage',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: '_strategy', type: 'address' }],
      name: 'setStrategy',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'uint256', name: 'numerator', type: 'uint256' },
        { internalType: 'uint256', name: 'denominator', type: 'uint256' },
      ],
      name: 'setVaultFractionToInvest',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'shouldUpgrade',
      outputs: [
        { internalType: 'bool', name: '', type: 'bool' },
        { internalType: 'address', name: '', type: 'address' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'strategy',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'strategyTimeLock',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'strategyUpdateTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'underlying',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'underlyingBalanceInVault',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'underlyingBalanceWithInvestment',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'holder', type: 'address' }],
      name: 'underlyingBalanceWithInvestmentForHolder',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'underlyingUnit',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'vaultFractionToInvestDenominator',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'vaultFractionToInvestNumerator',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'uint256', name: 'numberOfShares', type: 'uint256' }],
      name: 'withdraw',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'withdrawAll',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C',
);

const aaveContract = new web3.eth.Contract(
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'BalanceTransfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'target',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'Burn',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'underlyingAsset',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'pool',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'treasury',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'incentivesController',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint8',
          name: 'aTokenDecimals',
          type: 'uint8',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'aTokenName',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'aTokenSymbol',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'params',
          type: 'bytes',
        },
      ],
      name: 'Initialized',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'Mint',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'ATOKEN_REVISION',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'EIP712_REVISION',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'PERMIT_TYPEHASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'POOL',
      outputs: [{ internalType: 'contract ILendingPool', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'RESERVE_TREASURY_ADDRESS',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'UNDERLYING_ASSET_ADDRESS',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: '_nonces',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'user', type: 'address' },
        {
          internalType: 'address',
          name: 'receiverOfUnderlying',
          type: 'address',
        },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getIncentivesController',
      outputs: [
        {
          internalType: 'contract IAaveIncentivesController',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'getScaledUserBalanceAndSupply',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'user', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'handleRepayment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract ILendingPool',
          name: 'pool',
          type: 'address',
        },
        { internalType: 'address', name: 'treasury', type: 'address' },
        { internalType: 'address', name: 'underlyingAsset', type: 'address' },
        {
          internalType: 'contract IAaveIncentivesController',
          name: 'incentivesController',
          type: 'address',
        },
        { internalType: 'uint8', name: 'aTokenDecimals', type: 'uint8' },
        { internalType: 'string', name: 'aTokenName', type: 'string' },
        { internalType: 'string', name: 'aTokenSymbol', type: 'string' },
        { internalType: 'bytes', name: 'params', type: 'bytes' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'user', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'mintToTreasury',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
        { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        { internalType: 'uint8', name: 'v', type: 'uint8' },
        { internalType: 'bytes32', name: 'r', type: 'bytes32' },
        { internalType: 'bytes32', name: 's', type: 'bytes32' },
      ],
      name: 'permit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'scaledBalanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'scaledTotalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'transferOnLiquidation',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'target', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferUnderlyingTo',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  '0xd24946147829DEaA935bE2aD85A3291dbf109c80',
);

const fulcrumContract = new web3.eth.Contract(
  [
    {
      inputs: [{ internalType: 'address', name: '_newOwner', type: 'address' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
        { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'burner', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'assetAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
      ],
      name: 'Burn',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'assetAmount', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
      ],
      name: 'Mint',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
        { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'from', type: 'address' },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
    { payable: false, stateMutability: 'nonpayable', type: 'fallback' },
    {
      constant: true,
      inputs: [],
      name: 'VERSION',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'address', name: '_owner', type: 'address' },
        { internalType: 'address', name: '_spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_spender', type: 'address' },
        { internalType: 'uint256', name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
      name: 'assetBalanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'avgBorrowInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'bZxContract',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'baseRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'bytes32', name: 'loanId', type: 'bytes32' },
        { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'initialLoanDuration', type: 'uint256' },
        { internalType: 'uint256', name: 'collateralTokenSent', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
        { internalType: 'address', name: 'borrower', type: 'address' },
        { internalType: 'address', name: 'receiver', type: 'address' },
        { internalType: 'bytes', name: '', type: 'bytes' },
      ],
      name: 'borrow',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'borrowInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'bytes32', name: 'loanId', type: 'bytes32' },
        { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'initialLoanDuration', type: 'uint256' },
        { internalType: 'uint256', name: 'collateralTokenSent', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
        { internalType: 'address', name: 'borrower', type: 'address' },
        { internalType: 'address', name: 'receiver', type: 'address' },
        { internalType: 'address', name: 'gasTokenUser', type: 'address' },
        { internalType: 'bytes', name: '', type: 'bytes' },
      ],
      name: 'borrowWithGasToken',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'receiver', type: 'address' },
        { internalType: 'uint256', name: 'burnAmount', type: 'uint256' },
      ],
      name: 'burn',
      outputs: [{ internalType: 'uint256', name: 'loanAmountPaid', type: 'uint256' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
      name: 'checkpointPrice',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'checkpointSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_spender', type: 'address' },
        { internalType: 'uint256', name: '_subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseApproval',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'uint256', name: 'borrowAmount', type: 'uint256' },
        { internalType: 'address', name: 'borrower', type: 'address' },
        { internalType: 'address', name: 'target', type: 'address' },
        { internalType: 'string', name: 'signature', type: 'string' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'flashBorrow',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'gasToken',
      outputs: [{ internalType: 'contract ITokenHolderLike', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'initialLoanDuration', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
      ],
      name: 'getBorrowAmountForDeposit',
      outputs: [{ internalType: 'uint256', name: 'borrowAmount', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'uint256', name: 'borrowAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'initialLoanDuration', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
      ],
      name: 'getDepositAmountForBorrow',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'uint256', name: 'leverageAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'loanTokenSent', type: 'uint256' },
        { internalType: 'uint256', name: 'collateralTokenSent', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
      ],
      name: 'getEstimatedMarginDetails',
      outputs: [
        { internalType: 'uint256', name: 'principal', type: 'uint256' },
        { internalType: 'uint256', name: 'collateral', type: 'uint256' },
        { internalType: 'uint256', name: 'interestRate', type: 'uint256' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: 'leverageAmount', type: 'uint256' }],
      name: 'getMaxEscrowAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_spender', type: 'address' },
        { internalType: 'uint256', name: '_addedValue', type: 'uint256' },
      ],
      name: 'increaseApproval',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'initialPrice',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'isOwner',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'kinkLevel',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'loanParamsIds',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'loanTokenAddress',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'lowUtilBaseRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'lowUtilRateMultiplier',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'bytes32', name: 'loanId', type: 'bytes32' },
        { internalType: 'uint256', name: 'leverageAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'loanTokenSent', type: 'uint256' },
        { internalType: 'uint256', name: 'collateralTokenSent', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
        { internalType: 'address', name: 'trader', type: 'address' },
        { internalType: 'bytes', name: 'loanDataBytes', type: 'bytes' },
      ],
      name: 'marginTrade',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'bytes32', name: 'loanId', type: 'bytes32' },
        { internalType: 'uint256', name: 'leverageAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'loanTokenSent', type: 'uint256' },
        { internalType: 'uint256', name: 'collateralTokenSent', type: 'uint256' },
        { internalType: 'address', name: 'collateralTokenAddress', type: 'address' },
        { internalType: 'address', name: 'trader', type: 'address' },
        { internalType: 'address', name: 'gasTokenUser', type: 'address' },
        { internalType: 'bytes', name: 'loanDataBytes', type: 'bytes' },
      ],
      name: 'marginTradeWithGasToken',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'marketLiquidity',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'maxScaleRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'receiver', type: 'address' },
        { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: 'borrowAmount', type: 'uint256' }],
      name: 'nextBorrowInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: 'supplyAmount', type: 'uint256' }],
      name: 'nextSupplyInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'profitOf',
      outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'rateMultiplier',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'supplyInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'targetLevel',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'tokenHolder',
      outputs: [{ internalType: 'contract ITokenHolderLike', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'tokenPrice',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalAssetBorrow',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalAssetSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: 'assetSupply', type: 'uint256' }],
      name: 'totalSupplyInterestRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_to', type: 'address' },
        { internalType: 'uint256', name: '_value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: '_from', type: 'address' },
        { internalType: 'address', name: '_to', type: 'address' },
        { internalType: 'uint256', name: '_value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { internalType: 'address', name: 'settingsTarget', type: 'address' },
        { internalType: 'bytes', name: 'callData', type: 'bytes' },
      ],
      name: 'updateSettings',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'wethToken',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
  '0x6b093998D36f2C7F0cc359441FBB24CC629D5FF0',
);

const beefyCeloDaiUsdContract = new web3Celo.eth.Contract(
  [
    {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [
        { type: 'address', name: '_strategy', internalType: 'contract IStrategy' },
        { type: 'string', name: '_name', internalType: 'string' },
        { type: 'string', name: '_symbol', internalType: 'string' },
        { type: 'uint256', name: '_approvalDelay', internalType: 'uint256' },
      ],
    },
    {
      type: 'event',
      name: 'Approval',
      inputs: [
        { type: 'address', name: 'owner', internalType: 'address', indexed: true },
        { type: 'address', name: 'spender', internalType: 'address', indexed: true },
        { type: 'uint256', name: 'value', internalType: 'uint256', indexed: false },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'NewStratCandidate',
      inputs: [
        {
          type: 'address',
          name: 'implementation',
          internalType: 'address',
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      inputs: [
        { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
        { type: 'address', name: 'newOwner', internalType: 'address', indexed: true },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        { type: 'address', name: 'from', internalType: 'address', indexed: true },
        { type: 'address', name: 'to', internalType: 'address', indexed: true },
        { type: 'uint256', name: 'value', internalType: 'uint256', indexed: false },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'UpgradeStrat',
      inputs: [
        {
          type: 'address',
          name: 'implementation',
          internalType: 'address',
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'allowance',
      inputs: [
        { type: 'address', name: 'owner', internalType: 'address' },
        { type: 'address', name: 'spender', internalType: 'address' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'approvalDelay',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
      name: 'approve',
      inputs: [
        { type: 'address', name: 'spender', internalType: 'address' },
        { type: 'uint256', name: 'amount', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'available',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'balance',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'balanceOf',
      inputs: [{ type: 'address', name: 'account', internalType: 'address' }],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint8', name: '', internalType: 'uint8' }],
      name: 'decimals',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
      name: 'decreaseAllowance',
      inputs: [
        { type: 'address', name: 'spender', internalType: 'address' },
        { type: 'uint256', name: 'subtractedValue', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'deposit',
      inputs: [{ type: 'uint256', name: '_amount', internalType: 'uint256' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'depositAll',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'earn',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'getPricePerFullShare',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'inCaseTokensGetStuck',
      inputs: [{ type: 'address', name: '_token', internalType: 'address' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
      name: 'increaseAllowance',
      inputs: [
        { type: 'address', name: 'spender', internalType: 'address' },
        { type: 'uint256', name: 'addedValue', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'string', name: '', internalType: 'string' }],
      name: 'name',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'address', name: '', internalType: 'address' }],
      name: 'owner',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'proposeStrat',
      inputs: [{ type: 'address', name: '_implementation', internalType: 'address' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'renounceOwnership',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [
        { type: 'address', name: 'implementation', internalType: 'address' },
        { type: 'uint256', name: 'proposedTime', internalType: 'uint256' },
      ],
      name: 'stratCandidate',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'address', name: '', internalType: 'contract IStrategy' }],
      name: 'strategy',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'string', name: '', internalType: 'string' }],
      name: 'symbol',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
      name: 'totalSupply',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
      name: 'transfer',
      inputs: [
        { type: 'address', name: 'recipient', internalType: 'address' },
        { type: 'uint256', name: 'amount', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
      name: 'transferFrom',
      inputs: [
        { type: 'address', name: 'sender', internalType: 'address' },
        { type: 'address', name: 'recipient', internalType: 'address' },
        { type: 'uint256', name: 'amount', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'transferOwnership',
      inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'upgradeStrat',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [{ type: 'address', name: '', internalType: 'contract IERC20' }],
      name: 'want',
      inputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'withdraw',
      inputs: [{ type: 'uint256', name: '_shares', internalType: 'uint256' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      outputs: [],
      name: 'withdrawAll',
      inputs: [],
    },
  ],
  '0x7f6fE34C51d5352A0CF375C0Fbe03bD19eCD8460',
);

const promisify = inner => {
  return new Promise((resolve, reject) => {
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const handleHarvest = async () => {
  const decimals: number = <number>(
    await promisify(cb => harverstContract.methods.decimals().call(cb))
  );

  const balance: number = <number>(
    await promisify(cb =>
      harverstContract.methods
        .underlyingBalanceWithInvestmentForHolder(ownContract)
        .call(cb),
    )
  );
  const derivative: number = <number>(
    await promisify(cb => harverstContract.methods.balanceOf(ownContract).call(cb))
  );

  const parsedBalance = balance / Math.pow(10, decimals);
  const parsedDerivative = derivative / Math.pow(10, decimals);

  const interestRateRes = await axios.get(
    'https://api-ui.harvest.finance/vaults?key=41e90ced-d559-4433-b390-af424fdc76d6',
  );

  const interestRate = interestRateRes.data.eth['USDT'].estimatedApy;

  return {
    prevBalance: parsedBalance,
    amount: 0,
    balance: parsedBalance,
    interestRate,
    token: 'fUSDT',
    tokenBalance: parsedDerivative,
  };
};

const handleAave = async () => {
  const decimals: number = <number>(
    await promisify(cb => aaveContract.methods.decimals().call(cb))
  );
  const derivative: number = <number>(
    await promisify(cb => aaveContract.methods.balanceOf(ownContract).call(cb))
  );

  const tokePriceRes = await axios(coingeckoApiPrice);
  const tokenPrice = tokePriceRes.data['aave-usdc'].usd;
  const parsedDerivative = derivative / Math.pow(10, decimals);

  const balance = parsedDerivative * tokenPrice;

  const interestRateRes = await axios.post(
    'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    {
      query: `
    {
      reserves (where: {name: "USD Coin", aEmissionPerSecond: 0}){
        name
        liquidityRate 
        aEmissionPerSecond
      }
    }
    `,
    },
  );
  // Avve liquidity rates are expressed in RAY units that is 10^27, for percentage multiply by 100
  const interestRate =
    (interestRateRes.data.data.reserves[0].liquidityRate / Math.pow(10, 27)) * 100;

  return {
    prevBalance: balance,
    amount: 0,
    balance: parsedDerivative,
    interestRate,
    token: 'aUSDC',
    tokenBalance: parsedDerivative,
  };
};

const handleFulcrum = async () => {
  const decimals: number = <number>(
    await promisify(cb => fulcrumContract.methods.decimals().call(cb))
  );
  const derivative: number = <number>(
    await promisify(cb => fulcrumContract.methods.balanceOf(ownContract).call(cb))
  );

  const tokePrice: number = <number>(
    await promisify(cb => fulcrumContract.methods.tokenPrice().call(cb))
  );

  const interestRate: number = <number>(
    await promisify(cb => fulcrumContract.methods.supplyInterestRate().call(cb))
  );

  const parsedTokePrice = tokePrice / Math.pow(10, decimals);
  const parsedDerivative = derivative / Math.pow(10, decimals);
  const parsedInterestRate = interestRate / Math.pow(10, decimals);
  const balance = parsedTokePrice * parsedDerivative;

  return {
    prevBalance: balance,
    amount: 0,
    balance,
    interestRate: parsedInterestRate,
    token: 'iDAI',
    tokenBalance: parsedDerivative,
  };
};

const handleDaiUsd = async () => {
  const decimals: number = <number>(
    await promisify(cb => beefyCeloDaiUsdContract.methods.decimals().call(cb))
  );
  const derivative: number = <number>(
    await promisify(cb => beefyCeloDaiUsdContract.methods.balanceOf(ownContract).call(cb))
  );
  const tokenPrice: number = <number>(
    await promisify(cb => beefyCeloDaiUsdContract.methods.getPricePerFullShare().call(cb))
  );

  const lpPrice = await axios
    .get('https://api.beefy.finance/lps')
    .then(res => res.data['sushi-celo-cusd-dai']);

  const interestRate = await axios
    .get('https://api.beefy.finance/apy')
    .then(res => res.data['sushi-celo-cusd-daiv2']);

  const parsedDerivative = derivative / Math.pow(10, decimals);
  const parsedTokenPrice = tokenPrice / Math.pow(10, decimals);
  const tokenBalance = parsedDerivative * parsedTokenPrice;
  const balance = lpPrice * tokenBalance;
  const parsedInterestRate = interestRate * 100;

  return {
    prevBalance: balance,
    amount: 0,
    balance,
    interestRate: parsedInterestRate,
    token: 'Moo Sushi cUSD-DAI',
    tokenBalance,
  };
};

const getTotalContributions = async () => {
  return User.aggregate([
    {
      $group: {
        _id: '',
        contribution: { $sum: '$contribution' },
      },
    },
    {
      $project: {
        _id: 0,
        totalContribution: '$contribution',
      },
    },
  ]);
};

export const vaultCheckIn = async model => {
  const harvest = await handleHarvest();
  const aave = await handleAave();
  const fulcrum = await handleFulcrum();
  const beefy = await handleDaiUsd();

  const [{ totalContribution }] = await getTotalContributions();

  await model.create({
    type: 'checkin',
    vaults: { aave, harvest, fulcrum, beefy },
    totalContribution,
  });
};
