import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { filmesService } from '../../../services/filmes.service';
import type { IFilme } from '../../../models/filme.model';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const FilmesList = () => {
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFilmes = async () => {
    try {
      const data = await filmesService.findAll();
      setFilmes(data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;

    try {
      await filmesService.delete(id);
      carregarFilmes();
    } catch (error) {
      console.error('Erro ao excluir filme:', error);
    }
  };

  useEffect(() => {
    carregarFilmes();
  }, []);

  if (carregando) return <div>Carregando filmes...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Filmes</h2>

        <Link to="/filmes/novo" className="btn btn-primary">
          Adicionar Filme
        </Link>
      </div>

      {filmes.length === 0 ? (
        <div className="alert alert-info">Nenhum filme encontrado.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>Título</th>
              <th>Sinopse</th>
              <th>Classificação Etária</th>
              <th>Duração</th>
              <th>Gênero</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filmes.map((filme) => (
              <tr key={filme.id}>
                <td>{filme.titulo}</td>
                <td>{String(filme.sinopse ?? '')}</td>
                <td>{filme.classificacaoEtaria}</td>
                <td>{String(filme.duracao)} min</td>
                <td>{filme.genero?.nome ?? String(filme.generoId ?? '')}</td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/filmes/${filme.id}`}
                    className="btn btn-sm btn-warning"
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(filme.id)}
                    className="btn btn-sm btn-danger"
                    title="Excluir"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};