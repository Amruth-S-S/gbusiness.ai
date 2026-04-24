"use client"

import { useEffect, useState } from "react"
import { SettingsData } from "@/lib/types"
import { SettingsViewProps } from "@/lib/props"
import { useBoardsStore } from "@/store/boards"
import { useMiddlePaneStore } from "@/store/middle-pane"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertModal } from "@/components/molecules/modal/AlertModal"
import { post, put, remove } from "@/services/utils"
import { TabKey } from "@/lib/types"
import toast from "react-hot-toast"
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle,
  ChevronDown,
  Settings,
} from "lucide-react"

export interface SettingsSubColumnData {
  id: number
  keyName: string
  valueName: string
  isDisabled: boolean
  board_id?: number
}

export interface SettingsColumnData {
  id?: number
  board_id?: number
  name: string
  isDisabled: boolean
  subRows?: SettingsSubColumnData[]
}

type AccumulatorType = {
  [key: string]: string
}

export function SettingsView({ info }: SettingsViewProps) {
  const { selectedBoard } = useBoardsStore()
  const { middlePaneState, fetchData } = useMiddlePaneStore()
  const [accordionData, setAccordionData] = useState<SettingsColumnData[]>([])
  const [expandedItem, setExpandedItem] = useState<string | undefined>()
  const [selectedItemForDelete, setSelectedItemForDelete] =
    useState<SettingsColumnData | null>(null)

  useEffect(() => {
    fetchData(info.name, info.apiKey)
  }, [selectedBoard?.id])

  const boardId = selectedBoard?.id ?? null

  useEffect(() => {
    const relevantData = middlePaneState[info.name]?.data
    if (boardId && relevantData) {
      const selectedAIDoc = (relevantData as SettingsData[]).filter(
        (aiDoc) => aiDoc.boardId === boardId,
      ) as SettingsData[]

      if (selectedAIDoc.length) {
        const configurationDetailsArray = selectedAIDoc.map((doc) => ({
          id: doc.id,
          name: doc.name,
          isDisabled: true,
          board_id: doc.boardId ?? boardId,
          subRows: doc.configurationDetails
            ? Object.entries(doc.configurationDetails).map(
                ([key, value], index) => ({
                  id: index,
                  keyName: key,
                  valueName: value,
                  isDisabled: true,
                  board_id: doc.boardId ?? boardId,
                }),
              )
            : [],
        }))
        setAccordionData(configurationDetailsArray)
      } else {
        setAccordionData([])
      }
    } else {
      setAccordionData([])
    }
  }, [middlePaneState[info.name]?.data, boardId])

  const handleAddNewSetting = () => {
    if (boardId) {
      setAccordionData((prev) => [
        ...prev,
        {
          id: new Date().getTime(),
          name: "",
          isDisabled: false,
          board_id: boardId,
          subRows: [
            {
              id: new Date().getTime(),
              isDisabled: false,
              keyName: "",
              valueName: "",
              board_id: boardId,
            },
          ],
        },
      ])
    }
  }

  const handleUpdateSetting = (
    index: number,
    field: keyof SettingsColumnData,
    value: any,
  ) => {
    setAccordionData((prev) => {
      const newData = [...prev]
      newData[index] = { ...newData[index], [field]: value }
      return newData
    })
  }

  const handleUpdateSubRow = (
    settingIndex: number,
    subRowIndex: number,
    field: keyof SettingsSubColumnData,
    value: any,
  ) => {
    setAccordionData((prev) => {
      const newData = [...prev]
      if (newData[settingIndex].subRows) {
        newData[settingIndex].subRows![subRowIndex] = {
          ...newData[settingIndex].subRows![subRowIndex],
          [field]: value,
        }
      }
      return newData
    })
  }

  const handleAddSubRow = (settingIndex: number) => {
    setAccordionData((prev) => {
      const newData = [...prev]
      if (newData[settingIndex].subRows) {
        newData[settingIndex].subRows!.push({
          id: new Date().getTime(),
          isDisabled: false,
          keyName: "",
          valueName: "",
          board_id: boardId ?? undefined,
        })
      }
      return newData
    })
  }

  const handleRemoveSubRow = (settingIndex: number, subRowIndex: number) => {
    setAccordionData((prev) => {
      const newData = [...prev]
      if (newData[settingIndex].subRows) {
        newData[settingIndex].subRows!.splice(subRowIndex, 1)
      }
      return newData
    })
  }

  const handleSaveSetting = async (setting: SettingsColumnData) => {
    if (
      !setting.name ||
      !setting.subRows?.some((subRow) => subRow.keyName && subRow.valueName)
    ) {
      toast.error("Please fill all required fields", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
        position: "top-right",
      })
      return
    }

    const configurationDetails = setting.subRows?.reduce(
      (acc: AccumulatorType, obj) => {
        if (obj.keyName && obj.valueName) {
          acc[obj.keyName] = obj.valueName
        }
        return acc
      },
      {},
    )

    try {
      if (setting.id && setting.id.toString().length > 10) {
        // New setting
        await post(`/main-boards/boards/${info.apiKey}/`, {
          board_id: setting.board_id,
          configuration_details: JSON.stringify(configurationDetails),
          name: setting.name,
        })
      } else {
        // Existing setting
        await put(`/main-boards/boards/${info.apiKey}/${setting.id}`, {
          board_id: setting.board_id,
          configuration_details: JSON.stringify(configurationDetails),
          name: setting.name,
        })
      }

      await fetchData(info.name, info.apiKey)
      toast.success("Setting saved successfully!")
    } catch (error) {
      toast.error("Failed to save setting")
    }
  }

  const handleDeleteSetting = async () => {
    if (!selectedItemForDelete) return

    try {
      if (
        selectedItemForDelete.id &&
        selectedItemForDelete.id.toString().length < 10
      ) {
        await remove(
          `/main-boards/boards/${info.apiKey}`,
          selectedItemForDelete.id,
        )
        await fetchData(info.name, info.apiKey)
      } else {
        setAccordionData((prev) =>
          prev.filter((item) => item.id !== selectedItemForDelete.id),
        )
      }
      setSelectedItemForDelete(null)
      toast.success("Setting deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete setting")
    }
  }

  return (
    <div className="mt-5 space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto">
      {/* Header Section */}
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          onClick={handleAddNewSetting}
          className="text-white shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {/* Empty State */}
      {accordionData.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No settings found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 max-w-sm">
              Get started by creating your first setting configuration.
            </p>
            <Button
              onClick={handleAddNewSetting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Setting
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Settings Accordion */}
      {accordionData.length > 0 && (
        <Accordion
          type="single"
          collapsible
          value={expandedItem}
          onValueChange={setExpandedItem}
          className="space-y-4"
        >
          {accordionData.map((setting, settingIndex) => (
            <AccordionItem
              key={setting.id}
              value={`setting-${setting.id}`}
              className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200 no-underline hover:no-underline [&[data-state=open]]:no-underline">
                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Input
                          value={setting.name}
                          onChange={(e) =>
                            handleUpdateSetting(
                              settingIndex,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Setting name"
                          className="text-lg font-semibold border-none shadow-none p-0 h-auto bg-transparent focus:ring-0 focus:border-none"
                          disabled={setting.isDisabled}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.subRows?.length || 0} configuration
                        {setting.subRows?.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpdateSetting(
                            settingIndex,
                            "isDisabled",
                            !setting.isDisabled,
                          )
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        {setting.isDisabled ? (
                          <Edit3 className="w-3 h-3 mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {setting.isDisabled ? "Edit" : "Update"}
                      </Button>

                      {info.name !== "aiDocumentation" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItemForDelete(setting)
                          }}
                          className="h-8 px-3 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveSetting(setting)
                        }}
                        className="h-8 px-3 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 mt-4">
                  {/* Configuration Items */}
                  {setting.subRows && setting.subRows.length > 0 ? (
                    <div className="space-y-3">
                      {setting.subRows.map((subRow, subRowIndex) => (
                        <Card
                          key={subRow.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  Key
                                </Label>
                                <Input
                                  value={subRow.keyName}
                                  onChange={(e) =>
                                    handleUpdateSubRow(
                                      settingIndex,
                                      subRowIndex,
                                      "keyName",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Configuration key"
                                  className="text-sm"
                                  disabled={subRow.isDisabled}
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  {info.name === "aiDocumentation"
                                    ? "Description"
                                    : "Value"}
                                </Label>
                                <Input
                                  value={subRow.valueName}
                                  onChange={(e) =>
                                    handleUpdateSubRow(
                                      settingIndex,
                                      subRowIndex,
                                      "valueName",
                                      e.target.value,
                                    )
                                  }
                                  placeholder={
                                    info.name === "aiDocumentation"
                                      ? "Description"
                                      : "Configuration value"
                                  }
                                  className="text-sm"
                                  disabled={subRow.isDisabled}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateSubRow(
                                      settingIndex,
                                      subRowIndex,
                                      "isDisabled",
                                      !subRow.isDisabled,
                                    )
                                  }
                                  className="h-8 px-3 text-xs"
                                >
                                  {subRow.isDisabled ? (
                                    <Edit3 className="w-3 h-3 mr-1" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {subRow.isDisabled ? "Edit" : "Update"}
                                </Button>

                                {info.name !== "aiDocumentation" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleRemoveSubRow(
                                        settingIndex,
                                        subRowIndex,
                                      )
                                    }
                                    className="h-8 px-3 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Settings className="w-8 h-8 text-gray-400 mb-3" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        No configurations
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Add configurations to this setting
                      </p>
                    </div>
                  )}

                  {/* Add Configuration Button */}
                  {info.name !== "aiDocumentation" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddSubRow(settingIndex)}
                      className="w-full text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Configuration
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={!!selectedItemForDelete}
        onCancelClick={() => setSelectedItemForDelete(null)}
        onActionClick={handleDeleteSetting}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this setting and its configurations."
      />
    </div>
  )
}
