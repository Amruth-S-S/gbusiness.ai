import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { axiosInstance } from "../axiosConfig"

export interface ErrorData {
  response?: {
    data?: {
      data?: string
    }
  }
  message?: string
}

export interface ApiResponse<T> {
  data?: T
  errRes?: string
}

const get = (url: string): Promise<AxiosResponse> => axiosInstance?.get(url)

const getWithReqObj = <T extends AxiosRequestConfig<any> | undefined>(
  url: string,
  reqObj?: T,
): Promise<AxiosResponse> => axiosInstance.get(url, reqObj)

const post = <T>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => axiosInstance.post(url, data, config)

const put = <T>(url: string, reqObj?: T): Promise<AxiosResponse> =>
  axiosInstance.put(url, reqObj)

const remove = <T extends AxiosRequestConfig<any> | undefined>(
  url: string,
  id: string | number,
  reqObj?: T,
): Promise<AxiosResponse> => axiosInstance.delete(`${url}/${id}`, reqObj)

const deleteById = <T extends AxiosRequestConfig<any> | undefined>(
  url: string,
  id: string | number,
  reqObj?: T,
): Promise<AxiosResponse> => axiosInstance.get(`${url}/${id}`, reqObj)

const deleteAll = <T extends AxiosRequestConfig<any> | undefined>(
  url: string,
  reqObj?: T,
): Promise<AxiosResponse> => axiosInstance.delete(url, { data: reqObj })

export { get, post, put, remove, deleteById, deleteAll, getWithReqObj }
