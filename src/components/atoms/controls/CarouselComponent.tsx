/* eslint-disable react/no-array-index-key */
import React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { Translate } from "gbusiness-ai-react-auto-translate"

type AlignmentOptionType =
  | "start"
  | "center"
  | "end"
  | ((viewSize: number, snapSize: number, index: number) => number)

export type AxisOptionType = "x" | "y"

type CarouselComponentProps = {
  slides: string[]
  options: {
    align?: AlignmentOptionType
    axis?: AxisOptionType
    container?: string | HTMLElement | null
    dragFree?: boolean
  }
  imgAlt: string
}

const imageByIndex = (images: string[], index: number) =>
  images[index % images.length]

export function CarouselComponent({
  slides,
  options,
  imgAlt,
}: CarouselComponentProps) {
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()])

  return (
    <div className="embla rounded-2xl overflow-hidden h-1/2 w-full">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides?.map((_, index) => (
            <div
              className="embla__slide flex-shrink-0 w-full flex items-center h-full rounded-2xl overflow-hidden"
              key={index}
            >
              <div className="embla__slide__number">
                <span>
                  <Translate>{(index + 1).toString()}</Translate>
                </span>
              </div>
              <div className="relative w-full h-full aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={imageByIndex(slides, index)}
                  alt={imgAlt}
                  fill
                  className="object-cover object-center rounded-2xl"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
                  quality={100}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
