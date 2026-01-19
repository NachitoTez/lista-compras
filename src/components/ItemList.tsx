import type { Item, EstadoItem, Categoria } from '../types';
import { ItemCard } from './ItemCard';
import styles from './ItemList.module.css';

interface ItemListProps {
  items: Item[];
  filtroCategoria: Categoria | 'todas';
  onEstadoChange: (itemId: string, estado: EstadoItem) => void;
  onDelete: (itemId: string) => void;
}

export function ItemList({
  items,
  filtroCategoria,
  onEstadoChange,
  onDelete,
}: ItemListProps) {
  const itemsFiltrados =
    filtroCategoria === 'todas'
      ? items
      : items.filter((item) => item.categoria === filtroCategoria);

  if (itemsFiltrados.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay items{filtroCategoria !== 'todas' ? ' en esta categoria' : ''}.</p>
        <p>Agrega uno usando el formulario de arriba.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {itemsFiltrados.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEstadoChange={onEstadoChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
