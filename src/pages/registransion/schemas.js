
import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;


export const schema_login = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Required"),
    password: yup
        .string()
        .min(5)
        //   .matches(passwordRules, { message: "Please create a stronger password" })
        .required("Required"),
    // confirmPassword: yup
    //   .string()
    //   .oneOf([yup.ref("password"), null], "Passwords must match")
    //   .required("Required"),
});
export const schema_signup = yup.object().shape({
    username: yup
        .string()
        .min(3, "Username must be at least 3 characters long")
        .required("Required"),
    email: yup.string().email("Please enter a valid email").required("Required"),
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
