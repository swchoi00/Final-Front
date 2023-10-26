import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function KakaoLoginButton() {
  const kakaoButtonStyle = {
    backgroundColor: '#FFEB00',
    color: 'black',
    '&:hover': {
      backgroundColor: '#FFC100',
    },
  };

  return (
    <Button type="submit" fullWidth variant="contained" style={kakaoButtonStyle}
      sx={{ mt: 0, mb: 1 }} > 카카오 로그인 </Button>
  );
}

function GoogleLoginButton() {
  const googleButtonStyle = {
    backgroundColor: 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: 'blue',
    },
  };

  return (<Button type="submit" fullWidth variant="contained" style={googleButtonStyle} 
    sx={{ mt: 0, mb: 1 }} > 구글 로그인 </Button>
  );
}
const defaultTheme = createTheme();

function Login() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5"> 로그인 </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="id"
              label="아이디" name="id" autoComplete="id" autoFocus />

            <TextField margin="normal" required fullWidth name="password"
              label="비밀번호" type="password" id="password" autoComplete="current-password" />

            <FormControlLabel control={<Checkbox value="remember" color="primary" />}
              label="아이디 저장" />

              <Button type="submit" fullWidth variant="contained" 
                sx={{ mt: 3, mb: 1 }}> 로그인 </Button>
              <KakaoLoginButton />
              <GoogleLoginButton />

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2"> 비밀번호 찾기 </Link>
              </Grid>
              <Grid item>
                <Link href="/" variant="body2"> {"회원가입"} </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;



