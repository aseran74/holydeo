import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import SupabaseConnectionTest from "../../components/SupabaseConnectionTest";
import SimplePropertiesTest from "../../components/SimplePropertiesTest";
import DebugSupabase from "../../components/DebugSupabase";
import EnvVarsDebug from "../../components/EnvVarsDebug";


import EnvChecker from "../../components/EnvChecker";
import DebugCredentials from "../../components/DebugCredentials";
import TestPermissions from "../../components/TestPermissions";
import PropertyEditDebug from "../../components/PropertyEditDebug";
import PropertyEditTest from "../../components/PropertyEditTest";
import PropertyFormTest from "../../components/PropertyFormTest";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        {/* Prueba de Conexión Supabase */}
        <div className="col-span-12">
          <SupabaseConnectionTest />
        </div>

        {/* Prueba Simple de Propiedades */}
        <div className="col-span-12">
          <SimplePropertiesTest />
        </div>

        {/* Variables de Entorno */}
        <div className="col-span-12">
          <EnvVarsDebug />
        </div>

        {/* Debug Detallado de Credenciales */}
        <div className="col-span-12">
          <DebugCredentials />
        </div>

        {/* Prueba de Permisos */}
        <div className="col-span-12">
          <TestPermissions />
        </div>

        {/* Debug de Edición de Propiedades */}
        <div className="col-span-12">
          <PropertyEditDebug />
        </div>

        {/* Prueba de Edición de Propiedades */}
        <div className="col-span-12">
          <PropertyEditTest />
        </div>

        {/* Prueba del Formulario de Propiedades */}
        <div className="col-span-12">
          <PropertyFormTest />
        </div>

        {/* Verificación de Credenciales */}
        <div className="col-span-12">
          <EnvChecker />
        </div>





        {/* Debug Detallado */}
        <div className="col-span-12">
          <DebugSupabase />
        </div>
      </div>
    </>
  );
}
