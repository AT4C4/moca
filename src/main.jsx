import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ItemSearch from "./ItemSearch.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ItemSearch />
  </StrictMode>,
)
