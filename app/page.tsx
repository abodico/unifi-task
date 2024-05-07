/* eslint-disable @next/next/no-img-element */
"use client"
import { ChangeEvent, ReactNode, useState } from "react"
import { useGetData, useGetTime } from "@/app/utils/reactQueries"
import img from "@/public/bike.svg"
import {
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Modal,
    Pagination,
    Skeleton,
    TextField,
} from "@mui/material"
import { TbMoodEmpty } from "react-icons/tb"
import { MdSearch } from "react-icons/md"

const SkeletonComponent = ({ i }: { i: number }): ReactNode => (
    <li
        className={`flex w-full gap-4 py-2 px-2 ${
            i % 2 === 0 && "bg-secondary"
        } `}
    >
        {/* img-container */}
        <div className="w-[200px] h-[200px] bg-secondary">
            <Skeleton variant="rectangular" width={200} height={200} />
        </div>
        {/* info */}
        <div className="flex-1 text-[#666]">
            <Skeleton variant="text" className="text-base font-bold mb-2" />
            <div className="grid grid-cols-2 gap-8">
                {/* desc */}
                <div className="col-span-1">
                    <Skeleton variant="text" className="text-base" />
                    <Skeleton variant="text" className="text-base" />
                    <Skeleton variant="text" className="text-base" />
                </div>
                {/* date&location */}
                <div className="col-span-1">
                    <Skeleton variant="text" className="text-base" />
                    <Skeleton variant="text" className="text-base" />
                </div>
            </div>
        </div>
    </li>
)
export default function Home() {
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [search, setSearch] = useState<string>("")
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
    const {
        data: bikes,
        isLoading,
        refetch,
        isError,
        error,
    }: {
        data: any
        isLoading: boolean
        refetch: () => void
        isError: boolean
        error: ErrorType | null
    } = useGetData(
        "bikes",
        "https://bikeindex.org/api/v3/search",
        search,
        pageNumber
    )
    const {
        data: numberOfCases,
        isLoading: isLoadingNumberOfCases,
        refetch: refetchNumberOfCases,
    } = useGetData(
        "number-of-cases",
        "https://bikeindex.org:443/api/v3/search/count",
        search
    )
    const [open, setOpen] = useState<boolean>(false)
    const [openId, setOpenId] = useState<number>(0)

    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    })

    const handleChange = (e: ChangeEvent<unknown>, v: number) => {
        setPageNumber(v)
    }
    const { data: theftTime, refetch: refetchTime } = useGetTime(
        "time",
        `https://bikeindex.org:443/api/v3/bikes/${openId}`,
        openId
    )

    const handleGetDate = (id: number) => {
        console.log(id)
        setOpenId(id)
        refetchTime
    }
    return (
        <main className="py-20 container mx-auto flex flex-col items-center">
            {/* searchbar */}
            <div className="grid grid-cols-3 w-full mb-4">
                <TextField
                    className="col-span-1 col-start-2"
                    label="SEARCH FOR NEARBY STOLEN BIKES"
                    value={search}
                    InputProps={{
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
                                    <MdSearch />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <p className="text-primary font-extrabold text-2xl">
                <span className="font-bold">Number of bike theft cases: </span>
                {isLoadingNumberOfCases
                    ? "Calculating..."
                    : numberOfCases?.data?.proximity}
            </p>
            {isError ? (
                <p className="text-center text-red-700">{error?.error}</p>
            ) : !isLoading && numberOfCases?.data?.proximity == 0 ? (
                <div className="flex items-center gap-4 my-16">
                    <p>There is no result</p>
                    <TbMoodEmpty className="text-4xl" />
                </div>
            ) : (
                <ul className="flex w-full flex-col gap-3 px-10 mb-8">
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, i: number) => (
                              <div key={i}>
                                  <SkeletonComponent i={i} />
                              </div>
                          ))
                        : bikes?.data?.bikes.map((item: Bike, i: number) => (
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
                                                          +item.date_stolen *
                                                              1000
                                                      )
                                                  )}
                                              </p>
                                              <p className="">
                                                  <span className="font-medium">
                                                      Location:
                                                  </span>
                                                  {item.stolen_location}
                                              </p>
                                              <Button
                                                  onClick={() =>
                                                      handleGetDate(item.id)
                                                  }
                                                  variant="contained"
                                              >
                                                  Get reporting date
                                              </Button>
                                              <p>
                                                  {
                                                      theftTime?.data.bike
                                                          .stolen_record
                                                          .create_at
                                                  }
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </li>
                          ))}
                </ul>
            )}
            <Pagination
                count={Math.ceil((numberOfCases?.data?.proximity || 1) / 10)}
                page={pageNumber}
                onChange={handleChange}
            />
        </main>
    )
}
