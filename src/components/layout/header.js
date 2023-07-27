"use client";
import { Fragment } from "react";
import classes from "./header.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header(props) {
  const router = useRouter();
  return (
    <Fragment //className={classes.header}
    >
      <div
        className={classes.background}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div id="my-div">
          <div
            style={{
              borderRadius: "50%",
              minWidth: "10rem",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              position: "sticky",
              zIndex: 2,
            }}
          >
            <button
              onClick={() => {
                router.push("/");
              }}
              className={classes.button}
            >
              Recipe Design
            </button>
            <button
              onClick={() => {
                router.push("/plan");
              }}
              className={classes.button}
            >
              Weekle Plan
            </button>
            {/* <button
              onClick={() => {
                router.push("/talleres");
              }}
              className={classes.button}
            >
              Talleres
            </button>
            <button
              onClick={() => {
                router.push("/nosotros");
              }}
              className={classes.button}
            >
              Contacto
            </button> */}
          </div>
        </div>

        {/* <div className={classes["main-image"]}>
          <Image
            src={"/herramientas2.jpg"}
            width={800}
            height={450}
            alt="goods and services"
          />
        </div> */}
      </div>
    </Fragment>
  );
}
