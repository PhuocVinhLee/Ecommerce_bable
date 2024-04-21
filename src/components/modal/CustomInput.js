import { useField } from "formik";

const CustomInput = ({ label,className, ...props }) => {
    
  const [field, meta] = useField(props);
 
  return (
    <div className="flex flex-col text-black">
     
      <label class="block     text-sm font-bold mb-2" for="username">
      {label}
     
      </label>
     <div>
     <input
        {...field}
        {...props}
        className={` "shadow-sm bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
         ${meta.touched && meta.error ? "shadow appearance-none border border-red-500 rounded w-full p-2.5 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        :  meta.touched && !meta.error ? " " : " "} ${className}`}
        // className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && <div className="text-red-500 text-xs italic">{meta.error}</div>}
      {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
     </div>
    
    </div>
  );
};
export default CustomInput;
