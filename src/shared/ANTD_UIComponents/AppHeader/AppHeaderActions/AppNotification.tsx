const AppNotification = () => {
  const notification = true;
  return (
    <div className="relative">
      {notification && (
        <>
          <div className="absolute top-[4px] right-[2px] w-2 h-2 bg-(--naturalWhite) rounded-full border border-(--naturalWhite)" />
          <div className="absolute top-[4px] right-[2px] w-2 h-2 bg-(--statusR200) rounded-full border border-(--naturalWhite) animate-pulse" />
        </>
      )}
      <img
        src="/assets/header/notification.svg"
        alt=""
        aria-hidden
        className="size-[25px] shrink-0"
      />
    </div>
  );
};

export default AppNotification;
