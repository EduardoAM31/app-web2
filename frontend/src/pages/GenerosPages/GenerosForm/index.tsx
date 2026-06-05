import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { generosService } from '../../../services/generos.service';
import { generoSchema } from '../../../models/genero.model';
import type { IGenero } from '../../../models/genero.model';

export const GenerosForm = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [generos, setGeneros] = useState<IGenero[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregarGeneros = async () => {
    try {
      const data = await generosService.findAll();
      setGeneros(data);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
    }
  };

  useEffect(() => {
    carregarGeneros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacao = generoSchema.safeParse({ nome });
    if (!validacao.success) {
      setErro(validacao.error.issues[0]?.message ?? 'Dados inválidos.');
      return;
    }

    try {
      setErro(null);
      setSubmitError(null);
      setSalvando(true);

      await generosService.create({ nome: validacao.data.nome });
      setNome('');
      await carregarGeneros();
    } catch (error: any) {
      console.error('Erro ao salvar gênero:', error);
      setSubmitError(error?.message ?? String(error));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cadastrar Gênero</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          Erro ao salvar: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nome do gênero</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="form-control"
            placeholder="Ex.: Ação, Comédia, Terror"
          />
          {erro && <small className="text-danger">{erro}</small>}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </form>

      <h5>Gêneros cadastrados</h5>
      {generos.length === 0 ? (
        <p className="text-muted">Nenhum gênero cadastrado ainda.</p>
      ) : (
        <ul className="list-group">
          {generos.map((g) => (
            <li key={g.id} className="list-group-item">
              {g.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
