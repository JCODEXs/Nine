import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import App from "../App";
import DesignRecipe from "@/components/recepiDesign";
import axios from "axios";
// import { getIngredients, getRecipes } from "@/pantry";

const inter = Inter({ subsets: ["latin"] });
export default async function Home() {
  return (
    <main className={styles.main}>
      <DesignRecipe />
    </main>
  );
}
