/* eslint-disable @next/next/no-img-element */
"use client"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useGetData } from "@/app/utils/reactQueries"
import img from "@/public/bike.svg"
import {
    Autocomplete,
    CircularProgress,
    IconButton,
    InputAdornment,
    Pagination,
    TextField,
} from "@mui/material"
export default function Home() {
    const [pageNumber, setPageNumber] = useState(1)
    const [search, setSearch] = useState("")
    const {
        data: bikes,
        isLoading,
        refetch,
    } = useGetData(
        "bikes",
        pageNumber,
        search,
        "https://bikeindex.org/api/v3/search"
    )
    const {
        data: numberOfCases,
        isLoading: loadingNumberOfCases,
        refetch: refetchNumberOfCases,
    } = useGetData(
        "number-of-cases",
        pageNumber,
        search,
        "https://bikeindex.org:443/api/v3/search/count"
    )
    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    })

    const handleChange = (e, v) => {
        setPageNumber(v)
    }
    return (
        <main className="py-20 container mx-auto flex flex-col items-center">
            {/* searchbar */}
            <div className="grid grid-cols-3 w-full mb-4">
                {/* <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    className="col-span-1 col-start-2"
                    disableClearable
                    options={data?.data.bikes.map((option) => option.title)}
                    renderInput={(params) => (
                        
                    )}
                /> */}
                <TextField
                    // {...params}
                    label="SEARCH FOR NEARBY STOLEN BIKES"
                    // value={search}
                    InputProps={{
                        // ...params.InputProps,
                        type: "search",
                        onChange: (e) => {
                            setSearch(e.target.value)
                            refetch
                            refetchNumberOfCases
                        },
                        value: search,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        refetch
                                        refetchNumberOfCases
                                    }}
                                    edge="end"
                                >
                                    CL
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <p>{numberOfCases?.data?.proximity}</p>
            {!isLoading ? (
                <ul className="flex flex-col gap-3 px-10 mb-8">
                    {bikes?.data?.bikes.map((item, i) => (
                        <li
                            className={`flex gap-4 py-2 px-2 ${
                                i % 2 === 0 && "bg-secondary"
                            } `}
                            key={item.id}
                        >
                            {/* img-container */}
                            <div className="w-[200px] h-[200px] bg-secondary">
                                <img
                                    src={
                                        item.large_img
                                            ? item.large_img
                                            : img.src
                                    }
                                    className="object-cover h-full"
                                    alt="img"
                                />
                            </div>
                            {/* info */}
                            <div className="flex-1 text-[#666]">
                                <h3 className="text-primary font-bold mb-2">
                                    {item.title}
                                </h3>
                                <div className="grid grid-cols-2 gap-8">
                                    {/* desc */}
                                    <div className="col-span-1">
                                        <p className="">
                                            <span className="font-medium">
                                                Description:
                                            </span>
                                            {item.description
                                                ? item.description
                                                : "No description."}
                                        </p>
                                    </div>
                                    {/* date&location */}
                                    <div className="col-span-1">
                                        <p className="">
                                            <span className="font-medium text-red-600">
                                                Stolen:
                                            </span>
                                            {formatter.format(
                                                new Date(
                                                    +item.date_stolen * 1000
                                                )
                                            )}
                                        </p>
                                        <p className="">
                                            <span className="font-medium">
                                                Location:
                                            </span>
                                            {item.stolen_location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <CircularProgress />
            )}
            <Pagination count={10} page={pageNumber} onChange={handleChange} />
        </main>
    )
}
