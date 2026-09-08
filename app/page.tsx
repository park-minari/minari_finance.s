import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function Home() {
  const { data } = await supabase
    .from('ledger_transactions')
    .select('id, occurred_on, note, amount, kind, category, payment_method, is_fixed')
    .order('occurred_on', { ascending: false })
    .limit(20)

  const transactions = data ?? []
  const income = transactions.filter(t => t.kind === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter(t => t.kind === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const savings = transactions.filter(t => t.kind === 'savings').reduce((s, t) => s + Number(t.amount), 0)

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">MINARI FINANCE</p>
          <h1>나의 가계부</h1>
          <p className="muted">내 돈의 흐름을 한눈에 보고, 지금 써도 되는 금액을 확인해요.</p>
        </div>
        <button className="primary">+ 내역 추가</button>
      </header>

      <section className="cards">
        <div className="card accent">
          <span>이번 달 수입</span><strong>₩{income.toLocaleString()}</strong>
        </div>
        <div className="card"><span>이번 달 지출</span><strong>₩{expense.toLocaleString()}</strong></div>
        <div className="card"><span>이번 달 저축</span><strong>₩{savings.toLocaleString()}</strong></div>
        <div className="card safe"><span>지금 써도 되는 돈</span><strong>₩{Math.max(income - expense - savings, 0).toLocaleString()}</strong></div>
      </section>

      <section className="panel">
        <div className="panelTitle"><h2>최근 내역</h2><span>{transactions.length}건</span></div>
        {transactions.length === 0 ? (
          <div className="empty">아직 기록된 내역이 없어요.</div>
        ) : (
          <div className="list">
            {transactions.map(t => (
              <div className="row" key={t.id}>
                <div><b>{t.note || '내역 없음'}</b><small>{t.occurred_on ?? '-'} · {t.category || '미분류'}</small></div>
                <strong className={t.kind === 'income' ? 'income' : t.kind === 'expense' ? 'expense' : 'saving'}>
                  {t.kind === 'income' ? '+' : '-'}₩{Number(t.amount).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <nav className="nav"><span className="active">대시보드</span><span>내역</span><span>월별 분석</span><span>설정</span></nav>
    </main>
  )
}
