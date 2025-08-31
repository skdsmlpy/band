import type { UserRole } from "@/store/slices/auth";

export type MockUser = { email: string; password: string; role: UserRole; name: string };

export const MOCK_USERS: MockUser[] = [
  { email: "admin@band.app", password: "password", role: "Admin", name: "Admin User" },
  { email: "operator@band.app", password: "password", role: "Operator", name: "Operator One" },
  { email: "student@band.app", password: "password", role: "Student", name: "Student User" },
  { email: "director@band.app", password: "password", role: "Band Director", name: "Band Director" },
  { email: "equipment@band.app", password: "password", role: "Equipment Manager", name: "Equipment Manager" },
  { email: "supervisor@band.app", password: "password", role: "Supervisor", name: "Supervisor User" }
];
