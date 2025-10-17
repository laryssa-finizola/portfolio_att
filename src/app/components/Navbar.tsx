import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navbar = () => {
  return (
    <header className="w-full p-4 px-8 flex justify-between items-center bg-background-light dark:bg-background-dark">
      {/* Logo/Nome */}
      <div>
        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
          Laryssa Finizola
        </h1>
      </div>

      {/* Navegação e Botão de Tema */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
      </div>
    </header>
  );
};