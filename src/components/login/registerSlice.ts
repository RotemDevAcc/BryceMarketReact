import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { regtoServer } from './registerAPI';
import { Message } from '../../Message';

export interface RegisterInterface {
    status:string;
    
}

const initialState:RegisterInterface = {
  status:""
};


export const registerAsync = createAsyncThunk(
    'register/regtoServer',
    async (details: { username: string, firstname: string, lastname: string; password: string; email: string; gender: string; dob: string}) => {
      const response = await regtoServer(details);
      return response.data;
    }
);



export const registerSlice = createSlice({
  name: 'register',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    reset_status:(state) =>{
      state.status = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.fulfilled, (state, action) => {
        const pl = action.payload
        if(!pl.success){
          if(!pl.message){
            Message("Something Went Wrong","error")
            state.status ='rejected'
            return
          }
          let plmessage = pl.message
          plmessage = plmessage.slice(2, -2);
          state.status ='rejected'
          Message(plmessage,"error")
          return
        } 

        Message("Registration Successful","success")
        state.status ='move'
        
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status ='rejected'
      })
      .addCase(registerAsync.pending, (state, action) => {
        state.status = "loading...";
      })
  },
});



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.register.value)`

export const { reset_status } = registerSlice.actions;

export const register_status = (state: { register: { status: string; }; }) => state.register.status;

export default registerSlice.reducer;
