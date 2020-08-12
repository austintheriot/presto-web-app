import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
	},
	reducers: {
		updateUser: (state, action) => {
			console.log('payload: ', action.payload);
			state.user = action.payload;
		},
	},
});

export const selectUser = (state) => state.user.user;

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
