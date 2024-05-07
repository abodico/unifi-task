import { UseQueryResult, useQueries, useQuery } from "react-query"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
type ErrorType = {
    error: string
}
type Bike = {
    date_stolen: number
    description: string | null
    frame_colors: string[]
    frame_model: string
    id: number
    is_stock_img: boolean
    large_img: string | null
    location_found: string | null
    manufacturer_name: string
    external_id: number | null
    registry_name: string | null
    registry_url: string | null
    serial: string
    status: string
    stolen: boolean
    stolen_coordinates: number[]
    stolen_location: string
    thumb: string | null
    title: string
    url: string
    year: number | null
    propulsion_type_slug: string
    cycle_type_slug: string
}
const getData = async (
    link: string,
    search: string | undefined,
    pageNumber: number | undefined
) => {
    const res = await axios.get(link, {
        params: {
            location: "Munich",
            distance: 100,
            stolenness: "proximity",
            page: pageNumber,
            per_page: 10,
            query: search,
        },
    })
    return res
}
export const useGetData = (
    key: string,
    link: string,
    search?: string,
    pageNumber?: number | undefined
): UseQueryResult<AxiosResponse<any, any>, ErrorType | null> => {
    return useQuery([key, pageNumber, search], () =>
        getData(link, search, pageNumber)
    )
}
const getTime = async (link: string, id: number) => {
    const res = await axios.get(link)
    return res
}
export const useGetTime = (
    key: string,
    link: string,
    id: number
): UseQueryResult<AxiosResponse<any, any>, ErrorType | null> => {
    return useQuery([key, id], () => getTime(link, id), { enabled: false })
}
