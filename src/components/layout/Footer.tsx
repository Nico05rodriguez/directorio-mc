export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white/50 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-mc-dark/60">
          Plataforma de Impulso Local — Movimiento Ciudadano
        </p>
        <p className="mt-2 text-xs text-mc-dark/40">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};