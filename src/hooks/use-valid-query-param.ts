import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type Query = {
  name: string
  identifier: string
  isDefault: boolean
}

export type QueryList = Query[]

type UseValidQueryParam = (queryList: QueryList) => string | null | undefined

export const useValidQueryParam: UseValidQueryParam = (queryList) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [validQueryParam, setValidQueryParam] = useState<
    Query | null | undefined
  >(null)

  const findValidQueryParam = () =>
    queryList.find((query) => searchParams.get(query.identifier) === query.name)

  useEffect(() => {
    if (searchParams) {
      const queryParam = findValidQueryParam()
      setValidQueryParam(queryParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (validQueryParam === undefined && searchParams) {
      const defaultRedirect = queryList.find((query) => query.isDefault)
      if (defaultRedirect) {
        const url = `${pathname}?${defaultRedirect.identifier}=${defaultRedirect.name}`
        router.push(url)
      } else {
        router.push("/404")
      }
    }
  }, [validQueryParam, searchParams, router])

  return validQueryParam?.name ?? searchParams.get(queryList[0].identifier)
}
