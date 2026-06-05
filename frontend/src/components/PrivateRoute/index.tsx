import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = () => {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-5 text-danger">
        Não foi possível obter o token de acesso. Verifique se a API está no ar.
      </div>
    );
  }

  return <Outlet />;
};
