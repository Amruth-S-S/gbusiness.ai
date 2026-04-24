import {
  get,
  post,
  put,
  remove,
  deleteById,
  deleteAll,
  getWithReqObj,
} from "./utils"

type ServiceMethod = (
  url: string,
  payload: any,
) => Promise<{ data: any; error?: boolean }>

const serviceUtil = {
  get,
  post,
  put,
  remove,
  deleteById,
  deleteAll,
  getWithReqObj,
}

export const getServiceMethod = (
  type: "add" | "update" | "delete",
): ServiceMethod => {
  const serviceMethods: Record<"add" | "update" | "delete", ServiceMethod> = {
    add: serviceUtil.post,
    update: serviceUtil.put,
    delete: serviceUtil.remove,
  }

  return serviceMethods[type]
}
