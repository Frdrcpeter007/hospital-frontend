import React, { createContext, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Transition } from "@headlessui/react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import ScanDetails from "./details";
import SecurityCode from "./security";
export const StepContext = createContext();

const health = [
	{ label: 'Soin Dentaire', price: 15 },
	{ label: 'Ophtamologie', price: 30 },
	{ label: 'Pédiatrie', price: 40 },
	{ label: 'Urgence', price: 55 },
]

const Scan = () => {
	const [data, setData] = useState(null);
	const [step, setStep] = useState(-1);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleStep = (result = null) => {
		setStep(step + 1);

		if (result) {
			setData(result && result.slice(0, 8));
		}
	};


	if (step === -1)
		return (
			<div className='flex justify-center flex-col gap-6 h-full items-center mx-auto py-4 md:py-10 mb-20'>
				<div className='md:w-1/3 w-full bg-white rounded-xl p-8 min-h-fit flex flex-col gap-4 shadow-sm'>
					<div className="w-full flex flex-col gap-2">

						<p>Ajoutez un nouveau soin</p>
						<FormControl fullWidth>
							<Autocomplete
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Type Business"
								options={health}
								renderInput={(params) => <TextField {...params} label="Choisissez un service" />}
								onChange={(e) => null}
							/>

						</FormControl>
					</div>

					<div className="flex flex-row-reverse gap-4">
						<button className="border text-orange border-orange text-sm py-2 px-4 rounded-lg" type='submit' form='form-security'>
							+ Ajouter
						</button>
					</div>

					<div className="mt-3 border-t py-2 space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-900">Soins de dents</p>
							<p className="font-normal text-sm text-gray-600">$25.00</p>
						</div>
						<div className="flex w-full gap-4">
							<button className="bg-orange shadow-md text-md py-3 w-full px-4 rounded-lg effect-up text-white" form='form-security' onClick={() => setStep(0)}>
								Définir comme traitement
							</button>
						</div>
					</div>
				</div>
			</div>
		)

	if (step === 0)
		return (
			<Transition
				appear
				show={true}
				as={"div"}
				className="flex justify-center flex-col gap-6 h-full items-center mx-auto py-4 md:py-10"
			>
				<Transition.Child
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
					className={"md:w-1/2 w-3/4 bg-white rounded-xl px-10 py-8 min-h-fit"}
				>
					<TabsModal value={value} handleChange={handleChange} />

					<TabItems value={value} handleStep={handleStep} />
				</Transition.Child>
			</Transition>
		);

	if (step === 1)
		return (
			<StepContext.Provider value={{ step, setStep }}>
				<ScanDetails shorten={data} />
			</StepContext.Provider>
		);

	if (step === 2)
		return (
			<StepContext.Provider value={{ step, setStep }}>
				<SecurityCode shorten={data} />
			</StepContext.Provider>
		);

	return <>Complete</>;
};

export default Scan;

function TabsModal({ value, handleChange }) {
	return (
		<div>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label={"Scan QR Code"} {...a11yProps(0)} key={0} />
					<Tab label={"Saisir Pass Santé"} {...a11yProps(1)} key={1} />
				</Tabs>
			</Box>
		</div>
	);
}

function TabItems({ value, handleStep }) {
	const onSubmit = async (values) => {
		if (Object.keys(values).length == 0) return console.log("Pas de données");

		console.log("submit", values);
		handleStep(values.pass);
	};

	const ValidationSchema = yup.object().shape({
		pass: yup.string().required("Pass Santé est requis"),
	});

	const formik = useFormik({
		initialValues: {
			pass: "",
		},
		validationSchema: ValidationSchema,
		onSubmit,
	});

	const renderError = (message) => (
		<p className="text-xs text-red-600 font-light flex items-center gap-1 px-1">
			{message}
		</p>
	);

	return (
		<div className="mt-2">
			<div className="text-sm text-gray-500">
				{/* For Scan */}
				<TabPanel value={value} index={0}>
					<div className="mt-4">
						<div className="text-center">
							<h3 className="text-xl font-semibold md:text-gray-700">
								Scan QR Code
							</h3>
							<p className="text-sm font-light text-gray-500">
								Accorder la demande d'allumer la caméra
							</p>
						</div>
						<div className="">
							<QrReader
								delay={300}
								onResult={(result, error) => {
									if (!!result) {
										handleStep(result.text);
									}

									if (!!error) {
										console.log(error);
									}
								}}
								constraints={{ facingMode: "environment" }}
								style={{ width: "100%" }}
							/>
						</div>
					</div>
				</TabPanel>

				<TabPanel value={value} index={1}>
					<div className="space-y-8 py-10 px-20">
						<form id="signupform" onSubmit={formik.handleSubmit}>
							<Stack spacing={2}>
								<div className="space-y-1">
									<TextField
										id="outlined-basic"
										fullWidth
										label="Entrez le code Pass Santé"
										variant="outlined"
										name="pass"
										{...formik.getFieldProps("pass")}
									/>
									{formik.errors.pass && formik.touched.pass ? (
										renderError(formik.errors.pass)
									) : (
										<></>
									)}
								</div>

								<div className="form-button flex flex-row-reverse">
									<Button size="medium" variant="contained" type="submit">
										Soumettre
									</Button>
								</div>
							</Stack>
						</form>
					</div>
				</TabPanel>
			</div>
		</div>
	);
}

export function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}
