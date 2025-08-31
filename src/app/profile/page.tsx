"use client";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="card p-4 space-y-3">
        <div>Name: {user?.name}</div>
        <div>Email: {user?.email}</div>
        <div>Role: {user?.role}</div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Theme</span>
          <select className="input-field w-40" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button className="btn-primary" onClick={() => dispatch(logout())}>Sign out</button>
      </div>
    </div>
  );
}
