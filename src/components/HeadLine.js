import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: '100%',
    borderTopWidth: 4,
    borderTopStyle: 'solid',
    // borderTopColor: 'rgb(66, 133, 244)',
  },
};

const HeadLine = ({ classes, color, style }) => (
  <div
    className={classes.root}
    style={{
      borderTopColor: color || 'rgb(66, 133, 244)',
      ...style,
    }}
  />
);

HeadLine.defaultProps = {
  color: null,
  style: {},
};

HeadLine.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default withStyles(styles)(HeadLine);
