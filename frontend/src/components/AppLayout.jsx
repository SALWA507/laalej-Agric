import Footer from './Footer'
import Header from './Header'
import Hero from './Hero'
import TopUtilityBar from './TopUtilityBar'
import TrustBar from './TrustBar'

function AppLayout() {
  return (
    <div className="app-layout">
      <TopUtilityBar />
      <Header />
      <main className="site-main">
        <Hero />
      </main>
      <TrustBar />
      <Footer />
    </div>
  )
}

export default AppLayout
