/* eslint-disable no-nested-ternary */

"use client"

import React from "react"
import { type VariantProps } from "class-variance-authority"

import { HiPlus } from "react-icons/hi"
import { CommandInput } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Button } from "./button"
import { toast } from "./use-toast"
import { TagPopover } from "./tag-popover"
import { TagList } from "./tag-list"
import { tagVariants } from "./tag"
import { Autocomplete } from "./autocomplete"

export enum Delimiter {
  Comma = ",",
  Enter = "Enter",
  Space = " ",
}

type OmittedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value"
>

export type Tag = {
  id: string
  text: string
}

export interface TagInputProps
  extends OmittedInputProps,
    VariantProps<typeof tagVariants> {
  placeholder?: string
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  enableAutocomplete?: boolean
  autocompleteOptions?: Tag[]
  maxTags?: number
  minTags?: number
  readOnly?: boolean
  disabled?: boolean
  onTagAdd?: (tag: string) => void
  onTagRemove?: (tag: string) => void
  allowDuplicates?: boolean
  validateTag?: (tag: string) => boolean
  delimiter?: Delimiter
  showCount?: boolean
  placeholderWhenFull?: string
  sortTags?: boolean
  delimiterList?: string[]
  truncate?: number
  minLength?: number
  maxLength?: number
  usePopoverForTags?: boolean
  value?: string | number | readonly string[] | { id: string; text: string }[]
  autocompleteFilter?: (option: string) => boolean
  direction?: "row" | "column"
  onInputChange?: (value: string) => void
  customTagRenderer?: (tag: Tag) => React.ReactNode
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onTagClick?: (tag: Tag) => void
  draggable?: boolean
  inputFieldPostion?: "bottom" | "top" | "inline"
  clearAll?: boolean
  onClearAll?: () => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  restrictTagsToAutocompleteOptions?: boolean
  tagPopoverHeading?: string
  tagPopoverDescription?: string
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props) => {
  const {
    id,
    placeholder,
    tags,
    setTags,
    variant,
    size,
    shape,
    className,
    enableAutocomplete,
    autocompleteOptions,
    maxTags,
    delimiter = Delimiter.Comma,
    onTagAdd,
    onTagRemove,
    allowDuplicates,
    showCount,
    validateTag,
    placeholderWhenFull = "Max tags reached",
    sortTags,
    delimiterList,
    truncate,
    autocompleteFilter,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    minLength,
    maxLength,
    direction = "row",
    onInputChange,
    customTagRenderer,
    onFocus,
    onBlur,
    onTagClick,
    draggable = false,
    inputFieldPostion = "bottom",
    clearAll = false,
    onClearAll,
    usePopoverForTags = false,
    inputProps = {},
    restrictTagsToAutocompleteOptions = false,
    tagPopoverHeading,
    tagPopoverDescription,
  } = props

  const [inputValue, setInputValue] = React.useState("")
  const [tagCount, setTagCount] = React.useState(Math.max(0, tags.length))
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (
    (maxTags !== undefined && maxTags < 0) ||
    (props.minTags !== undefined && props.minTags < 0)
  ) {
    toast({
      title: "maxTags and minTags cannot be less than 0",
      description:
        "Please set maxTags and minTags to a value greater than or equal to 0",
      variant: "destructive",
    })
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onInputChange?.(newValue)
  }

  const addNewTag = () => {
    const newTagText = inputValue.trim()

    // Check if the tag is in the autocomplete options if restrictTagsToAutocomplete is true
    if (
      restrictTagsToAutocompleteOptions &&
      !autocompleteOptions?.some((option) => option.text === newTagText)
    ) {
      toast({
        title: "Invalid Tag",
        description: "Please select a tag from the autocomplete options.",
        variant: "destructive",
      })
      return
    }

    if (validateTag && !validateTag(newTagText)) {
      return
    }

    if (minLength && newTagText.length < minLength) {
      toast({
        title: "Tag is too short",
        description: "Please enter a tag with more characters",
        variant: "destructive",
      })
      return
    }

    // Validate maxLength
    if (maxLength && newTagText.length > maxLength) {
      toast({
        title: "Tag is too long",
        description: "Please enter a tag with less characters",
        variant: "destructive",
      })
      return
    }

    if (
      newTagText &&
      (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) &&
      (maxTags === undefined || tags.length < maxTags)
    ) {
      setTags([
        ...tags,
        { id: new Date().getTime().toString(), text: newTagText },
      ])
      onTagAdd?.(newTagText)
      setTagCount((prevTagCount) => prevTagCount + 1)
    }
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      delimiterList
        ? delimiterList.includes(e.key)
        : e.key === delimiter || e.key === Delimiter.Enter
    ) {
      e.preventDefault()
      addNewTag()
    }
  }

  const removeTag = (idToRemove: string) => {
    setTags(tags.filter((tag) => tag.id !== idToRemove))
    onTagRemove?.(tags.find((tag) => tag.id === idToRemove)?.text || "")
    setTagCount((prevTagCount) => prevTagCount - 1)
  }

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setTags((currentTags) => {
      const newTags = [...currentTags]
      const [removedTag] = newTags.splice(oldIndex, 1)
      newTags.splice(newIndex, 0, removedTag)

      return newTags
    })
  }

  const handleClearAll = () => {
    onClearAll?.()
  }

  const filteredAutocompleteOptions = autocompleteFilter
    ? autocompleteOptions?.filter((option) => autocompleteFilter(option.text))
    : autocompleteOptions

  const displayedTags = sortTags ? [...tags].sort() : tags

  const truncatedTags = truncate
    ? tags?.map((tag) => ({
        id: tag.id,
        text:
          tag.text?.length > truncate
            ? `${tag.text.substring(0, truncate)}...`
            : tag.text,
      }))
    : displayedTags

  return (
    <div
      className={`flex w-full gap-3 ${
        inputFieldPostion === "bottom"
          ? "flex-col"
          : inputFieldPostion === "top"
            ? "flex-col-reverse"
            : "flex-row"
      }`}
    >
      {enableAutocomplete ? (
        <div className="w-full max-w-[450px]">
          <Autocomplete
            tags={tags}
            setTags={setTags}
            autocompleteOptions={filteredAutocompleteOptions as Tag[]}
            maxTags={maxTags}
            onTagAdd={onTagAdd}
            allowDuplicates={allowDuplicates ?? false}
          >
            {!usePopoverForTags ? (
              <>
                <CommandInput
                  placeholder={
                    maxTags !== undefined && tags.length >= maxTags
                      ? placeholderWhenFull
                      : placeholder
                  }
                  ref={inputRef}
                  value={inputValue}
                  disabled={maxTags !== undefined && tags.length >= maxTags}
                  onChangeCapture={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="w-full"
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    addNewTag()
                  }}
                  className="p-3"
                >
                  <HiPlus />
                </Button>
              </>
            ) : (
              <TagPopover
                tags={truncatedTags}
                customTagRenderer={customTagRenderer}
                variant={variant}
                size={size}
                shape={shape}
                borderStyle={borderStyle}
                textCase={textCase}
                interaction={interaction}
                animation={animation}
                textStyle={textStyle}
                onTagClick={onTagClick}
                draggable={draggable}
                onSortEnd={onSortEnd}
                onRemoveTag={removeTag}
                direction={direction}
                tagPopoverHeading={tagPopoverHeading}
                tagPopoverDescription={tagPopoverDescription}
              >
                <CommandInput
                  placeholder={
                    maxTags !== undefined && tags.length >= maxTags
                      ? placeholderWhenFull
                      : placeholder
                  }
                  ref={inputRef}
                  value={inputValue}
                  disabled={maxTags !== undefined && tags.length >= maxTags}
                  onChangeCapture={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="w-full"
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    addNewTag()
                  }}
                  className="p-3"
                >
                  <HiPlus />
                </Button>
              </TagPopover>
            )}
          </Autocomplete>
        </div>
      ) : (
        <div className="w-full">
          {!usePopoverForTags ? (
            <div className="flex w-[300px] justify-between">
              <Input
                ref={inputRef}
                id={id}
                type="text"
                placeholder={
                  maxTags !== undefined && tags.length >= maxTags
                    ? placeholderWhenFull
                    : placeholder
                }
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                {...inputProps}
                className={cn(className, "w-[250px]")}
                autoComplete={enableAutocomplete ? "on" : "off"}
                list={enableAutocomplete ? "autocomplete-options" : undefined}
                disabled={maxTags !== undefined && tags.length >= maxTags}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  addNewTag()
                }}
                className="p-3"
              >
                <HiPlus />
              </Button>
            </div>
          ) : (
            <TagPopover
              tags={truncatedTags}
              customTagRenderer={customTagRenderer}
              variant={variant}
              size={size}
              shape={shape}
              borderStyle={borderStyle}
              textCase={textCase}
              interaction={interaction}
              animation={animation}
              textStyle={textStyle}
              onTagClick={onTagClick}
              draggable={draggable}
              onSortEnd={onSortEnd}
              onRemoveTag={removeTag}
              direction={direction}
              tagPopoverHeading={tagPopoverHeading}
              tagPopoverDescription={tagPopoverDescription}
            >
              <div className="flex">
                <Input
                  ref={inputRef}
                  id={id}
                  type="text"
                  placeholder={
                    maxTags !== undefined && tags.length >= maxTags
                      ? placeholderWhenFull
                      : placeholder
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={cn(className, "w-[250px]")}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  {...inputProps}
                  autoComplete={enableAutocomplete ? "on" : "off"}
                  list={enableAutocomplete ? "autocomplete-options" : undefined}
                  disabled={maxTags !== undefined && tags.length >= maxTags}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    addNewTag()
                  }}
                  className="p-3"
                >
                  <HiPlus />
                </Button>
              </div>
            </TagPopover>
          )}
        </div>
      )}
      {!usePopoverForTags ? (
        <TagList
          tags={truncatedTags}
          customTagRenderer={customTagRenderer}
          variant={variant}
          size={size}
          shape={shape}
          borderStyle={borderStyle}
          textCase={textCase}
          interaction={interaction}
          animation={animation}
          textStyle={textStyle}
          onTagClick={onTagClick}
          draggable={draggable}
          onSortEnd={onSortEnd}
          onRemoveTag={removeTag}
          direction={direction}
        />
      ) : null}
      {showCount && maxTags && (
        <div className="flex">
          <span className="ml-auto mt-1 text-sm text-muted-foreground">
            {`${tagCount}`}/{`${maxTags}`}
          </span>
        </div>
      )}
      {clearAll && (
        <Button type="button" onClick={handleClearAll} className="mt-2">
          Clear All
        </Button>
      )}
    </div>
  )
})

TagInput.displayName = "TagInput"

export { TagInput }
