"use client";
import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export interface AccountPageProps {}

const AccountPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    display_name: "",
    gender: "",
    username: "",
    email: "",
    date_of_birth: "",
    address: "",
    phone: "",
    about: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      // Obtener perfil
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setForm({
          display_name: data.display_name || "",
          gender: data.gender || "",
          username: data.username || "",
          email: user.email || "",
          date_of_birth: data.date_of_birth || "",
          address: data.address || "",
          phone: data.phone || "",
          about: data.about || "",
          avatar_url: data.avatar_url || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    let avatar_url = form.avatar_url;
    // Subir avatar si hay archivo nuevo
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.user_id}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      if (storageError) {
        setMessage("Error subiendo avatar");
        setLoading(false);
        return;
      }
      avatar_url = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
    }
    // Actualizar perfil
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        gender: form.gender,
        username: form.username,
        date_of_birth: form.date_of_birth,
        address: form.address,
        phone: form.phone,
        about: form.about,
        avatar_url,
      })
      .eq("user_id", profile.user_id);
    if (error) {
      setMessage("Error actualizando perfil");
    } else {
      setMessage("Perfil actualizado correctamente");
      setProfile((prev: any) => ({ ...prev, ...form, avatar_url }));
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-3xl font-semibold">Información de la cuenta</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <form className="flex flex-col md:flex-row" onSubmit={handleUpdate}>
        <div className="flex-shrink-0 flex items-start">
          <div className="relative rounded-full overflow-hidden flex">
            <Avatar sizeClass="w-32 h-32" imgUrl={form.avatar_url} userName={form.display_name} />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-1 text-xs">Cambiar imagen</span>
            </div>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarChange} />
          </div>
        </div>
        <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
          <div>
            <Label>Nombre</Label>
            <Input className="mt-1.5" name="display_name" value={form.display_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Género</Label>
            <Select className="mt-1.5" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Selecciona</option>
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
              <option value="Other">Otro</option>
            </Select>
          </div>
          <div>
            <Label>Username</Label>
            <Input className="mt-1.5" name="username" value={form.username} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1.5" name="email" value={form.email} disabled />
          </div>
          <div className="max-w-lg">
            <Label>Fecha de nacimiento</Label>
            <Input className="mt-1.5" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input className="mt-1.5" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input className="mt-1.5" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Sobre ti</Label>
            <Textarea className="mt-1.5" name="about" value={form.about} onChange={handleChange} />
          </div>
          <div className="pt-2 flex gap-4">
            <ButtonPrimary type="submit" disabled={loading}>Actualizar info</ButtonPrimary>
            <ButtonPrimary type="button" onClick={handleLogout} className="bg-red-500 hover:bg-red-600 border-none">
              Cerrar sesión
            </ButtonPrimary>
          </div>
          {message && <div className="text-green-600 mt-2">{message}</div>}
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
