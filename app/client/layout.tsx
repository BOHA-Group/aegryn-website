import localFont  from 'next/font/local'
import '@/styles/globals.css'

const plusJakartaSans = localFont({
  src: [
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Light-300.woff2',    weight: '300', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Regular-400.woff2',  weight: '400', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Medium-500.woff2',   weight: '500', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Bold-700.woff2',     weight: '700', style: 'normal' },
    { path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold-800.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
