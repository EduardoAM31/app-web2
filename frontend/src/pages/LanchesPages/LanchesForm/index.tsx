import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { lancheComboService } from '../../../services/lanchecombo.service';
import { lancheComboSchema, type ILancheCombo } from '../../../models/lanchecombo.model';

export const LanchesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Partial<ILancheCombo>>({
    nome: '',
    descricao: '',
    preco: 0,
    itens: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregar = async (lancheId: string) => {
    try {
      setCarregando(true);
      const data = await lancheComboService.findById(lancheId);

      setFormData({
        id: data.id,
        nome: data.nome ?? '',
        descricao: data.descricao ?? '',
        preco: data.preco ?? 0,
        itens: data.itens ?? '',
      });
    } catch (error) {
      console.error('Erro ao carregar combo:', error);
      setSubmitError('Não foi possível carregar o lanche/combo.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (id) carregar(id);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'preco' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacao = lancheComboSchema.safeParse(formData);

    if (!validacao.success) {
      const temp: Record<string, string> = {};

      validacao.error.issues.forEach((issue) => {
        temp[String(issue.path[0])] = issue.message;
      });

      setErros(temp);
      return;
    }

    try {
      setSubmitError(null);
      setErros({});

      const payload = {
        nome: validacao.data.nome,
        descricao: validacao.data.descricao,
        preco: Number(validacao.data.preco),
        itens: validacao.data.itens,
      };

      if (id) {
        await lancheComboService.update(id, payload);
        alert('Lanche/combo atualizado com sucesso!');
      } else {
        await lancheComboService.create(payload);
        alert('Lanche/combo criado com sucesso!');
      }

      navigate('/lanches');
    } catch (error: any) {
      console.error('Erro ao salvar combo:', error);
      setSubmitError(error?.message ?? String(error));
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando lanche/combo...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Lanche / Combo' : 'Cadastrar Lanche / Combo'}</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome ?? ''}
            onChange={handleChange}
            className="form-control"
          />
          {erros.nome && <small className="text-danger">{erros.nome}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao ?? ''}
            onChange={handleChange}
            className="form-control"
            rows={4}
          />
          {erros.descricao && <small className="text-danger">{erros.descricao}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Preço (R$)</label>
          <input
            type="number"
            name="preco"
            value={formData.preco ?? ''}
            onChange={handleChange}
            className="form-control"
            step="0.01"
          />
          {erros.preco && <small className="text-danger">{erros.preco}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Itens</label>
          <textarea
            name="itens"
            value={formData.itens ?? ''}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
          {erros.itens && <small className="text-danger">{erros.itens}</small>}
        </div>

        <button className="btn btn-success">Salvar</button>
      </form>
    </div>
  );
};