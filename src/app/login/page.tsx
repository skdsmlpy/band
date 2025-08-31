"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store";
import { loginSuccess } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["Admin","Supervisor","Operator","Student","Band Director","Equipment Manager"])
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { role: "Operator" as const },
    resolver: zodResolver(LoginSchema)
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      if (!res.ok) throw new Error("Login failed");
      const json = await res.json();
      setToken(json.token);
      dispatch(
        loginSuccess({
          token: json.token,
          user: { id: "me", name: json.name, email: data.email, role: data.role },
        })
      );
      router.push("/landing");
    } catch (e) {
      alert("Authentication failed. Use admin@band.app / password");
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="input-field mt-1" type="email" {...register("email")} />
          {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input className="input-field mt-1" type="password" {...register("password")} />
          {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
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
