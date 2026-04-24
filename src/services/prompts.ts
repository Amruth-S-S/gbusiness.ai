import { ApiResponse, get, post, put, remove } from "./utils"

export interface Prompt {
  name: string
  user_id: string
  id: number
  client_number?: number
  customer_number?: number
  prompt_text?: string
  prompt_out?: string
  created_at: string
  updated_at: string
  input_text?: string
  user_name: string
}

const getPrompts = (): Promise<ApiResponse<any>> =>
  get("/main-boards/boards/prompts/")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getPromptById = (promptId: number): Promise<ApiResponse<any>> =>
  get(`/main-boards/boards/prompts/${promptId}`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getPromptByBoardId = (boardId: number): Promise<ApiResponse<any>> =>
  get(`/main-boards/boards/prompts/boards/${boardId}`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

type CreatePromptPayload = Required<
  Pick<Prompt, "prompt_text" | "user_name"> & { board_id: number }
>

const createPrompt = (
  payload: CreatePromptPayload,
): Promise<ApiResponse<any>> =>
  post("/main-boards/boards/prompts/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const editPrompt = (
  promptId: number,
  payload: Required<
    Pick<Prompt, "prompt_text" | "user_name"> & { board_id: number }
  >,
): Promise<ApiResponse<any>> =>
  put(`/main-boards/boards/prompts/${promptId}`, payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const deletePromptById = (promptId: number): Promise<ApiResponse<any>> =>
  remove(`/main-boards/boards/prompts`, promptId)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const runPrompt = (
  promptText: string,
  boardId: string,
  payload: FormData,
): Promise<ApiResponse<any>> =>
  post(
    `/main-boards/boards/prompts/run_prompt?input_text=${promptText}&board_id=${boardId}`,
    payload,
  )
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const runPrompt2 = (
  promptText: string,
  boardId: string,
): Promise<ApiResponse<any>> =>
  post(
    `/main-boards/boards/prompts/run_prompt_v2?input_text=${promptText}&board_id=${boardId}`,
  )
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export {
  getPrompts,
  createPrompt,
  getPromptById,
  getPromptByBoardId,
  editPrompt,
  deletePromptById,
  runPrompt,
  runPrompt2,
}
