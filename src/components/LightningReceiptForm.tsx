'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/Card'
import CopyButton from '@/components/CopyButton'
import ShareButton from '@/components/ShareButton'
import Separator from '@/components/ui/Separator'
import VerificationStatus from '@/components/VerificationStatus'
import LightningReceiptPdfButton from '@/components/LightningReceiptPdf'
import {
  formatLong,
  verifyPaymentProof,
  getPubkeyFromSignature,
  type LightningReceipt,
  type DecodedInvoice,
  type DecodedBolt11,
} from '@/utils/lightning'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { decode } from 'light-bolt11-decoder'

interface DecodedInvoiceData {
  amount: number
  description: string
  paymentHash: string
  decoded: DecodedInvoice
}

export default function LightningReceiptForm() {
  const [formData, setFormData] = useState<LightningReceipt>({
    invoice: '',
    preimage: '',
  })

  const [decodedInvoice, setDecodedInvoice] =
    useState<DecodedInvoiceData | null>(null)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [payeePubKey, setPayeePubKey] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const invoiceParam = url.searchParams.get('invoice')
      const proofParam =
        url.searchParams.get('proof') || url.searchParams.get('preimage')

      if (invoiceParam && proofParam) {
        setFormData({
          invoice: invoiceParam.toLowerCase(),
          preimage: proofParam.toLowerCase(),
        })
      }
    }
  }, [])

  useEffect(() => {
    const decodeInvoice = async () => {
      if (!formData.invoice) {
        setDecodedInvoice(null)
        setIsPaid(false)
        setIsVerified(false)
        setPayeePubKey('')
        return
      }

      try {
        setIsLoading(true)
        const decoded = decode(formData.invoice)

        if (!decoded) {
          setDecodedInvoice(null)
          setIsLoading(false)
          return
        }

        const amount = decoded.sections.find(
          (section) => section.name === 'amount',
        )?.value
        const description =
          decoded.sections.find((section) => section.name === 'description')
            ?.value ?? 'vazio'
        const paymentHash =
          decoded.sections.find((section) => section.name === 'payment_hash')
            ?.value ?? ''

        if (!amount) {
          setDecodedInvoice(null)
          setIsLoading(false)
          return
        }

        const decodedData: DecodedInvoiceData = {
          amount: Math.floor(Number(amount) / 1000),
          description:
            typeof description === 'string' ? description : String(description),
          paymentHash:
            typeof paymentHash === 'string' ? paymentHash : String(paymentHash),
          decoded,
        }

        setDecodedInvoice(decodedData)

        if (formData.preimage) {
          const paid = await verifyPaymentProof(formData.preimage, paymentHash)
          setIsPaid(paid)

          const adaptedDecoded: DecodedBolt11 = {
            paymentRequest: decoded.paymentRequest,
            sections: decoded.sections,
          }

          const pubKey = await getPubkeyFromSignature(adaptedDecoded)
          setPayeePubKey(pubKey || '')
        }

        setIsVerified(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao decodificar invoice:', error)
        setDecodedInvoice(null)
        setIsVerified(false)
        setIsLoading(false)
      }
    }

    decodeInvoice()
  }, [formData.invoice, formData.preimage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Image src="/hodlelogo.png" alt="Hodle Logo" width={80} height={80} />
        </div>
        <CardTitle>Recibo Lightning</CardTitle>
        <CardDescription className="text-xs">
          <p>
            A pré-imagem fornecida prova criptograficamente que a invoice
            especificada foi paga com sucesso.
          </p>
          <p>
            Saiba mais{' '}
            <a
              href="https://faq.blink.sv/blink-and-other-wallets/how-to-prove-that-a-lightning-invoice-was-paid"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-500"
            >
              aqui
            </a>
            .
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="font-medium mb-2 mt-5">Invoice:</div>
        <div className="flex w-full items-center">
          <Input
            id="invoice"
            placeholder="Invoice BOLT11 (lnbc...)"
            value={formData.invoice}
            onChange={handleInputChange}
          />
          <CopyButton title="invoice" value={formData.invoice} />
        </div>
        <div className="font-medium mb-2 mt-5">Prova de Pagamento:</div>
        <div className="flex w-full items-center">
          <Input
            id="preimage"
            placeholder="Pré-imagem"
            value={formData.preimage}
            onChange={handleInputChange}
          />
          <CopyButton title="pré-imagem" value={formData.preimage} />
        </div>

        {(decodedInvoice || isLoading) && (
          <>
            <Separator className="my-6" />
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Campo</th>
                    <th className="py-3 px-4 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {decodedInvoice && (
                    <>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Valor</td>
                        <td className="py-3 px-4 text-right">
                          {decodedInvoice.amount}{' '}
                          {decodedInvoice.amount === 1 ? 'sat' : 'sats'}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Descrição</td>
                        <td className="py-3 px-4 text-right">
                          {decodedInvoice.description}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">
                          Hash de Pagamento
                        </td>
                        <td className="py-3 px-4 text-right flex items-center justify-end">
                          <span className="truncate max-w-[160px]">
                            {formatLong(decodedInvoice.paymentHash)}
                          </span>
                          <CopyButton
                            title="hash de pagamento"
                            value={decodedInvoice.paymentHash}
                          />
                        </td>
                      </tr>
                      {payeePubKey && (
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">
                            Chave Pública do Recebedor
                          </td>
                          <td className="py-3 px-4 text-right flex items-center justify-end">
                            <span className="truncate max-w-[160px]">
                              {formatLong(payeePubKey)}
                            </span>
                            <Link
                              href={`https://amboss.space/node/${payeePubKey}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mx-3 text-gray-500 hover:text-gray-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  <tr>
                    <td className="py-3 px-4 font-medium">Status</td>
                    <td className="py-3 px-4 text-right font-medium">
                      <VerificationStatus
                        isPaid={isPaid}
                        isVerified={isVerified}
                        isLoading={isLoading}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between px-6 pb-6 flex-col sm:flex-row gap-3">
        {decodedInvoice && isVerified ? (
          <>
            <div className="w-full sm:w-1/2">
              <LightningReceiptPdfButton
                invoice={formData.invoice}
                preimage={formData.preimage}
                amount={decodedInvoice.amount}
                description={decodedInvoice.description}
                paymentHash={decodedInvoice.paymentHash}
                payeePubKey={payeePubKey}
                isPaid={isPaid}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <ShareButton form={formData} />
            </div>
          </>
        ) : (
          <div className="w-full">
            <ShareButton form={formData} />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
