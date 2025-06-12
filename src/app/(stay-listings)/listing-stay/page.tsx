'use client';
import React, { FC, useEffect, useState } from "react";
import SectionGridFilterCard from "../SectionGridFilterCard";
import { supabase } from "@/utils/supabaseClient";

export interface ListingStayPageProps {}

const ListingStayPage: FC<ListingStayPageProps> = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*");
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  if (loading) return <div className="p-8">Cargando propiedades...</div>;

  return (
    <>
      {/* Se eliminó la imagen hero */}
      <SectionGridFilterCard className="container pb-24 lg:pb-28" data={properties} />
    </>
  );
};

export default ListingStayPage;
