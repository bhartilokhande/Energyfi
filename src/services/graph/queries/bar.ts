import gql from 'graphql-tag'

export const barQuery = gql`
  query barQuery($id: String! = "0xba571227fea63965bfab3bdb3f4ca45f6882e57e", $block: Block_height) {
    bar(id: $id, block: $block) {
      id
      totalSupply
      ratio
      xEnergyFiMinted
      xEnergyFiBurned
      energyFiStaked
      energyFiStakedUSD
      energyFiHarvested
      energyFiHarvestedUSD
      xEnergyFiAge
      xEnergyFiAgeDestroyed
      # histories(first: 1000) {
      #   id
      #   date
      #   timeframe
      #   energyFiStaked
      #   energyFiStakedUSD
      #   energyFiHarvested
      #   energyFiHarvestedUSD
      #   xEnergyFiAge
      #   xEnergyFiAgeDestroyed
      #   xEnergyFiMinted
      #   xEnergyFiBurned
      #   xEnergyFiSupply
      #   ratio
      # }
    }
  }
`

export const barHistoriesQuery = gql`
  query barHistoriesQuery {
    histories(first: 1000) {
      id
      date
      timeframe
      energyFiStaked
      energyFiStakedUSD
      energyFiHarvested
      energyFiHarvestedUSD
      xEnergyFiAge
      xEnergyFiAgeDestroyed
      xEnergyFiMinted
      xEnergyFiBurned
      xEnergyFiSupply
      ratio
    }
  }
`

export const barUserQuery = gql`
  query barUserQuery($id: String!) {
    user(id: $id) {
      id
      bar {
        totalSupply
        energyFiStaked
      }
      xEnergyFi
      energyFiStaked
      energyFiStakedUSD
      energyFiHarvested
      energyFiHarvestedUSD
      xEnergyFiIn
      xEnergyFiOut
      xEnergyFiOffset
      xEnergyFiMinted
      xEnergyFiBurned
      energyFiIn
      energyFiOut
      usdIn
      usdOut
      createdAt
      createdAtBlock
    }
  }
`
