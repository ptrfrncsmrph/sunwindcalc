import { add, compose, map, multiply, reduce } from "ramda"
import { capAt, nullCheck, valueAt } from "./calculations"

const sum = reduce(add, 0)

// capacityMultiplier :: SystemCapacity -> BaseRateMultiplier
const capacityMultiplier = x =>
  x <= 25000
    ? 2
    : x <= 250000
      ? 1.5
      : x <= 500000
        ? 1.25
        : x <= 1000000
          ? 1.1
          : 1

// activeValue :: AdderParams -> Number
const activeValue = ({ isActive, initialValue }) =>
  isActive ? initialValue : 0

const sumNestedValues = compose(
  sum,
  Object.values,
  map(activeValue)
)

//  {
//   capacity: number (Watts),
//   usefulEnergy: number ,
//   isActive: boolean
// }

// usefulEnergy and storageUseful energy are actually hours at rated capacity
export const energyStorageAdder = (
  systemCapacity,
  { capacity: storageCapacity, usefulEnergy: storageUsefulEnergy, isActive }
) =>
  isActive
    ? Math.max(
        0.0247,
        (storageCapacity /
          systemCapacity /
          (storageCapacity / systemCapacity +
            Math.exp(0.7 - 8 * (storageCapacity / systemCapacity)))) *
          (0.8 + 0.5 * Math.log(storageUsefulEnergy)) *
          0.045
      )
    : 0

//  {
//   block: number,
//   tranche: number,
//   systemCapacity: number,
//   isLowIncome: boolean,
//   isNantucketElectric: boolean,
//   adders: {
//     storage: {
//       isActive: boolean,
//       capacity: number,
//       usefulEnergy: number
//     },
//     location: {
//       buildingMounted: {
//         isActive: boolean,
//         initialValue: number
//       },
//       floating: {
//         isActive: boolean,
//         initialValue: number
//       },
//       brownfield: {
//         isActive: boolean,
//         initialValue: number
//       },
//       landfill: {
//         isActive: boolean,
//         initialValue: number
//       },
//       canopy: {
//         isActive: boolean,
//         initialValue: number
//       },
//       agricultural: {
//         isActive: boolean,
//         initialValue: number
//       }
//     },
//     offTaker: {
//       communityShared: {
//         isActive: boolean,
//         initialValue: number
//       },
//       lowIncomeProperty: {
//         isActive: boolean,
//         initialValue: number
//       },
//       lowIncomeCommunityShared: {
//         isActive: boolean,
//         initialValue: number
//       },
//       publicEntity: {
//         isActive: boolean,
//         initialValue: number
//       }
//     }
//   }

/*
*** This may be bad type annotation ***
*** Also: This only covers two cases:
*** Nantucket & Eversource.
sMARTBaseRate :: ({
  block: Int (Base 1),
  tranche: Int (Base 1),
  systemCapacity: Int (Watts),
  isLowIncome: Boolean,
  isNantucketElectric: Boolean,  
  adders: {   
    storage: 
  }
}) -> ({
  initialValue: Int (Dollars),
  capYear: Int
})
*/
export default ({
  block,
  tranche,
  systemCapacity,
  isLowIncome,
  isNantucketElectric,
  adders
}) => ({
  initialValue: compose(
    nullCheck,
    capAt(block - 1)(isNantucketElectric ? 2 : 8),
    add(
      compose(
        nullCheck,
        valueAt(tranche - 1)(-0.04)
      )((({ offTaker }) => sumNestedValues(offTaker))(adders))
    ),
    add(
      compose(
        nullCheck,
        valueAt(tranche - 1)(-0.04)
      )((({ location }) => sumNestedValues(location))(adders))
    ),
    add(
      compose(
        nullCheck,
        valueAt(tranche - 1)(-0.04)
      )((({ storage }) => energyStorageAdder(systemCapacity, storage))(adders))
    ),
    multiply(
      add(systemCapacity <= 25000 && isLowIncome ? 0.3 : 0)(
        capacityMultiplier(systemCapacity)
      )
    ),
    // (a) Blocks are base 1; (b) Nantucket has different block scheduling
    valueAt(block - 1)(isNantucketElectric ? -0.16 : -0.04)
  )(0.17),
  capYear: systemCapacity <= 25000 ? 10 : 20
})
