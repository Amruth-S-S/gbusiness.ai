import dynamic from "next/dynamic"

export const DynamicConsultantResultsTableView = dynamic(
  () =>
    import("./ConsultantResultsTableView").then(
      (mod) => mod.ConsultantResultsTableView,
    ),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
