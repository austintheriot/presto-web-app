import { createContext, useContext } from 'react';

/* import { useHistory } from 'react-router-dom'; */
export const AuthContext = createContext({ authenticated: false });

export function useAuth() {
  return useContext(AuthContext);
}

/*   let history = useHistory(); */

/* const AuthProvider = (props) => {
  const [user, setUser] = useState({
    authenticated: false,
    email: null,
    uid: null,
    displayName: null,
    emailVerified: null,
    photoUrl: null,
    isAnonymous: null,
  });

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};
 */
/* export default AuthProvider; */
