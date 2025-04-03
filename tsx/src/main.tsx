import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './exercicis/index.css'
import Endolls from './practica_json_schema/Endolls'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Endolls />
  </StrictMode>,
)
