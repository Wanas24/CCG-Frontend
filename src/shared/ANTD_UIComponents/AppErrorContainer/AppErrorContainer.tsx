const AppErrorContainer = ({ error }: { error: string }) => {
  return (
    <div className="bg-red-200 text-red-950 text-sm p-2 rounded-lg text-center font-bold">
      {error}
    </div>
  );
};

export default AppErrorContainer;
