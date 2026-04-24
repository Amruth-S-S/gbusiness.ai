import { ApiResponse, get, post, put, remove } from "./utils"

type BoardPayload = {
  main_board_id: number
  name: string
}

const getBoards = (): Promise<ApiResponse<any>> =>
  get("/main-boards/boards/")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getBoardById = (boardId: number): Promise<ApiResponse<any>> =>
  get(`/main-boards/boards/${boardId}`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getBoardsByMainBoardId = (
  mainBoardId: number,
): Promise<ApiResponse<any>> =>
  get(`/main-boards/boards/${mainBoardId}/boards`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const createBoard = (payload: BoardPayload): Promise<ApiResponse<any>> =>
  post("/main-boards/boards/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const editBoard = (
  boardId: number,
  payload: BoardPayload,
): Promise<ApiResponse<any>> =>
  put(`/main-boards/boards/${boardId}`, payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const deleteBoardById = (boardId: number): Promise<ApiResponse<any>> =>
  remove(`/main-boards/boards`, boardId)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export {
  getBoards,
  getBoardById,
  getBoardsByMainBoardId,
  createBoard,
  editBoard,
  deleteBoardById,
}
