const App = () => {
  return (
    <div className=" h-screen bg-slate-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-6">
        <p className="text-lg font-semibold tracking-wide">CCG</p>
      </header>

      <main className="mx-auto flex items-center justify-center flex-1 max-w-5xl px-8">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-center md:text-7xl">
          Constrict Code Group
        </h1>
      </main>
    </div>
  );
};

export default App;
