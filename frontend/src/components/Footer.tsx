function Footer() {
  return (
    <footer className="mt-20 bg-slate-50 border-t border-slate-200 py-10">
      
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-sm">

        {/* Left */}
        <p>
          © 2026 <span className="font-semibold text-blue-600">Thrift Commerce</span> • Built by Aarush
        </p>

        {/* Right Links */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
          <a href="https://github.com/Jain2975" target="_blank" className="hover:text-blue-600 transition">
            GitHub
          </a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
