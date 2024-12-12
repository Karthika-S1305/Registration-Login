import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Box, Card, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';

const Register = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState()
  const navigate = useNavigate();

  useEffect(()=>{
    const loggedInUser = localStorage.getItem('loggedInUser');
    if(loggedInUser){
      console.log("User is loggedIn: ", loggedInUser);
      setRememberMe(!!loggedInUser);
    }
  },[])

  //state for register, login
  const [register, setRegister] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const openLogin = ()=>{
    setIsLogin(true);
    setIsRegister(false);
    setIsForgot(false);
  }

  const openRegister = () =>{
    setIsLogin(false);
    setIsRegister(true);
    setIsForgot(false)
  }

  const openForgot = () => {
    setIsForgot(true);
    setIsLogin(false);
    setIsRegister(false);
  }

  //register onChange event
  const handleRegister = (e) =>{
    setRegister({...register,
      [e.target.name]:e.target.value
    })
  }

  //register
  const submitRegister = (e) =>{
    e.preventDefault();
    try{
      const storedRegister = JSON.parse(localStorage.getItem('register') || '[]');

      const newRegister ={
        name: register.name,
        email: register.email,
        password: register.password
      }
      const updatedRegister = [...storedRegister, newRegister];

      localStorage.setItem('register', JSON.stringify(updatedRegister));
      console.log(updatedRegister);

      setRegister({
        name:'',
        email:'',
        password:''
      });
    }catch(error){
      console.error("Error add register details", error);
    }
    
  }

  //login
  const submitLogin = (e) =>{
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('register') || '[]');
    const user = storedUser.find((u)=>u.email === login.email && u.password=== login.password);

    if(user){
        if(rememberMe){
          localStorage.setItem('loggedInUser',JSON.stringify(user))
          navigate('/dashboard');
        } else{
          sessionStorage.setItem('loggedInUser', JSON.stringify(user))
          navigate('/dashboard')
        }
    }else{
      console.log("Invalid email or password");
      
    }
  }

  //login ongange event
  const loginChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        backgroundColor: '#f0f0f0', 
      }}
    >
      <Box sx={{display: 'flex', flexDirection: 'row', gap:2, }}>
        <Button variant='outlined' onClick={openLogin}>Login</Button>
        <Button variant='contained' onClick={openRegister}>SignUp</Button>
      </Box>
      <Box>
      <Card 
        sx={{
          minWidth: 350,
          maxWidth: 400,
          padding: 3,
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isForgot?(
        <Box><Typography variant="h5" sx={{ marginBottom: 2 }}>Forgot Password</Typography>
        <Box 
          sx={{
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            autoComplete="off" 
            required
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ marginTop: 2 }}
          >
           Forgot Password
          </Button>
        </Box>
        </Box>):isLogin ? (
          <Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Login</Typography>
        <Box 
          sx={{
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <TextField 
            label="Email" 
            variant="outlined" 
            name='email'
            value={login.email}
            onChange={loginChange}
            fullWidth 
            autoComplete="off" 
            required
          />
          <TextField 
            label="Password" 
            type="password" 
            name='password'
            value={login.password}
            onChange={loginChange}
            variant="outlined" 
            fullWidth 
            autoComplete="off" 
            required
          />
          <FormControlLabel
          control={<Checkbox/>}
          label="Remember me"
          checked={rememberMe}
          onChange={(e)=>setRememberMe(e.target.checked)}
          >
          </FormControlLabel>
          <Link sx={{textAlign:'start', cursor: 'pointer', textDecoration: 'underline'}} onClick={openForgot}>Forgot Password?</Link>
          <Button 
          onClick={submitLogin}
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ marginTop: 2 }}
          >
           Login
          </Button>
        </Box>
      </Box>
        ): isRegister?(
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Register</Typography>
          <TextField 
            label="Name" 
            name='name'
            value={register.name}
            variant="outlined" 
            fullWidth 
            onChange={handleRegister}
            autoComplete="off" 
            required
          />
          <TextField 
            label="Email" 
            type='email'
            name='email'
            value={register.email}
            variant="outlined" 
            fullWidth 
            onChange={handleRegister}
            autoComplete="off" 
            required
          />
          <TextField 
            label="Password" 
            type="password" 
            name='password'
            value={register.password}
            variant="outlined" 
            fullWidth 
            onChange={handleRegister}
            autoComplete="off" 
            required
          />
          
          <Button 
            onClick={submitRegister}
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </Box>):null}
      </Card>
      </Box>
    </Box>
  );
};

export default Register;
