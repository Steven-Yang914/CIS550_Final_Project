import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import LinkWithCrewInfo from './LinkWithCrewInfo';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <LinkWithCrewInfo
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </LinkWithCrewInfo>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' style={{ backgroundColor: '#333' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='Studio on Walnut' isMain />
          <NavText href='/search' text='Search' />
          <NavText href='/design' text='Design' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
