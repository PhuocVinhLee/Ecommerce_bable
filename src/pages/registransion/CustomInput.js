import { useField } from "formik";

const CustomInput = ({ label,className, ...props }) => {
    console.log(className)
  const [field, meta] = useField(props);

  return (
    <>
     
      <label class="block text-white     text-sm font-bold mb-2" for="username">
      {label}
      </label>
      <input
        {...field}
        {...props}
        className={`${meta.touched && meta.error ? "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        :  meta.touched && !meta.error ? " " : " "} ${className}`}
        // className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && <div className="text-red-500 text-xs italic">{meta.error}</div>}
      {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
    </>
  );
};
export default CustomInput;
