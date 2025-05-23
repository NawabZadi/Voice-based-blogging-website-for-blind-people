import axios from 'axios';
import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { FormControl, Menu, Divider } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import FormHelperText from '@material-ui/core/FormHelperText';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';

import { signinConfig } from './signinConfig';
import AuthContext from '../../../contexts/AuthContext';
import SimpleSnackbar from '../../../components/UI/Snackbar';

const useStyles = makeStyles((theme) => ({
	formRoot: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
		},
	},
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	halfWidth: {
		width: '47% !important',
	},
	fullWidth: {
		width: '97% !important',
		textAlign: 'left',
	},
	formPad: {
		padding: '25px',
		width: '100%',
	},
	gutterBottom: {
		marginBottom: '20px',
	},
	alignLeft: {
		textAlign: 'left',
	},
	finalMargin: {
		marginTop: '20px',
	},
}));

export default function Signin(props) {
	const classes = useStyles();

	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const authorized = React.useContext(AuthContext);

	if (authorized) {
		props.history.replace('/');
	}

	const [forms, setForms] = React.useState(['signin']);
	const [formConfigs, setFormConfigs] = React.useState({
		signin: [...signinConfig],
	});
	const [errors, setErrors] = React.useState({
		signin: [],
	});
	const [formsData, setFormsData] = React.useState({
		signin: {},
	});

	const [values, setValues] = React.useState({
		amount: '',
		password: '',
		weight: '',
		weightRange: '',
		showPassword: false,
	});

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const isFormValidated = (activeStep) => {
		const formTitle = forms[activeStep];
		const errorInputs = [];
		let result = true;
		formConfigs[formTitle].forEach((input) => {
			if (input.validatorsAndAppearance.required) {
				if (formsData[formTitle][input.id]) {
					if (formsData[formTitle][input.id] === '') {
						result = false;
						errorInputs.push(input.id);
					}
				} else {
					result = false;
					errorInputs.push(input.id);
				}
			}
		});
		setErrors({
			...errors,
			[formTitle]: [...errorInputs],
		});
		return result;
	};

	const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

	const handleDateChange = (date, formTitle, inputId) => {
		helpSetFormsData(formTitle, inputId, date);
		setSelectedDate(date);
	};
	const [state, setState] = React.useState('');

	const helpSetFormsData = (formTitle, inputId, value) => {
		setFormsData({
			...formsData,
			[formTitle]: {
				...formsData[formTitle],
				[inputId]: value,
			},
		});
	};
	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });

		helpSetFormsData('signin', 'password', event.target.value);
	};
	const handleSelectChange = (event, formTitle, inputId) => {
		const stateVal = event.target.value;
		helpSetFormsData(formTitle, inputId, stateVal);
		setState(stateVal);
	};
	const handleFormValueChange = (event, formTitle, inputId) => {
		const value = event.target.value;
		helpSetFormsData(formTitle, inputId, value);
	};

	const handleSignin = () => {
		if (isFormValidated(0)) {
			axios
				.post('http://localhost:7000/auth/login', {
					...formsData.signin,
				})
				.then((res) => {
					window.localStorage.setItem('token', res.data.token);
					props.handleChange(4);
					props.handleClick();
					props.history.replace('/');
				})
				.catch((err) => {
                    setOpen(true);
                    setMessage(err.response.data.message);
				});
		}
	};

	const populateForm = (formTitle) => {
		return formConfigs[formTitle].map((input) => {
			if (!input.inputType) {
				return (
					<TextField
						key={input.id}
						className={classes[input.class]}
						id={input.id}
						label={input.label}
						value={formsData[formTitle][input.id]}
						onChange={(event) => handleFormValueChange(event, formTitle, input.id)}
						error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
						helperText={
							errors[formTitle].indexOf(input.id) > -1 ? 'Please fill out this field correctly' : ''
						}
						{...input.validatorsAndAppearance}
					/>
				);
			} else {
				if (input.inputType === 'select') {
					let menuItemsKeys = Object.keys(input.menuItems);

					return (
						<FormControl
							key={input.id}
							className={[classes.formControl, classes[input.class]].join(' ')}
							error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
							{...input.validatorsAndAppearance}
						>
							<InputLabel id="demo-simple-select-label">{input.label}</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={state}
								onChange={(event) => handleSelectChange(event, formTitle, input.id)}
								helpertext={
									errors[formTitle].indexOf(input.id) > -1 ? 'Please fill out this field' : ''
								}
							>
								{menuItemsKeys.map((mnKey) => (
									<MenuItem value={mnKey} key={mnKey}>
										{input.menuItems[mnKey]}
									</MenuItem>
								))}
							</Select>
							{errors[formTitle].indexOf(input.id) > -1 ? (
								<FormHelperText id="component-error-text">Please fill out this field.</FormHelperText>
							) : null}
						</FormControl>
					);
				} else if (input.inputType === 'date') {
					return (
						<MuiPickersUtilsProvider key={input.id} utils={DateFnsUtils}>
							<KeyboardDatePicker
								className={classes[input.class]}
								margin="normal"
								id="date-picker-dialog"
								label="Date picker dialog"
								format="MM/dd/yyyy"
								value={selectedDate}
								onChange={(date) => handleDateChange(date, formTitle, input.id)}
								error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
								helperText={
									errors[formTitle].indexOf(input.id) > -1 ? 'Please fill out this field' : ''
								}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					);
				} else if (input.inputType === 'password') {
					return (
						<FormControl
							className={[clsx(classes.margin, classes.textField), classes[input.class]].join(' ')}
							key={input.id}
							error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
							{...input.validatorsAndAppearance}
							required
						>
							<InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
							<Input
								id="standard-adornment-password"
								type={values.showPassword ? 'text' : 'password'}
								value={formsData[formTitle][input.id]}
								onChange={handleChange('password')}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
										>
											{values.showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							{errors[formTitle].indexOf(input.id) > -1 ? (
								<FormHelperText id="component-error-text">
									Please fill out this field correctly
								</FormHelperText>
							) : null}
						</FormControl>
					);
				}
			}
		});
	};

	return (
		<Container className={[classes.gutterBottom, classes.finalMargin].join(' ')} maxWidth="xs">
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Paper className={classes.formPad} variant="outlined">
				<Typography variant="h4">Login</Typography>
				<form className={classes.formRoot} noValidate autoComplete="off">
					{populateForm('signin')}
				</form>
				<Button className={classes['finalMargin']} variant="contained" color="primary" onClick={handleSignin}>
					Login
				</Button>
			</Paper>
		</Container>
	);
}
