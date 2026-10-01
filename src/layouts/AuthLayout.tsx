import { ViewTransition } from "react";
import { Outlet } from "react-router";
import LayoutShowcase from "@/modules/authentication/components/LayoutShowcase/LayoutShowcase";

const AuthLayout = () => {
  return (
    <div className="flex h-dvh w-full overflow-hidden text-(--app-text)">
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:flex lg:w-[55%]">
        <LayoutShowcase />
      </div>

      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-(--app-surface) py-12">
        <div className="my-auto w-full max-w-xl rounded-xl p-5">
          <ViewTransition>
            <Outlet />
          </ViewTransition>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
