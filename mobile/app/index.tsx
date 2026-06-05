import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth-context';
import { Loading } from '../src/ui';

export default function Index() {
  const { token, loading } = useAuth();
  if (loading) return <Loading />;
  return <Redirect href={token ? '/(tabs)/filmes' : '/login'} />;
}
