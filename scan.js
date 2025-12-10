import dynamic from 'next/dynamic'
const Scanner = dynamic(() => import('../components/Scanner'), { ssr: false });
export default function ScanPage(){
  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>Scanner de Nota (QR / OCR)</h2>
      <Scanner />
    </main>
  )
}
