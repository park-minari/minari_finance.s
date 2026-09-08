import './globals.css'

export const metadata = {
  title: '미나리 가계부',
  description: '나의 돈 흐름을 한눈에 보는 개인 가계부',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>
}
