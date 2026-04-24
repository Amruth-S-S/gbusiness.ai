import { CustomResponse, MainBoard } from "@/lib/types"
import { ApiResponse, get, post, put, remove } from "./utils"

const getMainBoardTreeInfo = (): Promise<ApiResponse<any>> =>
  get("/main-boards/get_all_info_tree")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getMainBoards = (): Promise<ApiResponse<any>> =>
  get("/main-boards/")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getMainBoardById = (
  mainBoardId: number,
): Promise<ApiResponse<CustomResponse<MainBoard>>> =>
  get(`/main-boards/${mainBoardId}`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const createMainBoard = (
  payload: MainBoard,
): Promise<ApiResponse<CustomResponse<MainBoard>>> =>
  post("/main-boards/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const editMainBoard = (
  mainBoardId: number,
  payload: MainBoard,
): Promise<ApiResponse<CustomResponse<MainBoard>>> =>
  put(`/main-boards/${mainBoardId}`, payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const deleteMainBoardById = (mainBoardId: number): Promise<ApiResponse<any>> =>
  remove(`/main-boards/`, mainBoardId)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export {
  getMainBoards,
  getMainBoardById,
  createMainBoard,
  editMainBoard,
  deleteMainBoardById,
  getMainBoardTreeInfo,
}
