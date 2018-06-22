import sMARTBaseRate from "./sMARTBaseRate"

const sMART = {
  systemCapacity: 10000,
  isNantucketElectric: false,
  isLowIncome: false,
  // This (isActive) doesn't matter to calculations,
  // but will matter for displaying data (?)
  // or at the component level.
  isActive: true,
  block: 3,
  tranche: 1,
  adders: {
    storage: {
      isActive: false,
      // Not going to compute initialValue separately,
      // so will not be part of state. The sMARTBaseRate
      // function does not care about this initialValue,
      // but I might want to display it in UI. Still, doesn't
      // need to be part of state...
      initialValue: 0,
      capacity: 0,
      usefulEnergy: 0
    },
    location: {
      buildingMounted: {
        isActive: true,
        initialValue: 0.02
      },
      floating: {
        isActive: false,
        initialValue: 0.03
      },
      brownfield: {
        isActive: false,
        initialValue: 0.03
      },
      landfill: {
        isActive: false,
        initialValue: 0.04
      },
      canopy: {
        isActive: false,
        initialValue: 0.06
      },
      agricultural: {
        isActive: false,
        initialValue: 0.06
      }
    },
    offTaker: {
      communityShared: {
        isActive: false,
        initialValue: 0.05
      },
      lowIncomeProperty: {
        isActive: false,
        initialValue: 0.03
      },
      lowIncomeCommunityShared: {
        isActive: false,
        initialValue: 0.06
      },
      publicEntity: {
        isActive: false,
        initialValue: 0.02
      }
    }
  }
}

console.log(sMARTBaseRate(sMART))
