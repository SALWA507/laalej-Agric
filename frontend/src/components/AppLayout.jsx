import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import TopUtilityBar from './TopUtilityBar'
import TrustBar from './TrustBar'

function AppLayout() {
  return (
    <div className="app-layout">
      <TopUtilityBar />
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <TrustBar />
      <Footer />
    </div>
  )
}

export default AppLayout
