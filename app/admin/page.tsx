import type { Metadata } from "next";
import AdminDashboard from "./components/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard Admin – Pendaftaran Anggota Perpustakaan Batang",
  description:
    "Dashboard admin untuk mengelola pendaftaran anggota perpustakaan Dinas Perpustakaan dan Kearsipan Kabupaten Batang.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
