"use client"

import { CirclesWithBar } from "react-loader-spinner"

export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-[66] hidden items-center justify-center"
      id="circles-with-bar-loader"
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10">
        <CirclesWithBar
          height="100"
          width="100"
          color="#4e5c97"
          outerCircleColor="#4e5c97"
          innerCircleColor="#4e5c97"
          barColor="#4e5c97"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible
        />
      </div>
    </div>
  )
}
