import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiInstagram, FiGithub, FiMail } from "react-icons/fi";
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [avatars, setAvatars] = useState(() => {
    const storedAvatars = localStorage.getItem('userAvatars');
    return storedAvatars ? JSON.parse(storedAvatars) : {};
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const fileInputRef = useRef(null);

  async function buscarUsuarios() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro!", error);
      setError("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarUsuarios();
  }, []);

  useEffect(() => {
    localStorage.setItem('userAvatars', JSON.stringify(avatars));
  }, [avatars]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && currentUserId) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatars(prev => ({ ...prev, [currentUserId]: reader.result }));
        setCurrentUserId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (userId) => {
    setCurrentUserId(userId);
    fileInputRef.current.click();
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h1>Usuários da API</h1>
      <button onClick={buscarUsuarios} disabled={loading}>
        {loading ? 'Carregando...' : 'Buscar Usuários'}
      </button>
      {loading && (
        <div className="spinner"></div>
      )}
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Filtrar por nome"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <ul>
        {usuariosFiltrados.map((usuario, index) => (
          <li key={usuario.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="profile">
              <div className="avatar" onClick={() => handleAvatarClick(usuario.id)}>
                {avatars[usuario.id] ? (
                  <img src={avatars[usuario.id]} alt="Avatar" />
                ) : (
                  usuario.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="info">
                <h3>{usuario.name}</h3>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Cidade:</strong> {usuario.address.city}</p>
                <p><strong>Telefone:</strong> {usuario.phone}</p>
                <p><strong>Website:</strong> <a href={`http://${usuario.website}`} target="_blank" rel="noopener noreferrer">{usuario.website}</a></p>
                <p><strong>Empresa:</strong> {usuario.company.name}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <footer className="footer">
        <p>&copy; 2026 Todos os direitos reservados</p>
        <div className="social-links">
          <a href="https://www.instagram.com/grah_hz" target="_blank" rel="noopener noreferrer" title="Instagram">
            <FiInstagram /> Instagram
          </a>
          <a href="mailto:davigrah2010@gmail.com" title="Gmail">
            <FiMail /> Gmail
          </a>
          <a href="https://github.com/DaviGrah2" target="_blank" rel="noopener noreferrer" title="GitHub">
            <FiGithub /> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;



