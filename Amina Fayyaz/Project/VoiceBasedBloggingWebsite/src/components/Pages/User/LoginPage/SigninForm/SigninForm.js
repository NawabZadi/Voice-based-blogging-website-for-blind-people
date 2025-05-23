import React, { useState, useEffect, useRef } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AuthService from '../../../../../services/auth-service';
import { Link } from 'react-router-dom';
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn(props) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const commands = [
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
      command: "Sign In.",
      callback: () => {
        SigninHandler();
        ttsSpeak('You have signed in successfully');
      },
      description: "Triggers the Sign In process"
    },
    {
      command: "Sign up.",
      callback: async () => {
        console.log('Signing up the user');
        props.history.push('/signup');
        ttsSpeak('You have now directed to signup page');
      },
      description: "Triggers the Sign up process"
    },
    {
      command: "Help.",
      callback: () => ttsSpeak('The available commands are: Enter Email, Enter Password, Read Email, Read Password, Sign In, Help'),
      description: "Provides help with available commands"
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
      setTimeout(ttsSpeak('Welcome to the Sign In Page. What would you like to do? Say help and I will guide you through the commands.'),)
	  }, []);

  const classes = useStyles();

  const SigninHandler = (event) => {
    //event.preventDefault();

    setLoading(true);

    AuthService.login(form.email, form.password)
      .then((response) => {
        setForm({ email: '', password: '' });
        setLoading(false);
        const userId = response.userId;
        props.history.push(`/articles-directory/user-articles/${userId}`);
        console.log('response:', response);
      })
      .catch((error) => {
        setLoading(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
       console.log('error');
        console.log(error.response);
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
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={form.email}
              onChange={(event) => {
                setForm({
                  email: event.target.value,
                  password: form.password
                });
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => {
                setForm({
                  email: form.email,
                  password: event.target.value
                });
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={SigninHandler}
            >
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}></Box>
      </Container>
    </React.Fragment>
  );
}
