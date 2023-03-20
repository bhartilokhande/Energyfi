import { request } from 'graphql-request'
import useSWR from 'swr'

const QUERY = `{
    bar(id: "0x741fa4552A8D38ba504729D8c178bDc35454c8F8") {
      ratio
    }
}`

// @ts-ignore TYPE NEEDS FIXING
const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/energyfidevops/bar-v2', query)

// Returns ratio of XEnergyfi:Energyfi
export default function useSushiPerXSushi(parse = true) {
  const { data } = useSWR(QUERY, fetcher)
  return parse ? parseFloat(data?.bar?.ratio) : data?.bar?.ratio
}
