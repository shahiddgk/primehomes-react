import cx from 'classnames';
import styles from '../styles/Signin.module.css'

export default Signin;

function Signin() {
  return (
    <>

      <main className={cx(styles["form-signin"],"text-center","mt-5")}>
        <form>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className={cx(styles.checkbox,"mb-3")}>
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>
      </main>

    </>
  )
}

// {import {
//   Typography,
//   Box,
//   Card,
//   Container,
//   Button,
//   styled
// } from '@mui/material';
// import BaseLayout from 'src/layouts/BaseLayout';

// import Link from 'src/components/Link';
// import Head from 'next/head';

// import Logo from 'src/components/LogoSign';
// import Hero from 'src/content/Overview/Hero';

// const HeaderWrapper = styled(Card)(
//   ({ theme }) => `
//   width: 100%;
//   display: flex;
//   align-items: center;
//   height: ${theme.spacing(10)};
//   margin-bottom: ${theme.spacing(10)};
// `
// );

// const OverviewWrapper = styled(Box)(
//   ({ theme }) => `
//     overflow: auto;
//     background: ${theme.palette.common.white};
//     flex: 1;
//     overflow-x: hidden;
// `
// );

// function Overview() {
//   return (
//     <OverviewWrapper>
//       <Head>
//         <title>Prime Homes</title>
//       </Head>
//       <HeaderWrapper>
//         <Container maxWidth="lg">
//           <Box display="flex" alignItems="center">
//             <Logo />
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="space-between"
//               flex={1}
//             >
//               <Box />
//               <Box>
//                 <Button
//                   component={Link}
//                   href="/dashboards/tasks"
//                   variant="contained"
//                   sx={{ ml: 2 }}
//                 >
//                   Live Preview
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         </Container>
//       </HeaderWrapper>
//       <Hero />
//       <Container maxWidth="lg" sx={{ mt: 8 }}>
//         <Typography textAlign="center" variant="subtitle1">
//           Crafted by{' '}
//           <Link
//             href="https://bloomui.com"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             BloomUI.com
//           </Link>
//         </Typography>
//       </Container>
//     </OverviewWrapper>
//   );
// }

// export default Overview;

// Overview.getLayout = function getLayout(page) {
//   return <BaseLayout>{page}</BaseLayout>;
// };
// }