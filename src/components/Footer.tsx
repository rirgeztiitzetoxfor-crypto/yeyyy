export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-xl text-primary tracking-widest mb-1">RADHAA DUDEJA</h3>
            <p className="text-muted-foreground text-xs tracking-widest">Anchor · Emcee · Host · Speaker</p>
          </div>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/radha_dudeja_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Instagram
            </a>
            <a href="https://www.youtube.com/@anchorrd8794" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              YouTube
            </a>
            <a href="mailto:info@radhadudeja.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Email
            </a>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs">© 2026 Radhaa Dudeja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
