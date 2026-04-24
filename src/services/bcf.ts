import { CustomResponse, BCF } from "@/lib/types"
import { ApiResponse, get, post, put, remove } from "./utils"

const getBCFs = (): Promise<ApiResponse<any>> =>
  get("/main-boards/bcf/")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getBCFById = (mainBoardId: number): Promise<ApiResponse<any>> =>
  get(`/main-boards/bcf/${mainBoardId}/bcf`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const createBCF = (payload: BCF): Promise<ApiResponse<CustomResponse<BCF>>> =>
  post("/main-boards/bcf/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const editBCF = (
  boardId: number,
  payload: BCF,
): Promise<ApiResponse<CustomResponse<BCF>>> =>
  put(`/main-boards/bcf/${boardId}`, payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const deleteBCFById = (boardId: number): Promise<ApiResponse<any>> =>
  remove(`/main-boards/bcf/`, boardId)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export { getBCFs, getBCFById, createBCF, editBCF, deleteBCFById }
