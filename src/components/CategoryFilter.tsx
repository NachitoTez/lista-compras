import type { Categoria } from '../types';
import { CATEGORIAS } from '../types';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  filtro: Categoria | 'todas';
  onChange: (filtro: Categoria | 'todas') => void;
}

export function CategoryFilter({ filtro, onChange }: CategoryFilterProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.btn} ${filtro === 'todas' ? styles.active : ''}`}
        onClick={() => onChange('todas')}
      >
        Todas
      </button>
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.value}
          className={`${styles.btn} ${filtro === cat.value ? styles.active : ''}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
