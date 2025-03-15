import React, { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from "@mui/material";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <a style={{ color: "white", textDecoration: "none" }}>
                Poplar Collective
              </a>
            </Link>
          </Typography>
          <Link href="/events/create" passHref>
            <Button color="inherit" component="a">
              Create Event
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>{children}</Box>
      </Container>
    </>
  );
};

export default Layout;
