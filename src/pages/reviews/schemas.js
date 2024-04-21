import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const urlImage = /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const validFileExtensions = { extensions: ['png', 'jpg','webp','avif'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}
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
 
  imaUrlComemnt: yup.array().of(
    yup.mixed()
      .required('A file is requeued')
      .test('fileSize', 'File exceeds the maximum supported size of 14 MB', (value) => {
        console.log(value)
        return value && value.size <= 1024 * 1024 * 14
      })
      .test('is-valid-type',
        'Invalid file extension. Allow downloading only files in PNG, JPG, Webp  and Avif formats.', (value) => {
          return isValidFileType(value && value?.name?.toLowerCase(), 'extensions')
        })
  ),
 
  comment: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),


});
export const advancedSchemaUpdate = yup.object().shape({
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
  imageUrl: yup.mixed().when({
    is: (exists) => !!exists,
    then: (schema) => yup.array().of(
      yup.mixed()
        .required('A file is requeued')
        .test('fileSize', 'File exceeds the maximum supported size of 14 MB', (value) => {
          console.log(value)
          return value && value.size <= 1024 * 1024 * 14
        })
        .test('is-valid-type',
          'Invalid file extension. Allow downloading only files in PNG, JPG, PDF formats.', (value) => {
            return isValidFileType(value && value?.name?.toLowerCase(), 'extensions')
          }))

  }, [['imageUrl', 'imageUrl']]),

  category: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  description: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),


});
