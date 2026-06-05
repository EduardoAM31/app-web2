import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { salasService } from '../../../services/sala.service';
import type { ISala } from '../../../models/sala.model';

export const SalasForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Partial<ISala>>({
    numero: 0,
    fileiras: 5,
    colunas: 10,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarSala = async (salaId: string) => {
    try {
      setCarregando(true);
      const data = await salasService.findById(salaId);

      setFormData({
        id: data.id,
        numero: data.numero ?? 0,
        fileiras: data.fileiras ?? 5,
        colunas: data.colunas ?? 10,
      });
    } catch (error) {
      console.error('Erro ao carregar sala:', error);
      setSubmitError('Não foi possível carregar a sala.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (id) carregarSala(id);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value),
    }));
  };

  const capacidade = Number(formData.fileiras ?? 0) * Number(formData.colunas ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero || formData.numero <= 0) {
      alert('Informe um número de sala válido.');
      return;
    }
    if (!formData.fileiras || formData.fileiras <= 0 || formData.fileiras > 26) {
      alert('Informe um número de fileiras entre 1 e 26.');
      return;
    }
    if (!formData.colunas || formData.colunas <= 0) {
      alert('Informe um número de colunas válido.');
      return;
    }

    try {
      setSubmitError(null);

      const payload = {
        numero: Number(formData.numero),
        fileiras: Number(formData.fileiras),
        colunas: Number(formData.colunas),
      };

      if (id) {
        await salasService.update(id, payload);
        alert('Sala atualizada com sucesso!');
      } else {
        await salasService.create(payload);
        alert('Sala criada com sucesso!');
      }

      navigate('/salas');
    } catch (error: any) {
      console.error('Erro ao salvar sala:', error);
      setSubmitError(error?.message ?? String(error));
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando sala...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Sala' : 'Cadastrar Sala'}</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Número da Sala</label>
          <input
            type="number"
            name="numero"
            value={formData.numero ?? ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fileiras (A–Z, máx. 26)</label>
            <input
              type="number"
              name="fileiras"
              min={1}
              max={26}
              value={formData.fileiras ?? ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Colunas (assentos por fileira)</label>
            <input
              type="number"
              name="colunas"
              min={1}
              value={formData.colunas ?? ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <p className="text-muted">
          Capacidade: <strong>{capacidade}</strong> lugares ({formData.fileiras ?? 0}×
          {formData.colunas ?? 0})
        </p>

        <button type="submit" className="btn btn-success">
          Salvar
        </button>
      </form>
    </div>
  );
};
