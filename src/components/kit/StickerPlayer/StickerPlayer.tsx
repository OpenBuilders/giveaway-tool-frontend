import Lottie from 'lottie-react'
import { useRef } from 'react'

interface StickerPlayerProps {
  lottie: string | object
  height?: number | string
  width?: number | string
}

export const StickerPlayer = ({
  lottie,
  height = 112,
  width = 112,
}: StickerPlayerProps) => {
  const ref = useRef(null)

  return (
    <Lottie
      lottieRef={ref}
      loop
      autoplay
      animationData={lottie}
      style={{ height, width }}
    />
  )
}
