import { useEffect } from "react";
import empresa from "../config/empresa";

/**
 * Actualiza el título de la pestaña del navegador.
 * Formato: "Sección — NombreEmpresa"
 */
export function usePageTitle(seccion) {
  useEffect(() => {
    document.title = seccion ? `${seccion} — ${empresa.nombre}` : empresa.nombre;
    return () => {
      document.title = empresa.nombre;
    };
  }, [seccion]);
}
