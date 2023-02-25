import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

function Copyright() {
    return (
        <React.Fragment>
            {'© '}
            <Link color="inherit" href="https://mui.com/">
                material-ui
            </Link>{' '}
            {new Date().getFullYear()}
        </React.Fragment>
    );
}

export default function AppFooter() {
    return (
        <Typography
            component="footer"
            sx={{ display: 'flex', bgcolor: 'secondary.light' }}
        >
            <Container sx={{ my: 8 }}>
                <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="h6" marked="left" gutterBottom>
                        About Me
                    </Typography>
                    <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
                        <Box component="li" sx={{ py: 0.5 }}>
                            Email
                            <p> tlsdpdms789@naver.com </p>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="h6" marked="left" gutterBottom>
                        CopyRight
                    </Typography>
                    <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
                        <Grid item>
                            <Copyright />
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">
                                {'Icons made by '}
                                <Link href="https://www.freepik.com" rel="sponsored" title="Freepik">
                                    Freepik
                                </Link>
                                {' from '}
                                <Link href="https://www.flaticon.com" rel="sponsored" title="Flaticon">
                                    www.flaticon.com
                                </Link>
                                {' is licensed by '}
                                <Link
                                    href="https://creativecommons.org/licenses/by/3.0/"
                                    title="Creative Commons BY 3.0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CC 3.0 BY
                                </Link>
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>
            </Container>
        </Typography>
    );
}