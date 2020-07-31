import React, { Component } from "react";

import ReactImageMagnify from "react-image-magnify";
import { withStyles } from "@material-ui/core/styles";
const styles = theme => ({
  root: {}
});

class MyReactImageMagnify extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ReactImageMagnify
      {...this.props}
      {...{
        smallImage: {
          isFluidWidth: true,
          src: this.props.smallImage,
        },
        largeImage: {
          src: this.props.largeImage,
          width: 400,
          height: 800
        },
        enlargedImagePortalId: "myPortal",
      }}
      />
    );
  }
}

export default withStyles(styles)(MyReactImageMagnify);
