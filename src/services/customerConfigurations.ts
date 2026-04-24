import { ApiResponse, get, post, put, remove } from "./utils"

export interface DataManagementTable {
  table_description: string
  table_name: string
  user_id: string
}

const getCustomerConfigurations = (): Promise<ApiResponse<any>> =>
  get("/customer-configurations/customer-configurations/")
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const getCustomerConfigurationById = (
  configurationId: number,
): Promise<ApiResponse<any>> =>
  get(`/customer-configurations/customer-configurations/${configurationId}`)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const createCustomerConfiguration = (
  payload: DataManagementTable,
): Promise<ApiResponse<any>> =>
  post("/customer-configurations/customer-configurations/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const editCustomerConfiguration = (
  configurationId: number,
  payload: DataManagementTable,
): Promise<ApiResponse<any>> =>
  put(
    `/customer-configurations/customer-configurations/${configurationId}`,
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

const deleteCustomerConfigurationById = (
  configurationId: number,
): Promise<ApiResponse<any>> =>
  remove(`/customer-configurations/customer-configurations/`, configurationId)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export {
  getCustomerConfigurations,
  getCustomerConfigurationById,
  createCustomerConfiguration,
  editCustomerConfiguration,
  deleteCustomerConfigurationById,
}
