'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Link,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/Button'
import { FilePlus } from 'lucide-react'

interface LightningReceiptPdfProps {
  invoice: string
  preimage: string
  amount: number
  description: string
  paymentHash: string
  payeePubKey?: string
  isPaid: boolean
}

const HODLE_LOGO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMDAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI1MCIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDQtMjFUMTE6MDg6MTgrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA0LTIxVDExOjEwOjU4KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA0LTIxVDExOjEwOjU4KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEzN2UwN2VmLTRkMzgtNDU0ZC1hOGJlLWVhN2U5ZTUyMWMyNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmRkMzA3NWNlLWFhY2MtOTM0Ny05ZmEzLWUxMzRhZDEzYTI4YSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQ0N2ZjOGVlLTMzMTUtNGYxMS05ZDVhLTljZTExYjEwZDcyYiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDQ3ZmM4ZWUtMzMxNS00ZjExLTlkNWEtOWNlMTFiMTBkNzJiIiBzdEV2dDp3aGVuPSIyMDIzLTA0LTIxVDExOjA4OjE4KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEzN2UwN2VmLTRkMzgtNDU0ZC1hOGJlLWVhN2U5ZTUyMWMyNyIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yMVQxMToxMDo1OCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pge/MjsAAAr4SURBVHja7ZxrjF1VFcf/a51z7p179/10pnfamdJHKQjIo5ViaQk+EBAUFRQ0BKNBE4iPBzFEYjRKiB8kBIxBVER8xCDoi0SBAhoFtJYKLS1taaWP6Uwf05nOfcycc9Zey60lNIRkH5o0j+n+JZu597b3nrv2//zXWmvvfRiTMAAhpU8yIWAAoWGy4L0lCKaslClZzYpGSZ9JKMVx8ggAThjFZIuMu57MiEGXEJIxCYsIkSzk9FkUcVTkHPV9oMMXlKB7+7H2+OJoQjCJAHhcT8+hcvCJlQ9UPJiVxQLTu6p2Vb5lZamQcZZblbYwxRdxbSRsyoICIMi/OAABEiiTXSfL2Ydcwj7hEVQbpjKdtmb3c7e6iDEy6Yc+pOZ95hPa1n9p1tLr/DmXfk3aLgGg9AaFdG6xyNilsb5fMh09CJGykLCbpqQVHgWEpkjfuySJd0mOHm+QejGT7KWFk34IIZSaHrfG1ftnLrv+fmd6kRD6sFDsF5wzexLwUaYJyS3UqaZ1bQ5fvYn2PfjLM06t/eW8/KpbLGfeXACaAGCTJHsxOV/iklODVdKqbW3uTB3CiMYke4Ux9l79MCAEgTwOLcMAzllxYWnSZ8vZ0r4tl08zM5mJQyDckYKAaJrLGDPKZqf8TjzKLTdXOy/R4X17q30HkqpbA1KCMZbaGTNMaWQskzUmj9D9Wy2qb/jajPHv/n6iNKe/3R4aMjWV/jrXXFMr9/Yf/FebN/FKJOPGFAARi+YwSn6gV7EYYwiCsK/U07esMFh4lEvnUwAK3hBD5ZCFMS4S4Q21iXLXWCWIMqh1Jji1Xj/0wygODlGNzQfSNKqEoUjXCGagf3i8vrE1ysQWN+M4LuuQO64FIuW1wliESdS8f1QlcaBkzJNCQmgDUCyoZbLGq+3H3s1VHtBjLvX2DRR6z7gJAKSUeR3bAD13I4GI61R3vGe8/i+3+lw8cj5jnVaULLcMZ3HkTySyLEZECkq1pXyQtJ8FGnJpYiqpuXUAkYA+W7QL9gLCxCxhgLhI/OYzp+aL71s8nFHZ63YyqTGlWONGdTGCgwxMW3YRuKUEYwBhvSBN4HXDU9zxJGq0ILNzc/T1KmMiE67vPuD5x+zIt3UVK4raDCmNGUqpmkUAEhFJpCLZeKrxxuTW/ZNPGNcGjIxhYoYqLrcdSxQFRMn7Fwy3Z31rZ7lje/1/X10hLHsRjEIiQmzTsS7JZp2Pj/aEPQc3FRccH3lsZylw/+5RxlhFhGyZMPrWBGl3TDsLdBqL1EwCwxmvVNzaF9NG0jQJgimDPBGCCeHqJ9HNIq6n9KCXSkFj3JQn3mDVhR8aLq0ZXiYzzhrCWBWpNLXLSq5j3d1z/V2Hig9MVhbe/nj95fvvKZ4f+fZrpdWjfZTJ5UoJeysOtZrpomQhY7xE0NJIRYWKPq1nSStMZXKxTFpMlJjQVkF5X3NJGNrFnJWO3p2j/eusWnMu8gLMVJ9hxjjlNb+S8MZf3WKwVMhm9xQZ41r3JmKOSCBObGG5mTduvPTHoWVbj0zteF7W3/xtxjHF5cPVF3h1/9OdPO/i+vLJWs3bS0XcnkrRBQO2aSEICkQhoCWTWvn9KHOqDUAkjLLIGBV9T/rMMMYhQ5n4rhvaRaMYjz/rBU4lSRJZdybXVptc//jLybyLnp5c//K7zfBYmk0rPPX2fTffSRZsXZw5tjMYeunPY/39/b7jHA2jplZALHAWwolFSjm7aMnJ/o499VJvCYrg8HTOiVW6dWxPdYIHfkbFzTxnzIKIk2aUbCgygwvdE1gfTURB6+tTOXsQ9cOqVZ0ZW/blHsN7fRZOjcB84MbQdLOzYNSXeU6tQHbkxUfGZ2/3y1nGBBwP6XhA9bX2SkQ0vAGQkRmW8aE5NVfOLWTmvNZorhtHQ4FJg54O31iR+94FgZmpTyS+X0scJxTFQlKbcWJUGBpN/+F7bFKc3nVGRs73R2b7pW+/0n6o8Qo77zIUTv8xyrnjIzTt3JEbsD/xRBzMXPNUecMjPy497b390Pmr2VtPk/mXQi2NooL9sBCiFpnx85Z1eoTVzfGdh5CJeZmdSYcMZ80uDOQYp84GR8I1bVIlSWARHspYkQfZxrP/m1y6bJ3q77ufvbXh5sL87OQZxzNkB5CJGzsnNv/xyNSFJHSLWf9YX/7ci28wLGdr2Fx3q2XnL3dX/vjIJ9m3rlwNw3y2NbpnS6N/2UZa+CBggTnuxGzdDSPbPyDdY1sxxdxc0PvhKyzbqjLGm0Ek6nGcBMykmZQSJDZNrhR1RtndYSDHDkRu3M+Nc5Y6PJxNfO+XN33r0i1o1Vf47X12pWflF/JHTDU1ueUOvHuDDI6OdBd6+j4nQvcJw7FOC3pLMDPUzeZyhvDDA7nRHfcF+dK5QaG4QTj23yjnFyMUe2TLLbKZnxJ1Nt2Bs6p4nz/40a9Ua9TG8IU3drDRXeOoV8GoDSSiMPHSTVE9bqc+Z8Qgo75IqBBKCcRJbPi+OM7SOCsYlUg1KYOa59OeRe9bY6vxH5A9HZqGON0YTPZ0K8fGipnfzjIyV6DZ4jJqnfPPk2sn91Pn2O4vGTIYRa20DkC1Ud/1mT7b3hdEbjwqTDeexnFqJrYiM3PaO/WKtw/CgP3eXnXdWKHU96Vq4+CeZOvTnzfygwvC5kQFSTMQsQSEhEiSJBWRqzLSoqZD4tSS4ELAIwZJExK7MYRWoaLkoaQVvUcE/8y/26NJXm4XjbeFzlKrpUDNvNlM2+bS5vqYvnjRjqmH7+4pPPzDYeaUZzUPPDNc7/qEmyZ+AKUCkEkgcEMgblYRNV2VxqEEgKWPrcQe+V2ztjf2mgeXZecNbIBp6jA1ZNjVYMGCZWE7rG9tGxeGJSIvgGG7EJwAQoEKgcgLIcNEGnbWIYZ5pGeoe/qh5tqJdpQ4NbNs/+dkw9tMreY4jmVlYkJM3U40jOJmcYGSakFQb9UTN9AZEEicpIEqTQ5PJ8+ta5afXLemsPIHGZWtVmWcJFL6DClkUa8qOkdE3BoHY1BCAKbZrukQYZoUQrBaGNKnxibuKn76kw9GLz10Vb780XGJg4C7Ik6QqCRm+sQoZFOz0o4iK00kjPKgIkpMx+4Jd17TbYw/U+Cxu0HEraOskOUqaUwiaSVI03TUDQQEjQfkXKSxbKY6NQvhIUj3L5mV7SEIuAmRJJCJnIGUvWuCsGmqNIn1kR5lZvgJ0/A+yj72pVHaO6ciO+VHROrDUAyJF6q0HuWYUcZw7ZRR/aSxmYd0P5ZtxWkYI/ZcmaRpzHWsoLe88YETK1cSUGLEsQ0kqd6KMnDMbGLmS3HG6a04Tf1Mft1dY/bgk17PCruaMXeEYUYyc9Z6fvdZZK5ndqeUEa40NkOAOPIsT9TdAZWrUEI9CRF7Rfejt0OIQSR+JGSsLEbT+cyjLBkXcTCktKI0jBu2AKKdGPPSs46Nqxeu/lzz6kuWlZ9a8jNj9iKaYQvzP49vDQwTWtl0G4oGrYTYJLSNmhUlUcgY49qxqTbTOtXYiMDsXI4SLbZoSpGCiMNYKBmDUaBgghOdXS0dx5BSfLO6LakMIkkSb46IhxcqzssXJxhUQxjGhmwpRyFNC4pbOzaX5eZsf2LtXQc2vrCcGsb4tIHBg5QoKTxBWL5viBT5Km1XZ5njhxoUohOJV0vlONAQibRtq/7Oz5+Iuhf9m63bSHy3GgQTzxJXYvhV+Nqb45dduTPj9o0RHX0OIxOCbGbkqY39Y99fM55/+gXVbY0vZVZ+Fplzf5BOWvkXVk/v5kT1uF0AAAAASUVORK5CYII='

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 50,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#f97316',
  },
  section: {
    margin: 10,
    padding: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    width: '30%',
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 12,
    width: '70%',
  },
  monospace: {
    fontFamily: 'Courier',
    fontSize: 10,
    wordBreak: 'break-all',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
  status: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statusPaid: {
    color: 'green',
  },
  statusUnpaid: {
    color: 'red',
  },
})

