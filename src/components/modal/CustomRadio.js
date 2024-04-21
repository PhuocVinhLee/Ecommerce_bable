import { useField } from "formik";

const CustomRadio = ({ label,className, ...props }) => {
    
  const [field, meta] = useField(props);
 
  return (
    <div className="w-full">
   
    <div className="flex items-center  w-full ps-4 border border-gray-200 rounded dark:border-gray-700">
     
     
     <div>
     <input
        {...field}
        {...props}
        className={` "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
         ${meta.touched && meta.error ? "shadow appearance-none border border-red-500 rounded w-full p-2.5 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        :  meta.touched && !meta.error ? " " : " "} ${className}`}
        // className={meta.touched && meta.error ? "input-error" : ""}
      />
     
      {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
     </div>
     <label class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="username">
      {label}
      
      </label>

      
    </div>
    
    {meta.touched && meta.error && <div className="text-red-500 text-xs italic">{meta.error}</div>}
    </div>
  );
};
export default CustomRadio;
