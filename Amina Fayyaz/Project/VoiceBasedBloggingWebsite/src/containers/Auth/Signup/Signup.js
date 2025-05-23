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
import convert from 'xml-js';

import { signupConfig } from './signupConfig';
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

export default function Signup(props) {
	const classes = useStyles();

	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const nameRef = React.useRef();

	const [forms, setForms] = React.useState(['signup']);
	const [formConfigs, setFormConfigs] = React.useState({
		signup: [...signupConfig],
	});
	const [errors, setErrors] = React.useState({
		signup: [],
	});
	const [formsData, setFormsData] = React.useState({
		proceedToSignup: false,
		signup: {
			firstname: '',
			lastname: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipcode: '',
		},
	});
	const [user, setUser] = React.useState({});
	React.useEffect(() => {
		if (!props.signup) {
			axios
				.get('http://localhost:7000/auth/user-profile', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + window.localStorage.getItem('token'),
					},
				})
				.then((res) => {
					setUser(res.data.user);
				})
				.catch((err) => {
					console.log(err.response);
				});
		}
	}, []);

	React.useEffect(() => {
		if (!props.signup) {
			let keys = Object.keys(user);
			let signup = {};
			keys.forEach((key) => {
				if (key.toLowerCase() !== 'password') signup[key.toLowerCase()] = user[key];
			});
			setFormsData({
				...formsData,
				signup: {
					...formsData['signup'],
					...signup,
				},
			});
			setValues({ ...values, password: user.Password });
		}
	}, [user]);

	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (formsData.proceedToSignup) {
			if (props.signup) {
				axios
					.put('http://localhost:7000/auth/signup', {
						...formsData.signup,
					})
					.then((res) => {
						setOpen(true);
						setMessage('Account created successfully');
					})
					.catch((err) => {
						setOpen(true);
						let errMsg;
						if (err.response.data.data) {
							errMsg = err.response.data.data[0].msg;
						} else {
							errMsg = 'Something went wrong. Make sure to choose a unique username';
						}
						setMessage(errMsg);
					});
			} else {
				axios
					.put(
						'http://localhost:7000/auth/update-profile',
						{
							...formsData.signup,
						},
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + window.localStorage.getItem('token'),
							},
						}
					)
					.then((res) => {
						setOpen(true);
						setMessage('Profile updated successfully');
					})
					.catch((err) => {
						setOpen(true);
						let errMsg;
						if (err.response.data.data) {
							errMsg = err.response.data.data[0].msg;
						} else {
							errMsg = err.response.data.message;
						}
						setMessage(errMsg);
					});
			}
		}
	}, [formsData.proceedToSignup, count]);

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
			if (props.signup) {
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
			} else {
				if (input.validatorsAndAppearance.required && input.id !== 'password') {
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

		helpSetFormsData('signup', 'password', event.target.value);
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

	const handleSignup = () => {
		if (isFormValidated(0)) {
			let address2Verify = formsData['signup'].address1;
			let city2Verify = formsData['signup'].city;
			let state2Verify = formsData['signup'].state;
			let zipcode2Verify = formsData['signup'].zipcode;
			axios
				.get(
					'https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="021COMPA3753"><Revision>1</Revision><Address ID="0"><Address1>' +
						address2Verify +
						'</Address1><Address2></Address2><City>' +
						city2Verify +
						'</City><State>' +
						state2Verify +
						'</State><Zip5>' +
						zipcode2Verify +
						'</Zip5><Zip4/></Address></AddressValidateRequest>'
				)
				.then((res) => {
					let options = { compact: true, ignoreComment: true, spaces: 4 };
					var result = convert.xml2json(res.data, options);

					let resultXML = res.data;
					let parser = new DOMParser();
					let xmlDoc = parser.parseFromString(resultXML, 'text/xml');
					let error = xmlDoc.getElementsByTagName('Error')[0];
					let description;
					let formTitle = 'signup';
					if (error) {
						description = error.childNodes[2].innerHTML;
						if (description === 'Invalid City.  ') {
							setErrors({
								...errors,
								[formTitle]: ['city'],
							});
						} else {
							setErrors({
								...errors,
								[formTitle]: ['address1'],
							});
						}
						return Promise.reject(new Error('fail'));
					}

					return res;
				})
				.then((res) => {
					let resultXML = res.data;
					let parser = new DOMParser();
					let xmlDoc = parser.parseFromString(resultXML, 'text/xml');

					let updatedAddress = xmlDoc.getElementsByTagName('Address2')[0].innerHTML;
					let updatedZipcode = xmlDoc.getElementsByTagName('Zip5')[0].innerHTML;

					setFormsData({
						...formsData,
						proceedToSignup: true,
						signup: {
							...formsData['signup'],
							address1: updatedAddress,
							zipcode: updatedZipcode,
						},
					});
					setCount((prevCount) => prevCount + 1);
				})
				.catch((err) => {
					console.log(err);
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
						value={formsData[formTitle][input.id]}
						label={input.label}
						onChange={(event) => handleFormValueChange(event, formTitle, input.id)}
						error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
						helperText={
							errors[formTitle].indexOf(input.id) > -1 ? 'Please fill out this field correctly' : ''
						}
						ref={input.id === 'name' ? nameRef : null}
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
								value={state !== '' ? state : formsData['signup'].state}
								onChange={(event) => handleSelectChange(event, formTitle, input.id)}
								helpertext={
									errors[formTitle].indexOf(input.id) > -1
										? 'Please fill out this field correctly'
										: ''
								}
							>
								{menuItemsKeys.map((mnKey) => (
									<MenuItem value={mnKey} key={mnKey}>
										{input.menuItems[mnKey]}
									</MenuItem>
								))}
							</Select>
							{errors[formTitle].indexOf(input.id) > -1 ? (
								<FormHelperText id="component-error-text">
									Please fill out this field correctly.
								</FormHelperText>
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
									errors[formTitle].indexOf(input.id) > -1
										? 'Please fill out this field correctly'
										: ''
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
									Please fill out this field correctly.
								</FormHelperText>
							) : null}
						</FormControl>
					);
				}
			}
		});
	};

	setTimeout(() => {
		if (!props.signup) {
			if (nameRef.current) {
				nameRef.current.childNodes[0].classList.add('MuiInputLabel-shrink');
				nameRef.current.childNodes[0].classList.add('MuiFocused');
				nameRef.current.childNodes[0].classList.add('MuiFocused');
			}
		}
	}, 1000);

	return (
		<Container className={[classes.gutterBottom, classes['finalMargin']].join(' ')} maxWidth="sm">
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Paper className={classes.formPad} variant="outlined">
				<Typography variant="h4">{props.signup ? 'Create Account' : 'Update Profile'}</Typography>
				<form className={classes.formRoot} noValidate autoComplete="off">
					{populateForm('signup')}
				</form>
				<Button className={classes['finalMargin']} variant="contained" color="primary" onClick={handleSignup}>
					{props.signup ? 'Create Account' : 'Update Profile'}
				</Button>
			</Paper>
		</Container>
	);
}
