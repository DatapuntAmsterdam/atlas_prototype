import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { routing } from '../routes'

const TITLE = 'Data en informatie'

function useDocumentTitle() {
  const location = useLocation()
  const route = Object.values(routing).find((value) => value.path === location.pathname)
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
