import { notFound } from "next/navigation"
import { DynamicConsultantDashboard } from "@/components/organisms/dashboard/consultant-dashboard/DynamicConsultantDashboard"

type Params = Promise<{ mainBoardId: string; boardId: string }>

export default async function BoardPage({ params }: { params: Params }) {
  const { mainBoardId, boardId } = await params

  if (!mainBoardId || !boardId) return notFound()

  return (
    <div className="p-4">
      <DynamicConsultantDashboard mainBoardId={mainBoardId} boardId={boardId} />
    </div>
  )
}
