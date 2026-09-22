const AppHeaderWelcome = () => {
  return (
    <div className="flex flex-col">
      <p className="flex items-center gap-1 text-base font-semibold text-(--Grey900)">
        <span>Welcome back</span>
        <img
          src="/assets/header/hello.svg"
          alt=""
          aria-hidden
          className="size-[17px] shrink-0"
        />
      </p>
      <p className="text-base text-(--naturalBlack)">USER</p>
    </div>
  );
};

export default AppHeaderWelcome;
