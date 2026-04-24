import Image from "next/image"
import Link from "next/link"
import { CardComponent } from "@/components/atoms/controls/CardComponent"
import { Heading } from "@/components/atoms/texts"
import { NavigationBar } from "@/components/molecules/nav/NavigationBar"
import { useDimensions } from "@/hooks/use-dimensions"
import { NavigationMenuBar } from "@/components/molecules/nav/NavigationMenuBar"
import { CenterModal } from "@/components/molecules/modal/CenterModal"
import SettingsView from "../../views/settings/SettingsView"
import { useModalContext } from "@/contexts/modal-context"
import clsx from "clsx"

const screens = [
  {
    label: "Consultant",
    path: "consultant",
    image:
      "https://cdn-icons-png.freepik.com/512/12210/12210394.png?ga=GA1.1.312683633.1711526830&",
  },
  {
    label: "CXO",
    path: "cxo",
    image:
      "https://img.freepik.com/free-vector/illustration-customer-service-concept_53876-5883.jpg",
  },
]

export function OverallDashboard() {
  const {
    dimensionsState: { winInnerW },
  } = useDimensions()
  const {
    modalState: { contentName },
  } = useModalContext()

  return (
    <div>
      {winInnerW < 640 ? (
        <NavigationMenuBar
          className="bg-gray-300"
          avatarContainerClassName="bg-primary text-white"
          userNameTextClassName="text-primary"
          userEmailTextClassName="text-primary"
          buttonClassName="bg-white text-primary"
        />
      ) : (
        <NavigationBar
          showLogo
          avatarContainerClassName="bg-primary text-white"
          userNameTextClassName="text-primary"
          userEmailTextClassName="text-primary"
          buttonClassName="text-primary shadow-none bg-transparent hover:bg-transparent p-0"
        />
      )}
      <div className="mt-20 flex items-center justify-center">
        <div className="relative w-[15rem] h-[47px] sm:h-[79px] sm:w-[400px]">
          <Image
            src="/logo-name.svg"
            alt="Logo"
            fill
            sizes="50vw, (max-width: 1024px): 30vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkyDlfDwADawG8NRzv6QAAAABJRU5ErkJggg=="
            quality={100}
            className="object-cover object-center"
          />
        </div>
      </div>
      <div className="flex items-center justify-center max-sm:mt-4 sm:h-[calc(100vh_-_300px)]">
        <div className="flex justify-between gap-4 max-sm:flex-col sm:gap-20">
          {screens?.map((screen) => (
            <Link
              className="group h-fit sm:w-[300px]"
              key={screen.label}
              href={screen.path}
            >
              <CardComponent
                className="w-full group-hover:shadow-primary"
                cardContent={
                  <div className="flex flex-col items-center justify-center gap-10 p-5">
                    <Heading
                      type="h1"
                      className="text-2xl text-primary"
                      text={screen.label}
                    />
                    <Image
                      src={screen.image}
                      width={winInnerW < 640 ? 80 : 160}
                      height={winInnerW < 640 ? 40 : 140}
                      alt={screen.label}
                    />
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      </div>
      <CenterModal
        dialogChildrenWrapperClassName={clsx(
          contentName === "VIEW__SETTINGS" &&
            "flex justify-center items-center",
        )}
      >
        {contentName === "VIEW__SETTINGS" && <SettingsView />}
      </CenterModal>
    </div>
  )
}
