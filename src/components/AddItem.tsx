import { useState } from 'react';
import type { Categoria, NuevoItem } from '../types';
import { CATEGORIAS } from '../types';
import styles from './AddItem.module.css';

interface AddItemProps {
  onAdd: (item: NuevoItem) => Promise<unknown>;
}

export function AddItem({ onAdd }: AddItemProps) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('otros');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    await onAdd({ nombre: nombre.trim(), categoria });
    setNombre('');
    setLoading(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="Nombre del item..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={loading}
      />
      <select
        className={styles.select}
        value={categoria}
        onChange={(e) => setCategoria(e.target.value as Categoria)}
        disabled={loading}
      >
        {CATEGORIAS.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button className={styles.button} type="submit" disabled={loading || !nombre.trim()}>
        {loading ? '...' : 'Agregar'}
      </button>
    </form>
  );
}
