import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';

import axios from 'axios';
import AuthService from '../../../../../services/auth-service';
import { useSpeechRecognition } from "react-speech-recognition";
const speech = new SpeechSynthesisUtterance();

function ttsSpeak(message) {
  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices[1];
  speech.text = message;
  window.speechSynthesis.speak(speech);
}
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp(props) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const commands = [
		{
		  command: "go back.",
		  callback: () => props.history.goBack(),
		  description: "Goes back to the previous page",
		},
    {
		  command: "Enter Username.",
		  callback: () =>{
      document.getElementById("username").focus();
      ttsSpeak('Enter the username in the text area');
      },
      description: "Focuses on the username input field"
		},
    {
		  command: "Enter E-mail.",
		  callback: () =>{
      document.getElementById("email").focus();
      ttsSpeak('Enter the email in the text area');
      },
      description: "Focuses on the email input field"
		},
		{
		  command: "Enter Password.",
		  callback: () => {
        document.getElementById("password").focus();
        ttsSpeak('Enter the password in the text area');
      },
      description: "Focuses on the password input field"
		},
    {
		  command: "Enter Confirm Password.",
		  callback: () => {
        document.getElementById("confirm-password").focus();
        ttsSpeak('Enter the confirm Password in the text area');
      },
      description: "Focuses on the confirm Password input field"
		},
    {
      command: "Read Username.",
      callback: () => ttsSpeak(`Username is: ${form.username}`),
      description: "Reads the username input value"
    },
		{
      command: "Read E-mail.",
      callback: () => ttsSpeak(`Email is: ${form.email}`),
      description: "Reads the email input value"
    },
    {
      command: "Read Password.",
      callback: () => ttsSpeak(`Password is: ${form.password}`),
      description: "Reads the password input value"
    },
    {
      command: "Read Confirm Password.",
      callback: () => ttsSpeak(`Password is: ${form.confirmPassword}`),
      description: "Reads the Confirm password input value"
    },
    {
      command: "Sign In.",
      callback: async () => {
        console.log('Signing in the user');
        props.history.push('/');
        ttsSpeak('You have now directed to signin page');
      },
      description: "Triggers the Sign In process"
    },
    {
      command: "Sign up.",
      callback: () => { SignupHandler();
        ttsSpeak('You are now registered');
      },
      description: "Triggers the Sign up process"
    },
		{
		  command: "scroll down.",
		  callback: () => window.scrollTo({ top: window.pageYOffset + 500, behavior: "smooth" }),
		},
		{
		  command: "scroll up.",
		  callback: () => window.scrollTo({ top: window.pageYOffset - 500, behavior: "smooth" }),
		},
		{
		  command: 'help.',
		  callback: async () => {
			ttsSpeak('The available commands are: ');
		  },
		  description: 'Help command'
		},
	  ];
	
	  const { transcript } = useSpeechRecognition({ commands });
	
	  const updateSidebar = () => {
		if (props.editor) {
		  commands.push();
		}
		props.setCommands(commands);
	  };
	
	  const commandsAndDesc = [];
	
	  commands.forEach((cmd) => {
		commandsAndDesc.push({
		  command: cmd.command,
		  description: cmd.description
		});
	  });
	
	  useEffect(() => {
		updateSidebar();
	  }, []);
	
	  // const { resetTranscript, interimTranscript, finalTranscript } =
	  //   useSpeechRecognition({ commands });
	  // const [editorJSON, setEditorJSON] = useState('');
	
	  // const onEditorStateChange = (editorState) => {
	  //   setEditorState((prevEditorState) => {
	  //     return editorState;
	  //   });
	
	  useEffect(() => {
		console.log('Transcript:', transcript);
	  }, [transcript]);
	
	  useEffect(() => {
      setTimeout(
		ttsSpeak('Welcome to the Sign UP Page. What would you like to do? Say help and I will guide you through the commands.'),)
	  }, []);

  const classes = useStyles();

  const SignupHandler = (event) => {
    //event.preventDefault();
    setLoading(true);

    AuthService.register(
      form.username,
      form.email,
      form.password,
      form.confirmPassword
    )
      .then((response) => {
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
        setLoading(false);
        props.history.push('/');
      })
      .catch((error) => {
        setLoading(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.log(error.response.data.data[0].msg);
      });
  };

  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : ''}
      <Container
        component="main"
        maxWidth="xs"
        style={{
          border: '1px solid rgba(0,0,0,0.2)',
          margin: '5rem auto',
          paddingBottom: '2rem'
        }}
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}></Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={form.username}
                  onChange={(event) => {
                    setForm({
                      username: event.target.value,
                      email: form.email,
                      password: form.password,
                      confirmPassword: form.confirmPassword
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm({
                      username: form.username,
                      email: event.target.value,
                      password: form.password,
                      confirmPassword: form.confirmPassword
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={(event) => {
                    setForm({
                      username: form.username,
                      email: form.email,
                      password: event.target.value,
                      confirmPassword: form.confirmPassword
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  value={form.confirmPassword}
                  onChange={(event) => {
                    setForm({
                      username: form.username,
                      email: form.email,
                      password: form.password,
                      confirmPassword: event.target.value
                    });
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={SignupHandler}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}></Box>
      </Container>
    </React.Fragment>
  );
}
