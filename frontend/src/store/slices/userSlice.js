import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;

// Signup API
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${MealHubBackend}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Signin API
export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${MealHubBackend}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Signin failed");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    role: "Select Role",
    authtoken: "",
    isLogin: false,
    isPending: false,
    message: "",
    name: "",
    email: "",
    phone: null,
    address: "",
    chefs: [],
    waiters: [],
    reservedTables: [],
  },
  reducers: {
    changeRole: (state, action) => {
      state.role = action.payload;
    },
    setSignUpUser: (state, action) => {
      const { name, email, role, phone, address } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.role = role;
    },
    logout: (state) => {
      // Reset all user state to initial values
      state.role = "Select Role";
      state.authtoken = "";
      state.isLogin = false;
      state.message = "";
      state.name = "";
      state.email = "";
      state.phone = null;
      state.address = "";
      state.chefs = [];
      state.waiters = [];
      state.reservedTables = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup API handling
      .addCase(signUpUser.pending, (state) => {
        state.isPending = true;
        state.message = "Signing up...";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.isLogin = true;
        state.authtoken = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isPending = false;
        state.message = action.payload;
      })
      // Signin API handling
      .addCase(signInUser.pending, (state) => {
        state.isPending = true;
        state.message = "Signing in...";
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.isLogin = true;
        state.authtoken = action.payload.token;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.phone = action.payload.user.phone;
        state.address = action.payload.user.address;
        state.role = action.payload.user.role;
        state.message = action.payload.message;
        state.chefs = action.payload.chefs;
        state.waiters = action.payload.waiters;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isPending = false;
        state.message = action.payload;
      });
  },
});

export const { changeRole, setSignUpUser, logout } = userSlice.actions;
export default userSlice.reducer;
