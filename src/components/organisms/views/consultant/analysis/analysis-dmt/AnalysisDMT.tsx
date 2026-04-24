"use client"

import { AlertModal } from "@/components/molecules/modal/AlertModal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModalContext } from "@/contexts/modal-context"
import { closeModal, openModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { put, remove } from "@/services/utils"
import { useBoardsStore } from "@/store/boards"
import { useMiddlePaneStore } from "@/store/middle-pane"
import { format } from "date-fns"
import {
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export function AnalysisDMT() {
  const [selectedTable, setSelectedTable] = useState<number | null | undefined>(
    null,
  )

  const dataManagementTables = useMiddlePaneStore(
    (state) => state.middlePaneState.dataManagementTables,
  )
  const fetchData = useMiddlePaneStore((state) => state.fetchData)

  const {
    modalState: { prevContentName, isOperationComplete },
    setModalState,
  } = useModalContext()
  const { lockScroll, unlockScroll } = useScrollLock()

  const { selectedMainBoard, selectedBoard } = useBoardsStore()
  const boardId = selectedBoard?.id ?? null

  const actionClickHandler = () => {
    openModal(setModalState, lockScroll, {
      modalState: {
        isActive: true,
        isOpen: true,
        heading: "Create Table",
        contentName: "FORM__ANALYSIS_DMT",
      },
    })
  }

  useEffect(() => {
    if (
      (prevContentName === "FORM__ANALYSIS_DMT" ||
        prevContentName === "VIEW__ANALYSIS_DMT_FILE_UPLOAD") &&
      isOperationComplete
    ) {
      fetchData("dataManagementTables", "data-management-table")
    }
  }, [prevContentName, isOperationComplete, fetchData])

  useEffect(() => {
    if (boardId) {
      fetchData("dataManagementTables", "data-management-table")
    }
  }, [boardId, selectedMainBoard?.id, fetchData])

  const [expandedItem, setExpandedItem] = useState<string | undefined>()

  const alertActionBtnClickHandler = async () => {
    try {
      if (selectedTable) {
        const { data, errRes } = (await remove(
          "/main-boards/boards/data-management-table",
          selectedTable,
        )) as any
        if (data) {
          setSelectedTable(null)
          fetchData("dataManagementTables", "data-management-table")
        }
        if (errRes) {
          toast.error(
            Object.hasOwn(errRes, "detail")
              ? errRes.detail
              : "Something went wrong",
            {
              position: "top-right",
            },
          )
        }
      }
    } catch (error) {
      if (error && typeof error === "object") {
        toast.error("Something went wrong")
      }
    }
  }

  const filteredTables = dataManagementTables.data.filter(
    (table) => table.boardId === boardId,
  )

  return (
    <div className="space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* Header Section */}
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          onClick={actionClickHandler}
          className="text-white shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tables found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 max-w-sm">
              Get started by creating your first data management table to
              organize your files and data.
            </p>
            <Button
              onClick={actionClickHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Table
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tables Accordion */}
      {filteredTables.length > 0 && (
        <Accordion
          type="single"
          collapsible
          value={expandedItem}
          onValueChange={setExpandedItem}
          className="space-y-4"
        >
          {filteredTables.map((table) => (
            <AccordionItem
              key={table.id}
              value={`table-${table.id}`}
              className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200 no-underline hover:no-underline [&[data-state=open]]:no-underline">
                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {table.tableName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate block text-wrap">
                        {table.tableDescription}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <Badge
                        variant={
                          table.files.some((f) => f.approved)
                            ? "default"
                            : "secondary"
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          table.files.some((f) => f.approved)
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {table.files.some((f) => f.approved) ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {table.files.some((f) => f.approved)
                          ? "Approved"
                          : "Pending"}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal(setModalState, lockScroll, {
                              modalState: {
                                isOpen: true,
                                isActive: true,
                                contentName: "VIEW__ANALYSIS_DMT_FILE_UPLOAD",
                                heading: "Upload File",
                                data: { id: table.id },
                              },
                            })
                          }}
                          className="h-8 px-3 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal(setModalState, lockScroll, {
                              modalState: {
                                isOpen: true,
                                isActive: true,
                                contentName: "FORM__ANALYSIS_DMT",
                                heading: "Edit Table",
                                data: {
                                  id: table.id,
                                  tableName: table.tableName,
                                  tableDescription: table.tableDescription,
                                },
                              },
                            })
                          }}
                          className="h-8 px-3 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTable(table.id)
                          }}
                          className="h-8 px-3 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {table.files.length} file
                      {table.files.length !== 1 ? "s" : ""} uploaded
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                {table.files.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    {table.files.map((file) => (
                      <Card
                        key={file.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <CardHeader className="flex flex-row justify-between items-start py-4 px-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mt-1">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {file.filename}
                              </CardTitle>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Uploaded:{" "}
                                {format(
                                  new Date(file.updatedAt),
                                  "dd MMM yyyy, HH:mm",
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {file.approved ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    put(
                                      `/main-boards/boards/data-management-table/status/approve/${file.id}?new_approval_status=${true}`,
                                    )
                                      .then(() => {
                                        fetchData(
                                          "dataManagementTables",
                                          "data-management-table",
                                        )
                                        toast.success(
                                          "File approved successfully!",
                                        )
                                        closeModal(
                                          setModalState,
                                          unlockScroll,
                                          true,
                                        )
                                      })
                                      .catch(() => {
                                        toast.error("Failed to approve file")
                                      })
                                  }}
                                  className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      No files uploaded
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Upload files to this table to get started
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        openModal(setModalState, lockScroll, {
                          modalState: {
                            isOpen: true,
                            isActive: true,
                            contentName: "VIEW__ANALYSIS_DMT_FILE_UPLOAD",
                            heading: "Upload File",
                            data: { id: table.id },
                          },
                        })
                      }
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload First File
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <AlertModal
        isOpen={!!selectedTable}
        onCancelClick={() => setSelectedTable(null)}
        onActionClick={alertActionBtnClickHandler}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete table and its data"
      />
    </div>
  )
}
