import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import App from '../App'
import DesignRecipe from '@/components/recepiDesign'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>

<DesignRecipe/>

    </main>
  )
}