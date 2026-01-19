import type { Item, EstadoItem } from '../types';
import { ESTADOS } from '../types';
import styles from './ItemCard.module.css';

interface ItemCardProps {
  item: Item;
  onEstadoChange: (itemId: string, estado: EstadoItem) => void;
  onDelete: (itemId: string) => void;
}

export function ItemCard({ item, onEstadoChange, onDelete }: ItemCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.nombre}>{item.nombre}</span>
        <span className={styles.categoria}>{item.categoria}</span>
      </div>
      <div className={styles.estados}>
        {ESTADOS.map((estado) => (
          <button
            key={estado.value}
            className={`${styles.estadoBtn} ${
              item.estado === estado.value ? styles.active : ''
            }`}
            style={{
              backgroundColor:
                item.estado === estado.value ? estado.color : 'transparent',
              borderColor: estado.color,
              color: item.estado === estado.value ? 'white' : estado.color,
            }}
            onClick={() => onEstadoChange(item.id, estado.value)}
            title={estado.label}
          >
            {estado.value === 'hay' && '✓'}
            {estado.value === 'hay_poco' && '~'}
            {estado.value === 'no_hay' && '✗'}
          </button>
        ))}
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(item.id)}
        title="Eliminar"
      >
        🗑
      </button>
    </div>
  );
}
