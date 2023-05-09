import React, { useContext, useRef, useState } from "react";
import { FormContextRegister } from "../RegisterForm";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useFormik } from 'formik';
import Toast from "../../../atoms/Toast";
import { useSelector, useDispatch } from 'react-redux';
import { BiCloudUpload } from "react-icons/bi";
import { FileUploader } from "react-drag-drop-files";
import { setRegister } from "../../../../redux/reducer";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "WEBP"];

function Images() {
	const { activeStep, setActiveStep, formData, setFormData, handleComplete } = useContext(FormContextRegister);
	const [state, setState] = useState({ type: 0, message: '' });
	const client = useSelector((state) => state.app.client);
	const dispatch = useDispatch();
	const hiddenFileInput = useRef(null);
  	const [createObjectURL, setCreateObjectURL] = useState(null);
	  const [file, setFile] = useState(null);

	  const handleChangeUp = (file) => {
		setFile(file);
		uploadToClient(file)
	  };

	const uploadToClient = (event) => {
		setCreateObjectURL(URL.createObjectURL(event));
	};

	const uploadToServer = async (event) => {
		
        dispatch(setRegister({...client.register, logo: file}))
        handleComplete()

	  };


	const onSubmit = async (values) => {
		if (Object.keys(values).length == 0) return console.log("Pas de données");

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
				{/* <p className="text-sm text-gray-400">{file ? `Nom du fichier: ${file.name}` : "Aucun fichier uploader..."}</p> */}
				{createObjectURL && <img src={createObjectURL} alt="img" className="my-5 w-36 mx-auto rounded-xl shadow-sm"/>}
				<div className="form-button">
					<Button size="large" variant="contained" type="submit" onClick={uploadToServer}>
						SUIVANT
					</Button>
				</div>
			</form>
		</>
	);
}

export default Images;
