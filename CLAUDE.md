@AGENTS.md
# Pendaftaran Anggota Perpustakaan Online — Dispuspa Kabupaten Batang

## Project Overview
Online membership registration portal for Dinas Perpustakaan dan Kearsipan (Dispuspa) Kabupaten Batang, Indonesia. Replaces manual registration process with a secure digital workflow.

## Tech Stack
- Framework: Next.js 15 with App Router
- Styling: Tailwind CSS (pure, no UI libraries)
- Language: TypeScript
- State: React useState only

## Color Theme
- Primary: #1e3a5f (dark blue)
- Accent: #c8a84b (gold)
- Background: #ffffff (white)

## Project Structure
- `app/page.tsx` — public registration form
- `app/components/RegistrationForm.tsx` — main form component
- `app/admin/page.tsx` — admin dashboard (login protected)
- `app/admin/components/AdminDashboard.tsx` — admin UI

## Database (INLISLite 3 — Local MySQL)
Main tables:
- `members` — member physical data, Branch_id = 37 (Batang)
- `members_online` — member portal login account

Key field mappings from form to DB:
- Fullname, PlaceOfBirth, DateOfBirth, Address
- IdentityType_id, IdentityNo (NIK)
- Sex_id, Agama_id, Job_id, EducationLevel_id
- NoHp, Email, PhotoUrl
- RegisterDate = NOW(), Branch_id = 37 (hardcoded)
- StatusAnggota_id = 3, MemberNo = MAX(MemberNo)+1

## Workflow
1. Public fills registration form → data saved as PENDING in cloud
2. Admin reviews in dashboard → views documents and photos
3. Admin clicks Approve → data sent via API to local INLISLite server
4. Member receives digital membership card via email

## Security
- AES-256-CBC encryption for sensitive data (NIK, address)
- HMAC-SHA256 signature for API integrity
- Cloudflare Tunnel for local server connection (no open ports)

## Rules
- Always use pure Tailwind CSS, no external UI libraries
- Always use React useState, no form libraries
- Always keep government formal design theme
- Indonesian language for all UI text
- All forms must have validation with red error messages