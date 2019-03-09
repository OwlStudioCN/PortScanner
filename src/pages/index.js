/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Done from '@material-ui/icons/Done';
import classNames from 'classnames';

import Promise from 'bluebird';
import Grid from '@material-ui/core/Grid';
import { green, purple } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/es/ListItemText/ListItemText';
import ListItemIcon from '@material-ui/core/es/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import HeadLine from '../components/HeadLine';
import AppContent from '../components/AppContent';
import withRoot from '../withRoot';

Promise.config({
  cancellation: true,
});

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
const TIMEOUT = 1000;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      host: '127.0.0.1',
      start: 1,
      end: 10000,
      openPorts: [],
      timeoutPorts: [],

      loading: false,
      concurrency: 4000,
    };
  }

  analyzePort = (host, port = 8080) =>
    new Promise(resolve => {
      const socket = new net.Socket();
      socket.setTimeout(TIMEOUT, () => {
        // console.log('timeout...');
        socket.destroy();
        resolve();
      });

      socket.connect(port, host, () => {
        // console.info(`OPEN: ${port}`);
        this.setState(state => ({ openPorts: [...state.openPorts, port] }));
        // we don't destroy the socket cos we want to listen to data event
        // the socket will self-destruct in [timeout] secs cos of the timeout we set, so no worries
      });

      // if any data is written to the client on connection, show it
      socket.on('data', data => {
        // console.log(`Data in ${port}: ${data}`);
        socket.destroy();
      });

      socket.on('error', e => {
        // console.log('ERROR: ', e.message);
        socket.destroy();
      });

      socket.on('close', () => {
        // console.log(`Closed: ${port}`);
        socket.destroy();
      });
    }).catch(console.info);

  scan = async (host, start, end) => {
    console.time('Scan Time');
    // eslint-disable-next-line no-param-reassign
    if (start > end) [end, start] = [start, end];

    // eslint-disable-next-line no-param-reassign
    end = Math.min(end, 65535);
    // eslint-disable-next-line no-param-reassign
    start = Math.max(1, start);

    console.info(
      'HOST:',
      host,
      'Start:',
      start,
      'End',
      end,
      'Timeout:',
      TIMEOUT,
      'Concurrency:',
      this.state.concurrency,
    );
    const ports = [];
    for (let i = start; i <= end; i++) ports.push(i);
    // Promise.all(ports.map(port => analyzePort(host, port, TIMEOUT))).catch(console.error);

    await Promise.map(ports, port => this.analyzePort(host, port, TIMEOUT), {
      concurrency: this.state.concurrency,
    })
      .catch(e => {
        this.setState(state => ({ success: false, loading: false }));
        console.info('ERROR:', e);
      })
      .finally(() => {
        console.timeEnd('Scan Time');
        this.setState(state => ({ success: true, loading: false }));
      }); // <---- at most 10 http requests at a time
  };

  handleScanClick = () => {
    this.setState(
      state => ({
        loading: true,
        success: false,
        openPorts: [],
      }),
      () => {
        const { host, start, end } = this.state;
        this.scan(host, start, end);
      },
    );
  };

  handleChange = name => event => {
    let { value } = event.target;
    if (name !== 'host') {
      value = +value;
    }
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;
    const { openPorts, loading, success } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <AppContent>
        <div
          style={{
            WebkitAppRegion: 'drag',
            position: 'absolute',
            height: 40,
            top: 0,
            left: 0,
            right: 0,
            // backgroundColor: '#ccc',
          }}
        />
        <div>
          <h1 style={{ fontFamily: 'Product Sans', fontWeight: 500 }}>
            Port Scanner
          </h1>
          <HeadLine
            color={purple[500]}
            style={{ marginBottom: 16, marginTop: -8 }}
          />

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
                type="number"
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
                type="number"
                className={classes.textField}
                value={this.state.end}
                onChange={this.handleChange('end')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="standard-name"
                label="Concurrency"
                type="number"
                className={classes.textField}
                value={this.state.concurrency}
                onChange={this.handleChange('concurrency')}
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
            </Grid>
          </Grid>
        </div>
        {openPorts.length > 0 &&
          // && openPorts.sort((a, b) => a - b)
          !this.state.loading && (
            <Paper
              style={{ overflow: 'auto', marginBottom: 24, marginTop: 24 }}
              elevation={1}
            >
              <List>
                {openPorts.map(port => (
                  <ListItem key={port} button>
                    <ListItemIcon>
                      <Done color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary={`${this.state.host}:${port}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
      </AppContent>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
