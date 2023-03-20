import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { barHistoriesQuery, barQuery } from 'app/services/graph/queries/bar'
import { request } from 'graphql-request'

const BAR = {
  // [ChainId.MOONBEAM_TESTNET]: 'chandu-thoughtwin/bar-v2',
  [ChainId.MOONBEAM]: 'energyfidevops/bar-v2',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (query, variables = undefined) =>
  request(`${GRAPH_HOST[ChainId.MOONBEAM]}/subgraphs/name/${BAR[ChainId.MOONBEAM]}`, query, variables)

export const getBar = async (variables = undefined) => {
  const { bar } = await fetcher(barQuery, variables)
  return bar
}

export const getBarHistory = async (variables = undefined) => {
  const { histories } = await fetcher(barHistoriesQuery, variables)
  return histories
}
