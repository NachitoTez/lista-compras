import { useState, useEffect } from 'react';
import { useList } from './hooks/useList';
import { useItems } from './hooks/useItems';
import { AddItem } from './components/AddItem';
import { ItemList } from './components/ItemList';
import { CategoryFilter } from './components/CategoryFilter';
import { ShareButton } from './components/ShareButton';
import { HomePage } from './components/HomePage';
import type { Categoria } from './types';
import './App.css';

function getListaIdFromUrl(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/lista\/([a-f0-9-]+)$/i);
  return match ? match[1] : null;
}

function App() {
  const [listaId, setListaId] = useState<string | null>(getListaIdFromUrl);
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | 'todas'>('todas');

  const { lista, loading: loadingLista, error: errorLista, crearLista } = useList(listaId);
  const {
    items,
    loading: loadingItems,
    error: errorItems,
    agregarItem,
    actualizarEstado,
    actualizarNombre,
    eliminarItem,
  } = useItems(listaId);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setListaId(getListaIdFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCreateList = async () => {
    const nuevaLista = await crearLista();
    if (nuevaLista) {
      window.history.pushState({}, '', `/lista/${nuevaLista.id}`);
      setListaId(nuevaLista.id);
    }
  };

  const handleJoinList = (id: string) => {
    window.history.pushState({}, '', `/lista/${id}`);
    setListaId(id);
  };

  // Show home page if no list selected
  if (!listaId) {
    return <HomePage onCreateList={handleCreateList} onJoinList={handleJoinList} />;
  }

  const loading = loadingLista || loadingItems;
  const error = errorLista || errorItems;

  if (loading && !lista) {
    return (
      <div className="container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>{lista?.nombre || 'Lista de Compras'}</h1>
        <ShareButton />
      </header>

      <section className="section">
        <h2>Agregar Item</h2>
        <AddItem onAdd={agregarItem} />
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Items ({items.length})</h2>
          <CategoryFilter filtro={filtroCategoria} onChange={setFiltroCategoria} />
        </div>
        <ItemList
          items={items}
          filtroCategoria={filtroCategoria}
          onEstadoChange={actualizarEstado}
          onNombreChange={actualizarNombre}
          onDelete={eliminarItem}
        />
      </section>

      <footer className="footer">
        <div className="legend">
          <span className="legend-item">
            <span className="dot hay"></span> Hay
          </span>
          <span className="legend-item">
            <span className="dot hay-poco"></span> Hay poco
          </span>
          <span className="legend-item">
            <span className="dot no-hay"></span> No hay
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
