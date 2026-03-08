import { useEffect, useState } from "react";
import { api } from "../services/api";

interface VersionInfo {
  version: string;
  name: string;
}

export function Home() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    api.get("/api/v1/version").then((res) => setVersionInfo(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Bienvenido a MetaBuilder
        </h3>
        <p className="text-gray-600 mb-4">
          Plataforma low-code basada en metadatos para gestionar entidades dinámicas.
        </p>
        {versionInfo && (
          <p className="text-sm text-gray-500">
            {versionInfo.name} v{versionInfo.version}
          </p>
        )}
      </div>
    </div>
  );
}
