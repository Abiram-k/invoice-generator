const Footer = () => {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <p className="text-center text-sm text-muted">
          All rights reserved by Abiram K &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
