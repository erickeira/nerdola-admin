import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import AuthLayout from "./AuthLayout";
import BlankLayout from "./BlankLayout";
import DashboardLayout from "./DashboardLayout";
import { useGlobal } from "@/context/GlobalContext";

const layouts = [
  { routes: ['/login'], comp: AuthLayout },
  { routes: [
    '/obras','/obra',
    '/obras-status','/obra-status',
    '/tags','/tag',
    '/usuarios','/usuario',
    '/obras','/obra',
    '/obras','/obra',
    '/obras','/obra',
    '/capitulos','/capitulo',
    '/agentes','/agente',
    '/pedidos',
    '/sites','/site',
  ], comp: DashboardLayout },
  { routes: [], comp: BlankLayout }
];

export default function Layout({ children }) {
  const { user } = useGlobal();
  const router = useRouter();

  const findLayout = () => {
    const matchingRoute = layouts.find(layout =>
      layout.routes.some(route => router.pathname.startsWith(route) || router.asPath.startsWith(route) || `/${router.pathname?.split('/')[1]}` === route)
    );
    return matchingRoute ? matchingRoute.comp : Box;
  };

  const LayoutBase = findLayout();

  return <LayoutBase>{children}</LayoutBase>;
}
