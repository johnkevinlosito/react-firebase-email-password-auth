import { Redirect, Route, Switch } from 'react-router-dom';
import { useContext } from 'react';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AuthContext from './context/auth-context';

function App() {
  const authContext = useContext(AuthContext)
  const isLoggedIn = authContext.isLoggedIn
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        {!isLoggedIn && <Route path="/auth" >
          <Auth />
        </Route>}
        <Route path="/profile" >
          {isLoggedIn && <Profile />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="*"><Redirect to="/" /></Route>
      </Switch>
    </Layout>
  );
}

export default App;
