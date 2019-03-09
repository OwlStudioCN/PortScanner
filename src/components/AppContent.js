import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  '@global': {
    html: {
      fontFamily: 'Roboto, Noto Sans CJK TC Light, -apple-system, sans-serif',
      backgroundColor: theme.palette.background.paper,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      boxSizing: 'border-box',
      '@media print': {
        background: theme.palette.common.white,
      },
    },
    body: {
      backgroundColor: '#FFFFFF !important',
    },
    img: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  root: theme.mixins.gutters({
    display: 'flex',
    maxHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 8,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
    // transition: theme.transitions.create('max-width'),
  }),
  // [theme.breakpoints.down('sm')]: { //max 1280 px
  [theme.breakpoints.down('md')]: {
    // max 1280 px
    // root: {
    //   overflowX: 'hidden', // ps fix minus margin in children
    // },
  },

  [theme.breakpoints.up('md')]: {
    root: {
      maxWidth: theme.breakpoints.values.md * 0.875,
    },
  },
});

function AppContent(props) {
  const { className, classes, children, ...other } = props;

  return (
    <div className={classNames(classes.root, className)} {...other}>
      {children}
    </div>
  );
}

AppContent.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default withStyles(styles)(AppContent);
