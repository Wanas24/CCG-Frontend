import { useEffect } from "react";
import { useNavigation } from "react-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.08 });

export const NavigationProgressFallback = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
};

const NavigationProgress = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      NProgress.done();
      return;
    }

    NProgress.start();
  }, [navigation.state]);

  return null;
};

export default NavigationProgress;
