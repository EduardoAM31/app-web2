import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { filmesService } from '../../../services/filmes.service';
import { generosService } from '../../../services/generos.service';
import { filmeSchema } from '../../../models/filme.model';
import type { IFilme } from '../../../models/filme.model';
import type { IGenero } from '../../../models/genero.model';

export const FilmesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Partial<IFilme>>({
    titulo: '',
    sinopse: '',
    classificacaoEtaria: '',
    duracao: 0,
    generoId: '',
  });

  const [generos, setGeneros] = useState<IGenero[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarGeneros = async () => {
    try {
      const data = await generosService.findAll();
      setGeneros(data);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
    }
  };

  const carregarFilme = async (filmeId: string) => {
    try {
      setCarregando(true);
      const data = await filmesService.findById(filmeId);

      setFormData({
        id: data.id,
        titulo: data.titulo ?? '',
        sinopse: data.sinopse ?? '',
        classificacaoEtaria: data.classificacaoEtaria ?? '',
        duracao: data.duracao ?? 0,
        generoId: data.generoId ?? '',
      });
    } catch (error) {
      console.error('Erro ao carregar filme:', error);
      setSubmitError('Não foi possível carregar o filme.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarGeneros();
  }, []);

  useEffect(() => {
    if (id) carregarFilme(id);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'duracao'
          ? value === ''
            ? 0
            : Number(value)
          : name === 'generoId'
            ? value === ''
              ? ''
              : Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacao = filmeSchema.safeParse(formData);

    if (!validacao.success) {
      const formatted: Record<string, string> = {};

      validacao.error.issues.forEach((issue) => {
        formatted[String(issue.path[0])] = issue.message;
      });

      setErros(formatted);
      return;
    }

    try {
      setSubmitError(null);
      setErros({});

      const payload = {
        titulo: validacao.data.titulo,
        sinopse: validacao.data.sinopse,
        classificacaoEtaria: validacao.data.classificacaoEtaria,
        duracao: Number(validacao.data.duracao),
        generoId: Number(validacao.data.generoId),
      };

      if (id) {
        await filmesService.update(id, payload);
        alert('Filme atualizado com sucesso!');
      } else {
        await filmesService.create(payload);
        alert('Filme criado com sucesso!');
      }

      navigate('/filmes');
    } catch (error: any) {
      console.error('Erro ao salvar filme:', error);
      setSubmitError(error?.message ?? String(error));
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando filme...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Filme' : 'Cadastrar Filme'}</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          Erro ao salvar: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo ?? ''}
            onChange={handleChange}
            className="form-control"
          />
          {erros.titulo && <small className="text-danger">{erros.titulo}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Sinopse</label>
          <textarea
            name="sinopse"
            value={formData.sinopse ?? ''}
            onChange={handleChange}
            className="form-control"
            rows={4}
          />
          {erros.sinopse && <small className="text-danger">{erros.sinopse}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Classificação Etária</label>
          <input
            type="text"
            name="classificacaoEtaria"
            value={formData.classificacaoEtaria ?? ''}
            onChange={handleChange}
            className="form-control"
          />
          {erros.classificacaoEtaria && (
            <small className="text-danger">{erros.classificacaoEtaria}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Duração (minutos)</label>
          <input
            type="number"
            name="duracao"
            value={formData.duracao ?? ''}
            onChange={handleChange}
            className="form-control"
          />
          {erros.duracao && <small className="text-danger">{erros.duracao}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Gênero</label>
          <select
            name="generoId"
            value={formData.generoId ?? ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione um gênero</option>
            {generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.nome}
              </option>
            ))}
          </select>
          {erros.generoId && <small className="text-danger">{erros.generoId}</small>}

          <div className="mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate('/generos')}
            >
              + Novo gênero
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Salvar
        </button>
      </form>
    </div>
  );
};