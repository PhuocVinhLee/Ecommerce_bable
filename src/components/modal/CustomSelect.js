import { useField } from "formik";

const CustomSelect = ({ label,className, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col">
      <label className= "  text-sm font-bold mb-2 text-black">{label}</label>
      <select
        {...field}
        {...props}
        className={`   p-3 ${meta.touched && meta.error ? "shadow  border border-red-500 rounded w-full mb-3 " 
        :  meta.touched && !meta.error ? " " : " "} ${className}`}
      />
        {meta.touched && meta.error && <div className="text-red-500 text-xs italic">{meta.error}</div>}
    </div>
  );
};
export default CustomSelect;
