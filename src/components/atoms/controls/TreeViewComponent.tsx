/* eslint-disable no-use-before-define */
import React, { useMemo, useCallback, Dispatch, SetStateAction } from "react"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Button } from "@/components/ui/button"
import { MainBoardType, TreeItem } from "@/lib/types"
import { cn } from "@/lib/utils"

type TreeProps = React.ComponentPropsWithoutRef<"div"> & {
  nodes: TreeItem[]
  className?: string
  parentType?: MainBoardType
  setNodes: Dispatch<SetStateAction<TreeItem[]>>
  onTreeItemClick?: Function
}

const expandNodeById = (
  nodes: TreeItem[],
  nodeId: TreeItem["id"],
): TreeItem[] =>
  nodes?.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        isSelected: node.children?.length ? !node.isSelected : true,
      }
    }

    if (node.children) {
      return {
        ...node,
        isSelected: node.isSelected,
        children: expandNodeById(node.children, nodeId),
      }
    }

    return { ...node, isSelected: false }
  })

export function Tree({
  nodes,
  setNodes,
  className,
  onTreeItemClick,
  parentType,
  ...props
}: TreeProps) {
  const handleNodeSelect = useCallback((nodeId: TreeItem["id"]) => {
    setNodes((prevNodes) => expandNodeById(prevNodes, nodeId))
  }, [])

  const renderNodes = useMemo(
    () => (items: TreeItem[]) =>
      items?.map((node) => (
        <TreeNode
          key={node.id}
          onNodeSelect={handleNodeSelect}
          {...node}
          onTreeItemClick={onTreeItemClick}
          setNodes={setNodes}
          type={node.type ?? parentType}
        />
      )),
    [handleNodeSelect],
  )

  return (
    <div
      className={cn(
        "flex flex-col gap-1 overflow-y-auto max-h-screen",
        className,
      )}
      {...props}
    >
      {renderNodes(nodes)}
    </div>
  )
}

type TreeNodeProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> &
  TreeItem & {
    onNodeSelect: (id: TreeItem["id"]) => void
    setNodes: Dispatch<SetStateAction<TreeItem[]>>
    onTreeItemClick?: Function
  }

function TreeNode({
  id,
  name,
  type,
  children,
  rightNode,
  setNodes,
  isSelected,
  onNodeSelect,
  onTreeItemClick,
  ...props
}: TreeNodeProps) {
  const handleClick = useCallback(() => {
    if (onTreeItemClick) {
      onTreeItemClick({ id, name, type })
    }
    onNodeSelect(id)
  }, [id, onNodeSelect])

  return (
    <div {...props} className="space-y-1">
      <div
        className={cn(
          "group flex justify-between gap-1 rounded-l-md hover:bg-[#313b96]",
        )}
      >
        <Button
          className={cn(
            "justify-start gap-1 p-1",
            !children?.length && isSelected && "text-[#F2D351]",
            !children?.length && "pl-7",
          )}
          onClick={handleClick}
          readOnly={!children}
          variant="destructive"
          disableAnimation
        >
          {!!children?.length &&
            (isSelected ? (
              <HiChevronUp size={20} className="min-w-5" />
            ) : (
              <HiChevronDown size={20} className="min-w-5" />
            ))}

          <span
            title={name}
            className="inline-block max-w-[130px] whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <Translate>{name}</Translate>
          </span>
        </Button>
        {rightNode && (
          <div
            className={cn(
              "hidden group-hover:flex group-hover:items-center group-hover:justify-center",
              isSelected && "flex items-center justify-center",
            )}
          >
            {rightNode}
          </div>
        )}
      </div>
      {children && isSelected && (
        <Tree
          className="pl-4"
          nodes={children}
          onTreeItemClick={onTreeItemClick}
          setNodes={setNodes}
          parentType={type}
        />
      )}
    </div>
  )
}
