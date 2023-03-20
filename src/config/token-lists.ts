const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'

// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

const YEARN_LIST = './token-lists/yearn-list.json'
const NFTX_LIST = './token-lists/nftx-list.json'
const SYNTHETIX_LIST = 'synths.snx.eth'
const AAVE_LIST = 'tokenlist.aave.eth'
const CMC_ALL_LIST = 'defi.cmc.eth'
const CMC_STABLECOIN = 'stablecoin.cmc.eth'
const COINGECKO_LIST = './token-lists/coingecko-list.json'
const COMPOUND_LIST = './token-lists/compoind-list.json'
const GEMINI_LIST = './token-lists/gemini-list.json'
const KLEROS_LIST = 't2crtokens.eth'
export const OPTIMISM_LIST = './token-lists/optimism-list.json'
const SET_LIST = './token-lists/set-list.json'
const UMA_LIST = './token-lists/uma-list.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
const DHEDGE_LIST = './token-lists/dhedge-list.json'
const ARBITRUM_LIST = './token-lists/arbitrum-list.json'

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  CMC_STABLECOIN,
  UMA_LIST,
  YEARN_LIST,
  SYNTHETIX_LIST,
  WRAPPED_LIST,
  SET_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  NFTX_LIST,
  GEMINI_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  DHEDGE_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [NFTX_LIST, YEARN_LIST, GEMINI_LIST]
