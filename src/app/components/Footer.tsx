export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full p-4 px-8 flex justify-center items-center bg-background-light dark:bg-background-dark">
      <p className="text-sm text-gray-detail dark:text-gray-dark-detail">
        © {currentYear} Laryssa Finizola. Todos os direitos reservados.
      </p>
    </footer>
  );
};