import { useState } from 'react';
import styles from './HomePage.module.css';

interface HomePageProps {
  onCreateList: () => void;
  onJoinList: (listaId: string) => void;
}

export function HomePage({ onCreateList, onJoinList }: HomePageProps) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = codigo.trim();

    // Extract ID from full URL or use as-is
    const match = trimmed.match(/\/lista\/([a-f0-9-]+)/i);
    const id = match ? match[1] : trimmed;

    // Basic UUID validation
    if (!/^[a-f0-9-]{36}$/i.test(id)) {
      setError('Código inválido. Pegá el link completo o el código de la lista.');
      return;
    }

    setError('');
    onJoinList(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Lista de Compras</h1>
        <p className={styles.subtitle}>Compartí tu lista con la familia en tiempo real</p>

        <button className={styles.createBtn} onClick={onCreateList}>
          Crear nueva lista
        </button>

        <div className={styles.divider}>
          <span>o</span>
        </div>

        <form onSubmit={handleJoin} className={styles.joinForm}>
          <label className={styles.label}>Tengo un código</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Pegá el link o código de la lista"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setError('');
            }}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.joinBtn} disabled={!codigo.trim()}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
