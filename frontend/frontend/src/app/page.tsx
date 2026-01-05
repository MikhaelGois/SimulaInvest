import { Navigation } from '@/components/Navigation'

export default function Home() {
  const stats = [
    { label: 'Bovespa', value: '130.450', change: '+1.23%' },
    { label: 'Dólar', value: 'R$ 5.12', change: '-0.45%' },
    { label: 'Ouro', value: 'R$ 295,00', change: '+0.89%' },
    { label: 'Ibovespa Futuro', value: '131.000', change: '+0.42%' },
  ]

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bem-vindo ao SimulaInvest
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Simule seus lucros, analise ativos e tome decisões de investimento com confiança.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/descobrir"
                className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-blue-50 transition"
              >
                Começar Análise
              </a>
              <a
                href="/simulador"
                className="bg-blue-500 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
              >
                Simular Lucro
              </a>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Visão Geral do Mercado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const isPositive = stat.change.includes('+')
              return (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                  <p className="text-slate-600 text-sm font-semibold mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                  <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">Descobrir Ativos</h3>
              <p className="text-slate-600">
                Explore ações, ETFs e FIIs com análise técnica e fundamentalista em tempo real.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">Simulador de Lucro</h3>
              <p className="text-slate-600">
                Simule seus cenários de lucro com análise de risco e probabilidade de atingir o alvo.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">Renda Fixa</h3>
              <p className="text-slate-600">
                Analise títulos públicos (Tesouro Direto) com as melhores rentabilidades.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Pronto para começar?
          </h2>
          <p className="text-slate-600 mb-6">
            Acesse agora a plataforma e simule seus primeiros cenários de investimento.
          </p>
          <a
            href="/simulador"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Ir para o Simulador
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-600">
          <p>SimulaInvest © 2026 | Plataforma de Simulação de Investimentos</p>
          <p className="text-sm mt-2">
            <a href="http://localhost:8000/docs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              API Documentation
            </a>
          </p>
        </footer>
      </main>
    </>
  )
}
