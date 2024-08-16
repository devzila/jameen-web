// import Select from 'react-select'
// import { useForm, Controller } from 'react-hook-form'

// const Sample = () => {
//   const { control, handleSubmit } = useForm({
//     defaultValues: {
//       firstName: '',
//       select: {},
//     },
//   })

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Controller name="firstName" control={control} render={({ field }) => <input {...field} />} />
//       <Controller
//         name="select"
//         control={control}
//         render={({ field }) => (
//           <Select
//             {...field}
//             options={[
//               { value: 'chocolate', label: 'Chocolate' },
//               { value: 'strawberry', label: 'Strawberry' },
//               { value: 'vanilla', label: 'Vanilla' },
//             ]}
//           />
//         )}
//       />
//       <input type="submit" />
//     </form>
//   )
// }
// export default Sample
