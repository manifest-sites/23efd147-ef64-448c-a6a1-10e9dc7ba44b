import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import ClownApp from './components/ClownApp'

function App() {

  return (
    <Monetization>
      <ClownApp />
    </Monetization>
  )
}

export default App