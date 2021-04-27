import { createContext, Dispatch, SetStateAction, useContext } from 'react'

interface DataSelectionContextValues {
  distanceText?: string
  setDistanceText: Dispatch<SetStateAction<DataSelectionContextValues['distanceText']>>
}

const DataSelectionContext = createContext<DataSelectionContextValues | null>(null)

export function useDataSelectionContext() {
  const context = useContext(DataSelectionContext)

  if (!context) {
    throw new Error(
      'No provider found for DataSelectionContext, make sure you include DataSelectionProvider in your component hierarchy.',
    )
  }

  return context
}

export default DataSelectionContext
