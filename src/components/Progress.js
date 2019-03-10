import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function LinearDeterminate(props) {
  const { classes, ...other } = props;
  console.log(props.progress);
  return (
    <LinearProgress
      color="secondary"
      variant="determinate"
      value={props.progress}
      {...other}
    />
  );
}

LinearDeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearDeterminate);
