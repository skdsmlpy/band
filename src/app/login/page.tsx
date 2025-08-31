"use client";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store";
import { loginSuccess } from "@/store/slices/auth";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
  role: "Admin" | "Supervisor" | "Operator" | "Student" | "Band Director" | "Equipment Manager";
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>({ defaultValues: { role: "Operator" } });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (data: LoginForm) => {
    dispatch(
      loginSuccess({
        token: "demo-token",
        user: { id: "u1", name: "Demo User", email: data.email, role: data.role },
      })
    );
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="input-field mt-1" type="email" required {...register("email")} />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input className="input-field mt-1" type="password" required {...register("password")} />
        </label>
        <label className="block">
          <span className="text-sm">Role</span>
          <select className="input-field mt-1" {...register("role")}>
            <option>Admin</option>
            <option>Supervisor</option>
            <option>Operator</option>
            <option>Student</option>
            <option>Band Director</option>
            <option>Equipment Manager</option>
          </select>
        </label>
        <button className="btn-primary w-full mt-2" type="submit">Continue</button>
      </form>
    </div>
  );
}
