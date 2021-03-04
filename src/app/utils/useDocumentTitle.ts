import { useState } from 'react'
import { useSelector } from 'react-redux'
import { routing } from '../routes'
import { getLocationType } from '../../store/redux-first-router/selectors'

const TITLE = 'Data en informatie - Amsterdam'

function useDocumentTitle() {
  const locationType = useSelector(getLocationType)
  const route = Object.values(routing).find((value) => value.type === locationType)
  const routeTitle = route?.title ?? null
  const [documentTitle, setTitle] = useState(routeTitle ? `${routeTitle} - ${TITLE}` : TITLE)

  function setDocumentTitle(pageTitle: string | boolean, documentTitleData: string[] = []) {
    const newTitle = [pageTitle || routeTitle, ...documentTitleData, TITLE].join(' - ')
    setTitle(newTitle)
    document.title = newTitle

    return newTitle
  }

  return {
    documentTitle,
    setDocumentTitle,
  }
}

export default useDocumentTitle
