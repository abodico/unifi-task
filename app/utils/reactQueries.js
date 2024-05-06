import { useQueries, useQuery } from "react-query"
import axios, { AxiosRequestConfig } from "axios"
const getData = async (pageNumber, search, link) => {
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
    console.log(res)
    return res
}
export const useGetData = (key, pageNumber, search, link) => {
    return useQuery([key, pageNumber, search], () =>
        getData(pageNumber, search, link)
    )
}
