import Link from 'next/link'
export default function Home() {
  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h1>Meu App Financeiro — PWA</h1>
      <p>Bem-vindo! Use o scanner para digitalizar notas e contas.</p>
      <ul>
        <li><Link href='/scan'>Ir para Scanner</Link></li>
      </ul>
    </main>
  )
}
