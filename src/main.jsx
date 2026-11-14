
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

document.getElementById('encryptionForm').addEventListener('submit', (e) => {
  e.preventDefault()

  const input = document.getElementById('input').value

  root.render(
    <StrictMode>
      <App input={input} />
    </StrictMode>
  )
})