import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { useDropzone } from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const MyDropzone = ({ formik }) => {
  const onDrop = (acceptedFiles) => {
    formik.setFieldValue("picture", acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
    multiple: false,
  });

  return (
    <Box
      gridColumn="span 4"
      border="2px dashed #1976d2"
      borderRadius="5px"
      p="1rem"
      textAlign="center"
      cursor="pointer"
      {...getRootProps()}
    >
      <input {...getInputProps()} />{" "}
      {formik.values.picture ? (
        <>
          <Typography variant="body2">
            {" "}
            {formik.values.picture.name}{" "}
          </Typography>{" "}
          <EditOutlinedIcon />
        </>
      ) : isDragActive ? (
        <Typography variant="body2"> Drop the image here </Typography>
      ) : (
        <Typography variant="body2">
          {" "}
          Click or drag & drop an image here{" "}
        </Typography>
      )}{" "}
    </Box>
  );
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();

    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const formik = useFormik({
    initialValues: isLogin ? initialValuesLogin : initialValuesRegister,
    validationSchema: isLogin ? loginSchema : registerSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {isRegister && (
            <>
              <TextField
                label="First Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                name="firstName"
                error={
                  Boolean(formik.touched.firstName) &&
                  Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />{" "}
              <TextField
                label="Last Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                name="lastName"
                error={
                  Boolean(formik.touched.lastName) &&
                  Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />{" "}
              <TextField
                label="Location"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.location}
                name="location"
                error={
                  Boolean(formik.touched.location) &&
                  Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
                sx={{ gridColumn: "span 4" }}
              />{" "}
              <TextField
                label="Occupation"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.occupation}
                name="occupation"
                error={
                  Boolean(formik.touched.occupation) &&
                  Boolean(formik.errors.occupation)
                }
                helperText={
                  formik.touched.occupation && formik.errors.occupation
                }
                sx={{ gridColumn: "span 4" }}
              />{" "}
              <MyDropzone formik={formik} />{" "}
            </>
          )}{" "}
          <TextField
            label="Email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
            error={
              Boolean(formik.touched.email) && Boolean(formik.errors.email)
            }
            helperText={formik.touched.email && formik.errors.email}
            sx={{ gridColumn: "span 4" }}
          />{" "}
          <TextField
            label="Password"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            error={
              Boolean(formik.touched.password) &&
              Boolean(formik.errors.password)
            }
            helperText={formik.touched.password && formik.errors.password}
            sx={{ gridColumn: "span 4" }}
          />{" "}
        </Box>{" "}
        {/* BUTTONS */}{" "}
        <Box>
          <Button
            fullWidth
            type="submit"
            sx={{
              m: "2rem 0",
              p: "1rem",
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              "&:hover": { color: palette.primary.main },
            }}
          >
            {isLogin ? "LOGIN" : "REGISTER"}{" "}
          </Button>{" "}
          <Typography
            onClick={() => {
              setPageType(isLogin ? "register" : "login");
              formik.resetForm();
            }}
            sx={{
              textDecoration: "underline",
              color: palette.primary.main,
              "&:hover": {
                cursor: "pointer",
                color: palette.primary.light,
              },
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up here."
              : "Already have an account? Login here."}{" "}
          </Typography>{" "}
        </Box>{" "}
      </form>{" "}
    </div>
  );
};

export default Form;
