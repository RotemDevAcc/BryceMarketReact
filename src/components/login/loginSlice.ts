import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getClientReceipts, logtoServer, recommendProduct, updateClientName, updateClientPicture } from './loginAPI';
import { Message } from '../../Message';
import { AllProductDetails } from '../management/managementSlice';

const getUserDetailsFromSessionStorage = () => {
  const storedUserDetails = sessionStorage.getItem('userDetails');
  return storedUserDetails ? JSON.parse(storedUserDetails) : null;
};


export interface UserDetails {
  user_id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  gender?: string;
  dob?: string;
  img?: string;
  is_staff?: boolean;
}


export interface ReceiptDetails {
  id: number;
  price:number;
  products:AllProductDetails[];
}

export interface RecommendDetails {
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface LoginInterface {
  loggedin: boolean,
  token: string,
  userDetails: UserDetails,
  userreceipts: ReceiptDetails;
  recommendation: RecommendDetails | null;
  status:string,
}

const initialState: LoginInterface = {
  loggedin: getUserDetailsFromSessionStorage() ? true : false,
  token: sessionStorage.getItem('token') || "",
  userDetails: getUserDetailsFromSessionStorage() || [],
  recommendation: null,
  userreceipts: {id:0, price:0, products:[]},
  status:""
};


export const loginAsync = createAsyncThunk(
  'login/logtoServer',
  async (details: { userName: string; password: string; }) => {
    const response = await logtoServer(details);
    return response.data;
  }
);

export const changePicAsync = createAsyncThunk(
  'login/updateClientPicture',
  async (formData: FormData) => {
    const response = await updateClientPicture(formData);
    return response.data;
  }
);

export const changeFullNameAsync = createAsyncThunk(
  'login/updateClientName',
  async (formData: FormData) => {
    const response = await updateClientName(formData);
    return response.data;
  }
);

export const recommandProductsAsync = createAsyncThunk(
  'login/recommendProduct',
  async (token: string) => {
    const response = await recommendProduct(token);
    return response.data;
  }
);

export const getClientReceiptsAsync = createAsyncThunk(
  'login/getClientReceipts',
  async (details:{token: string}) => {
    const response = await getClientReceipts(details);
    return response.data;
  }
);



export const loginSlice = createSlice({
  name: 'login',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    user_logout: (state) => {
      state.loggedin = false
      state.userDetails = {} as UserDetails;
      sessionStorage.removeItem("userDetails")
      Message("Logged out Successfully", "success")
    },
    reset_userreceipts: (state) => {
      state.userreceipts= {id:0, price:0, products:[]}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        if (!action.payload.access) return
        state.token = action.payload.access;
        if (state.token) {
          state.userDetails = parseJwt(state.token);
          sessionStorage.setItem("token", state.token);
          sessionStorage.setItem("userDetails", JSON.stringify({
            "user_id": state.userDetails.user_id,
            "username": state.userDetails.username,
            "firstname": state.userDetails.firstname || "John",
            "lastname": state.userDetails.lastname || "Doe",
            "email": state.userDetails.email || "johndoe@gmail.com",
            "gender": state.userDetails.gender || "male",
            "dob": state.userDetails.dob,
            "img": state.userDetails.img,
            "is_staff": state.userDetails.is_staff
          }));
          state.loggedin = true
          state.status = "done"
          Message("Welcome Back " + state.userDetails.username, "success")
        } else {
          Message("A Problem has occured, try again later.", "error")
          // state.userDetails = {}; // or whatever initial value you want
        }
        // state.userDetails = parseJwt(state.token)
        // sessionStorage.setItem("token", state.token);

      })
      .addCase(loginAsync.pending, (state,action) => {
        state.status = "pending"
      })
      .addCase(loginAsync.rejected, (state,action) => {
        state.status = "rejected"
      })
      .addCase(changePicAsync.fulfilled, (state, action) => {
        const data = action.payload
        if (data.success) {
          Message(data.message, "success");
          if (data.picname) {
            state.userDetails.img = data.picname
            sessionStorage.setItem("userDetails", JSON.stringify(state.userDetails));
          }
        } else {
          Message(data.message, "error");
        }
      })
      .addCase(changeFullNameAsync.fulfilled, (state, action) => {
        const data = action.payload
        if (data.success) {
          Message(data.message, "success");
          if (data.firstname && data.lastname) {
            state.userDetails.firstname = data.firstname
            state.userDetails.lastname = data.lastname
            sessionStorage.setItem("userDetails", JSON.stringify(state.userDetails));
            Message(`Name Changed To: ${data.firstname} ${data.firstname}.`,"info")
          }
        } else {
          Message(data.message, "error");
        }
      })
      .addCase(recommandProductsAsync.fulfilled, (state, action) => {
        const data = action.payload
        if (data.success) {
          Message(data.message,"success")

          state.recommendation = data.recommended_recipes || {};
        }else{
          Message(data.message, "error");
        }
      })
      .addCase(getClientReceiptsAsync.fulfilled,(state,action) => {
        const data = action.payload
        if (data.success) {
          Message(data.message,"success")
          state.userreceipts = data.receipts || {}
        }else{
          Message(data.message, "error");
        }
      })
  },
});

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const { user_logout, reset_userreceipts } = loginSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.login.value)`
export const is_user_logged = (state: { login: { loggedin: boolean; }; }) => state.login.loggedin;
export const is_user_staff = (state: { login: LoginInterface; }) => state.login.userDetails.is_staff;
export const get_user_details = (state: { login: { userDetails: UserDetails; }; }) => state.login.userDetails;
export const get_user_token = (state: { login: { token: string; }; }) => state.login.token;
export const get_login_status = (state:{login: {status:string;}}) => state.login.status;
export const get_user_receipts = (state:{login: {userreceipts:ReceiptDetails}}) => state.login.userreceipts
export const get_recipe_recommend = (state: { login: LoginInterface }) => state.login.recommendation;

export default loginSlice.reducer;
