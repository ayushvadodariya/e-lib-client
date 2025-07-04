import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormFeilds = z.infer<typeof schema>

export default function EditUserDetail() {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting}
  } = useForm<FormFeilds>({
    defaultValues: {
      email: "defalut email"
    },
    resolver: zodResolver(schema)
  });

  const onSubmit : SubmitHandler<FormFeilds> = async (data) => {
    try{
      await new Promise((resolve)=> setTimeout(resolve,1000));
      console.log(data);
      throw new Error();
    } catch (error) {
      console.error(error);
      setError("email", {
        message:"this email is already taken"
      });
      setError("root", {
        message: "This is root error"
      })
    }
  }

  return (
    <div className="p-10">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} type="text" placeholder="Email" />
        { errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        <input {...register("password")} type="password" placeholder="Password" />
        { errors.password&& (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <button disabled={isSubmitting} type="submit">{ isSubmitting ? "Loading..." : "Submit"}</button>
        { errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  )
}