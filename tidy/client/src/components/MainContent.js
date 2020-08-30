import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";

import AddUser from "./Utilities/MainContentUtilities/AddUser";
// import AllUsers from "./Utilities/MainContentUtilities/AllUsers";
// import AddProfile from "./Utilities/MainContentUtilities/AddProfile";
import AllUsers from "./Utilities/MainContentUtilities/AllUsers";
import AllProfiles from "./Utilities/MainContentUtilities/AllProfiles";
import AllJobs from "./Utilities/MainContentUtilities/AllJobs";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  fullWidth: {
    width: "100%",
  },
}));

function MainContent(props) {
  const classes = useStyles();

  switch (props.display) {
    case "Users":
      return <AllUsers />;

    case "Profiles":
      return <AllProfiles />;

    case "Jobs":
      return <AllJobs />;

    default:
      return <div>Default</div>;
  }
}

export default MainContent;
{
  /* <main className={classes.fullWidth}>
<div className={classes.toolbar} />
<div className={classes.title}>
  <Typography variant='h6'>Title</Typography>
</div>
<div className={classes.content}>
  <Typography paragraph>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus,
    nulla ut commodo sagittis, sapien dui mattis dui, non pulvinar lorem
    felis nec erat
  </Typography>
</div>
</main> */
}
