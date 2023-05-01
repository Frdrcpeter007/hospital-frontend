import React, { useContext, useRef, useState } from "react";
import { FormContextRegister } from "../RegisterForm";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useFormik } from 'formik';
import Toast from "../../../atoms/Toast";
import { useSelector, useDispatch } from 'react-redux';
import { BiCloudUpload } from "react-icons/bi";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "WEBP"];

function Images() {
	const { activeStep, setActiveStep, formData, setFormData, handleComplete } = useContext(FormContextRegister);
	const [state, setState] = useState({ type: 0, message: '' });
	const client = useSelector((state) => state.app.client);
	const dispatch = useDispatch();
	const hiddenFileInput = useRef(null);
	const [file, setFile] = useState(null);


	const handleChangeUp = (file) => {
		setFile(file);
	};


	const onSubmit = async (values) => {
		if (Object.keys(values).length == 0) return console.log("Pas de données");

		handleComplete()

	};

	const closeToast = () => {
		setState({ type: 0, message: "" })
	}

	// Formik hook
	const formik = useFormik({
		initialValues: {
			logo: ''
		},
		onSubmit
	})


	const handleChange = event => {
		console.log(event.target);
		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0];
			const body = new FormData();
			body.append("image", i);

			console.log(body);
		}
	};


	const handleClick = event => {
		hiddenFileInput.current.click();
	};

	return (
		<>
			{state.type > 0 ? state.type == 2 ? <Toast type={"danger"} message={state.message} close={closeToast} /> : (state.type == 1 ? <Toast type={"success"} message={state.message} close={closeToast} /> : <></>) : <></>}

			<Box sx={{ mb: 2, mt: 2, textAlign: "left" }}>
				<Typography color="primary" variant="body1" className="text-sm">
					Télécharger le logo de l'hôpital
				</Typography>
			</Box>

			<form id="signupform" onSubmit={formik.handleSubmit}>

				<FileUploader
					multiple={false}
					handleChange={handleChangeUp}
					name="file"
					types={fileTypes}
					
				/>
				<p className="text-sm text-gray-400">{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p>

				<div className="form-button">
					<Button size="large" variant="contained" type="submit">
						NEXT STEP
					</Button>
				</div>
			</form>
		</>
	);
}

export default Images;
