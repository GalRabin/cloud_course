import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TopMenu from "../components/TopMenu";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import MainContent from "../components/MainContent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    // justifyContent:
  },
}));

function Home() {
  const classes = useStyles();
  const [displayed, setDisplayed] = useState("AllUsers");
  // console.log("this is disp - > ", displayed);
  return (
    <div>
      <div className={classes.root}>
        <SideMenu
          changeDisplay={(key) => {
            setDisplayed(key);
          }}
        />
        <MainContent
          display={displayed}
          changeDisplayToAllUsers={() => {
            setDisplayed("AllUsers");
          }}
          changeDisplayToAllProfiles={() => {
            setDisplayed("AllProfiles");
          }}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
{
  /* <TopMenu /> */
}
