import { createSelector } from 'reselect'
import { REDUCER_KEY } from './constants'

export const getFiles = (state) => state[REDUCER_KEY]
export const getFileName = createSelector(getFiles, (files) => files && files.fileName)
