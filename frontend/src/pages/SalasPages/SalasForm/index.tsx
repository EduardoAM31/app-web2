import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { salasService } from '../../../services/sala.service';
import type { ISala } from '../../../models/sala.model';

export const SalasForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Partial<ISala>>({
    numero: 0,
    capacidade: 0,
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
        capacidade: data.capacidade ?? 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero || formData.numero <= 0) {
      alert('Informe um número de sala válido.');
      return;
    }

    if (!formData.capacidade || formData.capacidade <= 0) {
      alert('Informe uma capacidade válida.');
      return;
    }

    try {
      setSubmitError(null);

      const payload = {
        numero: Number(formData.numero),
        capacidade: Number(formData.capacidade),
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

        <div className="mb-3">
          <label className="form-label">Capacidade</label>
          <input
            type="number"
            name="capacidade"
            value={formData.capacidade ?? ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Salvar
        </button>
      </form>
    </div>
  );
};