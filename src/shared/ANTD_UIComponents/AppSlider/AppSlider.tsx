import { Slider, type SliderSingleProps } from "antd";

export type AppSliderProps = SliderSingleProps;

export const AppSlider = ({ className, ...props }: AppSliderProps) => {
  return <Slider {...props} className={`app-slider ${className ?? ""}`} />;
};

export default AppSlider;
