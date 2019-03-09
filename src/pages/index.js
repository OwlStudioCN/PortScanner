import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Done from '@material-ui/icons/Done';
import classNames from 'classnames';

import withRoot from '../withRoot';
import Promise from 'bluebird';
import AppContent from '../components/AppContent';
import HeadLine from '../components/HeadLine';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { green, purple } from '@material-ui/core/colors';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/es/ListItemText/ListItemText';
import ListItemIcon from '@material-ui/core/es/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';

const net = window.require('net');

const styles = theme => ({
  root: {
    // textAlign: 'center',
    // paddingTop: theme.spacing.unit * 20,
    fontFamily: 'Roboto Mono,sans-serif',
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200,
    width: '100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Index extends React.Component {
  state = {
    open: false,
    host: '127.0.0.1',
    start: 1000,
    end: 10000,
    timeout: 500,
    result: [],
    loading: false,
  };

  analyzePort = (host, port = 8080, timeout = 2000) =>
    new Promise(resolve => {
      const socket = new net.Socket();
      socket.setTimeout(timeout, () => {
        // console.log('timeout...');
        socket.destroy();
        resolve();
      });

      socket.connect(port, host, () => {
        console.log('OPEN: ' + port);
        this.setState(state => ({ result: [...state.result, port] }));
        // we don't destroy the socket cos we want to listen to data event
        // the socket will self-destruct in [timeout] secs cos of the timeout we set, so no worries
      });

      // if any data is written to the client on connection, show it
      socket.on('data', data => {
        // console.log('Data in ' + port + ': ' + data);
        socket.destroy();
      });

      socket.on('error', e => {
        // console.log('ERROR: ', e.message);
        socket.destroy();
      });
    }).catch(console.info);

  scan = async (host, start, end, timeout) => {
    if (start > end) {
      [end, start] = [start, end];
    }

    end = Math.min(end, 65535);
    start = Math.max(1, start);

    console.log("HOST:", host, start, end, timeout);
    const ports = [];
    for (let i = start; i <= end; i++) ports.push(i);
    // Promise.all(ports.map(port => analyzePort(host, port, timeout))).catch(console.error);
    await Promise.map(ports, port => this.analyzePort(host, port, timeout), {
      concurrency: 2000,
    })
      .catch(e => {
        this.setState(state => ({ success: false, loading: false }));
        console.log('ERROR:', e);
      })
      .finally(() => {
        console.log('finally');
        this.setState(state => ({ success: true, loading: false }));
      }); // <---- at most 10 http requests at a time
  };

  handleScanClick = () => {
    this.setState(
      state => ({
        loading: true,
        success: false,
        result: [],
      }),
      () => {
        const { host, start, end } = this.state;
        this.scan(host, start, end);
      },
    );
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { classes } = this.props;
    const { result, loading, success } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <AppContent>
        <h1>Port Scanner</h1>
        <HeadLine
          color={purple[500]}
          style={{ marginBottom: 16, marginTop: -8 }}
        />
        <div>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="standard-name"
                label="Host"
                className={classes.textField}
                value={this.state.host}
                onChange={this.handleChange('host')}
                // margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="standard-name"
                label="Start"
                className={classes.textField}
                value={this.state.start}
                onChange={this.handleChange('start')}
                // margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="standard-name"
                label="End"
                className={classes.textField}
                value={this.state.end}
                onChange={this.handleChange('end')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="standard-name"
                label="Concurrency"
                className={classes.textField}
                value={this.state.end}
                onChange={this.handleChange('end')}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.buttonWrapper}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={buttonClassname}
                  style={{ width: '100%' }}
                  disabled={loading}
                  onClick={this.handleScanClick}
                >
                  SCAN
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
              {/*<Button onClick={this.handleScanClick} variant="outlined" color="secondary"*/}
              {/*style={{ width: '100%' }}>Scan</Button>*/}
            </Grid>
          </Grid>
        </div>

        {/*{*/}
        {/*this.state.loading ?*/}
        {/*<LinearProgress /> :*/}
        {/*<div>*/}
        {/*{this.state.done && 'Done!!'}*/}
        {/*</div>*/}
        {/*}*/}
        <div>
          {result.length > 0 && result.sort((a, b) => a - b) && (
            <List>
              {result.map(port => (
                <ListItem key={port} button>
                  <ListItemIcon>
                    <Done color='secondary' />
                  </ListItemIcon>
                  <ListItemText primary={`${this.state.host}:${port}`} />
                </ListItem>
              ))}
            </List>
          )}
        </div>

      </AppContent>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
