import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard
      .writeText(value)
      .then(() => true)
      .catch(() => false)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = value

    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    return new Promise<boolean>((resolve) => {
      const successful = document.execCommand('copy')
      textArea.remove()
      resolve(successful)
    })
  }
}

export function getURLParams(): {
  invoice: string | null
  preimage: string | null
} {
  if (typeof window === 'undefined') {
    return { invoice: null, preimage: null }
  }

  const url = new URL(window.location.href)
  const invoice = url.searchParams.get('invoice')
  const preimage =
    url.searchParams.get('proof') || url.searchParams.get('preimage')

  return {
    invoice: invoice ? invoice.toLowerCase() : null,
    preimage: preimage ? preimage.toLowerCase() : null,
  }
}
