import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const urlImage = /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const basicSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  age: yup.number().positive().integer().required("Required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const advancedSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
    price: yup
    .number().typeError("That doesn't look like a  number")
    .min(0, "Username must be at least 3 characters long")
    .required("Required"),
    inventory_quantity: yup
    .number().typeError("That doesn't look like a  number")
    .min(1, "Username must be at least 3 characters long")
    .required("Required"),
    imageUrl: yup
    .string().matches(urlImage, {message: "That doesn't look like a URL Image"})
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
    category: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
    description: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),

  
});
