'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  data: string
  size?: number
}

export default function QRCodeDisplay({
  data,
  size = 200,
}: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!data) {
      setIsLoading(true)
      return
    }

    const generateQR = async () => {
      try {
        setIsLoading(true)
        const url = await QRCode.toDataURL(data, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: size,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        })
        setQrUrl(url)
      } catch (error) {
        console.error('Error generating QR code:', error)
      } finally {
        setIsLoading(false)
      }
    }

    generateQR()
  }, [data, size])

  if (isLoading) {
    return (
      <div
        className="bg-gray-100 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return <img src={qrUrl} alt="QR Code" width={size} height={size} />
}
