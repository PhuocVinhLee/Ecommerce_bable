import { useField, useFormikContext } from "formik";

const CustomInputImage = ({ label, className, ...props }) => {
  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col text-black">



<div class="flex flex-col  items-start  justify-center w-full">
  <div className=" font-bold">
  {label}
 
  </div>
    <label for="dropzone-file" class={`"  flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500
     dark:hover:bg-gray-600   ${ meta.error ? " border border-red-500" : " "} " `
  }>
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400"> PNG, JPG or GIF (MAX. 1024MB)</p>
        </div>
        <input  {...field}
          {...props}
          onChange={(event) => {
                      const files = event.target.files;
                       let myFiles =Array.from(files);
                       setFieldValue(field.name, myFiles[0]);
                   
                    }}
           value ={""} 
           id="dropzone-file" type="file" class="hidden" />
    </label>
    <div>
      {meta?.error && (<div className=" text-red-500">{meta.error}</div>)}
    </div>
</div> 





      {/* <label class="block     text-sm font-bold mb-2" for="username">
        {label}
      </label>
      <div>
        <input

          {...field}
          {...props}
          onChange={(event) => {
                      const files = event.target.files;
                       let myFiles =Array.from(files);
                       setFieldValue(field.name, myFiles[0]);
                   
                    }}
           value ={""}
         
          className={` " cursor-pointer  shadow-sm bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
         ${meta.touched && meta.error ? "shadow appearance-none border border-red-500 rounded w-full p-2.5 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              : meta.touched && !meta.error ? " " : " "} ${className}`}
        // className={meta.touched && meta.error ? "input-error" : ""}
        />
        {meta.touched && meta.error && <div className="text-red-500 text-xs italic">{meta.error}</div>}
       
      </div> */}

    </div>
  );
};
export default CustomInputImage;
