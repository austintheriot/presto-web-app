import { createContext, useContext } from 'react';

/* import { useHistory } from 'react-router-dom'; */
export const AuthContext = createContext({ authenticated: false });

export function useAuth() {
	return useContext(AuthContext);
}
