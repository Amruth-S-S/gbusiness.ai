import { useEffect } from "react"
import axios from "axios"
import { digitalOceanBaseUrl } from "@/lib/constants"
import {
  UpdateCollectionsStore,
  useCollectionsStore,
} from "@/store/collections"

type UseCollections = () => void

export const fetchCollectionsData = (
  updateCollectionsStore: UpdateCollectionsStore,
) => {
  const limit = 100
  const offset = 0

  axios
    .get(`${digitalOceanBaseUrl}/collections?limit=${limit}&offset=${offset}`)
    .then((res) => {
      const response = res.data
      if (response) {
        updateCollectionsStore({
          data: response,
          isLoading: false,
          error: null,
        })
      }
    })
    .catch((err) => {
      updateCollectionsStore({
        data: [],
        isLoading: false,
        error: err,
      })
    })
}

export const getInitialCollectionsState = () => ({
  isLoading: true,
  data: [],
  error: null,
})

export const useCollections: UseCollections = () => {
  const { updateCollectionsStore } = useCollectionsStore()

  // useEffect(() => {
  //   fetchCollectionsData(updateCollectionsStore)
  // }, [])
}