const LightningReceiptDocument = ({
  invoice,
  preimage,
  amount,
  description,
  paymentHash,
  payeePubKey,
  isPaid,
}: LightningReceiptPdfProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src={HODLE_LOGO_BASE64} style={styles.logo} />
        </View>
        <Text style={styles.header}>Recibo Lightning</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Detalhes da Transação</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Valor:</Text>
            <Text style={styles.fieldValue}>
              {amount} {amount === 1 ? 'sat' : 'sats'}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Descrição:</Text>
            <Text style={styles.fieldValue}>{description || 'vazio'}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Status:</Text>
            <Text
              style={[
                styles.fieldValue,
                isPaid ? styles.statusPaid : styles.statusUnpaid,
              ]}
            >
              {isPaid ? 'Pagamento bem-sucedido!' : 'Pagamento não verificado'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Dados Técnicos</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Invoice:</Text>
            <Text style={styles.monospace}>{invoice}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Pré-imagem:</Text>
            <Text style={styles.monospace}>{preimage}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Hash de Pagamento:</Text>
            <Text style={styles.monospace}>{paymentHash}</Text>
          </View>

          {payeePubKey && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Chave Pública do Recebedor:</Text>
              <Text style={styles.monospace}>{payeePubKey}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Gerado em {new Date().toLocaleDateString()} às{' '}
          {new Date().toLocaleTimeString()}
        </Text>

        <Text style={styles.footer}>
          Construído com{' '}
          <Link src="https://www.npmjs.com/package/light-bolt11-decoder">
            bolt11
          </Link>{' '}
          | <Link src="https://github.com/HodleHub/hodle-receipt">GitHub</Link>
        </Text>
      </Page>
    </Document>
  )
}

export default function LightningReceiptPdfButton({
  invoice,
  preimage,
  amount,
  description,
  paymentHash,
  payeePubKey,
  isPaid,
}: LightningReceiptPdfProps) {
  const fileName = `recibo-lightning-${paymentHash.slice(0, 8)}.pdf`

  return (
    <PDFDownloadLink
      document={
        <LightningReceiptDocument
          invoice={invoice}
          preimage={preimage}
          amount={amount}
          description={description}
          paymentHash={paymentHash}
          payeePubKey={payeePubKey}
          isPaid={isPaid}
        />
      }
      fileName={fileName}
      className="no-underline"
    >
      {({ loading }) => (
        <Button
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
          disabled={loading}
        >
          <FilePlus className="h-4 w-4" />
          {loading ? 'Gerando PDF...' : 'Exportar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
