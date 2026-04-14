import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sessoesService } from '../../../services/sessoes.service';
import { filmesService } from '../../../services/filmes.service';
import { salasService } from '../../../services/sala.service';

import type { ISessao } from '../../../models/sessao.model';
import type { IFilme } from '../../../models/filme.model';
import type { ISala } from '../../../models/sala.model';
import { sessaoSchema } from '../../../models/sessao.model';

export const SessoesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Partial<ISessao>>({
    filmeId: '',
    salaId: '',
    horarioInicio: '',
    valorIngresso: 0,
  });

  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarDependencias = async () => {
    try {
      const [filmesData, salasData] = await Promise.all([
        filmesService.findAll(),
        salasService.findAll(),
      ]);

      setFilmes(filmesData);
      setSalas(salasData);
    } catch (error) {
      console.error('Erro ao carregar filmes e salas:', error);
    }
  };

  const carregarSessao = async (sessaoId: string) => {
    try {
      setCarregando(true);
      const data = await sessoesService.findById(sessaoId);

      const horarioFormatado = data.horarioInicio
        ? new Date(data.horarioInicio).toISOString().slice(0, 16)
        : '';

      setFormData({
        id: data.id,
        filmeId: data.filmeId ?? '',
        salaId: data.salaId ?? '',
        horarioInicio: horarioFormatado,
        valorIngresso: data.valorIngresso ?? 0,
      });
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      setSubmitError('Não foi possível carregar a sessão.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDependencias();
  }, []);

  useEffect(() => {
    if (id) carregarSessao(id);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'filmeId' || name === 'salaId'
          ? value === ''
            ? ''
            : Number(value)
          : name === 'valorIngresso'
            ? value === ''
              ? 0
              : Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacao = sessaoSchema.safeParse(formData);

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
        filmeId: Number(validacao.data.filmeId),
        salaId: Number(validacao.data.salaId),
        horarioInicio: validacao.data.horarioInicio,
        valorIngresso: Number(validacao.data.valorIngresso),
      };

      if (id) {
        await sessoesService.update(id, payload);
        alert('Sessão atualizada com sucesso!');
      } else {
        await sessoesService.create(payload);
        alert('Sessão criada com sucesso!');
      }

      navigate('/sessoes');
    } catch (error: any) {
      console.error('Erro ao salvar sessão:', error);
      setSubmitError(error?.message ?? String(error));
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando sessão...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Sessão' : 'Cadastrar Sessão'}</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Filme</label>
          <select
            name="filmeId"
            value={formData.filmeId ?? ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione um filme</option>
            {filmes.map((filme) => (
              <option key={filme.id} value={filme.id}>
                {filme.titulo}
              </option>
            ))}
          </select>
          {erros.filmeId && <small className="text-danger">{erros.filmeId}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select
            name="salaId"
            value={formData.salaId ?? ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione uma sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                Sala {sala.numero} - Capacidade {sala.capacidade}
              </option>
            ))}
          </select>
          {erros.salaId && <small className="text-danger">{erros.salaId}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Horário de Início</label>
          <input
            type="datetime-local"
            name="horarioInicio"
            value={
              typeof formData.horarioInicio === 'string'
                ? formData.horarioInicio
                : ''
            }
            onChange={handleChange}
            className="form-control"
          />
          {erros.horarioInicio && (
            <small className="text-danger">{erros.horarioInicio}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Valor do Ingresso</label>
          <input
            type="number"
            name="valorIngresso"
            value={formData.valorIngresso ?? ''}
            onChange={handleChange}
            className="form-control"
            step="0.01"
          />
          {erros.valorIngresso && (
            <small className="text-danger">{erros.valorIngresso}</small>
          )}
        </div>

        <button type="submit" className="btn btn-success">
          Salvar
        </button>
      </form>
    </div>
  );
};