function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/50 bg-white/30 backdrop-blur-md py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
        {/* Left */}
        <p className="font-medium">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Thrift Commerce
          </span>{" "}
          • Built by Aarush
        </p>

        {/* Right Links */}
        <div className="flex gap-8">
          <a
            href="https://aj2975-port-folio.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:text-blue-600 hover:scale-105 transition-all"
          >
            About
          </a>
          <a
            href="https://github.com/Jain2975"
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:text-indigo-600 hover:scale-105 transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
