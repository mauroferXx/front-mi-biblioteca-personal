import React, { useEffect, useState } from 'react';
import { libraryAPI, translateAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const LibraryPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'my'
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [myLibrary, setMyLibrary] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [translating, setTranslating] = useState(false);

  const loadMyLibrary = async () => {
    if (!user?.id) return;
    try {
      const res = await libraryAPI.getUserLibrary(user.id);
      if (res?.success) setMyLibrary(res.items || []);
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    loadMyLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await libraryAPI.search(q.trim());
      setResults(res.items || []);
    } catch (err) {
      toast.error('Error buscando libros');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (book) => {
    if (!user?.id) {
      toast.error('Inicia sesión');
      return;
    }
    try {
      const res = await libraryAPI.add({ userId: user.id, book, status: 'TO_READ' });
      if (res?.success) {
        toast.success('Libro agregado a tu biblioteca');
        loadMyLibrary();
        setShowModal(false);
      } else {
        toast.error(res?.error || 'No se pudo agregar');
      }
    } catch (e) {
      toast.error('Error agregando libro');
    }
  };

  const openModal = async (book) => {
    setSelectedBook(book);
    setSelectedDetail(null);
    setShowModal(true);
    setDetailLoading(true);
    setTranslated(null);
    try {
      const res = await libraryAPI.getDetail(book.id, book.editionId);
      if (res?.success) setSelectedDetail(res.detail);
    } catch (_) {
      // noop
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setTranslated(null);
  };

  const handleTranslate = async () => {
    if (!selectedDetail?.description) {
      toast('No hay texto para traducir');
      return;
    }
    setTranslating(true);
    try {
      const res = await translateAPI.translate(selectedDetail.description, 'es', 'auto');
      if (res?.success) setTranslated(res.translatedText);
      else toast.error(res?.error || 'No se pudo traducir');
    } catch (_) {
      toast.error('Error traduciendo');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="card card-border-top-green" style={{ marginBottom: '1rem', padding: '1rem' }}>
          <h1 className="text-2xl font-bold">Biblioteca Digital</h1>
          <p className="text-sm text-gray-600">Explora una colección de libros y agrega a tu biblioteca.</p>
        </div>

        {/* Tabs */}
        <div className="card" style={{ padding: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('search')}
            >
              Buscar libros
            </button>
            <button
              className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveTab('my'); loadMyLibrary(); }}
            >
              Mi biblioteca
            </button>
          </div>
        </div>

        {activeTab === 'search' && (
          <>
            <form onSubmit={handleSearch} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <Search className="w-5 h-5" />
                  <input
                    className="input"
                    placeholder="Buscar por título, autor..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </form>

            <div className="card" style={{ padding: '1rem' }}>
              <h2 className="text-lg font-semibold" style={{ marginBottom: '0.5rem' }}>Resultados</h2>
              <div className="list" style={{ display: 'grid', gap: '0.5rem' }}>
                {results.map((b) => (
                  <div key={b.id} className="list-item" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => openModal(b)}>
                      <img src={b.coverUrl || 'https://via.placeholder.com/48x72?text=No+Cover'} alt={b.title} width={36} height={54} style={{ borderRadius: 4, objectFit: 'cover' }} />
                      <div>
                        <div className="font-medium">{b.title}</div>
                        <div className="text-sm text-gray-600">{b.author}</div>
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => handleAdd(b)}>
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                ))}
                {!results.length && <div className="text-sm text-gray-500">Sin resultados</div>}
              </div>
            </div>
          </>
        )}

        {activeTab === 'my' && (
          <div className="card" style={{ padding: '1rem' }}>
            <h2 className="text-lg font-semibold" style={{ marginBottom: '0.5rem' }}>Mi Biblioteca</h2>
            <div className="list" style={{ display: 'grid', gap: '0.5rem' }}>
              {myLibrary.map((item) => (
                <div key={item.bookId} className="list-item" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={item.book.coverUrl || 'https://via.placeholder.com/48x72?text=No+Cover'} alt={item.book.title} width={36} height={54} style={{ borderRadius: 4, objectFit: 'cover' }} />
                    <div>
                      <div className="font-medium">{item.book.title}</div>
                      <div className="text-sm text-gray-600">{item.book.author}</div>
                      <div className="text-xs text-gray-500">Estado: {item.status}</div>
                    </div>
                  </div>
                </div>
              ))}
              {!myLibrary.length && <div className="text-sm text-gray-500">Aún no tienes libros</div>}
            </div>
          </div>
        )}
      </div>
      {showModal && selectedBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 100 }} onClick={closeModal}>
          <div className="card" style={{ width: '100%', maxWidth: 720, padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <img src={(selectedDetail?.coverUrl || selectedBook.coverUrl) || 'https://via.placeholder.com/128x192?text=No+Cover'} alt={selectedBook.title} width={128} height={192} style={{ borderRadius: 6, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 className="text-xl font-semibold" style={{ marginBottom: '0.25rem' }}>{selectedDetail?.title || selectedBook.title}</h3>
                <div className="text-sm text-gray-600" style={{ marginBottom: '0.5rem' }}>
                  {(selectedDetail?.authors?.length ? selectedDetail.authors.map(a => a.name).join(', ') : selectedBook.author) || 'Autor no disponible'}
                </div>
                {detailLoading ? (
                  <div className="text-sm text-gray-500">Cargando detalles...</div>
                ) : (
                  <>
                    {selectedDetail?.subtitle && <div className="text-sm text-gray-700" style={{ marginBottom: '0.5rem' }}>{selectedDetail.subtitle}</div>}
                    <div className="text-sm text-gray-700" style={{ marginBottom: '0.75rem' }}>
                      {selectedDetail?.description || 'Sinopsis no disponible.'}
                    </div>
                    {(selectedDetail?.subjects?.length || 0) > 0 && (
                      <div className="text-xs text-gray-500" style={{ marginBottom: '0.5rem' }}>
                        Temas: {selectedDetail.subjects.slice(0, 8).join(' · ')}
                      </div>
                    )}
                    {(selectedDetail?.firstPublishYear || selectedDetail?.numberOfPages || (selectedDetail?.publishers?.length || 0) > 0) && (
                      <div className="text-xs text-gray-500" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {selectedDetail?.firstPublishYear && <span>Primera publicación: {selectedDetail.firstPublishYear}</span>}
                        {selectedDetail?.numberOfPages && <span>Páginas: {selectedDetail.numberOfPages}</span>}
                        {(selectedDetail?.publishers?.length || 0) > 0 && <span>Editorial: {selectedDetail.publishers[0]}</span>}
                      </div>
                    )}
                  </>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {selectedDetail?.description && (
                      <button className="btn btn-secondary" onClick={handleTranslate} disabled={translating}>
                        {translating ? 'Traduciendo...' : (translated ? 'Retraducir' : 'Traducir')}
                      </button>
                    )}
                  </div>
                  <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                  <button className="btn btn-primary" onClick={() => handleAdd(selectedBook)}>Agregar a mi biblioteca</button>
                </div>
              </div>
            </div>
            {translated && (
              <div className="card" style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f9fafb' }}>
                <div className="text-xs text-gray-500" style={{ marginBottom: '0.25rem' }}>Traducción</div>
                <div className="text-sm text-gray-800">{translated}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;


