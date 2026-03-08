import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useCreateEntity } from "../../hooks/useMetadata";

interface EntityBuilderProps {
  onSuccess: () => void;
}

export function EntityBuilder({ onSuccess }: EntityBuilderProps) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const createEntity = useCreateEntity();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createEntity.mutateAsync({
        name: name.toLowerCase().replace(/\s+/g, "_"),
        display_name: displayName,
        description: description || undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || "Error al crear entidad");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <Input
        label="Nombre para mostrar"
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
          if (!name) setName(e.target.value.toLowerCase().replace(/\s+/g, "_"));
        }}
        required
        placeholder="Ej: Productos"
      />
      <Input
        label="Nombre técnico"
        value={name}
        onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
        required
        placeholder="Ej: productos"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción opcional"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={createEntity.isPending}>
          Crear Entidad
        </Button>
      </div>
    </form>
  );
}
